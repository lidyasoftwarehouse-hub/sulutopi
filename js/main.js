/* =========================================================
   SULUTOPI — Landing page interactions
   GSAP + ScrollTrigger, FAQ, smooth scroll, reveal, stats
   ========================================================= */
'use strict';

(function () {
  // Mark JS-active so reveal animations engage; without JS, content stays visible.
  document.documentElement.classList.add('js');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav shadow on scroll ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 24) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu toggle ---------- */
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ---------- Reveal on scroll (fallback IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    // No IO or reduced motion → make everything visible immediately.
    revealEls.forEach((el) => el.classList.add('is-revealed'));
  }

  /* ---------- FAQ — accordion (only one open at a time) ---------- */
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---------- Animated stat counters ---------- */
  const statEls = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );
    statEls.forEach((el) => io.observe(el));
  } else {
    statEls.forEach((el) => {
      el.textContent = formatStat(parseFloat(el.dataset.count), el);
    });
  }

  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1600;
    const start = performance.now();
    const startVal = 0;

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = startVal + (target - startVal) * eased;
      el.textContent = formatStat(current, el, decimals);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = formatStat(target, el, decimals);
    }
    requestAnimationFrame(tick);
  }

  function formatStat(value, el, decimals) {
    const dec = decimals !== undefined ? decimals : parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    let str;
    if (dec > 0) {
      str = value.toFixed(dec);
    } else {
      str = Math.round(value).toLocaleString();
    }
    return str + suffix;
  }

  /* ---------- Hero image sequence (preloaded, ping-pong loop) ---------- */
  initHeroSequence();

  function initHeroSequence() {
    const img = document.getElementById('heroSequence');
    if (!img) return;

    const base    = img.dataset.frameBase;
    const ext     = img.dataset.frameExt || '.jpg';
    const count   = parseInt(img.dataset.frameCount || '0', 10);
    const pad     = parseInt(img.dataset.framePad || '3', 10);
    const fps     = parseInt(img.dataset.frameFps || '24', 10);
    if (!base || count < 2) return;

    // Build frame URL list.
    const urls = [];
    for (let i = 0; i < count; i++) {
      urls.push(base + String(i).padStart(pad, '0') + ext);
    }

    // Preload every frame in parallel; resolve regardless of individual failures.
    const frames = new Array(count);
    let loaded = 0;
    let ready = false;

    urls.forEach((src, i) => {
      const f = new Image();
      f.decoding = 'async';
      f.onload = f.onerror = () => {
        frames[i] = f;
        loaded++;
        if (!ready && loaded === count) {
          ready = true;
          if (!prefersReducedMotion) start();
        }
      };
      f.src = src;
    });

    function start() {
      const frameDuration = 1000 / fps;
      let index = 0;
      let direction = 1;          // 1 forward, -1 reverse → seamless ping-pong loop
      let last = performance.now();

      function tick(now) {
        const delta = now - last;
        if (delta >= frameDuration) {
          last = now - (delta % frameDuration);
          index += direction;
          if (index >= count - 1) { index = count - 1; direction = -1; }
          else if (index <= 0)    { index = 0;         direction = 1;  }
          const next = frames[index];
          if (next && next.src) img.src = next.src;
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  }

  /* ---------- GSAP enhancements (parallax hero, scroll-pin marquee idle) ---------- */
  window.addEventListener('load', () => {
    if (prefersReducedMotion) return;
    if (typeof window.gsap === 'undefined') return;
    const { gsap } = window;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    // Hero subtle parallax — applied to the bg wrapper so it doesn't
    // conflict with the per-frame src swaps on the <img> itself.
    const heroBgWrap = document.querySelector('.hero__bg');
    if (heroBgWrap && window.ScrollTrigger) {
      gsap.to(heroBgWrap, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // Gentle float on hero orbs
    gsap.utils.toArray('.hero__orb').forEach((orb, i) => {
      gsap.to(orb, {
        y: i % 2 === 0 ? 30 : -30,
        x: i % 2 === 0 ? -20 : 20,
        duration: 6 + i,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });

    // Subtle card stagger on entry (only product cards)
    if (window.ScrollTrigger) {
      gsap.from('.card', {
        scrollTrigger: { trigger: '#sets', start: 'top 70%' },
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        clearProps: 'all',
      });
    }
  });
})();
