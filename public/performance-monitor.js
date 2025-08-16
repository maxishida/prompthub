/**
 * Performance Monitor for Cyberpunk Theme
 * Monitors FPS, detects performance issues, and provides optimization suggestions
 */

class PerformanceMonitor {
  constructor(options = {}) {
    this.enabled = options.enabled !== false;
    this.showUI = options.showUI || false;
    this.logToConsole = options.logToConsole !== false;
    
    this.metrics = {
      fps: 60,
      frameTime: 0,
      memoryUsage: 0,
      scrollEvents: 0,
      resizeEvents: 0,
      violations: []
    };
    
    this.thresholds = {
      lowFPS: 30,
      highFrameTime: 16.67, // 60fps = 16.67ms per frame
      maxScrollEvents: 10, // per second
      maxResizeEvents: 5   // per second
    };
    
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.lastCheck = Date.now();
    
    if (this.enabled) {
      this.init();
    }
  }
  
  init() {
    this.setupFPSMonitoring();
    this.setupScrollOptimization();
    this.setupResizeOptimization();
    this.setupViolationDetection();
    
    if (this.showUI) {
      this.createUI();
    }
    
    // Start monitoring
    this.startMonitoring();
  }
  
  setupFPSMonitoring() {
    const measureFPS = (currentTime) => {
      this.frameCount++;
      const deltaTime = currentTime - this.lastTime;
      this.metrics.frameTime = deltaTime;
      
      // Calculate FPS every second
      if (currentTime - this.lastCheck >= 1000) {
        this.metrics.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastCheck));
        this.frameCount = 0;
        this.lastCheck = currentTime;
        
        // Check for performance issues
        this.checkPerformance();
      }
      
      this.lastTime = currentTime;
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }
  
  setupScrollOptimization() {
    let scrollCount = 0;
    let scrollTimeout;
    
    const resetScrollCount = () => {
      if (scrollCount > this.thresholds.maxScrollEvents) {
        this.logViolation('Excessive scroll events', { count: scrollCount });
      }
      scrollCount = 0;
    };
    
    window.addEventListener('scroll', () => {
      scrollCount++;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(resetScrollCount, 1000);
    }, { passive: true });
    
    // Reset count every second
    setInterval(resetScrollCount, 1000);
  }
  
  setupResizeOptimization() {
    let resizeCount = 0;
    let resizeTimeout;
    
    const resetResizeCount = () => {
      if (resizeCount > this.thresholds.maxResizeEvents) {
        this.logViolation('Excessive resize events', { count: resizeCount });
      }
      resizeCount = 0;
    };
    
    window.addEventListener('resize', () => {
      resizeCount++;
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resetResizeCount, 1000);
    }, { passive: true });
    
    setInterval(resetResizeCount, 1000);
  }
  
  setupViolationDetection() {
    // Monitor for long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 80) { // more conservative: tasks >80ms
              this.logViolation('Long task detected', {
                duration: entry.duration,
                name: entry.name
              });
            }
          }
        });
        
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.warn('PerformanceObserver not fully supported');
      }
    }
    
    // Monitor memory usage if available
    if ('memory' in performance) {
      setInterval(() => {
        this.metrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
      }, 5000);
    }
  }
  
  checkPerformance() {
    const issues = [];
    
    if (this.metrics.fps < this.thresholds.lowFPS) {
      issues.push(`Low FPS: ${this.metrics.fps}`);
    }
    
    if (this.metrics.frameTime > this.thresholds.highFrameTime) {
      issues.push(`High frame time: ${this.metrics.frameTime.toFixed(2)}ms`);
    }
    
    if (issues.length > 0 && this.logToConsole) {
      console.warn('Performance issues detected:', issues);
      this.suggestOptimizations();
    }
    
    if (this.showUI) {
      this.updateUI();
    }
  }
  
  logViolation(type, details) {
    const violation = {
      type,
      details,
      timestamp: Date.now()
    };
    
    this.metrics.violations.push(violation);
    
    if (this.logToConsole && this.metrics.violations[this.metrics.violations.length - 1]?.type !== type) {
      console.warn(`Performance violation: ${type}`, details);
    }
    
    // Keep only last 10 violations
    if (this.metrics.violations.length > 10) {
      this.metrics.violations.shift();
    }
  }
  
  suggestOptimizations() {
    const suggestions = [];
    
    if (this.metrics.fps < 20) {
      suggestions.push('Consider disabling particle animations');
      suggestions.push('Reduce the number of animated elements');
    }
    
    if (this.metrics.frameTime > 20) {
      suggestions.push('Use CSS transforms instead of changing layout properties');
      suggestions.push('Debounce scroll and resize event handlers');
    }
    
    if (this.metrics.violations.some(v => v.type.includes('scroll'))) {
      suggestions.push('Implement virtual scrolling for long lists');
      suggestions.push('Use passive event listeners for scroll events');
    }
    
    if (suggestions.length > 0) {
      console.group('Performance Optimization Suggestions:');
      suggestions.forEach(suggestion => console.log(`• ${suggestion}`));
      console.groupEnd();
    }
  }
  
  createUI() {
    const ui = document.createElement('div');
    ui.id = 'performance-monitor-ui';
    ui.className = 'performance-monitor';
    ui.innerHTML = `
      <div style="font-family: monospace; font-size: 12px; line-height: 1.4;">
        <div>FPS: <span id="fps-display">--</span></div>
        <div>Frame: <span id="frame-time-display">--</span>ms</div>
        <div>Memory: <span id="memory-display">--</span>MB</div>
        <div>Violations: <span id="violations-display">0</span></div>
      </div>
    `;
    
    document.body.appendChild(ui);
  }
  
  updateUI() {
    const fpsDisplay = document.getElementById('fps-display');
    const frameTimeDisplay = document.getElementById('frame-time-display');
    const memoryDisplay = document.getElementById('memory-display');
    const violationsDisplay = document.getElementById('violations-display');
    
    if (fpsDisplay) {
      fpsDisplay.textContent = this.metrics.fps;
      fpsDisplay.style.color = this.metrics.fps < this.thresholds.lowFPS ? '#ff4444' : '#00ff00';
    }
    
    if (frameTimeDisplay) {
      frameTimeDisplay.textContent = this.metrics.frameTime.toFixed(1);
      frameTimeDisplay.style.color = this.metrics.frameTime > this.thresholds.highFrameTime ? '#ff4444' : '#00ff00';
    }
    
    if (memoryDisplay) {
      memoryDisplay.textContent = this.metrics.memoryUsage.toFixed(1);
    }
    
    if (violationsDisplay) {
      violationsDisplay.textContent = this.metrics.violations.length;
      violationsDisplay.style.color = this.metrics.violations.length > 0 ? '#ff4444' : '#00ff00';
    }
  }
  
  startMonitoring() {
    if (this.logToConsole) {
      console.log('Performance monitoring started');
      console.log('Thresholds:', this.thresholds);
    }
  }
  
  getMetrics() {
    return { ...this.metrics };
  }
  
  destroy() {
    const ui = document.getElementById('performance-monitor-ui');
    if (ui) {
      ui.remove();
    }
  }
}

// Auto-initialize performance monitor
if (typeof window !== 'undefined') {
  // Only enable in development or when explicitly requested
  const enableMonitoring = 
    window.location.search.includes('debug=true') ||
    localStorage.getItem('performance-monitor') === 'true';
  
  if (enableMonitoring) {
    window.performanceMonitor = new PerformanceMonitor({
      enabled: true,
      showUI: window.location.search.includes('perf-ui=true'),
      logToConsole: true
    });
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceMonitor;
}