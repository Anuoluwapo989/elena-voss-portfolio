/* ═══════════════════════════════════════════
   Elena Voss — Shared JavaScript
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Page Loader ── */
  const loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('done');
        // Trigger entrance animations after loader fades
        setTimeout(() => {
          document.body.classList.add('page-ready');
        }, 400);
      }, 800);
    });
  }

  /* ── Scroll Progress Bar ── */
  const progress = document.querySelector('.scroll-progress');
  if (progress) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      progress.style.width = pct + '%';
    }, { passive: true });
  }

  /* ── Custom Cursor ── */
  const cursor = document.querySelector('.custom-cursor');
  if (cursor && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    // Add 'View' label to cursor
    const cursorLabel = document.createElement('span');
    cursorLabel.className = 'cursor-label';
    cursorLabel.textContent = 'View';
    cursor.appendChild(cursorLabel);

    let mx = -100, my = -100, cx = -100, cy = -100;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!cursor.classList.contains('visible')) cursor.classList.add('visible');
    });

    (function tick() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      requestAnimationFrame(tick);
    })();

    const interactives = 'a, button, [data-lb], .gallery-item, .product-card, .work-item, ' +
      '.cat-item, .cat-cell, .faq-item, .series-row, .strip-item, ' +
      '.featured-strip-item, .featured-hero-img, input, textarea, select';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactives)) cursor.classList.add('hover');
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactives)) cursor.classList.remove('hover');
    });

    document.addEventListener('mousedown', () => cursor.classList.add('click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('click'));

    document.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
  }

  /* ── Back to Top ── */
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Mobile Menu ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Page Exit Transition ── */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    // Only for internal .html links
    if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
      href.startsWith('http') || !href.endsWith('.html')) return;

    e.preventDefault();
    document.body.classList.add('page-exit');
    setTimeout(() => { window.location.href = href; }, 280);
  });

  /* ── Newsletter Form ── */
  const nlForm = document.querySelector('.newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = nlForm.querySelector('button');
      const input = nlForm.querySelector('input');
      btn.textContent = 'Subscribed ✓';
      btn.style.background = '#e5e5e5';
      btn.style.color = '#090909';
      btn.style.borderColor = '#e5e5e5';
      input.disabled = true;
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
        input.disabled = false;
        btn.disabled = false;
        input.value = '';
      }, 3000);
    });
  }

  /* ── Scroll-Direction Marquee ── */
  const marqueeTracks = document.querySelectorAll('.marquee-track');
  if (marqueeTracks.length) {
    const speed = 0.5;
    let direction = -1;
    let lastScrollY = window.scrollY;
    let paused = false;

    const states = Array.from(marqueeTracks).map(track => ({
      track,
      x: 0,
      halfWidth: track.scrollWidth / 2,
    }));

    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;
      if (Math.abs(delta) > 3) {
        direction = delta < 0 ? 1 : -1;
        lastScrollY = currentY;
      }
    }, { passive: true });

    document.querySelectorAll('.marquee').forEach(m => {
      m.addEventListener('mouseenter', () => { paused = true; });
      m.addEventListener('mouseleave', () => { paused = false; });
    });

    (function tick() {
      if (!paused) {
        states.forEach(s => {
          s.x += speed * direction;
          if (s.x <= -s.halfWidth) s.x += s.halfWidth;
          if (s.x >= 0) s.x -= s.halfWidth;
          s.track.style.transform = `translateX(${s.x}px)`;
        });
      }
      requestAnimationFrame(tick);
    })();
  }

  /* ══════════════════════════════════════════
     Premium Features
     ══════════════════════════════════════════ */

  /* ── 1. Divider Expand Animation ── */
  const dividers = document.querySelectorAll('.divider');
  if (dividers.length) {
    const divObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          divObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    dividers.forEach(d => divObs.observe(d));
  }

  /* ── Image Clip Reveal ── */
  const clipItems = document.querySelectorAll('.gallery-item img, .work-item img, .hero-bg img');
  if (clipItems.length) {
    clipItems.forEach(img => img.classList.add('clip-reveal'));
    const clipObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          clipObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    clipItems.forEach(img => clipObs.observe(img));
  }

  /* ── 2. Animated Stat Counters ── */
  const statEls = document.querySelectorAll('.stat-value');
  if (statEls.length) {
    const animateCount = (el) => {
      const raw = el.textContent.trim();
      // Parse number and suffix (e.g. "2k+" → 2, "k+")
      const match = raw.match(/^(\d+)(.*)/);
      if (!match) return;
      const target = parseInt(match[1], 10);
      const suffix = match[2] || '';
      const duration = 2000;
      const start = performance.now();

      el.textContent = '0' + suffix;

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quart
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const statObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCount(e.target);
          statObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => statObs.observe(el));
  }

  /* ── 3. Staggered Word Reveal ── */
  const reveals = document.querySelectorAll('h1.reveal, h2.reveal');
  if (reveals.length) {
    reveals.forEach(el => {
      // Preserve HTML structure (like <em>, <br>)
      const nodes = Array.from(el.childNodes);
      el.innerHTML = '';

      nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const words = node.textContent.split(/(\s+)/);
          words.forEach(w => {
            if (/^\s+$/.test(w)) {
              el.appendChild(document.createTextNode(w));
            } else if (w) {
              const span = document.createElement('span');
              span.className = 'word-reveal';
              span.textContent = w;
              el.appendChild(span);
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'BR') {
            el.appendChild(node.cloneNode());
          } else {
            // Wrap contents of <em> etc.
            const wrapper = node.cloneNode(false);
            const innerWords = node.textContent.split(/(\s+)/);
            innerWords.forEach(w => {
              if (/^\s+$/.test(w)) {
                wrapper.appendChild(document.createTextNode(w));
              } else if (w) {
                const span = document.createElement('span');
                span.className = 'word-reveal';
                span.textContent = w;
                wrapper.appendChild(span);
              }
            });
            el.appendChild(wrapper);
          }
        }
      });

      // Assign staggered delays
      const wordSpans = el.querySelectorAll('.word-reveal');
      wordSpans.forEach((span, i) => {
        span.style.transitionDelay = (i * 0.07) + 's';
      });
    });

    const wordObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.word-reveal').forEach(w => w.classList.add('visible'));
          wordObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    reveals.forEach(el => wordObs.observe(el));
  }

  /* ── 4. Parallax Images ── */
  const parallaxItems = document.querySelectorAll('.gallery-item img, .work-item img');
  if (parallaxItems.length && matchMedia('(hover:hover)').matches) {
    parallaxItems.forEach(img => img.classList.add('parallax-img'));

    const updateParallax = () => {
      const scrollY = window.scrollY;
      const winH = window.innerHeight;
      parallaxItems.forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < winH) {
          const center = rect.top + rect.height / 2;
          const offset = (center - winH / 2) / winH;
          const shift = offset * -30; // max ±30px
          img.style.transform = `translateY(${shift}px)`;
        }
      });
    };

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  /* ── 5. Smooth 3D Tilt on Hover ── */
  const tiltItems = document.querySelectorAll('.gallery-item, .work-item');
  if (tiltItems.length && matchMedia('(hover:hover)').matches) {
    tiltItems.forEach(item => {
      item.classList.add('tilt-card');
      const img = item.querySelector('img');
      if (!img) return;

      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateX = y * -12;  // max ±6 degrees
        const rotateY = x * 12;
        img.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      item.addEventListener('mouseleave', () => {
        img.style.transform = '';
      });
    });
  }

  /* ── 6. Magnetic Buttons ── */
  const navLinks = document.querySelectorAll('nav a, .cta-btn, .back-to-top');
  if (navLinks.length && matchMedia('(hover:hover)').matches) {
    navLinks.forEach(link => {
      link.classList.add('magnetic');

      link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.25;
        const dy = (e.clientY - cy) * 0.25;
        link.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      link.addEventListener('mouseleave', () => {
        link.style.transform = '';
      });
    });
  }

  /* ── 7. Global Keyboard Accessibility ── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const activeEl = document.activeElement;
      if (activeEl && activeEl.getAttribute('role') === 'button') {
        e.preventDefault();
        activeEl.click();
      }
    }
  });

})();
