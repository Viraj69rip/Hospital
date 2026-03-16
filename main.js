/* ═══════════════════════════════════════════════════
   BARAMATI SIGNATURE HOSPITAL — main.js
   Pure vanilla JS — zero external library dependency.
   Hero entrance = CSS @keyframes (instant, no flicker).
   Scroll reveals = IntersectionObserver.
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════
     Cursor Glow (desktop only)
  ══════════════════════════════ */
  const cursorGlow = document.querySelector('.cursor-glow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let tx = cx, ty = cy;
    window.addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    const lerp = () => {
      cx += (tx - cx) * 0.1;
      cy += (ty - cy) * 0.1;
      cursorGlow.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(lerp);
    };
    lerp();
  }

  /* ══════════════════════════════
     Scroll Progress Bar
  ══════════════════════════════ */
  const progressBar = document.querySelector('.scroll-progress__bar');
  if (progressBar) {
    const updateBar = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : '0%';
    };
    window.addEventListener('scroll', updateBar, { passive: true });
    updateBar();
  }

  /* ══════════════════════════════
     Navbar Scroll State
  ══════════════════════════════ */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const updateNav = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* ══════════════════════════════
     WhatsApp FAB — show only after hero
  ══════════════════════════════ */
  const waFab = document.getElementById('waFab');
  const heroSection = document.getElementById('home');
  if (waFab && heroSection) {
    const checkFab = () => {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      waFab.classList.toggle('is-visible', window.scrollY > heroBottom - 120);
    };
    window.addEventListener('scroll', checkFab, { passive: true });
    checkFab();
  }

  /* ══════════════════════════════
     Mobile Nav Toggle
  ══════════════════════════════ */
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu   = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('is-open', !expanded);
    });
    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      });
    });
    document.addEventListener('click', e => {
      if (navbar && !navbar.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      }
    });
  }

  /* ══════════════════════════════
     Scroll-reveal: IntersectionObserver
     CSS handles transition via .visible class
  ══════════════════════════════ */
  const revealEls = document.querySelectorAll('[data-animate]');
  if (revealEls.length) {
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const delay = el.getAttribute('data-delay') || '0';
        el.style.setProperty('--d', `${delay}ms`);
        el.classList.add('visible');
        revealIO.unobserve(el);
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -32px 0px' });
    revealEls.forEach(el => revealIO.observe(el));
  }

  /* ══════════════════════════════
     Counter Animation
  ══════════════════════════════ */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const counterIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = Number(el.getAttribute('data-counter'));
        const suffix = target === 96 ? '%' : '+';
        const dur    = 1400;
        const start  = performance.now();
        const tick   = now => {
          const p    = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = `${Math.floor(ease * target)}${suffix}`;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = `${target}${suffix}`;
        };
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterIO.observe(c));
  }

  /* ══════════════════════════════
     3D Card Tilt (desktop)
  ══════════════════════════════ */
  if (!('ontouchstart' in window) && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left)  / r.width  - 0.5) * 8;
        const y = (0.5 - (e.clientY - r.top) / r.height) * 8;
        card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  /* ══════════════════════════════
     Testimonials Carousel + Swipe
  ══════════════════════════════ */
  const testimonials = document.querySelectorAll('.testi');
  const tDots        = document.querySelectorAll('.testi-dot');
  let   activeIdx    = 0;
  let   tTimer;

  const showTesti = idx => {
    testimonials.forEach((t, i) => t.classList.toggle('is-active', i === idx));
    tDots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    activeIdx = idx;
  };
  const startLoop = () => {
    clearInterval(tTimer);
    tTimer = setInterval(() => showTesti((activeIdx + 1) % testimonials.length), 4800);
  };
  tDots.forEach((dot, i) => {
    dot.addEventListener('click', () => { showTesti(i); startLoop(); });
  });
  if (testimonials.length) startLoop();

  const testiTrack = document.getElementById('testiTrack');
  if (testiTrack) {
    let swipeStartX = 0;
    testiTrack.addEventListener('touchstart', e => { swipeStartX = e.touches[0].clientX; }, { passive: true });
    testiTrack.addEventListener('touchend', e => {
      const diff = swipeStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 48) {
        const next = diff > 0
          ? (activeIdx + 1) % testimonials.length
          : (activeIdx - 1 + testimonials.length) % testimonials.length;
        showTesti(next);
        startLoop();
      }
    }, { passive: true });
  }

  /* ══════════════════════════════
     FAQ Accordion
  ══════════════════════════════ */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(f => {
        f.classList.remove('is-open');
        f.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      // Open clicked
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ══════════════════════════════
     Booking Form → WhatsApp
  ══════════════════════════════ */
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    const dateField = document.getElementById('visitDate');
    if (dateField) dateField.min = new Date().toISOString().split('T')[0];

    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      const fd      = new FormData(bookingForm);
      const name    = fd.get('patientName')    || '';
      const phone   = fd.get('patientPhone')   || '';
      const dept    = fd.get('department')     || '';
      const date    = fd.get('visitDate')      || '';
      const concern = fd.get('patientConcern') || '';

      if (!name.trim() || !phone.trim() || !dept || !date) {
        const first = [...bookingForm.querySelectorAll('[required]')].find(el => !el.value.trim());
        if (first) {
          first.focus();
          first.style.borderColor = '#e35e5e';
          first.style.boxShadow   = '0 0 0 4px rgba(227,94,94,0.15)';
          setTimeout(() => { first.style.borderColor = ''; first.style.boxShadow = ''; }, 2500);
        }
        return;
      }

      const msg = [
        '🏥 *Appointment Request — Baramati Signature Hospital*',
        '',
        `👤 *Patient:* ${name}`,
        `📞 *Phone:* ${phone}`,
        `🏢 *Department:* ${dept}`,
        `📅 *Preferred Date:* ${date}`,
        `📝 *Symptoms / Requirement:* ${concern || 'Not provided'}`,
        '',
        '📍 Location: Baramati, Maharashtra'
      ].join('\n');

      window.open(`https://wa.me/919307815563?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });

    bookingForm.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('input', () => { el.style.borderColor = ''; el.style.boxShadow = ''; });
    });
  }

  /* ══════════════════════════════
     Smooth Anchor Scrolling
  ══════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = (navbar ? navbar.offsetHeight : 80) + 16;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  /* ══════════════════════════════
     Blob Parallax
  ══════════════════════════════ */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const blobs = document.querySelectorAll('.blob');
    let blobRaf;
    window.addEventListener('scroll', () => {
      cancelAnimationFrame(blobRaf);
      blobRaf = requestAnimationFrame(() => {
        const sy = window.scrollY;
        blobs.forEach((b, i) => {
          b.style.transform = `translateY(${sy * 0.07 * (i % 2 === 0 ? 1 : -1)}px)`;
        });
      });
    }, { passive: true });
  }

  /* ══════════════════════════════
     Hero image scroll parallax
  ══════════════════════════════ */
  const heroImg = document.querySelector('.hero__img');
  if (heroImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight * 1.5) {
        heroImg.style.transform = `translateY(${window.scrollY * 0.18}px)`;
      }
    }, { passive: true });
  }

  /* ══════════════════════════════
     Button ripple effect
  ══════════════════════════════ */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('pointerdown', e => {
      const r      = btn.getBoundingClientRect();
      const size   = Math.max(r.width, r.height) * 2;
      const ripple = document.createElement('span');
      Object.assign(ripple.style, {
        position: 'absolute', borderRadius: '50%', pointerEvents: 'none',
        width: size + 'px', height: size + 'px',
        left: (e.clientX - r.left - size / 2) + 'px',
        top:  (e.clientY - r.top  - size / 2) + 'px',
        background: 'rgba(255,255,255,0.22)',
        transform: 'scale(0)',
        animation: 'ripple 0.55s ease-out forwards'
      });
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  /* ══════════════════════════════
     Lazy image fade-in
  ══════════════════════════════ */
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.style.transition = 'opacity 0.5s ease';
    if (!img.complete || img.naturalWidth === 0) {
      img.style.opacity = '0';
      img.addEventListener('load',  () => { img.style.opacity = '1'; });
      img.addEventListener('error', () => { img.style.opacity = '0'; });
    }
  });

});