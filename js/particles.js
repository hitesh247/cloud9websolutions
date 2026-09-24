/**
 * CLOUD9 WEB SOLUTIONS - 60FPS INTERACTIVE PARTICLE NEBULA & CONSTELLATION ENGINE
 * High-performance WebGL/2D Canvas simulation with interactive mouse gravity & scroll parallax.
 */

class NebulaParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 100;
    this.maxDistance = 140;
    this.mouse = {
      x: -1000,
      y: -1000,
      radius: 180,
      isHovered: false,
      lastX: 0,
      lastY: 0,
      speed: 0
    };
    this.scrollY = window.scrollY;
    this.animationFrameId = null;
    this.colorPalette = [
      'rgba(0, 240, 255, ',    // Neon Cyan
      'rgba(157, 78, 221, ',   // Cyber Purple
      'rgba(58, 134, 255, ',   // Cyber Blue
      'rgba(255, 0, 127, '     // Magenta Glow
    ];

    this.init();
  }

  init() {
    this.handleResize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  handleResize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);

    // Dynamic particle count based on screen width
    if (this.width < 768) {
      this.particleCount = 45;
      this.maxDistance = 90;
    } else if (this.width < 1200) {
      this.particleCount = 80;
      this.maxDistance = 120;
    } else {
      this.particleCount = 120;
      this.maxDistance = 140;
    }
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      const colorBase = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: Math.random() * 2.2 + 1,
        baseAlpha: Math.random() * 0.6 + 0.25,
        colorBase: colorBase,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseVal: Math.random() * Math.PI,
        layerDepth: Math.random() * 0.8 + 0.2 // Depth for scroll parallax
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.handleResize();
      this.createParticles();
    });

    window.addEventListener('mousemove', (e) => {
      const dx = e.clientX - this.mouse.lastX;
      const dy = e.clientY - this.mouse.lastY;
      this.mouse.speed = Math.sqrt(dx * dx + dy * dy);
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.lastX = e.clientX;
      this.mouse.lastY = e.clientY;
      this.mouse.isHovered = true;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
      this.mouse.isHovered = false;
    });

    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    }, { passive: true });

    // Interactive Particle Burst on Click
    window.addEventListener('click', (e) => {
      if (this.particles.length > 200) return;
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 / 12) * i;
        const speed = Math.random() * 3 + 2;
        const colorBase = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
        this.particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 2.5 + 1.5,
          baseAlpha: 0.9,
          colorBase: colorBase,
          pulseSpeed: 0.05,
          pulseVal: 0,
          layerDepth: 0.8,
          isBurst: true,
          life: 1.0
        });
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(this.animationFrameId);
      } else {
        this.animate();
      }
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update and draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Temporary burst particles life fade
      if (p.isBurst) {
        p.life -= 0.015;
        p.vx *= 0.96;
        p.vy *= 0.96;
        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }
      }

      // Natural movement
      p.x += p.vx;
      p.y += p.vy;

      // Wrap boundaries
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Mouse Proximity & Gravitational Repulsion/Attraction
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouse.radius) {
        const force = (1 - dist / this.mouse.radius) * 1.5;
        const angle = Math.atan2(dy, dx);
        p.x -= Math.cos(angle) * force * 3;
        p.y -= Math.sin(angle) * force * 3;
      }

      // Parallax scroll reaction
      const renderY = p.y + (this.scrollY * p.layerDepth * 0.08) % this.height;

      // Alpha pulsing
      p.pulseVal += p.pulseSpeed;
      const currentAlpha = p.isBurst 
        ? p.life 
        : p.baseAlpha + Math.sin(p.pulseVal) * 0.2;

      // Draw particle circle with neon aura
      this.ctx.beginPath();
      this.ctx.arc(p.x, renderY, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.colorBase}${Math.max(0.1, currentAlpha)})`;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = `${p.colorBase}0.8)`;
      this.ctx.fill();

      // Connect constellation lines
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const p2RenderY = p2.y + (this.scrollY * p2.layerDepth * 0.08) % this.height;
        const cdx = p.x - p2.x;
        const cdy = renderY - p2RenderY;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

        if (cdist < this.maxDistance) {
          const lineAlpha = (1 - cdist / this.maxDistance) * 0.22;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, renderY);
          this.ctx.lineTo(p2.x, p2RenderY);
          this.ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.shadowBlur = 0;
          this.ctx.stroke();
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.cloud9Nebula = new NebulaParticleEngine('hero-canvas');
});
