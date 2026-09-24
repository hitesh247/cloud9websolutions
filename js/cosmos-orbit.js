/**
 * CLOUD9 WEB SOLUTIONS - TECH COSMOS & ORBITAL TELEMETRY HUD
 * Interactive planetary solar system showcasing modern full-stack architectures.
 */

const TECH_DATABASE = {
  nextjs: {
    name: "Next.js 15+ & React 19",
    category: "Full-Stack Architecture",
    icon: "⚡",
    description: "Enterprise-grade SSR, Server Actions, and Instant Streaming with Turbopack compilation. Guarantees 100/100 Core Web Vitals and zero cumulative layout shift.",
    metrics: {
      speed: "0.24s FCP",
      uptime: "99.99%",
      render: "Hybrid SSR / Edge",
      security: "Strict CSP"
    },
    features: ["Streaming Hydration", "Edge Middleware", "Automatic Image Optimization", "Turbopack Build Engine"]
  },
  threejs: {
    name: "Three.js & WebGL 2 / WebGPU",
    category: "3D & Immersive Experiences",
    icon: "🌐",
    description: "Buttery 60fps spatial 3D environments, GLSL fragment shaders, interactive particle clouds, and physics-driven spatial interactions that captivate visitors.",
    metrics: {
      framerate: "60 - 120 FPS",
      shaders: "GLSL 3.0",
      memory: "Sub-40MB Peak",
      lighting: "PBR & Raymarching"
    },
    features: ["Custom Shader Materials", "GPU Particle Simulations", "Morph Targets", "Post-Processing Pipelines"]
  },
  typescript: {
    name: "TypeScript 5.x",
    category: "Type Safety & Velocity",
    icon: "🛡️",
    description: "End-to-end static type enforcement preventing runtime exceptions across complex multi-tier enterprise systems and real-time collaborative applications.",
    metrics: {
      coverage: "100% Strict",
      errors: "0 Run-time Type Bugs",
      refactor: "Instant Autocomplete",
      dx: "Top Tier"
    },
    features: ["Generics & Discriminated Unions", "Zod Schema Validation", "tRPC Full-Stack Contracts", "Zero Overhead"]
  },
  pythonai: {
    name: "Python AI & Agentic RAG",
    category: "Artificial Intelligence & Agents",
    icon: "🤖",
    description: "Deep integration with Gemini Interactions API, custom autonomous LLM agents, vector embeddings, and real-time knowledge synthesis pipelines.",
    metrics: {
      tokenSpeed: "180+ tok/sec",
      ragLatency: "<450ms",
      accuracy: "99.2%",
      models: "Gemini Pro / Flash"
    },
    features: ["Autonomous Function Calling", "Real-time Vector Search", "Multi-modal Processing", "Self-Healing Workflows"]
  },
  wasm: {
    name: "WebAssembly & Rust",
    category: "High-Octane Edge Compute",
    icon: "🦀",
    description: "Near-native binary execution inside modern browser engines and cloud workers for intensive image processing, crypto encryption, and simulation crunching.",
    metrics: {
      speed: "10x vs Standard JS",
      coldStart: "<5ms",
      footprint: "<120KB Binary",
      safety: "Memory-Safe Rust"
    },
    features: ["SIMD Acceleration", "Multi-threading Web Workers", "Zero Garbage Collection", "Hardware Decryption"]
  },
  supabase: {
    name: "Supabase & Postgres Vector",
    category: "Realtime Data Layer",
    icon: "🗄️",
    description: "Postgres database paired with pgvector for lightning-fast similarity lookups, real-time WebSocket subscriptions, and granular Row-Level Security (RLS).",
    metrics: {
      querySpeed: "<8ms avg",
      realtimeSync: "<20ms",
      pgvector: "HNSW Indexing",
      auth: "OAuth / Passkeys"
    },
    features: ["Row Level Security", "Realtime WebSockets", "Automated Backups", "Edge Database Functions"]
  },
  aws: {
    name: "Cloudflare & AWS Edge Mesh",
    category: "Global Infrastructure",
    icon: "☁️",
    description: "300+ point-of-presence global CDN edge mesh delivering localized microsecond caching, instant SSL termination, and advanced DDoS shields.",
    metrics: {
      edgeLatency: "<12ms Global",
      ddosShield: "Terabit Scale",
      sla: "99.999% Uptime",
      pops: "330+ Edge Nodes"
    },
    features: ["Anycast Routing", "Zero-Trust Architecture", "WAF Rulesets", "Instant Serverless Scaling"]
  },
  tailwind: {
    name: "Tailwind CSS & CSS Next",
    category: "Modern UI Engineering",
    icon: "🎨",
    description: "Zero-runtime utility engine coupled with native modern CSS view transitions, container queries, and hardware-accelerated fluid typography.",
    metrics: {
      bundleSize: "<12KB Gzipped",
      renderTime: "0ms JIT",
      responsive: "Fluid Clamping",
      themes: "Dynamic Glassmorphism"
    },
    features: ["Container Queries", "Subgrid Layouts", "Scroll-Driven Timelines", "Dark-Mode First System"]
  }
};

class TechCosmosController {
  constructor() {
    this.orbitWrapper = document.querySelector('.orbit-system-wrapper');
    this.hudContainer = document.querySelector('.cosmos-hud');
    this.coreBtn = document.querySelector('.cosmos-core');
    this.techNodes = document.querySelectorAll('.tech-node');
    this.currentTechKey = 'nextjs';
    this.autoCycleTimer = null;
    this.keys = Object.keys(TECH_DATABASE);

    if (this.orbitWrapper && this.hudContainer) {
      this.init();
    }
  }

  init() {
    this.positionNodes();
    this.bindEvents();
    this.updateHUD('nextjs');
  }

  positionNodes() {
    // 8 nodes distributed across 3 orbital rings
    const ringConfig = [
      { ring: 1, radiusPercent: 22.5, nodes: ['nextjs', 'threejs', 'typescript'] },
      { ring: 2, radiusPercent: 37.5, nodes: ['pythonai', 'supabase', 'wasm'] },
      { ring: 3, radiusPercent: 50.0, nodes: ['aws', 'tailwind'] }
    ];

    ringConfig.forEach(cfg => {
      const angleStep = (Math.PI * 2) / cfg.nodes.length;
      cfg.nodes.forEach((key, index) => {
        const nodeEl = document.querySelector(`.tech-node[data-tech="${key}"]`);
        if (!nodeEl) return;

        const angle = angleStep * index - (Math.PI / 2);
        const xPercent = 50 + cfg.radiusPercent * Math.cos(angle);
        const yPercent = 50 + cfg.radiusPercent * Math.sin(angle);

        nodeEl.style.left = `${xPercent}%`;
        nodeEl.style.top = `${yPercent}%`;
        nodeEl.style.transform = 'translate(-50%, -50%)';
      });
    });
  }

  bindEvents() {
    this.techNodes.forEach(node => {
      node.addEventListener('click', (e) => {
        const key = node.getAttribute('data-tech');
        if (key && TECH_DATABASE[key]) {
          this.setActiveNode(key);
          this.playHapticSound();
        }
      });

      node.addEventListener('mouseenter', (e) => {
        const key = node.getAttribute('data-tech');
        if (key && TECH_DATABASE[key]) {
          this.setActiveNode(key);
        }
      });
    });

    if (this.coreBtn) {
      this.coreBtn.addEventListener('click', () => {
        const currentIndex = this.keys.indexOf(this.currentTechKey);
        const nextIndex = (currentIndex + 1) % this.keys.length;
        const nextKey = this.keys[nextIndex];
        this.setActiveNode(nextKey);
        this.playHapticSound();
      });
    }
  }

  setActiveNode(key) {
    this.currentTechKey = key;
    this.techNodes.forEach(n => {
      if (n.getAttribute('data-tech') === key) {
        n.classList.add('active');
      } else {
        n.classList.remove('active');
      }
    });

    this.updateHUD(key);
  }

  updateHUD(key) {
    const data = TECH_DATABASE[key];
    if (!data) return;

    const hudName = document.querySelector('.hud-name');
    const hudCategory = document.querySelector('.hud-category');
    const hudDesc = document.querySelector('.hud-desc');
    const hudIcon = document.querySelector('.hud-icon');
    const hudMetricsContainer = document.querySelector('.hud-metrics');

    if (hudName) hudName.textContent = data.name;
    if (hudCategory) hudCategory.textContent = data.category;
    if (hudDesc) hudDesc.textContent = data.description;
    if (hudIcon) hudIcon.textContent = data.icon;

    if (hudMetricsContainer) {
      hudMetricsContainer.innerHTML = '';
      Object.entries(data.metrics).forEach(([label, val]) => {
        const box = document.createElement('div');
        box.className = 'hud-metric-box';
        box.innerHTML = `
          <div class="hud-metric-label">${label}</div>
          <div class="hud-metric-val">${val}</div>
        `;
        hudMetricsContainer.appendChild(box);
      });
    }
  }

  playHapticSound() {
    if (window.cloud9Audio && window.cloud9Audio.enabled) {
      window.cloud9Audio.playTone(650, 0.08, 'sine');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.techCosmos = new TechCosmosController();
});
