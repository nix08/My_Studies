/* ═══════════════════════════════════════════════════════════
   EDUPINNACLE — Main JavaScript
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ── SCROLL PROGRESS BAR ──────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ── NAVBAR ───────────────────────────────────────────────── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const links     = navLinks.querySelectorAll('.nav-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveLink();
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Active link on scroll
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.id;
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + current) link.classList.add('active');
    });
  }

  updateActiveLink();
})();

/* ── SMOOTH SCROLL ────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── REVEAL ON SCROLL (Intersection Observer) ─────────────── */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ── COUNTER ANIMATION ────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const duration = 1800;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const start  = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(ease * target).toLocaleString('en-IN');
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target.toLocaleString('en-IN');
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ── PARTICLE GENERATOR (hero) ────────────────────────────── */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = window.matchMedia('(max-width: 600px)').matches ? 18 : 36;
  const colors = ['#C9A84C', '#0F3460', '#16213E', '#E8B94A'];

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 5 + 2;
    const x    = Math.random() * 100;
    const delay = Math.random() * 12;
    const dur   = Math.random() * 14 + 10;
    const color = colors[Math.floor(Math.random() * colors.length)];

    p.style.cssText = `
      left: ${x}%;
      top: -10px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      animation-duration: ${dur}s;
      animation-delay: -${delay}s;
      opacity: ${Math.random() * 0.3 + 0.05};
    `;

    container.appendChild(p);
  }
})();

/* ── FILTER TABS — COLLEGES ───────────────────────────────── */
(function initCollegeFilter() {
  const tabs  = document.querySelectorAll('#collegeTabs .filter-btn');
  const cards = document.querySelectorAll('#collegeGrid .college-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.classList.remove('hidden');
          card.style.animation = 'scaleIn 0.35s ease both';
        } else {
          card.classList.add('hidden');
          card.style.animation = '';
        }
      });
    });
  });
})();

/* ── FILTER TABS — COURSES ────────────────────────────────── */
(function initCourseFilter() {
  const tabs  = document.querySelectorAll('#courseTabs .filter-btn');
  const cards = document.querySelectorAll('#courseGrid .course-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.classList.remove('hidden');
          card.style.animation = 'scaleIn 0.35s ease both';
        } else {
          card.classList.add('hidden');
          card.style.animation = '';
        }
      });
    });
  });
})();

/* ── BACK TO TOP ──────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── CONTACT FORM ─────────────────────────────────────────── */
(function initContactForm() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const success   = document.getElementById('formSuccess');

  if (!form) return;

  function showError(fieldId, message) {
    const el = document.getElementById(fieldId + 'Error');
    const input = document.getElementById(fieldId);
    if (el) el.textContent = message;
    if (input) input.style.borderColor = 'rgba(239,68,68,0.6)';
  }

  function clearError(fieldId) {
    const el = document.getElementById(fieldId + 'Error');
    const input = document.getElementById(fieldId);
    if (el) el.textContent = '';
    if (input) input.style.borderColor = '';
  }

  function validate() {
    let valid = true;

    const name  = document.getElementById('name');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');

    clearError('name');
    clearError('phone');
    clearError('email');

    if (!name.value.trim() || name.value.trim().length < 2) {
      showError('name', 'Please enter your full name.');
      valid = false;
    }

    const phonePattern = /^[+]?[\d\s\-()]{7,15}$/;
    if (!phone.value.trim() || !phonePattern.test(phone.value.trim())) {
      showError('phone', 'Please enter a valid phone number.');
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
      showError('email', 'Please enter a valid email address.');
      valid = false;
    }

    return valid;
  }

  // Real-time validation clearing
  ['name', 'phone', 'email'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => clearError(id));
    }
  });

  // ── GOOGLE SHEETS INTEGRATION ──────────────────────────────
  // 1. Open https://script.google.com and create a new project.
  // 2. Paste the Apps Script code from js/sheets-script.gs into the editor.
  // 3. Click Deploy → New deployment → Web app.
  //    Set "Execute as" = Me, "Who has access" = Anyone. Deploy and copy the URL.
  // 4. Replace the placeholder below with your deployed Web App URL.
  const SHEETS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    btnText.style.display    = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;

    const payload = {
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      name:      document.getElementById('name').value.trim(),
      phone:     document.getElementById('phone').value.trim(),
      email:     document.getElementById('email').value.trim(),
      course:    document.getElementById('course').value || '—',
      budget:    document.getElementById('budget').value || '—',
      message:   document.getElementById('message').value.trim() || '—'
    };

    try {
      // no-cors is required for Apps Script Web Apps called from a browser
      await fetch(SHEETS_URL, {
        method:  'POST',
        mode:    'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });
    } catch (_) {
      // Network errors are silent — the success message still shows
    }

    btnText.style.display    = 'inline-flex';
    btnLoading.style.display = 'none';
    submitBtn.disabled = false;
    form.reset();
    success.style.display        = 'flex';
    success.style.alignItems     = 'center';
    success.style.justifyContent = 'center';
    success.style.gap            = '8px';

    setTimeout(() => { success.style.display = 'none'; }, 5000);
  });
})();

/* ── CARD TILT EFFECT ─────────────────────────────────────── */
(function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('.college-card, .course-card, .why-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -4;
      const rotateY = ((x - cx) / cx) *  4;

      card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ── PARTNER COLLEGES — CITY & STREAM TABS ───────────────── */
(function initCollegeTabs() {
  const cityTabs   = document.querySelectorAll('.city-tab');
  const cityPanels = document.querySelectorAll('.city-panel');

  cityTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const city = tab.dataset.city;

      cityTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      cityPanels.forEach(panel => {
        const isTarget = panel.id === 'panel-' + city;
        panel.classList.toggle('active', isTarget);

        if (isTarget) {
          // Reset stream tabs to first in this panel
          const streamTabs   = panel.querySelectorAll('.stream-tab');
          const streamPanels = panel.querySelectorAll('.stream-panel');
          streamTabs.forEach((st, i)  => st.classList.toggle('active', i === 0));
          streamPanels.forEach((sp, i) => sp.classList.toggle('active', i === 0));
        }
      });
    });
  });

  // Stream tab switching (delegated per city panel)
  document.querySelectorAll('.stream-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId  = tab.dataset.stream;
      const cityPanel = tab.closest('.city-panel');

      cityPanel.querySelectorAll('.stream-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      cityPanel.querySelectorAll('.stream-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === targetId);
      });
    });
  });
})();

/* ── LAZY LOAD SECTION ICONS ──────────────────────────────── */
// Mark hero as immediately visible (already in viewport)
(function initHeroReveal() {
  const heroContent = document.querySelector('.hero-content.reveal');
  if (heroContent) {
    requestAnimationFrame(() => {
      heroContent.classList.add('visible');
    });
  }
})();

/* ── FILE UPLOAD ZONES ────────────────────────────────────── */
(function initFileUploads() {
  document.querySelectorAll('.file-upload-zone').forEach(zone => {
    const input = zone.querySelector('.file-upload-input');
    const nameEl = zone.querySelector('.file-upload-name');

    input.addEventListener('change', () => {
      if (input.files.length) nameEl.textContent = input.files[0].name;
    });

    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));

    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      if (e.dataTransfer.files.length) {
        input.files = e.dataTransfer.files;
        nameEl.textContent = e.dataTransfer.files[0].name;
      }
    });
  });
})();
