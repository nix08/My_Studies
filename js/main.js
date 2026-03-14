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

/* ── GOOGLE SHEETS URL ────────────────────────────────────── */
// 1. Set up the Apps Script (see js/sheets-script.gs for full instructions).
// 2. Deploy it as a Web App (Execute as: Me, Who has access: Anyone).
// 3. Replace the placeholder below with your deployed Web App URL.
const SHEETS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

/* ── SHARED HELPERS ───────────────────────────────────────── */
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function setSubmitting(btn, isLoading) {
  btn.querySelector('.btn-text').style.display    = isLoading ? 'none'        : 'inline-flex';
  btn.querySelector('.btn-loading').style.display = isLoading ? 'inline-flex' : 'none';
  btn.disabled = isLoading;
}

function showFormSuccess(el) {
  el.style.display = 'flex';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}

async function postToSheets(payload) {
  try {
    await fetch(SHEETS_URL, {
      method:  'POST',
      mode:    'no-cors', // required for Apps Script Web Apps
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    });
  } catch (_) { /* no-cors responses always trigger catch — this is expected */ }
}

/* ── APPLY FORM (Start Your Journey Today) ────────────────── */
(function initApplyForm() {
  const form      = document.getElementById('applyForm');
  const submitBtn = document.getElementById('applySubmitBtn');
  const successEl = document.getElementById('applyFormSuccess');
  if (!form) return;

  const phoneRe = /^[+]?[\d\s\-()]{7,15}$/;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showErr(id, msg) {
    const el = document.getElementById(id + 'Error');
    const inp = document.getElementById(id);
    if (el)  el.textContent = msg;
    if (inp) inp.style.borderColor = 'rgba(239,68,68,0.6)';
  }
  function clearErr(id) {
    const el = document.getElementById(id + 'Error');
    const inp = document.getElementById(id);
    if (el)  el.textContent = '';
    if (inp) inp.style.borderColor = '';
  }

  function validate() {
    let ok = true;
    const ids = ['apply-name', 'apply-phone', 'apply-email', 'apply-education', 'apply-course'];
    ids.forEach(id => clearErr(id));

    if (document.getElementById('apply-name').value.trim().length < 2)
      { showErr('apply-name', 'Please enter your full name.'); ok = false; }
    if (!phoneRe.test(document.getElementById('apply-phone').value.trim()))
      { showErr('apply-phone', 'Please enter a valid phone number.'); ok = false; }
    if (!emailRe.test(document.getElementById('apply-email').value.trim()))
      { showErr('apply-email', 'Please enter a valid email address.'); ok = false; }
    if (!document.getElementById('apply-education').value)
      { showErr('apply-education', 'Please select your education level.'); ok = false; }
    if (!document.getElementById('apply-course').value)
      { showErr('apply-course', 'Please select a course.'); ok = false; }
    return ok;
  }

  ['apply-name', 'apply-phone', 'apply-email', 'apply-education', 'apply-course'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearErr(id));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(submitBtn, true);

    await postToSheets({
      type:      'apply',
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      name:      document.getElementById('apply-name').value.trim(),
      phone:     document.getElementById('apply-phone').value.trim(),
      email:     document.getElementById('apply-email').value.trim(),
      dob:       document.getElementById('apply-dob').value      || '—',
      education: document.getElementById('apply-education').value || '—',
      marks:     document.getElementById('apply-marks').value.trim() || '—',
      course:    document.getElementById('apply-course').value   || '—',
      location:  document.getElementById('apply-location').value || '—',
      budget:    document.getElementById('apply-budget').value   || '—',
      hostel:    document.getElementById('apply-hostel').value   || '—',
      message:   document.getElementById('apply-message').value.trim() || '—'
    });

    setSubmitting(submitBtn, false);
    form.reset();
    showFormSuccess(successEl);
  });
})();

/* ── SCHOLARSHIP FORM ─────────────────────────────────────── */
(function initScholarshipForm() {
  const form      = document.getElementById('scholarshipForm');
  const submitBtn = document.getElementById('schSubmitBtn');
  const successEl = document.getElementById('schFormSuccess');
  if (!form) return;

  const phoneRe = /^[+]?[\d\s\-()]{7,15}$/;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  function showErr(id, msg) {
    const el  = document.getElementById(id + 'Error');
    const inp = document.getElementById(id);
    if (el)  el.textContent = msg;
    if (inp) inp.style.borderColor = 'rgba(239,68,68,0.6)';
  }
  function clearErr(id) {
    const el  = document.getElementById(id + 'Error');
    const inp = document.getElementById(id);
    if (el)  el.textContent = '';
    if (inp) inp.style.borderColor = '';
  }

  function validate() {
    let ok = true;
    const ids = ['sch-name', 'sch-phone', 'sch-email', 'sch-education', 'sch-marks', 'sch-course'];
    ids.forEach(id => clearErr(id));

    if (document.getElementById('sch-name').value.trim().length < 2)
      { showErr('sch-name', 'Please enter your full name.'); ok = false; }
    if (!phoneRe.test(document.getElementById('sch-phone').value.trim()))
      { showErr('sch-phone', 'Please enter a valid phone number.'); ok = false; }
    if (!emailRe.test(document.getElementById('sch-email').value.trim()))
      { showErr('sch-email', 'Please enter a valid email address.'); ok = false; }
    if (!document.getElementById('sch-education').value)
      { showErr('sch-education', 'Please select your education level.'); ok = false; }
    if (!document.getElementById('sch-marks').value.trim())
      { showErr('sch-marks', 'Please enter your percentage or CGPA.'); ok = false; }
    if (!document.getElementById('sch-course').value)
      { showErr('sch-course', 'Please select a course.'); ok = false; }

    // File size validation
    const sslcFile    = document.getElementById('sch-sslc').files[0];
    const plusTwoFile = document.getElementById('sch-plustwo').files[0];
    if (sslcFile    && sslcFile.size    > MAX_FILE_SIZE)
      { showErr('sch-sslc',    'SSLC file must be under 10 MB.');     ok = false; }
    if (plusTwoFile && plusTwoFile.size > MAX_FILE_SIZE)
      { showErr('sch-plustwo', 'Plus Two file must be under 10 MB.'); ok = false; }

    return ok;
  }

  ['sch-name', 'sch-phone', 'sch-email', 'sch-education', 'sch-marks', 'sch-course'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearErr(id));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(submitBtn, true);

    // Read uploaded files as base64 for Google Drive upload via Apps Script
    const sslcInput    = document.getElementById('sch-sslc');
    const plusTwoInput = document.getElementById('sch-plustwo');
    let sslcBase64 = null, sslcName = null, plusTwoBase64 = null, plusTwoName = null;

    if (sslcInput.files[0]) {
      sslcBase64 = await readFileAsBase64(sslcInput.files[0]);
      sslcName   = sslcInput.files[0].name;
    }
    if (plusTwoInput.files[0]) {
      plusTwoBase64 = await readFileAsBase64(plusTwoInput.files[0]);
      plusTwoName   = plusTwoInput.files[0].name;
    }

    await postToSheets({
      type:        'scholarship',
      timestamp:   new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      name:        document.getElementById('sch-name').value.trim(),
      phone:       document.getElementById('sch-phone').value.trim(),
      email:       document.getElementById('sch-email').value.trim(),
      dob:         document.getElementById('sch-dob').value       || '—',
      education:   document.getElementById('sch-education').value || '—',
      marks:       document.getElementById('sch-marks').value.trim() || '—',
      course:      document.getElementById('sch-course').value    || '—',
      state:       document.getElementById('sch-state').value     || '—',
      address:     document.getElementById('sch-address').value.trim() || '—',
      message:     document.getElementById('sch-message').value.trim() || '—',
      sslcFile:    sslcBase64,
      sslcName:    sslcName,
      plusTwoFile: plusTwoBase64,
      plusTwoName: plusTwoName
    });

    setSubmitting(submitBtn, false);
    form.reset();
    document.getElementById('sslcFileName').textContent    = '';
    document.getElementById('plusTwoFileName').textContent = '';
    showFormSuccess(successEl);
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
    const input  = zone.querySelector('.file-upload-input');
    const nameEl = zone.querySelector('.file-upload-name');

    // Show filename and reset border on file selection
    input.addEventListener('change', () => {
      if (input.files.length) {
        nameEl.textContent = input.files[0].name;
        zone.style.borderColor = '';
      }
    });

    // Click anywhere on the zone (except the input itself) to open file picker
    zone.addEventListener('click', (e) => {
      if (e.target !== input) input.click();
    });

    // Drag-and-drop support
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

/* ── COURSES ACCORDION ────────────────────────────────────── */
(function initAccordion() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const isOpen = header.classList.contains('active');

      // Close all others
      document.querySelectorAll('.accordion-header').forEach(h => {
        h.classList.remove('active');
        const b = h.nextElementSibling;
        if (b) b.classList.remove('open');
      });

      // Toggle clicked
      if (!isOpen) {
        header.classList.add('active');
        body.classList.add('open');
      }
    });
  });
})();

