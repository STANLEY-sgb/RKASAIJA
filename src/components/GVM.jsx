import React from 'react';
import { motion } from 'framer-motion';

const GVM = () => {
  const cards = [
    { h: "Goal", t: "To provide exceptional, affordable, quality legal consultancy and advisory services to our clientele with a diligent and professional touch.", n: "01" },
    { h: "Vision", t: "To be a one-stop centre law firm in East Africa and beyond.", n: "02" },
    { h: "Mission", t: "To provide excellent legal services in a professional manner that meets our clients' needs.", n: "03" },
  ];

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-px bg-gold/20">
          {cards.map((card, i) => (
            <motion.div 
              key={i} 
              className="p-10 lg:p-14 bg-cream transition-all duration-500 hover:bg-gold/5 group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-10">
                <span className="font-mono text-[10px] tracking-widest uppercase text-gold-mid">Our {card.h}</span>
                <span className="font-mono text-xs opacity-30 group-hover:opacity-100 transition-opacity">{card.n}</span>
              </div>
              <p className="font-serif text-[22px] lg:text-[24px] leading-snug text-dark">
                {card.t}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GVM;
