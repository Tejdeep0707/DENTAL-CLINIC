/* -------------------------------------------------------------
   SMILECARE DENTAL - MAIN JAVASCRIPT BEHAVIORS
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    initPageFadeIn();
    initHeaderScroll();
    initMobileNav();
    initScrollReveal();
    initStatsCounter();
    initTestimonialsSlider();
    initFAQAccordion();
    initBookingForm();
    initTransformSliders();
    initThemeToggle();
    initCostCalculator();
    initDashboardSync();
    initScrollSpy();
    init3DTilt();
    initPortfolioHUD();
    initFloatingIconsInertia();
    initEmergencyBanner();
    initStaggerReveal();
    initGalleryLightbox();
});

/* -------------------------------------------------------------
   1. Header Sticky Scroll Class
   ------------------------------------------------------------- */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Trigger on load in case page is already scrolled
    handleScroll();
}

/* -------------------------------------------------------------
   2. Mobile Drawer Navigation
   ------------------------------------------------------------- */
function initMobileNav() {
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const drawer = document.querySelector('.mobile-drawer');
    const overlay = document.querySelector('.drawer-overlay');
    const drawerLinks = document.querySelectorAll('.mobile-nav-link');
    const drawerSubLinks = document.querySelectorAll('.mobile-nav-sublink');

    const toggleMenu = () => {
        navToggle.classList.toggle('open');
        drawer.classList.toggle('open');
        overlay.classList.toggle('active');
        document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
    };

    const closeMenu = () => {
        navToggle.classList.remove('open');
        drawer.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    drawerSubLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Mobile Dropdown Accordion Toggle
    const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
    const mobileDropdownMenu = document.querySelector('.mobile-dropdown-menu');
    const mobileDropdownIcon = document.querySelector('.mobile-dropdown-icon');
    
    if (mobileDropdownToggle && mobileDropdownMenu && mobileDropdownIcon) {
        mobileDropdownToggle.addEventListener('click', () => {
            mobileDropdownMenu.classList.toggle('open');
            mobileDropdownIcon.classList.toggle('rotate');
        });
    }
}

/* -------------------------------------------------------------
   3. Scroll Reveal Animations (Intersection Observer)
   ------------------------------------------------------------- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-init');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('reveal-active'));
    }
}

/* -------------------------------------------------------------
   4. Statistics Counter Animation
   ------------------------------------------------------------- */
function initStatsCounter() {
    const statsGrid = document.querySelector('.stats-grid');
    const numbers = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateCounters = () => {
        numbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds
            const stepTime = Math.max(Math.floor(duration / target), 15);
            let current = 0;
            
            const timer = setInterval(() => {
                // If it's a large target (like 12000), increment in bigger steps
                if (target > 1000) {
                    current += Math.ceil(target / 100);
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                } else {
                    current++;
                    if (current >= target) {
                        clearInterval(timer);
                    }
                }
                
                // Format with '+' if applicable
                if (target === 15 || target === 25) {
                    num.textContent = current + '+';
                } else if (target === 12000) {
                    num.textContent = current.toLocaleString() + '+';
                } else {
                    num.textContent = current;
                }
            }, stepTime);
        });
    };

    if ('IntersectionObserver' in window && statsGrid) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animateCounters();
                    animated = true;
                    observer.unobserve(statsGrid);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsGrid);
    } else {
        // Fallback
        animateCounters();
    }
}

/* -------------------------------------------------------------
   5. Interactive Testimonials Slider
   ------------------------------------------------------------- */
function initTestimonialsSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const btnPrev = document.querySelector('.btn-prev');
    const btnNext = document.querySelector('.btn-next');
    
    if (slides.length === 0) return;

    let currentIndex = 0;
    let autoPlayInterval;

    const showSlide = (index) => {
        // Handle bounds
        if (index >= slides.length) currentIndex = 0;
        else if (index < 0) currentIndex = slides.length - 1;
        else currentIndex = index;

        // Toggle active classes
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentIndex);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    };

    const nextSlide = () => showSlide(currentIndex + 1);
    const prevSlide = () => showSlide(currentIndex - 1);

    const startAutoplay = () => {
        autoPlayInterval = setInterval(nextSlide, 6000); // Change every 6 seconds
    };

    const resetAutoplay = () => {
        clearInterval(autoPlayInterval);
        startAutoplay();
    };

    // Events
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showSlide(i);
            resetAutoplay();
        });
    });

    startAutoplay();
}

/* -------------------------------------------------------------
   6. FAQ Accordion Height Animations
   ------------------------------------------------------------- */
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');

            // Close all other FAQs first (Accordion behavior)
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0px';
                }
            });

            // Toggle current FAQ
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = '0px';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

/* -------------------------------------------------------------
   7. Form Validation & Submissions
   ------------------------------------------------------------- */
function initBookingForm() {
    const form = document.getElementById('appointment-form');
    if (!form) return;

    const nameInput = document.getElementById('booking-name');
    const phoneInput = document.getElementById('booking-phone');
    const emailInput = document.getElementById('booking-email');
    const treatmentSelect = document.getElementById('booking-treatment');
    const dateInput = document.getElementById('booking-date');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const timeInput = document.getElementById('booking-time');
    const slotBtns = document.querySelectorAll('.time-slot-btn');

    const errorBanner = document.getElementById('form-error-banner');
    const successBanner = document.getElementById('form-success-banner');

    // Min date helper: set preferred date to tomorrow's date or later
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;

    // Helper functions for validating fields
    const setError = (element, id, show) => {
        const group = element.closest('.form-group');
        if (show) {
            group.classList.add('error');
        } else {
            group.classList.remove('error');
        }
    };

    const validateName = () => {
        const value = nameInput.value.trim();
        const isValid = value.length >= 3;
        setError(nameInput, 'error-name', !isValid);
        return isValid;
    };

    const validatePhone = () => {
        const value = phoneInput.value.trim();
        // Standard phone pattern matching (between 10 and 15 numbers)
        const phoneRegex = /^\+?[0-9\s\-()]{10,15}$/;
        const isValid = phoneRegex.test(value);
        setError(phoneInput, 'error-phone', !isValid);
        return isValid;
    };

    const validateEmail = () => {
        const value = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(value);
        setError(emailInput, 'error-email', !isValid);
        return isValid;
    };

    const validateTreatment = () => {
        const isValid = treatmentSelect.value !== '';
        setError(treatmentSelect, 'error-treatment', !isValid);
        return isValid;
    };

    const validateDate = () => {
        const value = dateInput.value;
        if (!value) {
            setError(dateInput, 'error-date', true);
            timeSlotsContainer.classList.add('hidden');
            return false;
        }
        const selectedDate = new Date(value);
        selectedDate.setHours(0,0,0,0);
        const minDate = new Date(dateInput.min);
        minDate.setHours(0,0,0,0);
        
        const isValid = selectedDate >= minDate;
        setError(dateInput, 'error-date', !isValid);

        if (isValid) {
            timeSlotsContainer.classList.remove('hidden');
        } else {
            timeSlotsContainer.classList.add('hidden');
            timeInput.value = '';
            slotBtns.forEach(btn => btn.classList.remove('active'));
        }
        return isValid;
    };

    const validateTimeSlot = () => {
        const isVisible = !timeSlotsContainer.classList.contains('hidden');
        if (!isVisible) return true;
        
        const isValid = timeInput.value !== '';
        setError(timeInput, 'error-time', !isValid);
        return isValid;
    };

    // Slot button click handler
    slotBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            slotBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            timeInput.value = btn.getAttribute('data-time');
            setError(timeInput, 'error-time', false);
        });
    });

    // Live validation triggers on input loss of focus
    nameInput.addEventListener('blur', validateName);
    phoneInput.addEventListener('blur', validatePhone);
    emailInput.addEventListener('blur', validateEmail);
    const clearCalculatorPackage = () => {
        window.selectedCalculatorEstimate = null;
        window.selectedCalculatorServices = null;
        if (calcInfoBox) calcInfoBox.classList.add('hidden');
        
        // Reset checkboxes in the calculator without triggering loops
        document.querySelectorAll('.treatment-checkbox').forEach(cb => {
            cb.checked = false;
            cb.dispatchEvent(new Event('change'));
        });
        const xrayCheckbox = document.getElementById('xray-addon');
        if (xrayCheckbox) {
            xrayCheckbox.checked = false;
            xrayCheckbox.dispatchEvent(new Event('change'));
        }
        const materialSelect = document.getElementById('material-select');
        if (materialSelect) {
            materialSelect.value = '0';
            materialSelect.dispatchEvent(new Event('change'));
        }
    };

    const calcInfoBox = document.getElementById('booking-calculator-info');
    const calcInfoClear = document.getElementById('calc-info-clear');

    // Check if there is a pending estimate stored from pricing page
    const pendingEstimateJson = localStorage.getItem('pendingEstimate');
    if (pendingEstimateJson) {
        try {
            const pending = JSON.parse(pendingEstimateJson);
            localStorage.removeItem('pendingEstimate'); // clear it
            
            // Set programmatic change flag
            window.isProgrammaticChange = true;
            
            window.selectedCalculatorEstimate = pending.summary;
            window.selectedCalculatorServices = pending.services;
            
            // Pre-select treatment in booking form
            const primaryService = pending.services[0];
            let selectValue = '';
            if (primaryService === 'Teeth Cleaning') selectValue = 'teeth-cleaning';
            else if (primaryService === 'Teeth Whitening') selectValue = 'teeth-whitening';
            else if (primaryService === 'Root Canal') selectValue = 'root-canal';
            else if (primaryService === 'Dental Implants') selectValue = 'dental-implants';
            else if (primaryService === 'Braces & Aligners') selectValue = 'braces-aligners';
            
            if (treatmentSelect && selectValue) {
                treatmentSelect.value = selectValue;
                treatmentSelect.dispatchEvent(new Event('change'));
            }
            
            window.isProgrammaticChange = false;
            
            if (calcInfoBox && calcInfoText) {
                calcInfoText.textContent = window.selectedCalculatorEstimate;
                calcInfoBox.classList.remove('hidden');
            }
        } catch (e) {
            console.error('Failed to parse pending estimate:', e);
        }
    }

    treatmentSelect.addEventListener('change', () => {
        validateTreatment();
        // Clear calculator selection if user changes the dropdown manually
        if (!window.isProgrammaticChange && window.selectedCalculatorEstimate) {
            clearCalculatorPackage();
        }
    });
    dateInput.addEventListener('change', validateDate);

    if (calcInfoClear) {
        calcInfoClear.addEventListener('click', () => {
            clearCalculatorPackage();
            treatmentSelect.value = '';
            // Temporarily set programmatic flag so resetting selection doesn't re-trigger clear
            window.isProgrammaticChange = true;
            treatmentSelect.dispatchEvent(new Event('change'));
            window.isProgrammaticChange = false;
        });
    }

    // Form submit listener
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Perform all validations
        const isNameValid = validateName();
        const isPhoneValid = validatePhone();
        const isEmailValid = validateEmail();
        const isTreatmentValid = validateTreatment();
        const isDateValid = validateDate();
        const isTimeValid = validateTimeSlot();

        const isFormValid = isNameValid && isPhoneValid && isEmailValid && isTreatmentValid && isDateValid && isTimeValid;

        if (isFormValid) {
            // Hide banners
            errorBanner.style.display = 'none';
            successBanner.style.display = 'none';

            // Disable submit button & show loading state to prevent duplicate submissions
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Submitting Appointment...';

            // Prepare EmailJS template parameters
            const templateParams = {
                booking_name: nameInput.value.trim(),
                booking_phone: phoneInput.value.trim(),
                booking_email: emailInput.value.trim(),
                booking_treatment: treatmentSelect.options[treatmentSelect.selectedIndex].text + (window.selectedCalculatorEstimate ? ` [Package: ${window.selectedCalculatorEstimate}]` : ''),
                booking_date: dateInput.value + ' at ' + timeInput.value
            };

            // =============================================================
            // EmailJS Configuration Placeholders
            // =============================================================
            // INSERT YOUR SERVICE_ID HERE:
            const SERVICE_ID = "service_cn1ly6v"; 
            // INSERT YOUR TEMPLATE_ID HERE:
            const TEMPLATE_ID = "template_b8riaqh"; 
            // INSERT YOUR PUBLIC_KEY HERE:
            const PUBLIC_KEY = "TLR5if82dog7Sd7XS";

            if (typeof emailjs !== 'undefined') {
                // Initialize EmailJS Browser SDK
                emailjs.init({
                    publicKey: PUBLIC_KEY
                });

                // Send the email
                emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
                    .then((response) => {
                        console.log('EmailJS Send Successful:', response.status, response.text);

                        // Success Actions
                        const successTextEl = successBanner.querySelector('p');
                        if (successTextEl) {
                            successTextEl.textContent = "Appointment request received. Our team will contact you within 24 hours.";
                        }
                        
                        successBanner.style.display = 'flex';
                        successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                        // Trigger Dynamic Admin Dashboard Sync
                        if (typeof window.triggerDashboardSync === 'function') {
                            window.triggerDashboardSync({
                                name: nameInput.value.trim(),
                                phone: phoneInput.value.trim(),
                                treatment: treatmentSelect.value,
                                treatments: window.selectedCalculatorServices || [],
                                source: 'form'
                            });
                        }

                        // Reset form
                        form.reset();

                        // Clear calculator package details
                        window.selectedCalculatorEstimate = null;
                        window.selectedCalculatorServices = null;
                        if (calcInfoBox) calcInfoBox.classList.add('hidden');

                        // Clear validation error flags
                        document.querySelectorAll('.form-group').forEach(group => {
                            group.classList.remove('error');
                        });

                        // Re-enable button
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;

                        // Close success banner after 10 seconds
                        setTimeout(() => {
                            successBanner.style.display = 'none';
                        }, 10000);
                    })
                    .catch((error) => {
                        console.error('EmailJS Send Failed:', error);

                        // Graceful portfolio fallback if EmailJS fails (e.g. rate limit, bad network)
                        console.log('Failing over to dynamic portfolio simulation update...');
                        
                        const successTextEl = successBanner.querySelector('p');
                        if (successTextEl) {
                            successTextEl.innerHTML = "Appointment request received! <br><small style='opacity: 0.8;'>(Portfolio Note: Simulated booking successfully synced to Live Admin Dashboard)</small>";
                        }
                        
                        successBanner.style.display = 'flex';
                        successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                        // Trigger Dynamic Admin Dashboard Sync anyway for demo purposes
                        if (typeof window.triggerDashboardSync === 'function') {
                            window.triggerDashboardSync({
                                name: nameInput.value.trim(),
                                phone: phoneInput.value.trim(),
                                treatment: treatmentSelect.value,
                                treatments: window.selectedCalculatorServices || [],
                                source: 'form'
                            });
                        }

                        // Reset form
                        form.reset();
                        window.selectedCalculatorEstimate = null;
                        window.selectedCalculatorServices = null;
                        if (calcInfoBox) calcInfoBox.classList.add('hidden');

                        // Clear validation error flags
                        document.querySelectorAll('.form-group').forEach(group => {
                            group.classList.remove('error');
                        });

                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;

                        setTimeout(() => {
                            successBanner.style.display = 'none';
                        }, 10000);
                    });
            } else {
                console.warn("EmailJS SDK is not loaded. Simulating booking response for showcase.");
                
                const successTextEl = successBanner.querySelector('p');
                if (successTextEl) {
                    successTextEl.innerHTML = "Appointment request received! <br><small style='opacity: 0.8;'>(Portfolio Note: Simulated booking successfully synced to Live Admin Dashboard)</small>";
                }
                
                successBanner.style.display = 'flex';
                successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                if (typeof window.triggerDashboardSync === 'function') {
                    window.triggerDashboardSync({
                        name: nameInput.value.trim(),
                        phone: phoneInput.value.trim(),
                        treatment: treatmentSelect.value,
                        treatments: window.selectedCalculatorServices || [],
                        source: 'form'
                    });
                }

                form.reset();
                window.selectedCalculatorEstimate = null;
                window.selectedCalculatorServices = null;
                if (calcInfoBox) calcInfoBox.classList.add('hidden');
                document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                setTimeout(() => {
                    successBanner.style.display = 'none';
                }, 10000);
            }

        } else {
            // Show validation error notification
            errorBanner.textContent = "Please correct the errors in the form before submitting.";
            errorBanner.style.display = 'block';
            errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            successBanner.style.display = 'none';
        }
    });
}

/* -------------------------------------------------------------
   8. Before/After Image Comparison Slider
   ------------------------------------------------------------- */
function initTransformSliders() {
    const sliders = document.querySelectorAll('.transform-slider-wrapper');
    
    sliders.forEach(slider => {
        let isDragging = false;
        
        const updateSlider = (clientX) => {
            const rect = slider.getBoundingClientRect();
            let x = clientX - rect.left;
            let percentage = (x / rect.width) * 100;
            
            // Clamp percentage between 0 and 100
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;
            
            slider.style.setProperty('--slider-pos', percentage + '%');
        };
        
        const startDragging = (e) => {
            isDragging = true;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updateSlider(clientX);
        };
        
        const drag = (e) => {
            if (!isDragging) return;
            // Prevent mobile screen scrolling while sliding
            if (e.cancelable) e.preventDefault();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updateSlider(clientX);
        };
        
        const stopDragging = () => {
            isDragging = false;
        };
        
        // Mouse Listeners
        slider.addEventListener('mousedown', startDragging);
        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', stopDragging);
        
        // Touch Listeners
        slider.addEventListener('touchstart', startDragging, { passive: false });
        window.addEventListener('touchmove', drag, { passive: false });
        window.addEventListener('touchend', stopDragging);
    });
}

/* -------------------------------------------------------------
   9. Theme Toggle (Dark Mode / Light Mode)
   ------------------------------------------------------------- */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        
        if (isDark) {
            document.body.classList.remove('dark-theme');
            document.documentElement.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.add('dark-theme');
            document.documentElement.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
    });
}

/* -------------------------------------------------------------
   10. Interactive Dental Treatment Cost Calculator
   ------------------------------------------------------------- */
function initCostCalculator() {
    const checkboxes = document.querySelectorAll('.treatment-checkbox');
    const materialSelect = document.getElementById('material-select');
    const xrayCheckbox = document.getElementById('xray-addon');
    const summaryList = document.getElementById('summary-items');
    const subtotalEl = document.getElementById('calc-subtotal');
    const taxEl = document.getElementById('calc-tax');
    const totalEl = document.getElementById('calc-total');
    const bookBtn = document.getElementById('calc-book-btn');
    
    // Booking Form Target Elements
    const treatmentSelect = document.getElementById('booking-treatment');
    const calcInfoBox = document.getElementById('booking-calculator-info');
    const calcInfoText = document.getElementById('booking-calculator-text');
    
    if (!checkboxes.length || !summaryList || !totalEl || !bookBtn) return;
    
    function updateCalculator() {
        let subtotal = 0;
        let itemsHtml = '';
        let hasTreatments = false;
        const selectedServices = [];
        
        // Add selected treatments
        checkboxes.forEach(cb => {
            const labelEl = cb.closest('.treatment-select-item');
            if (cb.checked) {
                if (labelEl) labelEl.classList.add('active');
                const name = cb.getAttribute('data-name');
                const val = parseFloat(cb.value);
                subtotal += val;
                itemsHtml += `
                    <li>
                        <span>${name}</span>
                        <span>₹${val.toLocaleString('en-IN')}</span>
                    </li>
                `;
                selectedServices.push(name);
                hasTreatments = true;
            } else {
                if (labelEl) labelEl.classList.remove('active');
            }
        });
        
        if (hasTreatments) {
            // Add material addon if chosen
            const materialVal = parseFloat(materialSelect.value);
            if (materialVal > 0) {
                const materialOption = materialSelect.options[materialSelect.selectedIndex];
                const materialName = materialOption.getAttribute('data-name');
                subtotal += materialVal;
                itemsHtml += `
                    <li>
                        <span>Crown: ${materialName}</span>
                        <span>+₹${materialVal.toLocaleString('en-IN')}</span>
                    </li>
                `;
            }
            
            // Add xray addon
            if (xrayCheckbox.checked) {
                const xrayVal = parseFloat(xrayCheckbox.value);
                const xrayName = xrayCheckbox.getAttribute('data-name');
                subtotal += xrayVal;
                itemsHtml += `
                    <li>
                        <span>${xrayName}</span>
                        <span>+₹${xrayVal.toLocaleString('en-IN')}</span>
                    </li>
                `;
            }
            
            const tax = Math.round(subtotal * 0.18);
            const total = subtotal + tax;
            
            summaryList.innerHTML = itemsHtml;
            subtotalEl.innerText = `₹${subtotal.toLocaleString('en-IN')}`;
            taxEl.innerText = `₹${tax.toLocaleString('en-IN')}`;
            totalEl.innerText = `₹${total.toLocaleString('en-IN')}`;
            bookBtn.disabled = false;
            
            // Save state details
            const materialDisplay = materialVal > 0 ? materialSelect.options[materialSelect.selectedIndex].getAttribute('data-name') : 'Standard';
            const xrayDisplay = xrayCheckbox.checked ? 'Included' : 'None';
            window.tempCalculatorEstimate = {
                services: selectedServices,
                summary: `${selectedServices.join(', ')} (Crown: ${materialDisplay}, X-ray: ${xrayDisplay}) - Est. Total: ₹${total.toLocaleString('en-IN')}`
            };
        } else {
            summaryList.innerHTML = '<li class="empty-summary-msg">Select a treatment above to begin estimation.</li>';
            subtotalEl.innerText = '₹0';
            taxEl.innerText = '₹0';
            totalEl.innerText = '₹0';
            bookBtn.disabled = true;
            window.tempCalculatorEstimate = null;
        }
    }
    
    // Add event listeners
    checkboxes.forEach(cb => cb.addEventListener('change', updateCalculator));
    materialSelect.addEventListener('change', updateCalculator);
    xrayCheckbox.addEventListener('change', updateCalculator);
    
    // Handle package booking action
    bookBtn.addEventListener('click', () => {
        if (!window.tempCalculatorEstimate) return;
        
        // Check if the appointment booking form is on the current page
        const bookingForm = document.getElementById('appointment-form');
        
        if (!bookingForm) {
            // Save estimate in localStorage for cross-page booking and redirect
            localStorage.setItem('pendingEstimate', JSON.stringify({
                summary: window.tempCalculatorEstimate.summary,
                services: window.tempCalculatorEstimate.services
            }));
            window.location.href = 'index.html#booking';
            return;
        }

        // Set programmatic change flag to avoid clearing on the change event
        window.isProgrammaticChange = true;
        
        // Copy to permanent estimate parameters
        window.selectedCalculatorEstimate = window.tempCalculatorEstimate.summary;
        window.selectedCalculatorServices = window.tempCalculatorEstimate.services;
        
        // Pre-select treatment in booking form
        const primaryService = window.tempCalculatorEstimate.services[0];
        let selectValue = '';
        if (primaryService === 'Teeth Cleaning') selectValue = 'teeth-cleaning';
        else if (primaryService === 'Teeth Whitening') selectValue = 'teeth-whitening';
        else if (primaryService === 'Root Canal') selectValue = 'root-canal';
        else if (primaryService === 'Dental Implants') selectValue = 'dental-implants';
        else if (primaryService === 'Braces & Aligners') selectValue = 'braces-aligners';
        
        if (treatmentSelect && selectValue) {
            treatmentSelect.value = selectValue;
            treatmentSelect.dispatchEvent(new Event('change'));
        }
        
        // Reset programmatic change flag
        window.isProgrammaticChange = false;
        
        // Reveal estimate details in booking form info box
        if (calcInfoBox && calcInfoText) {
            calcInfoText.textContent = window.selectedCalculatorEstimate;
            calcInfoBox.classList.remove('hidden');
        }
        
        // Scroll smoothly to appointment form
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Pricing card "Select Package" button click listener
    const pricingBtns = document.querySelectorAll('.pricing-btn[data-treatment]');
    pricingBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const treatmentType = btn.getAttribute('data-treatment');
            let checkboxName = '';
            if (treatmentType === 'teeth-cleaning') checkboxName = 'Teeth Cleaning';
            else if (treatmentType === 'teeth-whitening') checkboxName = 'Teeth Whitening';
            else if (treatmentType === 'root-canal') checkboxName = 'Root Canal';
            else if (treatmentType === 'dental-implants') checkboxName = 'Dental Implants';
            else if (treatmentType === 'braces-aligners') checkboxName = 'Braces & Aligners';

            if (checkboxName) {
                // Uncheck all checkboxes first
                checkboxes.forEach(cb => {
                    cb.checked = false;
                });
                
                // Check the clicked one
                const targetCheckbox = Array.from(checkboxes).find(cb => cb.getAttribute('data-name') === checkboxName);
                if (targetCheckbox) {
                    targetCheckbox.checked = true;
                    // Trigger change to update calculator totals
                    targetCheckbox.dispatchEvent(new Event('change'));
                }
                
                // Scroll smoothly to calculator
                const calcCard = document.querySelector('.cost-calculator-card');
                if (calcCard) {
                    calcCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });
}

/* -------------------------------------------------------------
   11. Smart Clinic Management Dashboard Live Synchronization
   ------------------------------------------------------------- */
function initDashboardSync() {
    // Define the global state on the window object
    window.dashboardState = {
        appointments: 127,
        leads: 42,
        chats: 84,
        pending: 11,
        treatmentCounts: {
            'dental-implants': 45,
            'teeth-whitening': 30,
            'teeth-cleaning': 27,
            'root-canal': 15,
            'braces-aligners': 10,
            'general-consultation': 0 // Mapped under consultation/leads
        }
    };

    // Helper to map human-readable treatment names to chart keys
    function mapServiceToKey(serviceName) {
        const serviceClean = serviceName.toLowerCase();
        if (serviceClean.includes('cleaning')) return 'teeth-cleaning';
        if (serviceClean.includes('whitening')) return 'teeth-whitening';
        if (serviceClean.includes('root') || serviceClean.includes('canal')) return 'root-canal';
        if (serviceClean.includes('implant')) return 'dental-implants';
        if (serviceClean.includes('brace') || serviceClean.includes('align')) return 'braces-aligners';
        return 'general-consultation';
    }

    // Global helper to trigger the sync update
    window.triggerDashboardSync = function(data) {
        const state = window.dashboardState;
        
        // 1. Increment Stats
        state.appointments += 1;
        state.pending += 1;
        
        if (data.source === 'chat') {
            state.chats += 1;
        } else {
            state.leads += 1;
        }

        // 2. Update Stats Counter UI
        updateStatCardValue('db-stat-appointments', state.appointments);
        updateStatCardValue('db-stat-leads', state.leads);
        updateStatCardValue('db-stat-chats', state.chats);
        updateStatCardValue('db-stat-pending', state.pending);

        // 3. Increment specific treatment counts
        if (data.treatments && data.treatments.length > 0) {
            data.treatments.forEach(t => {
                const key = mapServiceToKey(t);
                if (state.treatmentCounts.hasOwnProperty(key)) {
                    state.treatmentCounts[key] += 1;
                }
            });
        } else {
            let mappedTreatmentKey = data.treatment;
            if (state.treatmentCounts.hasOwnProperty(mappedTreatmentKey)) {
                state.treatmentCounts[mappedTreatmentKey] += 1;
            }
        }

        // 4. Update Treatment Popularity Chart Bars and Percentage text labels
        recalculateChart();

        // 5. Prepend new item to Recent Requests list
        prependRecentRequest(data);

        // 6. Show Sync Toast Notification
        showSyncToast(data);
    };

    // Helper: update stat card with pulse effect
    function updateStatCardValue(elementId, value) {
        const el = document.getElementById(elementId);
        if (!el) return;
        
        el.textContent = value;
        el.classList.remove('pulse-active');
        // Trigger reflow to restart animation
        void el.offsetWidth;
        el.classList.add('pulse-active');
    }

    // Helper: recalculate chart bar widths & values
    function recalculateChart() {
        const state = window.dashboardState;
        
        // Calculate total count across mapped treatments that are in the chart
        const chartTreatments = ['dental-implants', 'teeth-whitening', 'teeth-cleaning', 'root-canal', 'braces-aligners'];
        let chartTotal = 0;
        chartTreatments.forEach(key => {
            chartTotal += state.treatmentCounts[key];
        });

        // Recalculate percentages
        chartTreatments.forEach(key => {
            const count = state.treatmentCounts[key];
            const percent = chartTotal > 0 ? Math.round((count / chartTotal) * 100) : 0;

            // Update UI elements
            const textValEl = document.querySelector(`[data-chart-val="${key}"]`);
            const barFillEl = document.querySelector(`[data-chart-bar="${key}"]`);

            if (textValEl) textValEl.textContent = `${percent}%`;
            if (barFillEl) barFillEl.style.width = `${percent}%`;
        });
    }

    // Helper: prepend list item
    function prependRecentRequest(data) {
        const listContainer = document.getElementById('db-recent-list');
        if (!listContainer) return;

        // Get current time formatted as HH:MM AM/PM
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const timeStr = `${hours}:${minutes} ${ampm}`;

        // Map treatment values to human readable text
        let treatmentName = '';
        if (data.treatments && data.treatments.length > 0) {
            treatmentName = data.treatments.join(' + ');
        } else {
            const treatmentNames = {
                'teeth-cleaning': 'Teeth Cleaning',
                'dental-implants': 'Dental Implants',
                'root-canal': 'Root Canal Treatment',
                'teeth-whitening': 'Teeth Whitening',
                'braces-aligners': 'Braces & Aligners',
                'general-consultation': 'General Consultation'
            };
            treatmentName = treatmentNames[data.treatment] || data.treatment;
        }

        // Create new item element
        const newItem = document.createElement('div');
        newItem.className = 'db-list-item new-item';
        newItem.innerHTML = `
            <div class="db-item-time">${timeStr}</div>
            <div class="db-item-info">
                <div class="db-item-name">${data.name}</div>
                <div class="db-item-desc">${treatmentName} (${data.source === 'chat' ? 'AI Chat' : 'Web Form'})</div>
            </div>
            <span class="db-badge badge-pending">Pending</span>
        `;

        // Prepend to container
        listContainer.insertBefore(newItem, listContainer.firstChild);

        // Remove last item if list is too long (keep it max 5 items)
        if (listContainer.children.length > 5) {
            listContainer.removeChild(listContainer.lastChild);
        }

        // Recreate icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Helper: show toast notification
    let toastTimeout;
    function showSyncToast(data) {
        const toast = document.getElementById('db-toast');
        const toastMessage = document.getElementById('db-toast-message');
        if (!toast || !toastMessage) return;

        let treatmentDisplay = '';
        if (data.treatments && data.treatments.length > 0) {
            treatmentDisplay = data.treatments.join(', ');
        } else {
            const treatmentNames = {
                'teeth-cleaning': 'Teeth Cleaning',
                'dental-implants': 'Dental Implants',
                'root-canal': 'Root Canal Treatment',
                'teeth-whitening': 'Teeth Whitening',
                'braces-aligners': 'Braces & Aligners',
                'general-consultation': 'General Consultation'
            };
            treatmentDisplay = treatmentNames[data.treatment] || data.treatment;
        }

        const sourceLabel = data.source === 'chat' ? 'AI Chat' : 'Web Form';
        toastMessage.textContent = `Live Sync: ${data.name} booked [${treatmentDisplay}] via ${sourceLabel}!`;

        clearTimeout(toastTimeout);
        toast.classList.remove('active');
        
        // Trigger reflow
        void toast.offsetWidth;
        
        toast.classList.add('active');

        toastTimeout = setTimeout(() => {
            toast.classList.remove('active');
        }, 4000);
    }
}

/* =============================================================
   12. Portfolio Showcase HUD & UI Polish Routines
   ============================================================= */

// A. Page Entrance Transitions
function initPageFadeIn() {
    document.body.classList.add('page-fade-in');
}

// B. Scroll Spy Navigation Active Highlights
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;

    const handleScrollSpy = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // Offset for sticky navbar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === '#' && currentSectionId === 'home') {
                    link.classList.add('active');
                } else if (href && href.includes(currentSectionId)) {
                    link.classList.add('active');
                }
            });
        }
    };

    window.addEventListener('scroll', handleScrollSpy);
    handleScrollSpy(); // Trigger on load
}

// C. 3D Card Hover Tilt Calculations
function init3DTilt() {
    const cards = document.querySelectorAll('.doctor-card, .service-card');
    
    cards.forEach(card => {
        const parent = card.parentElement;
        if (parent) {
            parent.classList.add('perspective-container');
        }

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Normalized rotation angles (scale factor to control intensity)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const tiltX = ((centerY - y) / centerY) * 12; // tilt around X axis
            const tiltY = ((x - centerX) / centerX) * 12; // tilt around Y axis

            card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
            card.style.boxShadow = '0 20px 35px -10px rgba(15, 23, 42, 0.18)';
            card.style.borderColor = 'var(--color-secondary)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            card.style.boxShadow = '';
            card.style.borderColor = '';
        });
    });
}

// D. Portfolio Developer HUD Panel Injection & Operations
const SHOW_PORTFOLIO_HUD = true;

function initPortfolioHUD() {
    if (!SHOW_PORTFOLIO_HUD) return;
    
    // 1. Create and inject HUD elements dynamically
    const hudContainer = document.createElement('div');
    hudContainer.className = 'portfolio-hud-container';
    
    hudContainer.innerHTML = `
        <button class="portfolio-hud-toggle" id="portfolio-hud-toggle" aria-label="Open Developer Controls">
            <i data-lucide="terminal"></i>
            <span class="hud-pulse-ring"></span>
        </button>
        <div class="portfolio-hud-panel" id="portfolio-hud-panel">
            <div class="hud-header">
                <div class="hud-header-title">
                    <i data-lucide="briefcase"></i>
                    <h4>Portfolio HUD</h4>
                </div>
                <div class="hud-close-btn" id="portfolio-hud-close" aria-label="Close Panel">
                    <i data-lucide="x"></i>
                </div>
            </div>
            <div class="hud-body">
                <div>
                    <span class="hud-section-title">Tech Stack</span>
                    <div class="hud-tech-tags">
                        <span class="hud-tag">HTML5 Semantic</span>
                        <span class="hud-tag">CSS3 Variables</span>
                        <span class="hud-tag">Vanilla ES6+ JS</span>
                        <span class="hud-tag">Lucide Icons</span>
                        <span class="hud-tag">EmailJS SDK</span>
                    </div>
                </div>
                <div>
                    <span class="hud-section-title">Quick Teleport</span>
                    <div class="hud-links-list">
                        <a href="index.html#booking" class="hud-teleport-link">
                            <span>Appointment Form</span>
                            <i data-lucide="chevron-right"></i>
                        </a>
                        <a href="index.html#clinic-management" class="hud-teleport-link">
                            <span>Live Sync Dashboard</span>
                            <i data-lucide="chevron-right"></i>
                        </a>
                        <a href="pricing.html#pricing" class="hud-teleport-link">
                            <span>Cost Estimator</span>
                            <i data-lucide="chevron-right"></i>
                        </a>
                        <a href="doctors.html#transformations" class="hud-teleport-link">
                            <span>Before/After Slider</span>
                            <i data-lucide="chevron-right"></i>
                        </a>
                    </div>
                </div>
                <div>
                    <span class="hud-section-title">Auto-Pilot Sandbox</span>
                    <div class="hud-action-box">
                        <p class="hud-autopilot-desc">Launch an automated visual simulation that scrolls, auto-types realistic guest booking data, selects slots, and submits to see the Live Sync Admin Dashboard update instantly!</p>
                        <button class="btn-hud-action" id="hud-autopilot-btn">
                            <i data-lucide="play"></i>
                            <span>⚡ Run Test Booking</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(hudContainer);

    // 2. Create and inject portfolio footer signature badge
    const footer = document.querySelector('.footer');
    if (footer) {
        const signatureBadge = document.createElement('div');
        signatureBadge.className = 'portfolio-footer-badge';
        signatureBadge.innerHTML = `
            <div class="container">
                <p>Portfolio Showcase: Designed & Engineered by <a href="#" target="_blank" rel="noopener noreferrer">Tejdeep</a>. Available for custom web development opportunities.</p>
            </div>
        `;
        footer.parentNode.insertBefore(signatureBadge, footer.nextSibling);
    }

    // 3. Initialize lucide icons inside dynamically injected elements
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 4. Panel toggling logic
    const toggleBtn = document.getElementById('portfolio-hud-toggle');
    const closeBtn = document.getElementById('portfolio-hud-close');
    const panel = document.getElementById('portfolio-hud-panel');

    if (toggleBtn && panel) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('open');
        });
    }

    if (closeBtn && panel) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.remove('open');
        });
    }

    document.addEventListener('click', (e) => {
        if (panel && panel.classList.contains('open') && !hudContainer.contains(e.target)) {
            panel.classList.remove('open');
        }
    });

    // 5. Teleport scroll handlers for cross-page anchor teleports
    const teleportLinks = document.querySelectorAll('.hud-teleport-link');
    teleportLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const targetParts = href.split('#');
            const targetPage = targetParts[0];
            const targetAnchor = targetParts[1];
            
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';

            if (currentPage === targetPage || (targetPage === 'index.html' && (currentPage === '' || currentPage === '/'))) {
                e.preventDefault();
                panel.classList.remove('open');
                
                const targetEl = document.getElementById(targetAnchor === 'before-after' ? 'transformations' : targetAnchor === 'cost-estimator' ? 'pricing' : targetAnchor);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });

    // 6. Bind Auto-pilot demo trigger
    const autopilotBtn = document.getElementById('hud-autopilot-btn');
    if (autopilotBtn) {
        autopilotBtn.addEventListener('click', () => {
            panel.classList.remove('open');
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            
            if (currentPage !== 'index.html' && currentPage !== '') {
                // Redirect to home page and run test on load
                window.location.href = 'index.html?autopilot=true#booking';
            } else {
                runAutoPilotDemo();
            }
        });
    }

    // 7. Check if autopilot is queued in URL parameters on load
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autopilot') === 'true') {
        window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
        setTimeout(() => {
            runAutoPilotDemo();
        }, 1500); // Wait for page elements to fully initialize
    }
}

// E. Dynamic Keyboard Auto-Typing Animation Helper
function typeInput(element, text, index, callback) {
    if (index < text.length) {
        element.value += text.charAt(index);
        element.dispatchEvent(new Event('input'));
        setTimeout(() => {
            typeInput(element, text, index + 1, callback);
        }, 60);
    } else {
        element.dispatchEvent(new Event('change'));
        element.dispatchEvent(new Event('blur')); // Triggers live validation styles
        if (callback) callback();
    }
}

// F. The Auto-Pilot Visual Sandbox Demo Simulation
function runAutoPilotDemo() {
    const form = document.getElementById('appointment-form');
    const autopilotBtn = document.getElementById('hud-autopilot-btn');
    
    if (!form) return;

    // Guard: Prevent concurrent runs
    if (autopilotBtn && autopilotBtn.disabled) return;

    if (autopilotBtn) {
        autopilotBtn.disabled = true;
        autopilotBtn.innerHTML = '<i data-lucide="loader" class="toast-spinner-icon"></i> <span>Auto-Typing...</span>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Scroll smoothly to appointment section
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Simulation Guest Details Databank
    const names = ["Sarah Connor (Recruiter)", "Diana Prince (Client)", "Tony Stark (Auditor)", "Bruce Banner (Reviewer)", "Arthur Dent (Guest)"];
    const treatments = ["teeth-cleaning", "dental-implants", "root-canal", "teeth-whitening", "braces-aligners"];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomPhone = "+1 (555) " + Math.floor(1000000 + Math.random() * 9000000);
    const randomEmail = randomName.toLowerCase().replace(/[^a-z0-9]/g, '') + "@portfolio-test.dev";
    const randomTreatment = treatments[Math.floor(Math.random() * treatments.length)];

    // Target elements
    const nameInput = document.getElementById('booking-name');
    const phoneInput = document.getElementById('booking-phone');
    const emailInput = document.getElementById('booking-email');
    const treatmentSelect = document.getElementById('booking-treatment');
    const dateInput = document.getElementById('booking-date');
    const timeSlotsContainer = document.getElementById('time-slots-container');

    // Run typewriter inputs sequentially
    setTimeout(() => {
        nameInput.value = '';
        nameInput.focus();
        
        typeInput(nameInput, randomName, 0, () => {
            setTimeout(() => {
                phoneInput.value = '';
                phoneInput.focus();
                
                typeInput(phoneInput, randomPhone, 0, () => {
                    setTimeout(() => {
                        emailInput.value = '';
                        emailInput.focus();
                        
                        typeInput(emailInput, randomEmail, 0, () => {
                            setTimeout(() => {
                                // Select Treatment dropdown
                                treatmentSelect.focus();
                                treatmentSelect.value = randomTreatment;
                                treatmentSelect.dispatchEvent(new Event('change'));
                                
                                setTimeout(() => {
                                    // Select Date in the future
                                    const tomorrow = new Date();
                                    tomorrow.setDate(tomorrow.getDate() + 2); // 2 days from now
                                    const yyyy = tomorrow.getFullYear();
                                    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
                                    const dd = String(tomorrow.getDate()).padStart(2, '0');
                                    
                                    dateInput.focus();
                                    dateInput.value = `${yyyy}-${mm}-${dd}`;
                                    dateInput.dispatchEvent(new Event('change'));

                                    // Wait for time slots picker grid to transition in
                                    setTimeout(() => {
                                        const slots = document.querySelectorAll('.time-slot-btn');
                                        if (slots.length > 0) {
                                            const randomSlot = slots[Math.floor(Math.random() * slots.length)];
                                            randomSlot.focus();
                                            randomSlot.click();
                                            
                                            // Final Submit Trigger
                                            setTimeout(() => {
                                                const submitBtn = form.querySelector('button[type="submit"]');
                                                if (submitBtn) {
                                                    submitBtn.click();
                                                }
                                                
                                                // Reset HUD button state
                                                setTimeout(() => {
                                                    if (autopilotBtn) {
                                                        autopilotBtn.disabled = false;
                                                        autopilotBtn.innerHTML = '<i data-lucide="play"></i> <span>⚡ Run Test Booking</span>';
                                                        if (typeof lucide !== 'undefined') lucide.createIcons();
                                                    }
                                                    
                                                    // Scroll to Dashboard to witness live-sync metrics in action
                                                    setTimeout(() => {
                                                        const dashboard = document.getElementById('clinic-management');
                                                        if (dashboard) {
                                                            dashboard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                            
                                                            // Highlight dashboard panel with a dynamic pulse
                                                            const dbWindow = document.querySelector('.dashboard-window');
                                                            if (dbWindow) {
                                                                dbWindow.style.outline = '4px solid var(--color-secondary)';
                                                                dbWindow.style.transition = 'outline 0.3s ease';
                                                                setTimeout(() => {
                                                                    dbWindow.style.outline = 'none';
                                                                }, 3500);
                                                            }
                                                        }
                                                    }, 800);
                                                    
                                                }, 2500);
                                            }, 1000);
                                        }
                                    }, 800);
                                }, 800);
                            }, 800);
                        });
                    }, 800);
                });
            }, 800);
        });
    }, 800);
}

// G. Floating Action Icons Scroll Inertia & Rotation Physics
function initFloatingIconsInertia() {
    const hudToggle = document.getElementById('portfolio-hud-toggle');
    const chatToggle = document.getElementById('chatbot-toggle');

    if (!hudToggle && !chatToggle) return;

    let lastScrollY = window.scrollY;
    let scrollTimeout;

    // Apply smooth springy transitions
    if (hudToggle) hudToggle.style.transition = 'transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1.25), background-color 0.2s ease, box-shadow 0.2s ease';
    if (chatToggle) chatToggle.style.transition = 'transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1.25), background-color 0.2s ease, box-shadow 0.2s ease';

    const handleScrollPhysics = () => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;

        // Calculate dynamic translation offset (inertia drag) based on scroll speed
        const offset = Math.min(Math.max(delta * 0.35, -25), 25);
        
        // Calculate terminal icon rotation delta
        const rotation = Math.min(Math.max(delta * 0.45, -60), 60);

        if (hudToggle) {
            hudToggle.style.transform = `translateY(${-offset}px) rotate(${rotation}deg)`;
            hudToggle.style.boxShadow = '0 15px 30px -5px rgba(37, 99, 235, 0.7)';
        }
        
        if (chatToggle) {
            chatToggle.style.transform = `translateY(${-offset}px) scale(1.05)`;
            chatToggle.style.boxShadow = '0 15px 30px -5px rgba(13, 148, 136, 0.6)';
        }

        // Return icons to resting coordinates smoothly when scrolling ceases
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (hudToggle) {
                hudToggle.style.transform = 'translateY(0px) rotate(0deg)';
                hudToggle.style.boxShadow = '';
            }
            if (chatToggle) {
                chatToggle.style.transform = 'translateY(0px) scale(1)';
                chatToggle.style.boxShadow = '';
            }
        }, 150);
    };

    window.addEventListener('scroll', handleScrollPhysics);
}

/* -------------------------------------------------------------
   FINAL POLISH — Emergency Banner Dismiss
   ------------------------------------------------------------- */
function initEmergencyBanner() {
    const banner  = document.getElementById('emergency-banner');
    const closeBtn = document.getElementById('eb-close-btn');
    if (!banner || !closeBtn) return;

    // Check if user already dismissed it this session
    if (sessionStorage.getItem('eb-dismissed') === '1') {
        banner.classList.add('hidden');
        document.body.classList.remove('banner-visible');
        return;
    }

    closeBtn.addEventListener('click', () => {
        banner.classList.add('hidden');
        document.body.classList.remove('banner-visible');
        sessionStorage.setItem('eb-dismissed', '1');
    });
}

/* -------------------------------------------------------------
   FINAL POLISH — Staggered Children Reveal
   ------------------------------------------------------------- */
function initStaggerReveal() {
    const staggerGrids = document.querySelectorAll('.stagger-children');
    if (!staggerGrids.length) return;

    if (!('IntersectionObserver' in window)) {
        staggerGrids.forEach(g => g.classList.add('revealed'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    staggerGrids.forEach(g => observer.observe(g));
}

/* -------------------------------------------------------------
   FINAL POLISH — Gallery Lightbox
   ------------------------------------------------------------- */
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const overlay      = document.getElementById('lightbox-overlay');
    const contentEl    = document.getElementById('lightbox-content');
    const captionEl    = document.getElementById('lightbox-caption');
    const closeBtn     = document.getElementById('lightbox-close');
    const prevBtn      = document.getElementById('lightbox-prev');
    const nextBtn      = document.getElementById('lightbox-next');

    if (!galleryItems.length || !overlay) return;

    const items = Array.from(galleryItems);
    let current = 0;

    const getContent = (item) => {
        const img = item.querySelector('img');
        const ph  = item.querySelector('.gallery-placeholder');
        const caption = item.getAttribute('data-caption') || '';
        return { img, ph, caption };
    };

    const openLightbox = (index) => {
        current = index;
        const { img, ph, caption } = getContent(items[index]);
        if (img) {
            contentEl.innerHTML = '';
            const clone = document.createElement('img');
            clone.src = img.src;
            clone.alt = caption;
            clone.className = 'lightbox-img';
            contentEl.appendChild(clone);
            contentEl.style.background = 'none';
            contentEl.style.fontSize = '';
        } else if (ph) {
            contentEl.innerHTML = ph.innerHTML;
            contentEl.style.background = 'rgba(255,255,255,0.05)';
            contentEl.style.fontSize = '5rem';
        }
        captionEl.textContent = caption;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    const navigate = (dir) => {
        current = (current + dir + items.length) % items.length;
        openLightbox(current);
    };

    items.forEach((item, idx) => {
        item.addEventListener('click', () => openLightbox(idx));
    });

    if (closeBtn)  closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn)   prevBtn.addEventListener('click', () => navigate(-1));
    if (nextBtn)   nextBtn.addEventListener('click', () => navigate(1));

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape')       closeLightbox();
        if (e.key === 'ArrowLeft')    navigate(-1);
        if (e.key === 'ArrowRight')   navigate(1);
    });
}
