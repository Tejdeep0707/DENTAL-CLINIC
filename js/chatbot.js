/* -------------------------------------------------------------
   SMILECARE DENTAL - AI ASSISTANT CHATBOT LOGIC
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    initChatbot();
});

function initChatbot() {
    const toggleBtn = document.getElementById('chatbot-toggle');
    const minimizeBtn = document.getElementById('chat-minimize');
    const chatWin = document.getElementById('chat-window');
    const chatBody = document.getElementById('chat-body');
    const inputForm = document.getElementById('chat-input-bar');
    const textInput = document.getElementById('chat-text-input');
    const suggestionsBox = document.getElementById('chat-suggestions');
    const chatBadge = document.querySelector('.chat-badge');

    if (!toggleBtn || !chatWin || !chatBody) return;

    // Chatbot state tracker
    let chatState = 'idle'; // idle, expecting_name, expecting_phone, expecting_email, expecting_service, expecting_date
    let userData = {
        name: '',
        phone: '',
        email: '',
        service: '',
        date: ''
    };
    let hasCountedChatConversation = false;

    // Open/Close Actions
    const openChat = () => {
        chatWin.classList.add('open');
        toggleBtn.querySelector('.chat-icon-open').classList.add('hidden');
        toggleBtn.querySelector('.chat-icon-close').classList.remove('hidden');
        
        // Clear unread badge
        if (chatBadge) {
            chatBadge.style.display = 'none';
        }

        // Increment chat conversation counter on dashboard once
        if (!hasCountedChatConversation) {
            hasCountedChatConversation = true;
            if (window.dashboardState && typeof window.dashboardState.chats !== 'undefined') {
                window.dashboardState.chats += 1;
                const chatsEl = document.getElementById('db-stat-chats');
                if (chatsEl) {
                    chatsEl.textContent = window.dashboardState.chats;
                    chatsEl.classList.remove('pulse-active');
                    void chatsEl.offsetWidth;
                    chatsEl.classList.add('pulse-active');
                }
            }
        }
        
        scrollToBottom();
        setTimeout(() => textInput.focus(), 300);
    };

    const closeChat = () => {
        chatWin.classList.remove('open');
        toggleBtn.querySelector('.chat-icon-open').classList.remove('hidden');
        toggleBtn.querySelector('.chat-icon-close').classList.add('hidden');
    };

    toggleBtn.addEventListener('click', () => {
        if (chatWin.classList.contains('open')) {
            closeChat();
        } else {
            openChat();
        }
    });

    minimizeBtn.addEventListener('click', closeChat);

    // Setup Text-to-Speech variables
    let speechEnabled = false;
    let currentUtterance = null;

    // Speech synthesis helper
    const speakText = (text) => {
        if (!speechEnabled || !window.speechSynthesis) return;

        // Cancel previous speaking to prevent overlapping
        window.speechSynthesis.cancel();

        // Strip HTML tags from bot text
        const cleanText = text.replace(/<[^>]*>/g, '');

        currentUtterance = new SpeechSynthesisUtterance(cleanText);
        
        // Find a suitable English voice (preferably a warm/female or clear speaker)
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.name.includes('Google US English') || 
            voice.name.includes('Natural') || 
            voice.name.includes('Microsoft Zira') ||
            voice.name.includes('Female')
        );
        
        if (preferredVoice) {
            currentUtterance.voice = preferredVoice;
        }
        
        currentUtterance.rate = 1.05; // slightly faster for responsiveness
        currentUtterance.pitch = 1.0;
        
        window.speechSynthesis.speak(currentUtterance);
    };

    // Inject Speech Toggle Button dynamically into Chat Header
    const chatHeader = document.querySelector('.chat-header');
    if (chatHeader) {
        const speechToggle = document.createElement('button');
        speechToggle.className = 'chat-speech-toggle';
        speechToggle.id = 'chat-speech-toggle';
        speechToggle.setAttribute('aria-label', 'Toggle Voice Assistance');
        speechToggle.setAttribute('title', 'Enable Voice Assistance');
        speechToggle.innerHTML = `<i data-lucide="volume-x" class="speech-icon-off"></i><i data-lucide="volume-2" class="speech-icon-on hidden"></i>`;
        
        if (minimizeBtn) {
            chatHeader.insertBefore(speechToggle, minimizeBtn);
        } else {
            chatHeader.appendChild(speechToggle);
        }

        // Re-initialize Lucide Icons for dynamic buttons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Toggle Event
        speechToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            speechEnabled = !speechEnabled;
            
            const iconOff = speechToggle.querySelector('.speech-icon-off');
            const iconOn = speechToggle.querySelector('.speech-icon-on');
            
            if (speechEnabled) {
                iconOff.classList.add('hidden');
                iconOn.classList.remove('hidden');
                speechToggle.setAttribute('title', 'Disable Voice Assistance');
                speakText("Voice assistance enabled.");
            } else {
                iconOff.classList.remove('hidden');
                iconOn.classList.add('hidden');
                speechToggle.setAttribute('title', 'Enable Voice Assistance');
                if (window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                }
            }
        });
    }

    // Scroll chat body helper
    const scrollToBottom = () => {
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    // Add message element helper
    const appendMessage = (sender, text) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}-msg`;
        msgDiv.innerHTML = text.replace(/\n/g, '<br>');
        chatBody.appendChild(msgDiv);
        scrollToBottom();

        // Speak bot messages if speech is active
        if (sender === 'bot') {
            speakText(text);
        }

        return msgDiv;
    };

    // Simulate bot typing indicator
    const showTypingIndicator = (callback, delay = 1200) => {
        const indicatorDiv = document.createElement('div');
        indicatorDiv.className = 'chat-msg bot-msg typing-msg';
        indicatorDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        chatBody.appendChild(indicatorDiv);
        scrollToBottom();

        setTimeout(() => {
            indicatorDiv.remove();
            callback();
        }, delay);
    };

    // Quick replies selection
    suggestionsBox.addEventListener('click', (e) => {
        const btn = e.target.closest('.suggestion-btn');
        if (!btn) return;

        const intent = btn.getAttribute('data-intent');
        const userText = btn.textContent;
        
        // Add user selected pill text
        appendMessage('user', userText);

        // Process response
        showTypingIndicator(() => {
            handleIntent(intent);
        });
    });

    // Message processing logic
    const handleIntent = (intent) => {
        switch (intent) {
            case 'faq':
                appendMessage('bot', `Here are some popular questions I can answer. Type keywords or ask directly:\n\n• <strong>"clean"</strong> - Scaling details\n• <strong>"implant"</strong> - Replacement cost\n• <strong>"pain"</strong> - Root canal safety\n• <strong>"whitening"</strong> - laser whitening info`);
                break;
            case 'services':
                appendMessage('bot', `SmileCare Dental provides:\n• 🦷 Teeth Cleaning & Polishing\n• 🔩 Dental Implants (permanent)\n• ⚡ Pain-free Root Canals\n• ✨ Professional Laser Whitening\n• 🔗 Braces & Clear Aligners\n\nWould you like to book a consult? Type <strong>"book"</strong> to start.`);
                break;
            case 'booking':
                chatState = 'expecting_name';
                appendMessage('bot', `I'll guide you to request a slot! To start, could you please type your **Full Name**?`);
                break;
            case 'hours':
                appendMessage('bot', `Our clinic is open:\n• Mon – Fri: 8:00 AM – 7:00 PM\n• Sat: 9:00 AM – 4:00 PM\n• Sun: Closed (Emergency cases on call)`);
                break;
            default:
                appendMessage('bot', `I'm not sure I understood. Feel free to choose an option from the suggestions menu below.`);
        }
    };

    // Main user text input processing
    inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = textInput.value.trim();
        if (!query) return;

        // Print user text bubble
        appendMessage('user', query);
        textInput.value = '';

        // Handle states
        showTypingIndicator(() => {
            processUserState(query);
        });
    });

    const processUserState = (query) => {
        const cleaned = query.toLowerCase();

        // If in a booking questionnaire state machine
        if (chatState === 'expecting_name') {
            userData.name = query;
            chatState = 'expecting_phone';
            appendMessage('bot', `Thank you, ${userData.name}! What **Phone Number** is best to contact you?`);
            return;
        }

        if (chatState === 'expecting_phone') {
            // Very loose match for phone number (at least 8 digits/chars)
            if (cleaned.replace(/[^0-9]/g, '').length < 8) {
                appendMessage('bot', `Please provide a valid contact number so we can confirm the slot.`);
                return;
            }
            userData.phone = query;
            chatState = 'expecting_email';
            appendMessage('bot', `Got it. What **Email Address** should we send confirmation to?`);
            return;
        }

        if (chatState === 'expecting_email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(cleaned)) {
                appendMessage('bot', `Please enter a valid email address (e.g. name@example.com).`);
                return;
            }
            userData.email = query;
            chatState = 'expecting_service';
            appendMessage('bot', `Thank you. What **Treatment** do you require? (e.g. Cleaning, Implants, Braces, or consultation)`);
            return;
        }

        if (chatState === 'expecting_service') {
            userData.service = query;
            chatState = 'expecting_date';
            appendMessage('bot', `Understood. Lastly, what is your **Preferred Date** for the visit?`);
            return;
        }

        if (chatState === 'expecting_date') {
            userData.date = query;
            chatState = 'idle';

            appendMessage('bot', `Excellent! I have recorded your appointment request details:\n\n• 👤 <strong>Name</strong>: ${userData.name}\n• 📞 <strong>Phone</strong>: ${userData.phone}\n• 📧 <strong>Email</strong>: ${userData.email}\n• 🦷 <strong>Treatment</strong>: ${userData.service}\n• 📅 <strong>Preferred Date</strong>: ${userData.date}\n\nOur system is submitting your request...`);

            // EmailJS credentials matching main.js
            const SERVICE_ID = "service_cn1ly6v"; 
            const TEMPLATE_ID = "template_b8riaqh"; 
            const PUBLIC_KEY = "TLR5if82dog7Sd7XS";

            if (typeof emailjs !== 'undefined') {
                emailjs.init({
                    publicKey: PUBLIC_KEY
                });

                const templateParams = {
                    booking_name: userData.name,
                    booking_phone: userData.phone,
                    booking_email: userData.email,
                    booking_treatment: userData.service + " (Booked via AI Chatbot)",
                    booking_date: userData.date
                };

                // Show bot typing indicator for sending email
                const typingMsg = appendMessage('bot', `Booking appointment... ⏳`);

                emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
                    .then((response) => {
                        console.log('Chatbot EmailJS Send Successful:', response.status, response.text);
                        typingMsg.remove();
                        appendMessage('bot', `✅ **Booking request submitted successfully!**\n\nOur coordinator will call/email you in 24 hours to confirm your final slot.`);
                        
                        // Trigger Dynamic Admin Dashboard Sync
                        if (typeof window.triggerDashboardSync === 'function') {
                            let serviceClean = userData.service.toLowerCase();
                            let treatmentKey = 'general-consultation';
                            if (serviceClean.includes('clean') || serviceClean.includes('scaling')) {
                                treatmentKey = 'teeth-cleaning';
                            } else if (serviceClean.includes('implant')) {
                                treatmentKey = 'dental-implants';
                            } else if (serviceClean.includes('root') || serviceClean.includes('canal') || serviceClean.includes('toothache')) {
                                treatmentKey = 'root-canal';
                            } else if (serviceClean.includes('whiten') || serviceClean.includes('laser')) {
                                treatmentKey = 'teeth-whitening';
                            } else if (serviceClean.includes('brace') || serviceClean.includes('align') || serviceClean.includes('invisalign')) {
                                treatmentKey = 'braces-aligners';
                            }

                            window.triggerDashboardSync({
                                name: userData.name,
                                phone: userData.phone,
                                treatment: treatmentKey,
                                source: 'chat'
                            });
                        }
                    })
                    .catch((error) => {
                        console.error('Chatbot EmailJS Send Failed:', error);
                        typingMsg.remove();
                        appendMessage('bot', `❌ **Submission failed.** We encountered a connection issue. Please try submitting via the booking form or call us directly!`);
                    });
            } else {
                console.error("EmailJS SDK is not loaded.");
                appendMessage('bot', `❌ Service temporarily unavailable. Please call us directly!`);
            }

            // Log for simulator
            console.log('Chatbot collected booking request:', userData);
            return;
        }

        // Default Idle State: Keywords detection
        if (cleaned.includes('hello') || cleaned.includes('hi') || cleaned.includes('hey')) {
            appendMessage('bot', `Hello! How can I help you today? You can ask about our services, clinic hours, or start booking an appointment!`);
        }
        else if (cleaned.includes('clean') || cleaned.includes('scaling') || cleaned.includes('polish')) {
            appendMessage('bot', `Our professional teeth cleaning removes plaque and calculus buildup. We recommend getting this done twice a year. Type <strong>"book"</strong> if you'd like to schedule a cleaning session.`);
        }
        else if (cleaned.includes('implant') || cleaned.includes('screw') || cleaned.includes('missing')) {
            appendMessage('bot', `Dental Implants are premium titanium roots topped with a custom crown to replace missing teeth permanently. Type <strong>"book"</strong> to get a consult with Dr. Sarah Jenkins!`);
        }
        else if (cleaned.includes('pain') || cleaned.includes('root canal') || cleaned.includes('infection') || cleaned.includes('toothache')) {
            appendMessage('bot', `If you are experiencing severe toothaches, you may need a root canal treatment. It is a pain-free clinical procedure to save your tooth. We offer rapid emergency slots.`);
        }
        else if (cleaned.includes('whitening') || cleaned.includes('bleach') || cleaned.includes('yellow')) {
            appendMessage('bot', `We offer advanced laser whitening that lightens teeth by up to 8 shades safely and effectively. It takes less than 60 minutes in the chair!`);
        }
        else if (cleaned.includes('braces') || cleaned.includes('aligners') || cleaned.includes('invisalign') || cleaned.includes('straight')) {
            appendMessage('bot', `We offer both standard metal braces and transparent Invisalign clear aligners for alignment. Dr. Marcus Vance is our chief orthodontics specialist.`);
        }
        else if (cleaned.includes('book') || cleaned.includes('appointment') || cleaned.includes('schedule') || cleaned.includes('visit')) {
            chatState = 'expecting_name';
            appendMessage('bot', `I can help register a slot for you! What is your **Full Name**?`);
        }
        else if (cleaned.includes('hours') || cleaned.includes('time') || cleaned.includes('open')) {
            appendMessage('bot', `We are open:\n• Mon – Fri: 8:00 AM – 7:00 PM\n• Sat: 9:00 AM – 4:00 PM\n• Sun: Closed`);
        }
        else if (cleaned.includes('where') || cleaned.includes('location') || cleaned.includes('address') || cleaned.includes('map')) {
            appendMessage('bot', `Our clinic is located at:\n📍 128 Healthcare Ave, Medical Suite 400, Chicago, IL 60611.\nYou can view the interactive map directly on the page contact section.`);
        }
        else {
            appendMessage('bot', `I'm not sure about that. I can help recommend services, answer FAQs, check clinic timings, or book a consultation slot. Try typing <strong>"book"</strong> or selection an option below.`);
        }
    };
}
