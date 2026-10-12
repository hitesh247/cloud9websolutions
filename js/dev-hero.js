/**
 * Web Development Agency in India - Interactive Fluid Engine
 * Handles 3D card tilt, cursor spotlight, magnetic button, and entrance animations
 */

(function () {
  'use strict';

  function initDevHero() {
    const heroSection = document.getElementById('top-agency-hero');
    if (!heroSection) return;

    const interactiveCard = document.getElementById('dev-interactive-card');
    const contactBtn = document.getElementById('dev-contact-btn');
    const spotlight = document.querySelector('.fluid-mouse-spotlight');
    const stripCards = document.querySelectorAll('.strip-card');

    // 1. Entrance Reveals
    const revealItems = heroSection.querySelectorAll('[data-dev-reveal]');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, idx * 100);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      revealItems.forEach((el) => observer.observe(el));
    } else {
      revealItems.forEach((el) => el.classList.add('is-visible'));
    }

    // 2. Fluid Mouse Spotlight & 3D Tilt on Desktop
    if (window.matchMedia('(pointer: fine)').matches) {
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;
      let isHovering = false;

      heroSection.addEventListener('mouseenter', () => {
        isHovering = true;
      });

      heroSection.addEventListener('mouseleave', () => {
        isHovering = false;
        if (interactiveCard) {
          interactiveCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        }
      });

      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        // Position spotlight
        if (spotlight) {
          spotlight.style.left = `${mouseX}px`;
          spotlight.style.top = `${mouseY}px`;
        }

        // 3D Card Tilt relative to image card
        if (interactiveCard) {
          const cardRect = interactiveCard.getBoundingClientRect();
          const cardCenterX = cardRect.left + cardRect.width / 2;
          const cardCenterY = cardRect.top + cardRect.height / 2;

          const deltaX = (e.clientX - cardCenterX) / (cardRect.width / 2);
          const deltaY = (e.clientY - cardCenterY) / (cardRect.height / 2);

          // Restrict bounds
          const clampedX = Math.max(-1, Math.min(1, deltaX));
          const clampedY = Math.max(-1, Math.min(1, deltaY));

          const tiltX = -clampedY * 8; // degrees
          const tiltY = clampedX * 10; // degrees

          interactiveCard.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(12px)`;
        }
      });

      // 3. Magnetic Hover Effect on CTA Button
      if (contactBtn) {
        contactBtn.addEventListener('mousemove', (e) => {
          const btnRect = contactBtn.getBoundingClientRect();
          const btnCenterX = btnRect.left + btnRect.width / 2;
          const btnCenterY = btnRect.top + btnRect.height / 2;

          const distX = (e.clientX - btnCenterX) * 0.25;
          const distY = (e.clientY - btnCenterY) * 0.25;

          contactBtn.style.transform = `translate(${distX}px, ${distY}px) scale(1.03)`;
        });

        contactBtn.addEventListener('mouseleave', () => {
          contactBtn.style.transform = 'translate(0px, 0px) scale(1)';
        });
      }
    }

    // 4. Interactive Bottom Capability Strip Cards
    if (stripCards.length > 0) {
      stripCards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          stripCards.forEach((c) => c.classList.remove('active'));
          card.classList.add('active');
        });
      });
    }
  }

  // Initialize on DOMContentLoaded or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDevHero);
  } else {
    initDevHero();
  }
})();
