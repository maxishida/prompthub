/**
 * Optimized Cyberpunk Particles Effect
 * Ultra-lightweight floating neon particles for cyberpunk theme
 * Performance-optimized with smart rendering and memory management
 */

class CyberpunkParticles {
  constructor(options = {}) {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationId = null;
    this.isRunning = true;
    this.isVisible = true;
    this.performanceMonitor = {
      frameCount: 0,
      lastCheck: Date.now(),
      avgFPS: 60,
      lowPerformanceCount: 0,
      skipFrames: 0
    };
    
    // Ultra-optimized Configuration
    this.config = {
      particleCount: options.particleCount || 15, // Further reduced
      particleSize: options.particleSize || 1,
      particleSpeed: options.particleSpeed || 0.15,
      colors: options.colors || [
        '#00ff00', // Primary Neon Green
        '#39ff14', // Bright Green
        '#00ff41'  // Electric Green
      ],
      opacity: options.opacity || 0.3,
      connectionDistance: options.connectionDistance || 50, // Further reduced
      showConnections: options.showConnections !== false,
      maxFPS: 20, // Lower frame rate for better performance
      maxConnections: 1, // Limit connections per particle
      enableVisibilityOptimization: true
    };
    
    this.lastTime = 0;
    this.frameInterval = 1000 / this.config.maxFPS;
    this.throttledResize = this.throttle(this.handleResize.bind(this), 250);
    this.throttledMouseMove = this.throttle(this.handleMouseMove.bind(this), 50);
    
    this.init();
  }
  
  init() {
    this.createCanvas();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }
  
  createCanvas() {
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'cyberpunk-particles';
    this.canvas.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2; /* acima do conteúdo, abaixo de overlays (topbar tem z-10) */
      opacity: 0.45;
      mix-blend-mode: screen;
    `;
    
    // Insert canvas as first child of body
    document.body.appendChild(this.canvas);
    document.body.style.overflowX = 'hidden'
    
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    this.particles = [];
    
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.config.particleSpeed,
        vy: (Math.random() - 0.5) * this.config.particleSpeed,
        size: Math.random() * this.config.particleSize + 1,
        color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
        opacity: Math.random() * this.config.opacity + 0.3,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }
  
  updateParticles() {
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Wrap around screen edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Update pulse for glow effect
      particle.pulse += 0.02;
    });
  }
  
  drawParticles() {
    // Batch particle rendering for better performance
    this.ctx.save();
    
    this.particles.forEach(particle => {
      const glowIntensity = Math.sin(particle.pulse) * 0.5 + 0.5;
      const currentOpacity = particle.opacity * glowIntensity;
      
      // Minimize context state changes - avoid expensive shadow operations
      this.ctx.globalAlpha = currentOpacity;
      this.ctx.fillStyle = particle.color;
      
      // Use simpler rendering without expensive shadow effects
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    this.ctx.restore();
  }
  
  drawConnections() {
    // Limit connections to improve performance
    const maxConnections = Math.min(this.config.maxConnections, 3);
    let connectionCount = 0;
    
    this.ctx.save();
    this.ctx.lineWidth = 0.8;
    
    for (let i = 0; i < this.particles.length && connectionCount < maxConnections; i++) {
      for (let j = i + 1; j < this.particles.length && connectionCount < maxConnections; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distanceSquared = dx * dx + dy * dy; // Avoid sqrt for performance
        const maxDistanceSquared = this.config.connectionDistance * this.config.connectionDistance;
        
        if (distanceSquared < maxDistanceSquared) {
          const distance = Math.sqrt(distanceSquared);
          const opacity = (1 - distance / this.config.connectionDistance) * 0.2;
          
          this.ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
           this.ctx.beginPath();
           this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
           this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
          
          connectionCount++;
        }
      }
    }
    
    this.ctx.restore();
  }
  
  animate(currentTime = 0) {
    // Check if animation should continue
    if (!this.isRunning || !this.isVisible) return;
    
    // FPS control with frame skipping
    if (currentTime - this.lastTime < this.frameInterval) {
      this.animationId = requestAnimationFrame((time) => this.animate(time));
      return;
    }
    
    // Skip frame if browser is struggling to prevent forced reflow
    const deltaTime = currentTime - this.lastTime;
    if (deltaTime > 50) { // More than 50ms indicates performance issues
      this.lastTime = currentTime;
      this.animationId = requestAnimationFrame((time) => this.animate(time));
      return;
    }
    
    this.lastTime = currentTime;
    
    // Performance monitoring with adaptive quality
    this.performanceMonitor.frameCount++;
    const now = Date.now();
    if (now - this.performanceMonitor.lastCheck > 2000) { // Check every 2 seconds for less overhead
      const fps = (this.performanceMonitor.frameCount * 1000) / (now - this.performanceMonitor.lastCheck);
      this.performanceMonitor.avgFPS = fps;
      this.performanceMonitor.frameCount = 0;
      this.performanceMonitor.lastCheck = now;
      
      // Adaptive quality based on performance
      if (fps < 10) { // Lower threshold for better stability
        this.performanceMonitor.lowPerformanceCount++;
        if (this.performanceMonitor.lowPerformanceCount > 2) {
          console.warn('Cyberpunk particles paused due to sustained low performance');
          this.pause();
          return;
        }
        // Reduce quality
        this.config.showConnections = false;
        this.config.particleCount = Math.max(5, Math.floor(this.config.particleCount * 0.7));
      } else if (fps > 18 && this.performanceMonitor.lowPerformanceCount > 0) {
        // Gradually restore quality
        this.performanceMonitor.lowPerformanceCount = Math.max(0, this.performanceMonitor.lowPerformanceCount - 1);
      }
    }
    
    // Skip frames for better performance if needed
    if (this.performanceMonitor.avgFPS < 12) {
      this.performanceMonitor.skipFrames++;
      if (this.performanceMonitor.skipFrames % 3 === 0) { // Skip more frames when performance is poor
        this.animationId = requestAnimationFrame((time) => this.animate(time));
        return;
      }
    }
    
    // Use try-catch to prevent crashes from affecting scroll performance
    try {
      // Clear canvas efficiently
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Update and draw with performance optimizations
      this.updateParticles();
      if (this.config.showConnections && this.performanceMonitor.avgFPS > 12) {
        this.drawConnections();
      }
      this.drawParticles();
    } catch (error) {
      console.warn('Animation error:', error);
      this.pause();
      return;
    }
    
    // Continue animation
    this.animationId = requestAnimationFrame((time) => this.animate(time));
  }
  
  pause() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  resume() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  }
  
  bindEvents() {
    // Throttled resize handler
    window.addEventListener('resize', this.throttledResize, { passive: true });
    
    // Visibility API for performance optimization
    if (this.config.enableVisibilityOptimization) {
      document.addEventListener('visibilitychange', () => {
        this.isVisible = !document.hidden;
        if (!this.isVisible) {
          this.pause();
        } else {
          this.resume();
        }
      });
    }
    
    // Throttled mouse interaction
    document.addEventListener('mousemove', this.throttledMouseMove, { passive: true });
    
    // Optimized scroll handling to prevent forced reflow
    let scrollTimeout;
    let isScrolling = false;
    
    const handleScrollStart = this.debounce(() => {
      if (this.isRunning && !isScrolling) {
        isScrolling = true;
        this.pause();
      }
    }, 16); // ~60fps
    
    const handleScrollEnd = this.debounce(() => {
      if (isScrolling) {
        isScrolling = false;
        if (!this.isRunning) this.resume();
      }
    }, 200);
    
    const optimizedScrollHandler = () => {
      handleScrollStart();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollEnd, 200);
    };
    
    window.addEventListener('scroll', optimizedScrollHandler, { 
      passive: true,
      capture: false 
    });
  }
  
  handleResize() {
    this.resizeCanvas();
    this.createParticles();
  }
  
  handleMouseMove(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Simplified mouse interaction with fewer calculations
    const maxDistance = 80;
    const maxDistanceSquared = maxDistance * maxDistance;
    
    for (let i = 0; i < Math.min(this.particles.length, 5); i++) {
      const particle = this.particles[i];
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distanceSquared = dx * dx + dy * dy;
      
      if (distanceSquared < maxDistanceSquared) {
        const distance = Math.sqrt(distanceSquared);
        const force = (maxDistance - distance) / maxDistance;
        particle.vx += (dx / distance) * force * 0.005;
        particle.vy += (dy / distance) * force * 0.005;
        
        // Limit velocity
        const maxVel = this.config.particleSpeed * 1.5;
        particle.vx = Math.max(-maxVel, Math.min(maxVel, particle.vx));
        particle.vy = Math.max(-maxVel, Math.min(maxVel, particle.vy));
      }
    }
  }
  
  throttle(func, limit) {
    let inThrottle;
    let rafId;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          func.apply(context, args);
        });
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
  
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  destroy() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    // Remove event listeners
    window.removeEventListener('resize', this.throttledResize);
    document.removeEventListener('mousemove', this.throttledMouseMove);
    
    // Remove canvas
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
      document.body.style.removeProperty('overflow')
    }
    
    // Clear references
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
  }
}

// Auto-initialize when DOM is loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize particles with optimized green neon settings
    window.cyberpunkParticles = new CyberpunkParticles({
      particleCount: 35,
      particleSize: 1.5,
      particleSpeed: 0.3,
      showConnections: true,
      connectionDistance: 80,
      opacity: 0.6,
      maxFPS: 45
    });
  });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CyberpunkParticles;
}