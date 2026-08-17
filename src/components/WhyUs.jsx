import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Briefcase, Users, Award } from 'lucide-react';

const WhyUs = () => {
  const items = [
    { 
      icon: Shield, 
      h: "Ethical Integrity", 
      t: "Professional ethics upheld with timely responses and transparent dealing at every stage." 
    },
    { 
      icon: Briefcase, 
      h: "Business Acumen", 
      t: "Cost-conscious, strategic, value-driven — your outcomes are our north star, not billable hours." 
    },
    { 
      icon: Users, 
      h: "ADR-First", 
      t: "Alternative dispute resolution to save you time, money, and reputation. Litigation when necessary." 
    },
    { 
      icon: Award, 
      h: "Collective Responsibility", 
      t: "Team approach with a dedicated expert lead for every matter — no silos, no dropped balls." 
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-br from-[#1D1007] via-[#0D0804] to-[#1B1005] text-cream relative overflow-hidden">
      <div className="container-custom relative z-10">
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="font-mono text-[10px] tracking-widest uppercase text-gold mb-4">§ Why R. Kasaija & Partners</div>
          <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-tight">
            Different by <em className="accent !text-gold">principle,</em><br />not by promise.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {items.map((item, i) => (
            <motion.div 
              key={i} 
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-mid flex items-center justify-center mb-8 shadow-[0_8px_24px_-8px_rgba(184,149,106,0.45)] group-hover:shadow-[0_16px_40px_-10px_rgba(184,149,106,0.6)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <item.icon className="text-darker" size={24} />
              </div>
              <div className="font-serif text-2xl mb-4 tracking-tight group-hover:text-gold transition-colors">{item.h}</div>
              <p className="text-sm opacity-65 leading-relaxed group-hover:opacity-100 transition-opacity duration-300">
                {item.t}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
