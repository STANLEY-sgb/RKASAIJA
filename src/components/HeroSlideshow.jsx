import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGES, handleImageError } from '../data/images';

const HeroSlideshow = ({ slides = IMAGES.heroSlides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect user preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  // Advance to next slide
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  // Slideshow auto-advance interval: 5 seconds display per slide
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Preload next slide image in background to ensure zero loading flash
  useEffect(() => {
    const nextIdx = (currentIndex + 1) % slides.length;
    const nextSlideObj = slides[nextIdx];
    if (nextSlideObj) {
      const img = new Image();
      img.src = nextSlideObj.src;
      if (nextSlideObj.srcSm) {
        const imgSm = new Image();
        imgSm.src = nextSlideObj.srcSm;
      }
    }
  }, [currentIndex, slides]);

  const currentSlide = slides[currentIndex] || slides[0];

  // Motion animation variants for alternating natural movement after reveal
  const getSecondaryMotion = (type) => {
    if (prefersReducedMotion) {
      return { scale: 1, x: 0, y: 0 };
    }
    switch (type) {
      case 'panLeft':
        return { scale: [1.015, 1.0], x: ['-0.8%', '0%'] };
      case 'zoomOut':
        return { scale: [1.025, 1.0], x: '0%' };
      case 'panRight':
        return { scale: [1.0, 1.015], x: ['0%', '0.8%'] };
      case 'restrainedZoomOut':
        // Specially tuned for full team photograph so everyone remains visible
        return { scale: [1.01, 1.0], x: '0%' };
      case 'zoomIn':
      default:
        return { scale: [1.0, 1.025], x: '0%' };
    }
  };

  return (
    <div 
      className="absolute inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden bg-[#0A0502]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Advocate Portraits & Team Bubble Slideshow"
      role="region"
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentSlide.id || currentIndex}
          initial={prefersReducedMotion ? { opacity: 0 } : { 
            opacity: 0, 
            scale: 0.35,
            clipPath: 'circle(10% at 50% 50%)',
            borderRadius: '50%',
            filter: 'blur(6px)'
          }}
          animate={prefersReducedMotion ? { opacity: 1 } : { 
            opacity: 1, 
            scale: 1,
            clipPath: 'circle(120% at 50% 50%)',
            borderRadius: '0%',
            filter: 'blur(0px)'
          }}
          exit={prefersReducedMotion ? { opacity: 0 } : { 
            opacity: 0, 
            scale: 0.85,
            clipPath: 'circle(5% at 50% 50%)',
            filter: 'blur(4px)'
          }}
          transition={{ 
            duration: 0.9, 
            ease: [0.22, 1, 0.36, 1], // Premium smooth morph cubic-bezier
          }}
          className="absolute inset-0 w-full h-full transform-gpu"
          style={{ willChange: "transform, opacity, clip-path" }}
        >
          {/* Luminous Glass Bubble Border Glow Ring (Visible during reveal) */}
          <motion.div 
            className="absolute inset-0 pointer-events-none z-10 border-2 border-gold/40 shadow-[0_0_50px_rgba(184,149,106,0.35)] rounded-full opacity-0"
            initial={{ opacity: 0.9, scale: 0.4 }}
            animate={{ opacity: 0, scale: 1.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          <motion.picture 
            className="w-full h-full block"
            animate={getSecondaryMotion(currentSlide.motionType)}
            transition={{ duration: 5.1, ease: "linear" }}
          >
            {currentSlide.srcSm && (
              <source media="(max-width: 640px)" srcSet={currentSlide.srcSm} />
            )}
            <img
              src={currentSlide.src}
              alt={currentSlide.alt}
              loading={currentIndex === 0 ? "eager" : "lazy"}
              fetchPriority={currentIndex === 0 ? "high" : "auto"}
              decoding="async"
              onError={(e) => handleImageError(e, currentSlide.fallback || currentSlide.fallbackOriginal)}
              className="w-full h-full object-cover transition-opacity duration-300"
              style={{
                objectPosition: currentSlide.objectPosition || 'center 15%',
                imageRendering: 'auto',
              }}
            />
          </motion.picture>
        </motion.div>
      </AnimatePresence>

      {/* Subtle Dark Gradient Overlay (Guarantees hero text contrast without heavy blur) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0502]/95 via-[#0A0502]/70 to-[#0A0502]/45 pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0502] via-transparent to-[#0A0502]/30 pointer-events-none z-[1]" />

      {/* Active Slide Advocate / Team Badge (Bottom Right) */}
      <div className="absolute bottom-16 right-6 sm:right-12 z-10 hidden md:flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-gold/30 shadow-lg">
        <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
        <span className="font-serif text-xs text-cream tracking-wide">{currentSlide.name}</span>
        <span className="text-gold/40 text-xs">•</span>
        <span className="font-mono text-[10px] text-gold/80 uppercase tracking-widest">{currentSlide.title}</span>
      </div>

      {/* Interactive Slide Indicators (Dots ● ○ ○ ○ ○ ○ for all 6 slides) */}
      <div className="absolute bottom-16 left-6 sm:left-12 lg:left-[calc((100vw-1280px)/2+2rem)] z-10 flex items-center gap-2.5">
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.id || idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}: ${slide.name}`}
              aria-current={isActive ? 'true' : 'false'}
              className="group relative py-2 focus:outline-none cursor-pointer transition-all duration-300"
            >
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'w-8 bg-gold shadow-[0_0_12px_rgba(184,149,106,0.7)]' 
                    : 'w-2 bg-white/40 group-hover:bg-white/70'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HeroSlideshow;
