document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Elements ---------- */
  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]:not(.nav-cta)');
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');
  const headshot = document.querySelector('.headshot');
  const photoFrame = document.querySelector('.photo-frame');

  /* ---------- Mobile Menu ---------- */
  function setMenu(open) {
    mainNav.classList.toggle('open', open);
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      setMenu(!mainNav.classList.contains('open'));
    });

    // Close the menu after a link is tapped
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setMenu(false));
    });

    // Close the menu on Escape and return focus to the toggle
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        setMenu(false);
        menuToggle.focus();
      }
    });

    // Close the menu when clicking outside the header
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('open') && header && !header.contains(e.target)) {
        setMenu(false);
      }
    });
  }

  /* ---------- Header Shadow on Scroll ---------- */
  function updateHeader() {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }
  }

  /* ---------- Active Navigation Link ---------- */
  const sectionIds = ['home', 'services', 'results', 'about', 'testimonials', 'contact'];

  function updateActiveLink() {
    let current = '';

    sectionIds.forEach(id => {
      const section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top <= 140) {
        current = id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  function onScroll() {
    updateHeader();
    updateActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Copyright Year ---------- */
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('.year').forEach(el => {
    el.textContent = currentYear;
  });

  /* ---------- Headshot Fallback ---------- */
  if (headshot && photoFrame) {
    const showFallback = () => photoFrame.classList.add('no-photo');

    headshot.addEventListener('error', showFallback);

    // If the image already failed before this script ran
    if (headshot.complete && headshot.naturalWidth === 0) {
      showFallback();
    }
  }

  /* ---------- Contact Form (Formspree) ---------- */
  if (form && submitBtn && formStatus) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot check: if a bot filled the hidden field, stop silently
      const honeypot = form.querySelector('#_gotcha');
      if (honeypot && honeypot.value.trim() !== '') {
        return;
      }

      const originalLabel = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      formStatus.textContent = 'Sending your message...';
      formStatus.className = 'form-status';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          form.reset();
          formStatus.textContent = "Thank you! Your message has been sent. I'll reply by email within 24 to 48 hours.";
          formStatus.className = 'form-status success';
        } else {
          formStatus.textContent = 'Something went wrong. Please try again, or email dave.authorservices@gmail.com directly.';
          formStatus.className = 'form-status error';
        }
      } catch (error) {
        formStatus.textContent = "We couldn't reach the server. Please check your connection and try again.";
        formStatus.className = 'form-status error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }

});