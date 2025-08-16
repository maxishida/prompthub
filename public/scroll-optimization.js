/**
 * Scroll Optimization Script
 * Fixes forced reflow and scroll performance issues
 */

(function() {
  'use strict';
  
  // Prevent forced reflow during scroll
  let isScrolling = false;
  let scrollRAF = null;
  let lastScrollTop = 0;
  
  // Optimize scroll performance
  function optimizeScrollPerformance() {
    // Add CSS containment for better performance
    const style = document.createElement('style');
    style.textContent = `
      /* Prevent layout thrashing */
      body {
        contain: layout style paint;
        will-change: scroll-position;
      }
      
      /* Optimize scroll containers */
      .scroll-container {
        contain: layout style paint;
        transform: translateZ(0); /* Force GPU acceleration */
      }
      
      /* Prevent reflow during animations */
      .particle-canvas {
        contain: layout style paint;
        will-change: transform;
        pointer-events: none;
      }
      
      /* Optimize fixed elements */
      .fixed-element {
        contain: layout style;
        will-change: transform;
      }
      
      /* Reduce paint complexity */
      * {
        backface-visibility: hidden;
        perspective: 1000px;
      }
      
      /* Optimize text rendering */
      body, * {
        text-rendering: optimizeSpeed;
        -webkit-font-smoothing: subpixel-antialiased;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Debounced scroll handler
  function handleScroll() {
    if (scrollRAF) {
      cancelAnimationFrame(scrollRAF);
    }
    
    // Se o DevTools estiver aberto, reduza a pressão de raf
    const raf = (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined') ? (cb) => setTimeout(cb, 32) : requestAnimationFrame;
    scrollRAF = raf(() => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Only process if scroll position actually changed
      if (Math.abs(currentScrollTop - lastScrollTop) > 1) {
        lastScrollTop = currentScrollTop;
        
        // Pause expensive animations during scroll
        if (window.cyberpunkParticles && !isScrolling) {
          isScrolling = true;
          window.cyberpunkParticles.pause();
        }
      }
      
      scrollRAF = null;
    });
  }
  
  // Resume animations after scroll ends
  let scrollEndTimer;
  function handleScrollEnd() {
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      if (isScrolling) {
        isScrolling = false;
        if (window.cyberpunkParticles) {
          window.cyberpunkParticles.resume();
        }
      }
    }, 250);
  }
  
  // Optimize resize handling
  let resizeRAF = null;
  function handleResize() {
    if (resizeRAF) {
      cancelAnimationFrame(resizeRAF);
    }
    
    resizeRAF = requestAnimationFrame(() => {
      // Batch DOM reads and writes
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Update canvas size if particles exist
      if (window.cyberpunkParticles) {
        window.cyberpunkParticles.handleResize(width, height);
      }
      
      resizeRAF = null;
    });
  }
  
  // Prevent layout thrashing from extensions
  function preventExtensionInterference() {
    // Override problematic methods that cause forced reflow
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    let getBoundingClientRectCalls = 0;
    const maxCallsPerFrame = 10;
    
    Element.prototype.getBoundingClientRect = function() {
      getBoundingClientRectCalls++;
      
      // Throttle excessive calls
      if (getBoundingClientRectCalls > maxCallsPerFrame) {
        // Return cached result or approximate
        return this._cachedBoundingRect || {
          top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0
        };
      }
      
      const result = originalGetBoundingClientRect.call(this);
      this._cachedBoundingRect = result;
      return result;
    };
    
    // Reset counter every frame
    function resetCallCounter() {
      getBoundingClientRectCalls = 0;
      requestAnimationFrame(resetCallCounter);
    }
    resetCallCounter();
  }
  
  // Initialize optimizations
  function init() {
    // Apply CSS optimizations
    optimizeScrollPerformance();
    
    // Set up optimized event listeners
    window.addEventListener('scroll', handleScroll, { 
      passive: true, 
      capture: false 
    });
    
    window.addEventListener('scroll', handleScrollEnd, { 
      passive: true, 
      capture: false 
    });
    
    window.addEventListener('resize', handleResize, { 
      passive: true 
    });
    
    // Prevent extension interference
    preventExtensionInterference();
    
    // Monitor performance
    if (window.performanceMonitor) {
      console.log('Scroll optimization initialized with performance monitoring');
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Export for debugging
  window.scrollOptimization = {
    isScrolling: () => isScrolling,
    forceResume: () => {
      isScrolling = false;
      if (window.cyberpunkParticles) {
        window.cyberpunkParticles.resume();
      }
    }
  };
  
})();