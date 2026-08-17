import React from 'react';
import { motion } from 'framer-motion';
import { STAFF } from '../data/constants';

const Team = () => {
  return (
    <div className="pt-24 lg:pt-32 pb-32 bg-cream min-h-screen">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-6">§ Our people</div>
          <h1 className="font-serif text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] mb-20 tracking-tight">
            The team behind<br />every <em className="accent">matter.</em>
          </h1>
        </motion.div>

        {/* Staff Grid - 3 Columns on LG, 2 on MD, 1 on SM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {STAFF.map((s, i) => {
            return (
              <motion.div 
                key={i} 
                className="flex flex-col rounded-3xl bg-white border border-gold/15 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(42,29,16,0.12)] transition-all duration-500 group overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
              >
                {/* Image Section with Badge */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  {/* Role Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1.5 bg-gold/90 backdrop-blur-md text-dark text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm border border-white/20">
                      {s.role.split(' — ')[0]}
                    </span>
                  </div>

                  <img 
                    src={s.photo} 
                    alt={s.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Gradient Overlay for Name */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-90" />
                  
                  <div className="absolute bottom-6 left-6 right-6 z-10">
                    <h3 className="font-serif text-3xl text-white tracking-tight mb-1">{s.name}</h3>
                    <div className="text-[12px] text-gold font-medium uppercase tracking-widest opacity-90">{s.role}</div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="mb-6">
                    <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-gold-mid mb-3 font-bold">Practice Focus</div>
                    <p className="text-[14px] font-bold text-dark leading-snug tracking-tight uppercase">
                      {s.focus}
                    </p>
                  </div>
                  
                  <div className="mb-8 flex-grow">
                    <p className="text-[14px] text-dark/60 leading-relaxed group-hover:text-dark/80 transition-colors">
                      {s.bio}
                    </p>
                  </div>

                  {/* Credentials Pills */}
                  <div className="flex flex-wrap gap-2 mt-auto pt-6 border-t border-gold/10">
                    {s.creds.map((cred, j) => (
                      <span key={j} className="text-[10px] px-3 py-1 bg-[#F9F6F0] text-dark/70 font-semibold border border-gold/10 rounded-md">
                        {cred}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Closing Quote */}
        <motion.div 
          className="mt-32 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="w-12 h-[1px] bg-gold-mid mx-auto mb-10 opacity-30" />
          <p className="font-serif text-2xl text-dark leading-relaxed italic opacity-80">
            "We approach clients' problems with business acumen — time is money, and we embrace efficiency in every transaction."
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Team;
