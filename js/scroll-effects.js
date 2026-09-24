/**
 * CLOUD9 WEB SOLUTIONS - KINETIC SCROLL & 3D PARALLAX ENGINE
 * Manages scroll progress, IntersectionObserver reveal triggers, animated count-ups, and mouse 3D tilt.
 */

class ScrollEffectsEngine {
  constructor() {
    this.progressBar = document.querySelector('.scroll-progress-bar');
    this.navbar = document.querySelector('.navbar');
    this.counterElements = document.querySelectorAll('[data-count-to]');
    this.revealObserver = null;
    
    this.init();
  }

  init() {
    this.bindScrollEvents();
    this.initIntersectionObserver();
    this.init3DTilt();
  }

  bindScrollEvents() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    // 1. Update Scroll Progress Bar
    if (this.progressBar) {
      this.progressBar.style.width = `${scrollPercentage}%`;
    }

    // 2. Navbar Styling & Background Opacity
    if (this.navbar) {
      if (scrollTop > 60) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }
    }

    // 3. Parallax Floating Orbs & Background Depth
    const orb1 = document.querySelector('.glow-orb-1');
    const orb2 = document.querySelector('.glow-orb-2');
    const orb3 = document.querySelector('.glow-orb-3');

    if (orb1) orb1.style.transform = `translateY(${scrollTop * 0.12}px)`;
    if (orb2) orb2.style.transform = `translateY(${scrollTop * -0.08}px)`;
    if (orb3) orb3.style.transform = `translateY(${scrollTop * 0.06}px)`;
  }

  initIntersectionObserver() {
    // Reveal On Scroll Observer
    this.revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.05,
      rootMargin: '0px 0px 50px 0px'
    });

    document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right').forEach(el => {
      this.revealObserver.observe(el);
    });

    // Metric Count-Up Observer
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3
    });

    this.counterElements.forEach(el => counterObserver.observe(el));
  }

  observeNewElements(container) {
    if (!this.revealObserver) return;
    const targets = container 
      ? container.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right')
      : document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right');

    targets.forEach(el => {
      this.revealObserver.observe(el);
    });
  }

  animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-count-to')) || 0;
    const prefix = element.getAttribute('data-prefix') || '';
    const suffix = element.getAttribute('data-suffix') || '';
    const decimals = parseInt(element.getAttribute('data-decimals')) || 0;
    const duration = 2000; // ms
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = target * easeProgress;

      element.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
      }
    };

    requestAnimationFrame(updateCount);
  }

  init3DTilt() {
    const cards = document.querySelectorAll('.holo-card-3d, .solution-card, .project-card, .testimonial-card, .review-card, .webdesign-card, .seo-pillar-card, .logo-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.scrollEffects = new ScrollEffectsEngine();
});
