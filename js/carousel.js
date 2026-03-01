/* ═══════════════════════════════════════════════════════════
   EDUPINNACLE — Testimonial Carousel
   ═══════════════════════════════════════════════════════════ */

'use strict';

(function initCarousel() {
  const track  = document.getElementById('testimonialTrack');
  const dotsEl = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!track || !dotsEl || !prevBtn || !nextBtn) return;

  const slides = Array.from(track.querySelectorAll('.testimonial-card'));
  const total  = slides.length;
  let current  = 0;
  let autoplayTimer = null;
  let isAnimating   = false;
  const AUTOPLAY_DELAY = 5000;
  const TRANSITION_MS  = 500;

  /* ── BUILD DOTS ─────────────────────────────────────────── */
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function getDots() { return dotsEl.querySelectorAll('.dot'); }

  /* ── GO TO SLIDE ────────────────────────────────────────── */
  function goTo(index, direction) {
    if (isAnimating || index === current) return;
    isAnimating = true;

    // Determine scroll direction for animation hint
    const dir = direction !== undefined ? direction : (index > current ? 1 : -1);

    // Update track position
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;

    // Update dots
    getDots().forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });

    // Update active slide class
    slides.forEach((slide, i) => {
      slide.classList.toggle('active-slide', i === current);
    });

    setTimeout(() => { isAnimating = false; }, TRANSITION_MS);
  }

  /* ── PREV / NEXT ────────────────────────────────────────── */
  function prev() {
    goTo((current - 1 + total) % total, -1);
    resetAutoplay();
  }

  function next() {
    goTo((current + 1) % total, 1);
    resetAutoplay();
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  /* ── AUTOPLAY ───────────────────────────────────────────── */
  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      goTo((current + 1) % total, 1);
    }, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  /* ── PAUSE ON HOVER ─────────────────────────────────────── */
  const wrapper = track.closest('.testimonial-carousel');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);
    wrapper.addEventListener('focusin',  stopAutoplay);
    wrapper.addEventListener('focusout', startAutoplay);
  }

  /* ── TOUCH / SWIPE ──────────────────────────────────────── */
  let touchStartX = 0;
  let touchStartY = 0;
  const SWIPE_THRESHOLD = 50;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    // Only swipe horizontally if dominant axis
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      dx < 0 ? next() : prev();
    }
    startAutoplay();
  }, { passive: true });

  /* ── KEYBOARD ───────────────────────────────────────────── */
  document.addEventListener('keydown', (e) => {
    const section = document.getElementById('testimonials');
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    if (e.key === 'ArrowLeft')  { prev(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { next(); e.preventDefault(); }
  });

  /* ── INITIALISE ─────────────────────────────────────────── */
  slides[0].classList.add('active-slide');
  track.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;
  startAutoplay();

})();
