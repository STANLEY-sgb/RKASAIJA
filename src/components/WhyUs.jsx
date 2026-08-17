import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Briefcase, Users, Award } from 'lucide-react';

const WhyUs = () => {
  const items = [
    { 
      icon: Shield, 
      title: "Ethical Integrity", 
      text: "Uncompromising professional ethics, transparent fee structures, and timely communication at every stage of legal representation." 
    },
    { 
      icon: Briefcase, 
      title: "Business Acumen", 
      text: "Cost-conscious, strategic, and commercial — we focus on business outcomes and long-term client goals rather than billable hours." 
    },
    { 
      icon: Users, 
      title: "ADR-First Approach", 
      text: "Member of ICAMEK. We prioritize alternative dispute resolution to save clients time, capital, and public reputation." 
    },
    { 
      icon: Award, 
      title: "Collective Responsibility", 
      text: "Partner-led team approach with dedicated specialist counsel assigned to every client matter — ensuring zero dropped details." 
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-dark text-cream relative overflow-hidden">
      {/* Background Accent */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at center, #B8956A 0%, transparent 70%)" }} 
      />

      <div className="container-custom relative z-10">
        <motion.div 
          className="mb-16 max-w-3xl"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-gold mb-3">
            § Why Choose R. Kasaija & Partners
          </div>
          <h2 className="font-serif text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[0.96] tracking-tight text-[#FDFBF7]">
            Different by <em className="accent !text-gold">principle,</em><br />not by promise.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <motion.div 
              key={i} 
              className="group bg-darker/60 border border-gold/15 p-8 rounded-2xl hover:border-gold/40 transition-all duration-300 flex flex-col justify-between"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center mb-6 group-hover:bg-gold group-hover:text-dark transition-all duration-300">
                  <item.icon className="text-gold group-hover:text-dark transition-colors duration-300" size={22} />
                </div>
                <h3 className="font-serif text-2xl mb-3 tracking-tight text-[#FDFBF7] group-hover:text-gold transition-colors">
                  {item.title}
                </h3>
                <p className="text-[14px] text-cream/70 leading-relaxed">
                  {item.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
