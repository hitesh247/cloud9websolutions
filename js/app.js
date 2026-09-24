/**
 * CLOUD9 WEB SOLUTIONS - MAIN APPLICATION CONTROLLER
 * Audio Synthesizer, Project Estimator, Portfolio Simulator, Customer Reviews Hub & Terminal
 */

// ==========================================================================
// 1. WEB AUDIO API SYNTHESIZER (Haptic UI Feedback Engine)
// ==========================================================================
class SoundSynthesisEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.toggleBtn = document.querySelector('.audio-toggle-btn');
    this.init();
  }

  init() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleAudio());
    }

    // Attach interactive hover/click sounds to primary UI controls
    document.querySelectorAll('.btn, .nav-link, .filter-btn, .option-pill, .tech-node').forEach(el => {
      el.addEventListener('mouseenter', () => this.playHoverTick());
      el.addEventListener('click', () => this.playClickChirp());
    });
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleAudio() {
    this.ensureContext();
    this.enabled = !this.enabled;

    if (this.toggleBtn) {
      if (this.enabled) {
        this.toggleBtn.classList.add('active');
        this.toggleBtn.setAttribute('title', 'Cyber Audio FX: Active');
        this.playSuccessChime();
        showToast('Cyber Audio FX Enabled 🔊');
      } else {
        this.toggleBtn.classList.remove('active');
        this.toggleBtn.setAttribute('title', 'Cyber Audio FX: Muted');
        showToast('Cyber Audio FX Muted 🔇');
      }
    }
  }

  playTone(freq, duration = 0.1, type = 'sine', gainVal = 0.08) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio fallback
    }
  }

  playHoverTick() {
    this.playTone(850, 0.04, 'sine', 0.03);
  }

  playClickChirp() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  playSuccessChime() {
    if (!this.enabled) return;
    setTimeout(() => this.playTone(523.25, 0.12, 'sine', 0.08), 0);
    setTimeout(() => this.playTone(659.25, 0.12, 'sine', 0.08), 80);
    setTimeout(() => this.playTone(783.99, 0.18, 'sine', 0.08), 160);
    setTimeout(() => this.playTone(1046.50, 0.25, 'sine', 0.1), 240);
  }
}

// ==========================================================================
// 2. PROJECT COST & BLUEPRINT ESTIMATOR ENGINE
// ==========================================================================
class ProjectEstimator {
  constructor() {
    this.costDisplay = document.querySelector('.cost-val');
    this.specTier = document.getElementById('spec-tier');
    this.specVisual = document.getElementById('spec-visual');
    this.specTimeline = document.getElementById('spec-timeline');
    this.specStack = document.getElementById('spec-stack');
    this.generateBtn = document.getElementById('btn-generate-blueprint');

    this.state = {
      tier: 'saas',
      visual: 'kinetic',
      addons: ['ai-agent', 'edge-cdn']
    };

    this.tierData = {
      mvp: { name: 'Startup MVP Engine', baseCost: 4800, baseWeeks: 3, stack: 'Next.js 15, Tailwind, Supabase' },
      saas: { name: 'Scale-Up SaaS Platform', baseCost: 9800, baseWeeks: 6, stack: 'Next.js 15, React 19, Supabase RLS, Stripe' },
      webgl: { name: '3D Spatial / WebGL Universe', baseCost: 14500, baseWeeks: 7, stack: 'Three.js, WebGL 2, Next.js, GLSL' },
      enterprise: { name: 'Enterprise Multi-Region Grid', baseCost: 26000, baseWeeks: 10, stack: 'Kubernetes, Rust WASM, Next.js, AWS Mesh' }
    };

    this.visualData = {
      standard: { name: 'High-Speed Clean', multiplier: 1.0 },
      kinetic: { name: 'Kinetic Motion & Parallax', multiplier: 1.2 },
      spatial: { name: 'Full 3D / WebGPU', multiplier: 1.45 }
    };

    this.addonData = {
      'ai-agent': { name: 'Autonomous AI Copilot', cost: 2400, addWeeks: 1 },
      'vector-db': { name: 'Vector DB & RAG Search', cost: 1800, addWeeks: 1 },
      'edge-cdn': { name: 'Global Edge Cloud Mesh', cost: 1200, addWeeks: 0.5 },
      'realtime': { name: 'Multi-User Live Collaboration', cost: 2200, addWeeks: 1 }
    };

    this.init();
  }

  init() {
    document.querySelectorAll('.option-pill[data-group]').forEach(pill => {
      pill.addEventListener('click', () => {
        const group = pill.getAttribute('data-group');
        const val = pill.getAttribute('data-val');

        if (group === 'tier' || group === 'visual') {
          document.querySelectorAll(`.option-pill[data-group="${group}"]`).forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.state[group] = val;
        } else if (group === 'addon') {
          pill.classList.toggle('active');
          if (pill.classList.contains('active')) {
            if (!this.state.addons.includes(val)) this.state.addons.push(val);
          } else {
            this.state.addons = this.state.addons.filter(a => a !== val);
          }
        }

        this.calculate();
      });
    });

    if (this.generateBtn) {
      this.generateBtn.addEventListener('click', () => this.openBlueprintModal());
    }

    this.calculate();
  }

  calculate() {
    const tier = this.tierData[this.state.tier];
    const visual = this.visualData[this.state.visual];

    let total = tier.baseCost * visual.multiplier;
    let weeks = tier.baseWeeks;

    this.state.addons.forEach(addKey => {
      const addon = this.addonData[addKey];
      if (addon) {
        total += addon.cost;
        weeks += addon.addWeeks;
      }
    });

    const roundedTotal = Math.round(total / 100) * 100;
    const minRange = Math.round(roundedTotal * 0.92 / 100) * 100;
    const maxRange = Math.round(roundedTotal * 1.12 / 100) * 100;

    if (this.costDisplay) {
      this.costDisplay.innerHTML = `$${minRange.toLocaleString()} <span>- $${maxRange.toLocaleString()}</span>`;
    }

    if (this.specTier) this.specTier.textContent = tier.name;
    if (this.specVisual) this.specVisual.textContent = visual.name;
    if (this.specTimeline) this.specTimeline.textContent = `${Math.ceil(weeks)} - ${Math.ceil(weeks + 2)} Weeks`;
    if (this.specStack) this.specStack.textContent = tier.stack;
  }

  openBlueprintModal() {
    const modal = document.getElementById('blueprint-modal');
    if (!modal) return;

    const tier = this.tierData[this.state.tier];
    const visual = this.visualData[this.state.visual];
    const activeAddonNames = this.state.addons.map(a => this.addonData[a]?.name).filter(Boolean).join(', ') || 'None';

    document.getElementById('modal-bp-tier').textContent = tier.name;
    document.getElementById('modal-bp-visual').textContent = visual.name;
    document.getElementById('modal-bp-addons').textContent = activeAddonNames;
    document.getElementById('modal-bp-stack').textContent = tier.stack;
    document.getElementById('modal-bp-cost').textContent = this.costDisplay.textContent;
    document.getElementById('modal-bp-timeline').textContent = this.specTimeline.textContent;

    modal.classList.add('active');
    if (window.cloud9Audio) window.cloud9Audio.playSuccessChime();
  }
}

// ==========================================================================
// 3. PORTFOLIO SHOWCASE & DEVICE SIMULATOR MODAL
// ==========================================================================
const PORTFOLIO_DATA = [
  {
    id: 'aetherflow',
    title: 'AetherFlow AI Studio',
    category: 'ai',
    categoryLabel: 'AI & Spatial',
    description: 'Generative AI platform orchestrating multimodal agents with real-time vector knowledge retrieval and 3D spatial neural graphs.',
    metrics: { speed: '0.22s FCP', conversion: '+340%', uptime: '99.99%' },
    tech: ['Next.js 15', 'Three.js', 'Python AI', 'pgvector'],
    previewSrc: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'chronopulse',
    title: 'ChronoPulse 3D Watchmaker',
    category: 'webgl',
    categoryLabel: '3D & WebGL',
    description: 'Luxury interactive 3D timepiece configurator featuring raytraced sapphire crystal refraction and real-time custom engraving.',
    metrics: { speed: '60 FPS', engagement: '6.4 min avg', sales: '+210%' },
    tech: ['Three.js', 'GLSL Shaders', 'WebGPU', 'Tailwind'],
    previewSrc: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'cybervault',
    title: 'CyberVault Edge Security',
    category: 'saas',
    categoryLabel: 'SaaS Platform',
    description: 'Zero-trust cloud infrastructure dashboard with real-time DDoS telemetry, automated micro-isolation, and encrypted secrets vault.',
    metrics: { speed: '<12ms TTFB', clients: '450+ Orgs', grade: 'SOC2 Compliant' },
    tech: ['Next.js 15', 'Rust WASM', 'Supabase RLS', 'Cloudflare'],
    previewSrc: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'luminacommerce',
    title: 'Lumina Hyper-Speed E-Commerce',
    category: 'ecommerce',
    categoryLabel: 'E-Commerce',
    description: 'Headless multi-currency commerce engine with instant 0.1s page transitions, 3D product previews, and 1-click biometric checkout.',
    metrics: { speed: '100/100 Core Vitals', checkout: '<4 sec', aov: '+45%' },
    tech: ['Next.js 15', 'Shopify Storefront', 'Stripe', 'Tailwind'],
    previewSrc: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'orbitspatial',
    title: 'OrbitSpatial Architectural Meta',
    category: 'webgl',
    categoryLabel: '3D & WebGL',
    description: 'Collaborative architectural visualization platform allowing real-time CAD walkthroughs and sun-path daylight simulations.',
    metrics: { speed: '120 FPS Max', memory: '<35MB', scale: '1:1 Accurate' },
    tech: ['WebGL 2', 'Three.js', 'WebSockets', 'Next.js'],
    previewSrc: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'novafin',
    title: 'NovaFin Quantum Trader',
    category: 'saas',
    categoryLabel: 'Fintech & SaaS',
    description: 'High-frequency algorithmic portfolio analytics workstation streaming microsecond order-book feeds and risk matrices.',
    metrics: { latency: '<8ms WebSocket', processed: '$4.2B+', accuracy: '99.98%' },
    tech: ['TypeScript', 'Next.js', 'WebSockets', 'Chart.js'],
    previewSrc: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80'
  }
];

class PortfolioShowcaseController {
  constructor() {
    this.filterBtns = document.querySelectorAll('.showcase-filters .filter-btn');
    this.grid = document.querySelector('.showcase-grid');
    this.modal = document.getElementById('project-modal');
    this.init();
  }

  init() {
    this.renderCards('all');

    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter') || 'all';
        this.renderCards(filter);
      });
    });

    // Device simulator button controls in modal
    document.querySelectorAll('.device-btn').forEach(dBtn => {
      dBtn.addEventListener('click', () => {
        document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
        dBtn.classList.add('active');
        const device = dBtn.getAttribute('data-device') || 'desktop';
        const frame = document.querySelector('.simulator-frame');
        if (frame) {
          frame.className = `simulator-frame ${device}`;
        }
      });
    });
  }

  renderCards(filter) {
    if (!this.grid) return;
    this.grid.innerHTML = '';

    const filtered = filter === 'all' 
      ? PORTFOLIO_DATA 
      : PORTFOLIO_DATA.filter(item => item.category === filter);

    filtered.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `project-card reveal-on-scroll is-revealed delay-${(index % 3) + 1}`;
      card.setAttribute('data-id', item.id);
      card.innerHTML = `
        <div class="project-thumbnail-wrapper">
          <img src="${item.previewSrc}" alt="${item.title}" class="project-thumbnail" loading="lazy">
          <div class="project-overlay">
            <span class="project-badge-pill">${item.categoryLabel}</span>
          </div>
        </div>
        <div class="project-info">
          <h3 class="project-title">${item.title}</h3>
          <p class="project-description">${item.description}</p>
          <div class="project-meta-row">
            <div class="project-tech-list">
              ${item.tech.slice(0, 3).map(t => `<span class="project-tech-item">${t}</span>`).join(' • ')}
            </div>
            <span class="project-view-btn">
              Explore Live ↗
            </span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => this.openProjectModal(item));
      this.grid.appendChild(card);
    });

    if (window.scrollEffects) {
      window.scrollEffects.init3DTilt();
    }
  }

  openProjectModal(item) {
    if (!this.modal) return;

    document.getElementById('modal-project-title').textContent = item.title;
    document.getElementById('modal-project-desc').textContent = item.description;
    document.getElementById('modal-project-cat').textContent = item.categoryLabel;
    
    const metricsContainer = document.getElementById('modal-project-metrics');
    if (metricsContainer) {
      metricsContainer.innerHTML = Object.entries(item.metrics).map(([k, v]) => `
        <div class="holo-stat-box">
          <div class="holo-stat-val">${v}</div>
          <div class="holo-stat-lbl">${k}</div>
        </div>
      `).join('');
    }

    const viewportImg = document.getElementById('modal-simulator-img');
    if (viewportImg) {
      viewportImg.src = item.previewSrc;
    }

    this.modal.classList.add('active');
    if (window.cloud9Audio) window.cloud9Audio.playTone(750, 0.1, 'sine');
  }
}

// ==========================================================================
// 4. CUSTOMER REVIEWS HUB (AUTHENTIC CLOUD9 REVIEWS WITH DP HEADSHOTS)
// ==========================================================================
const CUSTOMER_REVIEWS_DATA = [
  {
    id: 'rev-1',
    name: 'Elena Vance',
    role: 'Chief Technology Officer',
    company: 'Synthetix AI Global',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    stars: 5,
    category: 'saas',
    date: 'August 2026',
    metric: '🚀 +340% Conversion Spike | 0.24s FCP',
    quote: 'Cloud9 Web Solutions completely transformed our digital presence. They engineered our AI SaaS platform with Next.js 15 Server Components and custom WebGL neural graphs. Our FCP dropped to 0.24s and conversions spiked by 340% in the first month. Cloud9 is in a league of their own.',
    tech: ['Next.js 15', 'React 19', 'Supabase RLS', 'Turbopack']
  },
  {
    id: 'rev-2',
    name: 'Marcus Thorne',
    role: 'Founder & CEO',
    company: 'ChronoPulse Luxury Timepieces',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    stars: 5,
    category: 'webgl',
    date: 'July 2026',
    metric: '💎 6.4 min Avg Session | +210% Direct Sales',
    quote: 'Hiring Cloud9 Web Solutions was the single best decision for our luxury brand. Their mastery of Three.js, WebGPU, and GLSL shaders allowed us to build an interactive 3D watch configurator running at buttery 60fps on mobile. Our customers spend over 6 minutes customizing watches!',
    tech: ['Three.js', 'GLSL Shaders', 'WebGPU', 'Tailwind']
  },
  {
    id: 'rev-3',
    name: 'Dr. Samantha Reed',
    role: 'VP of Engineering',
    company: 'CyberVault Edge Networks',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    stars: 5,
    category: 'fintech',
    date: 'June 2026',
    metric: '🛡️ Zero Breaches | $42M ARR Protected',
    quote: 'Cloud9 Web Solutions delivered our zero-trust security dashboard two weeks ahead of schedule. Their implementation of Rust WebAssembly and sub-10ms edge caching protected over $42M in enterprise ARR with zero downtime. If you need serious, hyperscale web engineering, choose Cloud9.',
    tech: ['Rust WASM', 'Next.js', 'Cloudflare Edge', 'Zero-Trust']
  },
  {
    id: 'rev-4',
    name: 'Julian Hayes',
    role: 'Head of Growth',
    company: 'Lumina Hyper-Commerce',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    stars: 5,
    category: 'ecommerce',
    date: 'May 2026',
    metric: '⚡ 100/100 Core Vitals | <3s Checkout',
    quote: 'Our old Shopify store was sluggish and lost mobile shoppers. Cloud9 Web Solutions designed a headless Next.js frontend with 100/100 Core Web Vitals and instant biometric checkout. Our average order value jumped 45% immediately after launch.',
    tech: ['Shopify Storefront', 'Next.js 15', 'Stripe', 'Tailwind']
  },
  {
    id: 'rev-5',
    name: 'Aria Sterling',
    role: 'Lead Spatial Architect',
    company: 'OrbitSpatial Meta Studios',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    stars: 5,
    category: 'webgl',
    date: 'April 2026',
    metric: '🌌 120 FPS Rendering | Sub-35MB Footprint',
    quote: 'The 3D engineering team at Cloud9 Web Solutions is world-class. They converted our massive architectural CAD models into lightweight WebGL 2 scenes that stream in under 35MB of RAM. Their mathematical shader optimization and kinetic scroll choreography blew our clients away.',
    tech: ['WebGL 2', 'Three.js', 'WebSockets', 'Next.js']
  },
  {
    id: 'rev-6',
    name: 'David Chen',
    role: 'Managing Director',
    company: 'QuantumEdge Algorithmic Capital',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
    stars: 5,
    category: 'fintech',
    date: 'March 2026',
    metric: '📊 <8ms Latency | $4.2B Volume Handled',
    quote: 'In algorithmic finance, milliseconds equal millions. Cloud9 Web Solutions engineered our high-frequency portfolio workstation with real-time WebSocket feeds processing over $4.2B in volume with zero frame drops. Outstanding architectural precision.',
    tech: ['TypeScript', 'Next.js', 'WebSockets', 'Chart.js']
  },
  {
    id: 'rev-7',
    name: 'Sarah Jenkins',
    role: 'Chief Product Officer',
    company: 'NovaPulse Health Tech',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    stars: 5,
    category: 'saas',
    date: 'February 2026',
    metric: '🤖 88 NPS Score | 99.8% AI Diagnostic Accuracy',
    quote: 'Collaborating with Cloud9 Web Solutions felt like having an elite SWAT team of senior engineers. They integrated custom Gemini AI agents with pgvector semantic search. The UI is accessible, lightning-fast, and beautiful. Our NPS score climbed straight to 88.',
    tech: ['Gemini API', 'Next.js 15', 'Python RAG', 'PostgreSQL']
  },
  {
    id: 'rev-8',
    name: 'Liam O Connor',
    role: 'Co-Founder & CMO',
    company: 'Apex Motors 3D Hypercars',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80',
    stars: 5,
    category: 'webgl',
    date: 'January 2026',
    metric: '🏎️ 1.2M Launch Impressions | +380% RSVPs',
    quote: 'Cloud9 Web Solutions created an unforgettable 3D spatial showroom for our hypercar debut. The cosmic particle background, raytraced paint reflections, and Web Audio sound effects generated immense viral traction. They exceeded every single milestone.',
    tech: ['Three.js', 'GLSL Shaders', 'Web Audio API', 'Next.js']
  }
];

class CustomerReviewsController {
  constructor() {
    this.filterBtns = document.querySelectorAll('.review-filters .filter-btn');
    this.grid = document.querySelector('.reviews-grid');
    this.openReviewModalBtn = document.getElementById('btn-open-review-modal');
    this.reviewModal = document.getElementById('review-submission-modal');
    this.reviews = [...CUSTOMER_REVIEWS_DATA];
    this.selectedStars = 5;

    this.init();
  }

  init() {
    this.renderReviews('all');

    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-review-filter') || 'all';
        this.renderReviews(filter);
      });
    });

    if (this.openReviewModalBtn && this.reviewModal) {
      this.openReviewModalBtn.addEventListener('click', () => {
        this.reviewModal.classList.add('active');
        if (window.cloud9Audio) window.cloud9Audio.playTone(600, 0.1, 'sine');
      });
    }

    this.initStarPicker();
    this.initReviewForm();
  }

  renderReviews(filter) {
    if (!this.grid) return;
    this.grid.innerHTML = '';

    const filtered = filter === 'all'
      ? this.reviews
      : this.reviews.filter(r => r.category === filter);

    filtered.forEach((r, idx) => {
      const card = document.createElement('div');
      card.className = `review-card reveal-on-scroll is-revealed delay-${(idx % 3) + 1}`;
      card.innerHTML = `
        <div>
          <div class="review-card-top">
            <div class="review-client-header">
              <img src="${r.avatar}" alt="${r.name} Headshot" class="review-avatar" loading="lazy">
              <div>
                <div class="review-author-name">
                  ${r.name} <span class="verified-icon" title="Verified Cloud9 Enterprise Client">✔</span>
                </div>
                <div class="review-author-role">${r.role}, <strong>${r.company}</strong></div>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.85rem;">
            <div class="stars-glow" style="font-size: 1.15rem; margin-bottom:0;">
              ${'★'.repeat(r.stars)}
            </div>
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">${r.date}</span>
          </div>

          <div class="review-metric-pill">${r.metric}</div>

          <p class="review-quote-body">"${r.quote}"</p>
        </div>

        <div class="solution-tags" style="margin-top: 0.5rem; padding-top: 1rem;">
          ${r.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      `;

      this.grid.appendChild(card);
    });

    if (window.scrollEffects) {
      window.scrollEffects.init3DTilt();
    }
  }

  initStarPicker() {
    const stars = document.querySelectorAll('.star-picker-item');
    stars.forEach(star => {
      star.addEventListener('mouseenter', () => {
        const val = parseInt(star.getAttribute('data-star')) || 5;
        stars.forEach((s, idx) => {
          if (idx < val) s.classList.add('hovered');
          else s.classList.remove('hovered');
        });
      });

      star.addEventListener('mouseleave', () => {
        stars.forEach(s => s.classList.remove('hovered'));
      });

      star.addEventListener('click', () => {
        const val = parseInt(star.getAttribute('data-star')) || 5;
        this.selectedStars = val;
        stars.forEach((s, idx) => {
          if (idx < val) s.classList.add('active');
          else s.classList.remove('active');
        });
        if (window.cloud9Audio) window.cloud9Audio.playTone(800 + val * 50, 0.08, 'sine');
      });
    });
  }

  initReviewForm() {
    const form = document.getElementById('review-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rev-author-name').value;
      const role = document.getElementById('rev-author-role').value;
      const company = document.getElementById('rev-author-company').value;
      const category = document.getElementById('rev-category').value;
      const metric = document.getElementById('rev-metric').value || '⚡ 100/100 Core Vitals | Peak Delivery';
      const quote = document.getElementById('rev-quote').value;

      const newReview = {
        id: `rev-${Date.now()}`,
        name: name,
        role: role,
        company: company,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        stars: this.selectedStars,
        category: category,
        date: 'Just Now',
        metric: metric,
        quote: quote,
        tech: ['Next.js 15', 'Three.js', 'Supabase']
      };

      this.reviews.unshift(newReview);
      this.renderReviews('all');

      if (this.reviewModal) this.reviewModal.classList.remove('active');
      form.reset();

      showToast(`Thank you, ${name}! Your verified review of Cloud9 Web Solutions is now live 🌟`);
      if (window.cloud9Audio) window.cloud9Audio.playSuccessChime();
    });
  }
}

// ==========================================================================
// 5. GLOBAL HQ TELEMETRY CLOCKS
// ==========================================================================
function updateGlobalClocks() {
  const timezones = {
    'clock-sf': 'America/Los_Angeles',
    'clock-london': 'Europe/London',
    'clock-tokyo': 'Asia/Tokyo',
    'clock-singapore': 'Asia/Singapore'
  };

  const now = new Date();
  Object.entries(timezones).forEach(([id, tz]) => {
    const el = document.getElementById(id);
    if (el) {
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: tz,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      el.textContent = `${timeStr} UTC`;
    }
  });
}

// ==========================================================================
// 6. TOAST NOTIFICATION UTILITY
// ==========================================================================
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================================================
// 7. CONTACT TERMINAL VALIDATION & SUBMISSION
// ==========================================================================
function initContactTerminal() {
  const form = document.getElementById('terminal-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const submitBtn = form.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Transmitting to Cloud9 Cluster... ⚡';
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Transmission Successful ✔';
      }
      form.reset();
      showToast(`Transmission received! Our lead architect will reach out to ${email} within 4 hours.`);
      if (window.cloud9Audio) window.cloud9Audio.playSuccessChime();
    }, 1200);
  });
}

// ==========================================================================
// 6. WEB DESIGN THEME TRANSFORMER ENGINE
// ==========================================================================
function initWebDesignThemeTransformer() {
  const themeBtns = document.querySelectorAll('.theme-toggle-btn');
  const mockBody = document.getElementById('theme-mock-body');
  const addressText = document.getElementById('browser-address-text');
  const tagText = document.getElementById('mock-tag-text');
  const headingText = document.getElementById('mock-heading-text');
  const descText = document.getElementById('mock-desc-text');
  const statLatency = document.getElementById('stat-latency');

  const themeData = {
    glass: {
      className: 'theme-cyber-glass',
      url: 'https://cloud9-preview.studio/quantum-design-system',
      tag: '✦ INTELLIGENT WORKFLOW',
      heading: 'Spatial Design Systems For The Next Web',
      desc: 'Engineered with fluid typography curves, sub-pixel rendering, and dark glassmorphic luminance.',
      latency: '0.18s'
    },
    luxury: {
      className: 'theme-minimal-luxury',
      url: 'https://cloud9-preview.studio/haute-couture-minimal',
      tag: '👑 ATELIER EDITION',
      heading: 'Pure Aesthetic Balance & Editorial Precision',
      desc: 'Minimalist champagne gold geometry with bespoke serif typography and silent micro-transitions.',
      latency: '0.12s'
    },
    blueprint: {
      className: 'theme-blueprint-wireframe',
      url: 'https://cloud9-preview.studio/spec-wireframe-mode',
      tag: '📐 ARCHITECTURAL BLUEPRINT',
      heading: 'High-Density Wireframe & Token Schema',
      desc: 'Mathematical wireframe alignment with strict 8pt grid tokens and zero-layout-shift constraints.',
      latency: '0.08s'
    }
  };

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedTheme = btn.getAttribute('data-theme') || 'glass';
      const data = themeData[selectedTheme];

      if (mockBody && data) {
        mockBody.className = `browser-body ${data.className}`;
        if (addressText) addressText.textContent = data.url;
        if (tagText) tagText.textContent = data.tag;
        if (headingText) headingText.textContent = data.heading;
        if (descText) descText.textContent = data.desc;
        if (statLatency) statLatency.textContent = data.latency;
        if (window.cloud9Audio) window.cloud9Audio.playTone(700, 0.08, 'sine');
      }
    });
  });
}

// ==========================================================================
// 7. SEO & CORE WEB VITALS SCANNER SIMULATOR
// ==========================================================================
function initSeoScannerSimulator() {
  const scanBtn = document.getElementById('btn-run-seo-scan');
  const urlInput = document.getElementById('seo-url-input');
  const presetChips = document.querySelectorAll('.preset-chip');
  const progressWrap = document.getElementById('seo-scan-progress');
  const progressFill = document.getElementById('seo-progress-fill');
  const progressStatus = document.getElementById('seo-progress-status');
  const statusTag = document.getElementById('scanner-status-tag');

  const scoreTotal = document.getElementById('score-val-total');
  const scoreRating = document.getElementById('score-rating-text');
  const scoreLcp = document.getElementById('score-lcp');
  const scoreInp = document.getElementById('score-inp');
  const scoreCls = document.getElementById('score-cls');
  const scoreGeo = document.getElementById('score-geo');
  const scoreSchema = document.getElementById('score-schema');

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const url = chip.getAttribute('data-url');
      if (urlInput && url) urlInput.value = url;
      triggerScan(url);
    });
  });

  if (scanBtn) {
    scanBtn.addEventListener('click', () => {
      const url = urlInput ? urlInput.value.trim() : 'cloud9websolutions.com';
      triggerScan(url);
    });
  }

  function triggerScan(targetDomain) {
    if (!progressWrap || !progressFill || !progressStatus) return;

    progressWrap.classList.add('active');
    if (statusTag) {
      statusTag.textContent = 'STATUS // AUDITING...';
      statusTag.style.color = 'var(--neon-cyan)';
      statusTag.style.borderColor = 'rgba(0, 240, 255, 0.4)';
    }

    if (scanBtn) scanBtn.disabled = true;

    const stages = [
      { pct: '25%', text: `Resolving DNS & Anycast Edge for ${targetDomain}...` },
      { pct: '55%', text: 'Benchmarking LCP, INP & Zero Cumulative Layout Shift...' },
      { pct: '85%', text: 'Parsing JSON-LD Entity Graph & AI Citation Index (GEO)...' },
      { pct: '100%', text: `Audit Completed! 100/100 Core Vitals & SEO Score Validated.` }
    ];

    stages.forEach((stage, idx) => {
      setTimeout(() => {
        progressFill.style.width = stage.pct;
        progressStatus.textContent = stage.text;
        if (window.cloud9Audio) window.cloud9Audio.playTone(550 + idx * 80, 0.06, 'sine');

        if (idx === stages.length - 1) {
          setTimeout(() => {
            if (statusTag) {
              statusTag.textContent = 'STATUS // 100/100 VERIFIED';
              statusTag.style.color = 'var(--neon-green)';
              statusTag.style.borderColor = 'rgba(0, 255, 136, 0.4)';
            }
            if (scanBtn) scanBtn.disabled = false;
            if (scoreTotal) scoreTotal.textContent = '100';
            if (scoreRating) scoreRating.textContent = 'Grade A+ (Elite 0.1% Web Speed)';
            if (scoreLcp) scoreLcp.textContent = '0.24s';
            if (scoreInp) scoreInp.textContent = '8ms';
            if (scoreCls) scoreCls.textContent = '0.00';
            if (scoreGeo) scoreGeo.textContent = '98/100';
            if (scoreSchema) scoreSchema.textContent = '100%';

            showToast(`SEO Audit Complete for ${targetDomain}! 100/100 Score Achieved 🚀`);
            if (window.cloud9Audio) window.cloud9Audio.playSuccessChime();
          }, 400);
        }
      }, idx * 450);
    });
  }
}

// ==========================================================================
// 8. LOGO DESIGN & BRAND ARCHETYPE STUDIO ENGINE
// ==========================================================================
function initBrandStudioArchetypes() {
  const tabs = document.querySelectorAll('.archetype-tab');
  const iconDisplay = document.getElementById('brand-icon-display');
  const nameDisplay = document.getElementById('brand-name-display');
  const taglineDisplay = document.getElementById('brand-tagline-display');
  const geometryVal = document.getElementById('brand-geometry-val');
  const fontVal = document.getElementById('brand-font-val');
  const swatchesGrid = document.getElementById('brand-swatches-grid');

  const archetypeData = {
    cyber: {
      name: 'SYNTHETIX AI',
      tagline: 'NEURAL INTELLIGENCE ENGINE',
      geometry: 'Hexagonal Golden Ratio',
      font: 'Syne Display 800',
      svg: `
        <svg viewBox="0 0 100 100" class="brand-svg-mark">
          <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="none" stroke="#00F0FF" stroke-width="3"/>
          <polygon points="50,20 75,35 75,65 50,80 25,65 25,35" fill="rgba(0, 240, 255, 0.15)" stroke="#00F0FF" stroke-width="2"/>
          <circle cx="50" cy="50" r="10" fill="#00F0FF"/>
        </svg>
      `,
      swatches: [
        { name: 'Cyber Cyan', hex: '#00F0FF' },
        { name: 'Nebula Violet', hex: '#7928CA' },
        { name: 'Obsidian Core', hex: '#050714' },
        { name: 'Quantum Green', hex: '#00FF88' }
      ]
    },
    luxe: {
      name: 'CHRONOPULSE',
      tagline: 'HAUTE HORLOGERIE GENEVE',
      geometry: 'Sacred Fibonacci Spiral',
      font: 'Cinzel Serif Bold',
      svg: `
        <svg viewBox="0 0 100 100" class="brand-svg-mark">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#FFD700" stroke-width="2.5"/>
          <circle cx="50" cy="50" r="32" fill="rgba(255, 215, 0, 0.1)" stroke="#FFD700" stroke-width="1.5" stroke-dasharray="4,4"/>
          <polygon points="50,18 62,42 86,50 62,58 50,82 38,58 14,50 38,42" fill="none" stroke="#FFD700" stroke-width="2"/>
          <circle cx="50" cy="50" r="5" fill="#FFD700"/>
        </svg>
      `,
      swatches: [
        { name: 'Champagne Gold', hex: '#FFD700' },
        { name: 'Solar Amber', hex: '#FFA500' },
        { name: 'Royal Obsidian', hex: '#0E1118' },
        { name: 'Platinum Silver', hex: '#E2E8F0' }
      ]
    },
    fintech: {
      name: 'QUANTUM EDGE',
      tagline: 'ALGORITHMIC CAPITAL MESH',
      geometry: 'Delta Tri-Prism Vector',
      font: 'Plus Jakarta Sans 800',
      svg: `
        <svg viewBox="0 0 100 100" class="brand-svg-mark">
          <polygon points="50,10 90,85 10,85" fill="none" stroke="#00FF88" stroke-width="3"/>
          <polygon points="50,30 75,75 25,75" fill="rgba(0, 255, 136, 0.15)" stroke="#00FF88" stroke-width="2"/>
          <line x1="50" y1="10" x2="50" y2="85" stroke="#00FF88" stroke-width="2" stroke-dasharray="3,3"/>
          <circle cx="50" cy="55" r="7" fill="#00FF88"/>
        </svg>
      `,
      swatches: [
        { name: 'Emerald Alpha', hex: '#00FF88' },
        { name: 'Deep Cobalt', hex: '#0070F3' },
        { name: 'Titanium Slate', hex: '#1E293B' },
        { name: 'Midnight Void', hex: '#050714' }
      ]
    },
    astral: {
      name: 'ORBIT SPATIAL',
      tagline: 'METAVERSE 3D STUDIOS',
      geometry: 'Planetary Eclipse Ring',
      font: 'Space Grotesk Bold',
      svg: `
        <svg viewBox="0 0 100 100" class="brand-svg-mark">
          <circle cx="50" cy="50" r="28" fill="rgba(255, 0, 128, 0.2)" stroke="#FF0080" stroke-width="3"/>
          <ellipse cx="50" cy="50" rx="44" ry="18" fill="none" stroke="#7928CA" stroke-width="2.5" transform="rotate(-25 50 50)"/>
          <circle cx="78" cy="38" r="6" fill="#00F0FF"/>
        </svg>
      `,
      swatches: [
        { name: 'Cosmic Magenta', hex: '#FF0080' },
        { name: 'Astral Purple', hex: '#7928CA' },
        { name: 'Aurora Cyan', hex: '#00F0FF' },
        { name: 'Dark Void', hex: '#0A051B' }
      ]
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const archetypeKey = tab.getAttribute('data-archetype') || 'cyber';
      const data = archetypeData[archetypeKey];

      if (data) {
        if (iconDisplay) iconDisplay.innerHTML = data.svg;
        if (nameDisplay) nameDisplay.textContent = data.name;
        if (taglineDisplay) taglineDisplay.textContent = data.tagline;
        if (geometryVal) geometryVal.textContent = data.geometry;
        if (fontVal) fontVal.textContent = data.font;

        if (swatchesGrid) {
          swatchesGrid.innerHTML = data.swatches.map(s => `
            <div class="swatch-card" data-hex="${s.hex}" onclick="navigator.clipboard.writeText('${s.hex}'); if(window.showToast) showToast('Copied ${s.hex} to clipboard!');">
              <div class="swatch-color" style="background: ${s.hex};"></div>
              <div class="swatch-info">
                <div class="swatch-name">${s.name}</div>
                <div class="swatch-hex">${s.hex}</div>
              </div>
            </div>
          `).join('');
        }

        if (window.cloud9Audio) window.cloud9Audio.playTone(650, 0.08, 'sine');
      }
    });
  });
}

// ==========================================================================
// 9. MODAL CLOSING LOGIC
// ==========================================================================
function initModalCloseHandlers() {
  document.querySelectorAll('.modal-close-btn, .modal-overlay').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target === btn || btn.classList.contains('modal-close-btn')) {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }
  });
}

// ==========================================================================
// INITIALIZATION ON DOM READY
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  window.cloud9Audio = new SoundSynthesisEngine();
  window.cloud9Estimator = new ProjectEstimator();
  window.cloud9Portfolio = new PortfolioShowcaseController();
  window.cloud9Reviews = new CustomerReviewsController();

  initWebDesignThemeTransformer();
  initSeoScannerSimulator();
  initBrandStudioArchetypes();
  initContactTerminal();
  initModalCloseHandlers();

  // Run Global Clocks
  updateGlobalClocks();
  setInterval(updateGlobalClocks, 1000);

  // Smooth hash navigation for buttons
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});
