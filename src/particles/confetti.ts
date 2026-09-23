/**
 * Celebratory Particle Engine for Loji's Birthday Reveal.
 * Generates delicate rose petals, golden stardust, and antique parchment fragments.
 * Optimized for mobile GPUs with a single requestAnimationFrame Canvas loop.
 * Automatically halts when settled to conserve battery and CPU.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: 'petal' | 'dust' | 'parchment';
  color: string;
  rotation: number;
  rotationSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
  fadeSpeed: number;
  life: number;
  maxLife: number;
}

export class PoeticCelebration {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private isRunning = false;
  private animFrameId: number | null = null;
  private width = 0;
  private height = 0;

  // Curated vintage color palette
  private petalColors = ['#491F26', '#642933', '#7F3644', '#994455', '#6D2B37'];
  private goldColors = ['#CBB48C', '#A48A62', '#D4AF37', '#DFBE70', '#EFE3B5'];
  private paperColors = ['#F0E8DA', '#E5DCBE', '#D6C8A4', '#ECE3D1'];

  constructor(targetCanvas: HTMLCanvasElement) {
    this.canvas = targetCanvas;
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D context is not supported');
    }
    this.ctx = context;
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
  }

  private resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.resetTransform?.();
    this.ctx.scale(dpr, dpr);
  }

  public burst(count = 70): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const isMobile = this.width < 600;
    const adjustedCount = isMobile ? Math.min(count, 45) : count;

    for (let i = 0; i < adjustedCount; i++) {
      this.particles.push(this.createParticle());
    }

    if (!this.isRunning) {
      this.isRunning = true;
      this.tick();
    }
  }

  private createParticle(): Particle {
    const rand = Math.random();
    let type: 'petal' | 'dust' | 'parchment';
    let color: string;
    let size: number;

    if (rand < 0.45) {
      type = 'petal';
      color = this.petalColors[Math.floor(Math.random() * this.petalColors.length)];
      size = 8 + Math.random() * 8;
    } else if (rand < 0.8) {
      type = 'dust';
      color = this.goldColors[Math.floor(Math.random() * this.goldColors.length)];
      size = 2 + Math.random() * 3.5;
    } else {
      type = 'parchment';
      color = this.paperColors[Math.floor(Math.random() * this.paperColors.length)];
      size = 6 + Math.random() * 6;
    }

    return {
      x: Math.random() * this.width,
      y: -20 - Math.random() * (this.height * 0.3),
      vx: (Math.random() - 0.5) * 1.5,
      vy: 1.2 + Math.random() * 2.2,
      size,
      type,
      color,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.03,
      opacity: 0.8 + Math.random() * 0.2,
      fadeSpeed: 0.002 + Math.random() * 0.003,
      life: 0,
      maxLife: 260 + Math.random() * 140
    };
  }

  private tick = (): void => {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.life++;
      p.wobble += p.wobbleSpeed;
      p.rotation += p.rotationSpeed;
      p.x += p.vx + Math.sin(p.wobble) * 1.1;
      p.y += p.vy;

      if (p.life > p.maxLife * 0.7) {
        p.opacity -= p.fadeSpeed;
      }

      if (p.y > this.height + 30 || p.opacity <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
      this.ctx.fillStyle = p.color;

      if (p.type === 'petal') {
        // Draw organic curved rose petal
        this.ctx.beginPath();
        const w = p.size * 0.7;
        const h = p.size;
        this.ctx.moveTo(0, -h / 2);
        this.ctx.bezierCurveTo(w, -h / 4, w, h / 3, 0, h / 2);
        this.ctx.bezierCurveTo(-w, h / 3, -w, -h / 4, 0, -h / 2);
        this.ctx.fill();
      } else if (p.type === 'dust') {
        // Draw soft glowing gold dot/star
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Draw antique rectangular parchment scrap with irregular aspect
        const w = p.size;
        const h = p.size * 0.6;
        this.ctx.fillRect(-w / 2, -h / 2, w, h);
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animFrameId = requestAnimationFrame(this.tick);
    } else {
      this.isRunning = false;
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  };

  public stop(): void {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.particles = [];
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
