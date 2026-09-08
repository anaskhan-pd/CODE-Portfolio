/**
 * ANAS KHAN PORTFOLIO SHOWCASE — SCRIPT.JS
 * Complete Micro-Interactions, Navigation, Physics, & Image Handling
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initMagneticElements();
  initScrollProgressBar();
  initCardSpotlight();
  initCardTilt();
  initEmailCopyFeedback();
  initScrollReveal();
  initMobileMenu();
  initActiveNavLinkOnScroll();
  initImageFallbackHandler();
});

/**
 * 1. Bespoke Custom Smooth Cursor
 */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring) return;

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(renderRing);
    }
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    if (Math.abs(mouseX - ringX) > 0.1 || Math.abs(mouseY - ringY) > 0.1) {
      requestAnimationFrame(renderRing);
    } else {
      isMoving = false;
    }
  }

  const interactiveSelector = 'a, button, .card, .video-card, .featured-video-card, .script-card, .blog-card, .thumbnail-item, .skill-tag, .nav-link';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.remove('cursor-hover');
    }
  });
}

/**
 * 2. Magnetic Buttons & Nav Targets (Desktop Fine Pointers)
 */
function initMagneticElements() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const magneticTargets = document.querySelectorAll('.magnetic-target');

  magneticTargets.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      
      // Pull button up to 8px max towards cursor
      el.style.transform = `translate3d(${x * 0.25}px, ${y * 0.25}px, 0)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}

/**
 * 3. Navbar Scroll Progress Line Indicator
 */
function initScrollProgressBar() {
  const line = document.getElementById('scroll-progress-line');
  if (!line) return;

  function updateProgress() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = Math.min(Math.max(window.scrollY / totalHeight, 0), 1);
    line.style.transform = `scaleX(${progress})`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/**
 * 4. Cursor Spotlight Radial Glow on Cards
 */
function initCardSpotlight() {
  const spotlightCards = document.querySelectorAll('.card-spotlight');

  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * 5. Subtle 3D Card Tilt on Mouse Movement
 */
function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const rotateX = ((mouseY - height / 2) / (height / 2)) * -4.5;
      const rotateY = ((mouseX - width / 2) / (width / 2)) * 4.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/**
 * 6. "Copied to Clipboard" Micro-Feedback for Email Button
 */
function initEmailCopyFeedback() {
  const emailBtn = document.getElementById('email-btn');
  if (!emailBtn) return;

  emailBtn.addEventListener('click', (e) => {
    const email = 'btw.anaskhan@gmail.com';
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        const originalText = emailBtn.textContent;
        emailBtn.textContent = 'Email Copied! ✓';
        emailBtn.style.backgroundColor = '#00f2c3';
        emailBtn.style.color = '#090a0f';

        setTimeout(() => {
          emailBtn.textContent = originalText;
          emailBtn.style.backgroundColor = '';
          emailBtn.style.color = '';
        }, 2200);
      }).catch(() => {});
    }
  });
}

/**
 * 7. Smooth Scroll Reveal Animations
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
}

/**
 * Mobile Hamburger Navigation Menu Toggle
 */
function initMobileMenu() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navToggle || !navMenu) return;

  function toggleMenu() {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  }

  function closeMenu() {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
  }

  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

/**
 * Active Navigation Link Highlighting on Scroll
 */
function initActiveNavLinkOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/**
 * Graceful Image Fallback Handling
 */
function initImageFallbackHandler() {
  const images = document.querySelectorAll('img');

  images.forEach(img => {
    img.addEventListener('error', function () {
      const altText = this.getAttribute('alt') || 'Content Preview';
      
      const svgPlaceholder = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="337" viewBox="0 0 600 337" fill="none">
          <rect width="600" height="337" fill="#11131c"/>
          <rect x="2" y="2" width="596" height="333" rx="10" stroke="#00f2c3" stroke-opacity="0.25" stroke-width="2"/>
          <circle cx="300" cy="140" r="30" fill="#00f2c3" fill-opacity="0.1" stroke="#00f2c3" stroke-width="2"/>
          <polygon points="293,127 313,140 293,153" fill="#00f2c3"/>
          <text x="300" y="220" font-family="Inter, sans-serif" font-size="16" font-weight="600" fill="#94a3b8" text-anchor="middle">${altText}</text>
          <text x="300" y="250" font-family="Inter, sans-serif" font-size="12" fill="#64748b" text-anchor="middle">PREVIEW MEDIA</text>
        </svg>
      `)}`;
      
      this.src = svgPlaceholder;
    });
  });
}
