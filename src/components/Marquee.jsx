import React from 'react';

const Marquee = () => {
  const items = ["Banking & Finance", "Corporate Law", "Debt Recovery", "Land & Conveyancing", "Intellectual Property", "Arbitration", "Family Law", "Criminal Defence", "Tax Advisory", "Employment Law", "NGO / Non-Profit", "Governance & Compliance"];
  
  return (
    <div className="bg-dark text-cream py-5 overflow-hidden border-y border-darker">
      <div className="flex whitespace-nowrap animate-marquee w-fit hover:[animation-play-state:paused] transition-all duration-300">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center">
            {items.map((item, j) => (
              <div key={j} className="flex items-center gap-6 px-8">
                <span className="font-serif text-xl md:text-2xl italic text-gold">{item}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
