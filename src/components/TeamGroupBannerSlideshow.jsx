import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGES, handleImageError } from '../data/images';
import { Users } from 'lucide-react';

const TeamGroupBannerSlideshow = ({ slides = IMAGES.teamGroupSlides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cycle between group photos at a calm 5-second interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div className="relative aspect-[16/10] sm:aspect-[21/9] md:aspect-[2.2/1] w-full overflow-hidden bg-[#0A0502]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id || currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <picture className="w-full h-full block">
            <source media="(min-width: 768px)" srcSet={currentSlide.src} />
            <img
              src={currentSlide.srcMd || currentSlide.src}
              alt={currentSlide.title}
              loading="eager"
              decoding="async"
              onError={(e) => handleImageError(e, currentSlide.fallbackOriginal || currentSlide.fallback)}
              className="w-full h-full object-cover"
              style={{ objectPosition: currentSlide.objectPosition || 'center 30%' }}
            />
          </picture>
        </motion.div>
      </AnimatePresence>
      
      {/* Soft Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/35 to-transparent opacity-90 pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/50 via-transparent to-dark/50 pointer-events-none z-[1]" />

      {/* Floating Badge & Caption Info */}
      <div className="absolute bottom-5 sm:bottom-8 left-5 sm:left-8 right-5 sm:right-8 flex flex-col md:flex-row md:items-end justify-between gap-3 z-10 text-white">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 backdrop-blur-md rounded-full border border-gold/40 text-gold font-mono text-[10px] sm:text-[11px] uppercase tracking-widest mb-2 shadow-md">
            <Users size={13} /> {currentSlide.badge}
          </div>
          <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl text-cream font-medium tracking-tight">
            {currentSlide.title}
          </h3>
        </div>

        {/* 2-Slide Visual Indicator Dots */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold/30 self-start md:self-auto">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
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
