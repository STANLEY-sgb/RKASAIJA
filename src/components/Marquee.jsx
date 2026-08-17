import React from 'react';

const Marquee = () => {
  const items = [
    "Banking & Finance", 
    "Corporate & Commercial", 
    "Debt Recovery", 
    "Land & Conveyancing", 
    "Intellectual Property", 
    "Arbitration & ADR", 
    "Family & Probate", 
    "Criminal Defence", 
    "Revenue Law & Taxation", 
    "Employment & Labour", 
    "Non-Profit & NGO", 
    "Governance & Compliance"
  ];
  
  return (
    <div className="bg-dark text-cream py-4 sm:py-5 overflow-hidden border-y border-gold/20 select-none">
      <div className="flex whitespace-nowrap animate-marquee w-fit hover:[animation-play-state:paused] transition-all duration-300">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center">
            {items.map((item, j) => (
              <div key={j} className="flex items-center gap-4 sm:gap-6 px-6 sm:px-8">
                <span className="font-serif text-lg sm:text-xl italic text-gold font-normal">{item}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold/40 flex-shrink-0" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
