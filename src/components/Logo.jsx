import React from 'react';
import { IMAGES, handleImageError } from '../data/images';

export const Logo = ({ 
  variant = 'light', // 'light' (on cream/white background) or 'dark' (on dark background)
  size = 'md',        // 'sm', 'md', 'lg'
  showText = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { img: 'w-8 h-8', text: 'text-[15px]', sub: 'text-[8px]' },
    md: { img: 'w-10 h-10 lg:w-11 lg:h-11', text: 'text-[16px] sm:text-[18px]', sub: 'text-[9px] sm:text-[10px]' },
    lg: { img: 'w-14 h-14 lg:w-16 lg:h-16', text: 'text-[22px] sm:text-[24px]', sub: 'text-[11px] sm:text-[12px]' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const isDarkVariant = variant === 'dark';

  return (
    <div className={`flex items-center gap-3 group focus:outline-none ${className}`}>
      <div className={`${currentSize.img} rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ring-1 ${isDarkVariant ? 'bg-cream ring-gold/50' : 'bg-dark ring-gold/30'} group-hover:scale-105 transition-transform duration-300`}>
        <img 
          src={IMAGES.logo.src}
          alt={IMAGES.logo.alt}
          loading="eager"
          width="44"
          height="44"
          className="w-full h-full object-cover"
          onError={(e) => handleImageError(e, IMAGES.logo.fallback)}
        />
      </div>
      {showText && (
        <div className="leading-none">
          <div className={`font-serif ${currentSize.text} font-medium tracking-tight ${isDarkVariant ? 'text-cream' : 'text-dark'}`}>
            R. Kasaija <span className="text-gold-mid font-serif italic">&</span> Partners
          </div>
          <div className={`font-mono ${currentSize.sub} tracking-[0.22em] uppercase mt-1 ${isDarkVariant ? 'text-cream/60' : 'opacity-55 text-dark'}`}>
            Advocates · Kampala
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
