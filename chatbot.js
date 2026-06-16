/* ==========================================================================
   Doctor Byte - Simulated AI Chatbot Assistant for Aura Dental Clinic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const chatbotLauncher = document.getElementById('chatbot-launcher');
  const chatbotContainer = document.getElementById('chatbot-container');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const suggestionContainer = document.getElementById('chat-suggestions');

  if (!chatbotLauncher || !chatbotContainer || !chatMessages || !chatInput || !chatSendBtn) {
    console.error("Doctor Byte elements not found in HTML.");
    return;
  }

  // 1. Precise Knowledge Base for Doctor Byte (Reordered to prioritize specific treatments)
  const knowledgeBase = {
    greetings: {
      keywords: ['hello', 'hi', 'hey', 'greetings', 'morning', 'afternoon', 'evening', 'yo', 'halo'],
      response: "Hello! 👋 I'm **Doctor Byte**, your Aura Dental digital assistant. How can I help you today? You can ask me about our services, pricing, specialists, operating hours, or how to book an appointment!"
    },
    aligners: {
      keywords: ['aligner', 'aligners', 'invisalign', 'clear braces', 'braces', 'straighten', 'crooked', 'crowding'],
      response: "Our **Invisalign Clear Aligners** (starting from ₹45,000) are custom-designed, comfortable, and virtually invisible. They straighten teeth faster than traditional metal braces. 0% EMI payment schemes are available. Would you like to consult our specialist?"
    },
    implants: {
      keywords: ['implant', 'implants', 'missing tooth', 'titanium', 'screws', 'denture'],
      response: "We offer **Premium Titanium Dental Implants** (starting from ₹25,000) with a **Lifetime Warranty**. They look, feel, and function exactly like natural teeth, restoring your bite force. We provide pain-free implant surgery. Ask me to book an implant consultation!"
    },
    whitening: {
      keywords: ['whitening', 'white', 'yellow', 'bleach', 'stain', 'brighten'],
      response: "Our **Laser Zoom Teeth Whitening** (starting from ₹5,000) is a quick, safe procedure that reduces yellowing and stains by up to **8 shades in under 45 minutes**! It is a safe and painless cosmetic touch-up."
    },
    cleaning: {
      keywords: ['clean', 'cleaning', 'scaling', 'plaque', 'tartar', 'polish', 'hygiene'],
      response: "Our **Ultrasonic Deep Cleaning & Scaling** (starting from ₹1,500) eliminates gum plaque buildup and freshens breath. We recommend a cleaning session once every 6 months to prevent dental decay."
    },
    services: {
      keywords: ['service', 'services', 'treatment', 'treatments', 'procedure', 'procedures', 'teeth', 'do you do'],
      response: "At **Aura Dental**, we offer premium services including:\n\n" +
                "• **Zoom Laser Teeth Whitening** (₹5,000+)\n" +
                "• **Invisalign Clear Aligners** (₹45,000+)\n" +
                "• **Dental Implants** (₹25,000+)\n" +
                "• **Ultrasonic Deep Cleaning & Scaling** (₹1,500+)\n" +
                "• **Dental Consultations** (₹500+)\n\n" +
                "Would you like details on a specific treatment?"
    },
    pricing: {
      keywords: ['price', 'prices', 'pricing', 'cost', 'costs', 'fee', 'fees', 'charge', 'charges', 'how much', 'rate', 'rates', 'rupee', 'rupees', 'rs', 'inr'],
      response: "We maintain 100% transparent pricing at Aura Dental. Here are our starting fees:\n\n" +
                "• **Teeth Whitening**: From ₹5,000\n" +
                "• **Clear Aligners (Invisalign)**: From ₹45,000\n" +
                "• **Dental Implants**: From ₹25,000\n" +
                "• **Deep Cleaning**: From ₹1,500\n" +
                "• **Consultation Fee**: ₹500\n\n" +
                "We accept credit cards, digital payments, and offer **0% interest EMI options** for aligners and implants."
    },
    doctors: {
      keywords: ['doctor', 'doctors', 'dentist', 'dentists', 'specialist', 'specialists', 'sharma', 'verma', 'mds', 'who works', 'staff'],
      response: "Our clinic is led by top-tier MDS specialists:\n\n" +
                "• **Dr. A. Sharma** (BDS, MDS Orthodontics): A clear aligner and smile-designing specialist with over 12+ years of experience.\n" +
                "• **Dr. R. Verma** (BDS, MDS Endodontics): An expert in titanium implants, pain-free root canals, and micro-dentistry with 10+ years of experience."
    },
    hours: {
      keywords: ['hour', 'hours', 'time', 'times', 'timing', 'timings', 'open', 'close', 'schedule', 'when', 'sunday', 'saturday', 'weekday'],
      response: "Aura Dental is open 7 days a week:\n\n" +
                "• **Monday - Friday**: 7:00 AM - 10:00 PM\n" +
                "• **Saturday - Sunday**: 8:00 AM - 11:00 PM\n\n" +
                "We provide late evening slots for your convenience."
    },
    location: {
      keywords: ['location', 'address', 'where', 'map', 'find you', 'landmark', 'place', 'city', 'hyderabad'],
      response: "We are located at:\n**Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033**.\n\nWe are right on the main road and offer dedicated free parking slots for our dental patients."
    },
    booking: {
      keywords: ['book', 'appointment', 'appointments', 'reserve', 'schedule', 'visit', 'slot', 'slots', 'intake', 'consultation'],
      response: "You can book your clinical visit in two ways:\n\n" +
                "1. Scroll to the **Schedule A Visit** form on our website, fill out your details, and submit.\n" +
                "2. Click the **[Book on WhatsApp]** button to text our front desk receptionist directly (+91 99999 99999) for a slot in under 15 minutes."
    },
    pain: {
      keywords: ['pain', 'hurt', 'painful', 'scared', 'fear', 'anesthesia', 'sedation', 'sensitive'],
      response: "We specialize in **pain-free dentistry**. Using modern topical anesthetics, gentle ultrasonic micro-instrumentation, and dental anxiety management techniques, we ensure procedures like root canals, cleanings, and implants are absolutely comfortable."
    },
    insurance: {
      keywords: ['insurance', 'emi', 'finance', 'payment plan', 'installment', 'card', 'cash'],
      response: "Yes! We support:\n\n" +
                "• **0% interest EMI options** for Clear Aligners and Implants.\n" +
                "• Direct cashless claims processing with major **dental insurance plans**.\n" +
                "• Digital payments, credit/debit cards, and UPI."
    },
    emergency: {
      keywords: ['emergency', 'accident', 'knocked', 'severe pain', 'swelling', 'bleed', 'urgent'],
      response: "🚨 **Dental Emergency?** If you have severe swelling, a knocked-out tooth, or extreme pain, please call our emergency hotline directly at **+91 99999 99999**. We offer **same-day emergency dental appointments**."
    }
  };

  // 2. Chat Interface Mechanics
  let isChatbotOpened = false;

  // Toggle Chatbot Container
  const toggleChatbot = () => {
    isChatbotOpened = !isChatbotOpened;
    if (isChatbotOpened) {
      chatbotContainer.classList.add('active');
      chatbotLauncher.classList.add('chat-open');
      // Focus input field
      setTimeout(() => chatInput.focus(), 300);
      
      // Send welcome message if it's empty
      if (chatMessages.children.length === 0) {
        sendBotReply(knowledgeBase.greetings.response);
      }
    } else {
      chatbotContainer.classList.remove('active');
      chatbotLauncher.classList.remove('chat-open');
    }
  };

  chatbotLauncher.addEventListener('click', toggleChatbot);
  if (chatbotClose) chatbotClose.addEventListener('click', toggleChatbot);

  // Auto scroll messages to bottom
  const scrollToBottom = () => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  // 3. Simulated Response Logic (Word boundary matched regex)
  const generateBotResponse = (userInput) => {
    const cleanInput = userInput.toLowerCase().trim();
    
    // Find matching topic in knowledgeBase
    for (const key in knowledgeBase) {
      const topic = knowledgeBase[key];
      const match = topic.keywords.some(keyword => {
        // Escape regex special chars
        const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        // Check for whole word match using boundary \b
        const regex = new RegExp('\\b' + escaped + '\\b', 'i');
        return regex.test(cleanInput);
      });
      if (match) {
        return topic.response;
      }
    }
    
    // Fallback response if no keywords match
    return "I'm sorry, I didn't quite get that. 🦷 Could you please ask about our **services, pricing, specialists, hours**, or **how to book an appointment**? Alternatively, click one of the quick suggestions below!";
  };

  // Add User Message
  const addUserMessage = (text) => {
    const msg = document.createElement('div');
    msg.className = 'chat-message user';
    msg.innerHTML = `<p>${escapeHTML(text)}</p>`;
    chatMessages.appendChild(msg);
    scrollToBottom();
  };

  // Create Bot Message with Typing Indicator
  const sendBotReply = (text) => {
    // 1. Create typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-message bot typing';
    typingIndicator.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    chatMessages.appendChild(typingIndicator);
    scrollToBottom();

    // 2. Calculate realistic delay based on text length
    const delay = Math.min(Math.max(text.length * 12, 600), 2000);

    setTimeout(() => {
      // Remove typing indicator
      typingIndicator.remove();

      // Create actual bot reply
      const msg = document.createElement('div');
      msg.className = 'chat-message bot';
      msg.innerHTML = `<p>${formatMarkdown(text)}</p>`;
      chatMessages.appendChild(msg);
      scrollToBottom();
    }, delay);
  };

  // Process User Input
  const handleUserSend = () => {
    const text = chatInput.value.trim();
    if (text === '') return;

    addUserMessage(text);
    chatInput.value = '';

    // Get response and send with delay
    const reply = generateBotResponse(text);
    sendBotReply(reply);
  };

  // Event Listeners for sending message
  chatSendBtn.addEventListener('click', handleUserSend);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleUserSend();
    }
  });

  // Suggestion Chip Handler
  if (suggestionContainer) {
    suggestionContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.suggestion-chip');
      if (!chip) return;

      const query = chip.getAttribute('data-query');
      addUserMessage(chip.textContent.trim());
      
      const reply = generateBotResponse(query);
      sendBotReply(reply);
    });
  }

  // Helpers
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  function formatMarkdown(text) {
    // Simple bold markdown converter: **text** -> <strong>text</strong>
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Simple line break converter: \n -> <br>
    html = html.replace(/\n/g, '<br>');
    return html;
  }
});
