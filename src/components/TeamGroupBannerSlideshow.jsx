import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGES, handleImageError } from '../data/images';
import { Users } from 'lucide-react';

const TeamGroupBannerSlideshow = ({ slides = IMAGES.teamGroupSlides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically cycle between the 2 official group photos every 2 seconds (2000ms count)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div className="relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[2.2/1] w-full overflow-hidden bg-[#0A0502]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentSlide.id || currentIndex}
          initial={{ 
            opacity: 0, 
            scale: 0.95,
            clipPath: 'circle(25% at 50% 50%)',
            filter: 'blur(4px)'
          }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            clipPath: 'circle(120% at 50% 50%)',
            filter: 'blur(0px)'
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.95,
            clipPath: 'circle(10% at 50% 50%)',
            filter: 'blur(4px)'
          }}
          transition={{ 
            duration: 0.5, 
            ease: [0.22, 1, 0.36, 1] 
          }}
          className="absolute inset-0 w-full h-full transform-gpu"
        >
          <picture className="w-full h-full block">
            <source media="(min-width: 768px)" srcSet={currentSlide.src} />
            <img
              src={currentSlide.srcMd || currentSlide.src}
              alt={currentSlide.title}
              loading="eager"
              decoding="async"
              onError={(e) => handleImageError(e, currentSlide.fallbackOriginal || currentSlide.fallback)}
              className="w-full h-full object-cover transition-all duration-700"
              style={{ objectPosition: currentSlide.objectPosition || 'center 30%' }}
            />
          </picture>
        </motion.div>
      </AnimatePresence>
      
      {/* Subtle Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/30 to-transparent opacity-90 pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/60 via-transparent to-dark/60 pointer-events-none z-[1]" />

      {/* Floating Badge & Caption Info */}
      <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col md:flex-row md:items-end justify-between gap-4 z-10 text-white">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-gold/20 backdrop-blur-md rounded-full border border-gold/40 text-gold font-mono text-[10px] sm:text-[11px] uppercase tracking-widest mb-2 shadow-md">
            <Users size={13} /> {currentSlide.badge}
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-cream font-medium tracking-tight">
            {currentSlide.title}
          </h3>
        </div>

        {/* 2-Slide Visual Indicator Dots */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold/30">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-6 bg-gold' : 'w-2 bg-white/40'
              }`}
              aria-label={`Show team photo ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamGroupBannerSlideshow;
