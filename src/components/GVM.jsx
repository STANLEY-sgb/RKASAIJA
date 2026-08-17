import React from 'react';
import { motion } from 'framer-motion';

const GVM = () => {
  const cards = [
    { 
      title: "Goal", 
      text: "To provide exceptional, affordable, quality legal consultancy and advisory services to our clientele with a diligent, personalized, and professional touch.", 
      num: "01" 
    },
    { 
      title: "Vision", 
      text: "To be a premier, trusted one-stop legal services centre in East Africa and beyond, known for legal excellence and ethical integrity.", 
      num: "02" 
    },
    { 
      title: "Mission", 
      text: "To deliver diligent, result-oriented legal counsel that protects clients' interests, fosters commercial growth, and upholds justice.", 
      num: "03" 
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-cream">
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-px bg-gold/20 rounded-2xl overflow-hidden shadow-sm border border-gold/20">
          {cards.map((card, i) => (
            <motion.div 
              key={i} 
              className="p-8 sm:p-10 lg:p-12 bg-cream transition-all duration-500 hover:bg-gold/5 group flex flex-col justify-between"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-[11px] tracking-widest uppercase text-gold-mid font-semibold">
                  Firm {card.title}
                </span>
                <span className="font-mono text-xs opacity-40 group-hover:opacity-100 group-hover:text-gold transition-all">
                  {card.num}
                </span>
              </div>
              <p className="font-serif text-[20px] sm:text-[22px] lg:text-[24px] leading-snug text-dark">
                {card.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GVM;
