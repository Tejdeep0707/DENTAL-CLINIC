/* ==========================================================================
   Aura Dental Clinic - Interactive JavaScript Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. Dark Mode / Theme Toggle
     ========================================== */
  const themeToggle = document.getElementById('theme-toggle');
  
  // Check local storage or browser preference
  const currentTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Apply initial theme
  if (currentTheme === 'dark' || (!currentTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  
  // Theme Toggle Event Listener
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }


  /* ==========================================
     2. Header Scroll Effect
     ========================================== */
  const header = document.querySelector('.header');
  const handleHeaderScroll = () => {
    if (!header) return;
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll(); // Run once on load


  /* ==========================================
     3. Mobile Drawer Navigation
     ========================================== */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    if (mobileDrawer && drawerOverlay) {
      mobileDrawer.classList.add('active');
      drawerOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Stop scrolling
    }
  };

  const closeDrawer = () => {
    if (mobileDrawer && drawerOverlay) {
      mobileDrawer.classList.remove('active');
      drawerOverlay.classList.remove('active');
      document.body.style.overflow = ''; // Resume scrolling
    }
  };

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });


  /* ==========================================
     4. Active Nav Link Highlighting on Scroll
     ========================================== */
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-desktop .nav-link, .nav-desktop .nav-link-sub');

  const highlightNavOnScroll = () => {
    let scrollPos = window.scrollY || document.documentElement.scrollTop;
    const offset = 140; // Height offsets
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - offset;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNavOnScroll);


  /* ==========================================
     5. Intersection Observer - Scroll Reveal
     ========================================== */
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, revealOptions);

  revealElements.forEach(element => {
    revealOnScroll.observe(element);
  });


  /* ==========================================
     6. FAQ Accordion Handler
     ========================================== */
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.parentElement;
      const isActive = parent.classList.contains('active');
      
      // Close all FAQs first
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      // If clicked wasn't active, open it
      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });


  /* ==========================================
     7. Back to Top Button
     ========================================== */
  const backToTopBtn = document.getElementById('back-to-top');

  const toggleBackToTopBtn = () => {
    if (!backToTopBtn) return;
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  };
  window.addEventListener('scroll', toggleBackToTopBtn);

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  /* ==========================================
     8. Custom Toast Notification System
     ========================================== */
  const showToast = (message, duration = 6000) => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<span>${message}</span>`;
    
    container.appendChild(toast);

    // Auto fade out and remove
    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('transitionend', () => {
        toast.remove();
      });
    }, duration);
  };


  /* ==========================================
     9. Appointment Intake Form Submission Handler
     ========================================== */
  const reservationForm = document.getElementById('reservation-form');
  const formSubmitBtn = document.getElementById('form-submit-btn');
  const formAlert = document.getElementById('form-alert');
  
  // Set minimum date picker values to today
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;
  }

  const showFormAlert = (message, type) => {
    if (!formAlert) return;
    formAlert.textContent = message;
    formAlert.className = `form-alert ${type}`;
    formAlert.classList.remove('hidden');
    
    setTimeout(() => {
      formAlert.classList.add('hidden');
    }, 8000);
  };

  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btnText = formSubmitBtn.querySelector('.btn-text');
      const btnLoader = formSubmitBtn.querySelector('.btn-loader');

      // Toggle Loading State
      if (btnText) btnText.style.opacity = '0.5';
      if (btnLoader) btnLoader.classList.remove('hidden');
      formSubmitBtn.disabled = true;

      // Grab form values
      const formData = {
        name: document.getElementById('res-name').value.trim(),
        email: document.getElementById('res-email').value.trim(),
        phone: document.getElementById('res-phone').value.trim(),
        treatment: document.getElementById('res-treatment').value,
        date: document.getElementById('res-date').value,
        time: document.getElementById('res-time').value,
        notes: document.getElementById('res-notes').value.trim()
      };

      // Mock Reservation Submission Success
      setTimeout(() => {
        if (btnText) btnText.style.opacity = '1';
        if (btnLoader) btnLoader.classList.add('hidden');
        formSubmitBtn.disabled = false;

        // Trigger premium custom toast notification
        showToast(`✅ Appointment request received! We'll confirm your slot shortly.`);
        console.log("Appointment Request Submitted (Mock Details):", formData);
        
        reservationForm.reset();
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
      }, 1500); // 1.5 seconds mock latency
    });
  }


  /* ==========================================
     10. Mobile Sticky CTA Visibility Handler
     ========================================== */
  const mobileStickyCta = document.getElementById('mobile-sticky-cta');
  const contactSection = document.getElementById('contact');

  if (mobileStickyCta && contactSection) {
    const handleStickyCtaVisibility = () => {
      const rect = contactSection.getBoundingClientRect();
      // If contact section is in viewport
      const isContactVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (window.scrollY > 400 && !isContactVisible) {
        mobileStickyCta.classList.remove('hidden-state');
      } else {
        mobileStickyCta.classList.add('hidden-state');
      }
    };

    window.addEventListener('scroll', handleStickyCtaVisibility);
    handleStickyCtaVisibility(); // Run on load
  }


  /* ==========================================
     11. Smooth Scroll for Navigation & Widgets
     ========================================== */
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  scrollLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});
