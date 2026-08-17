import React from 'react';
import { IMAGES, handleImageError } from '../data/images';

const HeroSlideshow = ({ slides = IMAGES.heroSlides }) => {
  // Duplicate slides array to guarantee a seamless, continuous infinite marquee loop
  const marqueeSlides = [...slides, ...slides];

  return (
    <div 
      className="w-full max-w-full overflow-hidden relative group select-none py-2"
      aria-label="Advocate Portraits & Legal Team Continuous Horizontal Marquee Carousel"
      role="region"
    >
      {/* Soft gradient edge masks for elegant entering and exiting */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 md:w-32 bg-gradient-to-r from-[#0A0502] via-[#0A0502]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 md:w-32 bg-gradient-to-l from-[#0A0502] via-[#0A0502]/80 to-transparent z-10 pointer-events-none" />

      {/* Pure CSS Continuous Horizontal Marquee (Right -> Left) */}
      <div className="animate-hero-marquee flex items-center gap-4 sm:gap-6">
        {marqueeSlides.map((slide, idx) => {
          const isGroupPhoto = slide.isTeamPic || slide.id?.includes('team');

          return (
            <div
              key={`${slide.id || idx}-${idx}`}
              className={`shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden border border-gold/25 bg-[#140C06] relative shadow-xl transition-all duration-300 hover:border-gold/60 group/card ${
                isGroupPhoto 
                  ? 'w-[320px] sm:w-[440px] md:w-[540px] lg:w-[620px] h-[300px] sm:h-[380px] md:h-[420px] lg:h-[460px]' 
                  : 'w-[230px] sm:w-[280px] md:w-[320px] lg:w-[360px] h-[300px] sm:h-[380px] md:h-[420px] lg:h-[460px]'
              }`}
            >
              {/* Advocate / Team Image Presentation */}
              <picture className="w-full h-full block">
                {slide.srcSm && (
                  <source media="(max-width: 640px)" srcSet={slide.srcSm} />
                )}
                <img
                  src={slide.src}
                  alt={slide.alt || slide.name}
                  loading={idx < 4 ? "eager" : "lazy"}
                  decoding="async"
                  onError={(e) => handleImageError(e, slide.fallback || slide.fallbackOriginal)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                  style={{
                    objectPosition: slide.objectPosition || (isGroupPhoto ? 'center 30%' : 'center 15%'),
                  }}
                />
              </picture>

              {/* Gradient Bottom Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/35 to-transparent opacity-90 pointer-events-none" />

              {/* Card Label Badge */}
              <div className="absolute bottom-4 left-4 right-4 z-10 text-cream">
                <div className="font-mono text-[9.5px] sm:text-[10.5px] text-gold uppercase tracking-widest font-medium mb-0.5">
                  {slide.title}
                </div>
                <h3 className="font-serif text-base sm:text-lg md:text-xl text-cream font-medium tracking-tight line-clamp-1">
                  {slide.name}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeroSlideshow;
