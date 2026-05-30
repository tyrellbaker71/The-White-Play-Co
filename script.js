/* ============================================================
   THE WHITE PLAY CO. — script.js
   Luxury Soft Play Experiences · Durban, KZN
   ============================================================ */

'use strict';

/* ── Utility: throttle ── */
function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) { last = now; fn.apply(this, args); }
  };
}

/* ============================================================
   1. NAVBAR — scroll behaviour
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', throttle(onScroll, 50), { passive: true });
  onScroll(); // run once on load
})();

/* ============================================================
   2. MOBILE MENU
   ============================================================ */
(function initMobileMenu() {
  const hamburger    = document.getElementById('hamburger');
  const mobileMenu   = document.getElementById('mobileMenu');
  const mobileClose  = document.getElementById('mobileClose');
  const overlay      = document.getElementById('mobileOverlay');
  const mobileLinks  = document.querySelectorAll('.mobile-link');

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ============================================================
   3. HERO — trigger loaded class for ken-burns effect
   ============================================================ */
(function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Small delay so the animation feels intentional
  requestAnimationFrame(() => {
    setTimeout(() => hero.classList.add('loaded'), 100);
  });
})();

/* ============================================================
   4. SCROLL REVEAL — IntersectionObserver
   ============================================================ */
(function initScrollReveal() {
  const revealSelectors = [
    '.reveal-up',
    '.reveal-left',
    '.reveal-right',
    '.reveal-scale'
  ];

  const elements = document.querySelectorAll(revealSelectors.join(', '));
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once only
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   5. SMOOTH SCROLL for anchor links
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   6. ACTIVE NAV LINK — highlight based on scroll position
   ============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  function updateActive() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', throttle(updateActive, 80), { passive: true });
  updateActive();
})();

/* ============================================================
   7. PARALLAX — subtle hero background parallax
   ============================================================ */
(function initParallax() {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg) return;

  // Only run on devices that likely support smooth parallax
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function onScroll() {
    const scrolled = window.scrollY;
    // Move the image up slightly as the user scrolls
    heroImg.style.transform = `scale(1) translateY(${scrolled * 0.25}px)`;
  }

  window.addEventListener('scroll', throttle(onScroll, 16), { passive: true });
})();

/* ============================================================
   8. PACKAGE CARD — subtle tilt on mouse move (desktop)
   ============================================================ */
(function initCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window) return; // skip on touch devices

  const cards = document.querySelectorAll('.package-card, .feature-card, .testimonial-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const tiltX  = ((y - cy) / cy) * 3;   // max ±3deg
      const tiltY  = ((cx - x) / cx) * 3;

      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ============================================================
   9. GALLERY LIGHTBOX — simple image lightbox
   ============================================================ */
(function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  // Create lightbox elements
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-backdrop"></div>
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Close">✕</button>
      <button class="lightbox-prev" aria-label="Previous">‹</button>
      <button class="lightbox-next" aria-label="Next">›</button>
      <img class="lightbox-img" src="" alt="" />
      <p class="lightbox-caption"></p>
    </div>
  `;
  document.body.appendChild(lightbox);

  // Inject lightbox styles
  const style = document.createElement('style');
  style.textContent = `
    .lightbox {
      position: fixed;
      inset: 0;
      z-index: 9000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.35s ease;
    }
    .lightbox.open {
      opacity: 1;
      pointer-events: all;
    }
    .lightbox-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(20, 12, 8, 0.92);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
    .lightbox-content {
      position: relative;
      z-index: 1;
      max-width: min(90vw, 900px);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .lightbox-img {
      max-width: 100%;
      max-height: 80vh;
      border-radius: 12px;
      object-fit: contain;
      box-shadow: 0 40px 100px rgba(0,0,0,0.5);
      transition: opacity 0.25s ease;
    }
    .lightbox-img.fading { opacity: 0; }
    .lightbox-caption {
      margin-top: 16px;
      font-size: 0.72rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.55);
      font-family: 'Jost', sans-serif;
    }
    .lightbox-close {
      position: absolute;
      top: -44px;
      right: 0;
      background: none;
      border: none;
      color: rgba(255,255,255,0.7);
      font-size: 1.3rem;
      cursor: pointer;
      transition: color 0.2s;
      line-height: 1;
      padding: 4px 8px;
    }
    .lightbox-close:hover { color: #fff; }
    .lightbox-prev, .lightbox-next {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.8);
      font-size: 1.8rem;
      cursor: pointer;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, color 0.2s;
      z-index: 2;
    }
    .lightbox-prev:hover, .lightbox-next:hover {
      background: rgba(255,255,255,0.18);
      color: #fff;
    }
    .lightbox-prev { left: -64px; }
    .lightbox-next { right: -64px; }
    @media (max-width: 768px) {
      .lightbox-prev { left: -40px; width: 36px; height: 36px; font-size: 1.3rem; }
      .lightbox-next { right: -40px; width: 36px; height: 36px; font-size: 1.3rem; }
    }
  `;
  document.head.appendChild(style);

  const lbImg     = lightbox.querySelector('.lightbox-img');
  const lbCaption = lightbox.querySelector('.lightbox-caption');
  const lbClose   = lightbox.querySelector('.lightbox-close');
  const lbPrev    = lightbox.querySelector('.lightbox-prev');
  const lbNext    = lightbox.querySelector('.lightbox-next');
  const backdrop  = lightbox.querySelector('.lightbox-backdrop');

  let currentIndex = 0;
  const items = Array.from(galleryItems);

  function openLightbox(index) {
    currentIndex = index;
    const img     = items[index].querySelector('img');
    const caption = items[index].querySelector('.gallery-overlay span');
    lbImg.src            = img.src;
    lbImg.alt            = img.alt;
    lbCaption.textContent = caption ? caption.textContent : '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    lbImg.classList.add('fading');
    setTimeout(() => {
      currentIndex = (currentIndex + dir + items.length) % items.length;
      const img     = items[currentIndex].querySelector('img');
      const caption = items[currentIndex].querySelector('.gallery-overlay span');
      lbImg.src            = img.src;
      lbImg.alt            = img.alt;
      lbCaption.textContent = caption ? caption.textContent : '';
      lbImg.classList.remove('fading');
    }, 200);
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lbClose.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
  lbNext.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
})();

/* ============================================================
   10. MARQUEE — pause on hover
   ============================================================ */
(function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;

  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();

/* ============================================================
   11. SCROLL PROGRESS INDICATOR
   ============================================================ */
(function initScrollProgress() {
  // Create a thin gold progress bar at the very top
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(90deg, #b89a6a, #d4b896);
    z-index: 9999;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', throttle(() => {
    const scrolled  = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct       = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
    bar.style.width = pct + '%';
  }, 16), { passive: true });
})();

/* ============================================================
   12. PLACEHOLDER IMAGE FALLBACKS
       If placeholder images are missing, show a styled fallback
   ============================================================ */
(function initImageFallbacks() {
  const images = document.querySelectorAll('img[src^="images/"]');

  images.forEach(img => {
    img.addEventListener('error', function () {
      // Create a styled placeholder using a data URI canvas
      const parent = this.parentElement;
      const w = parent.offsetWidth  || 400;
      const h = parent.offsetHeight || 300;

      // Use a soft cream gradient as fallback
      this.style.cssText = `
        background: linear-gradient(135deg, #ede5db 0%, #e8ddd3 50%, #d4c4b0 100%);
        object-fit: cover;
      `;
      this.removeAttribute('src');
      this.alt = '';

      // Add a subtle "image" icon overlay
      if (!parent.querySelector('.img-placeholder-icon')) {
        const icon = document.createElement('span');
        icon.className = 'img-placeholder-icon';
        icon.style.cssText = `
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: rgba(184, 154, 106, 0.4);
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          pointer-events: none;
        `;
        icon.innerHTML = `
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
          </svg>
          <span>Image</span>
        `;
        parent.style.position = 'relative';
        parent.appendChild(icon);
      }
    }, { once: true });
  });
})();

/* ============================================================
   13. STAGGER ANIMATION for package cards on load
   ============================================================ */
(function initStaggerOnLoad() {
  // Already handled by IntersectionObserver + CSS delay classes.
  // This adds a small initial nudge to any hero reveal elements.
  const heroReveals = document.querySelectorAll('.hero .reveal-up');
  heroReveals.forEach((el, i) => {
    el.style.transitionDelay = `${0.3 + i * 0.15}s`;
    setTimeout(() => el.classList.add('visible'), 200 + i * 150);
  });
})();

/* ============================================================
   14. INIT LOG
   ============================================================ */
console.log(
  '%c THE WHITE PLAY CO. %c\nLuxury Soft Play Experiences · Durban, KZN',
  'background: #b89a6a; color: #fff; font-size: 13px; padding: 4px 10px; border-radius: 4px; font-family: Georgia, serif;',
  'color: #7a5c44; font-size: 11px;'
);
