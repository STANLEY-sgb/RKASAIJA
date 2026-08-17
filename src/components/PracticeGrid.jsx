import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PRACTICE_AREAS } from '../data/constants';
import { handleImageError } from '../data/images';

const PracticeGrid = ({ limit = 12, onSelect = null, selectedId = null }) => {
  const navigate = useNavigate();
  const displayAreas = PRACTICE_AREAS.slice(0, limit);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayAreas.map((p, i) => (
        <motion.div 
          key={p.id} 
          onClick={() => {
            if (onSelect) {
              onSelect(p);
            } else {
              navigate('/practice', { state: { selectedId: p.id } });
            }
          }}
          className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 ${
            selectedId === p.id 
              ? 'border-gold bg-dark text-cream ring-2 ring-gold/40' 
              : 'border-gold/20 hover:border-gold/50 text-dark'
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
        >
          {/* Card Top Image */}
          <div className="relative aspect-[16/10] overflow-hidden bg-dark/10">
            <img 
              src={p.image} 
              alt={p.name}
              onError={handleImageError}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
            
            {/* Practice Number Badge */}
            <div className="absolute top-3 left-3 bg-dark/80 backdrop-blur-md text-gold px-3 py-1 rounded-full border border-gold/30 font-mono text-[11px] font-bold tracking-widest shadow-md">
              {p.num}
            </div>

            {/* Top Right Arrow */}
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cream/90 text-dark flex items-center justify-center shadow-md group-hover:bg-gold group-hover:text-dark transition-colors duration-300">
              <ArrowUpRight size={16} />
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <h3 className={`font-serif text-xl mb-2 font-medium leading-snug group-hover:text-gold-mid transition-colors ${
                selectedId === p.id ? 'text-gold' : 'text-dark'
              }`}>
                {p.name}
              </h3>
              <p className={`text-xs leading-relaxed line-clamp-3 mb-4 ${
                selectedId === p.id ? 'text-cream/70' : 'text-dark/70'
              }`}>
                {p.desc}
              </p>
            </div>

            {/* Card Footer CTA */}
            <div className={`pt-4 border-t flex items-center justify-between text-[11px] font-sans font-medium transition-colors ${
              selectedId === p.id ? 'border-cream/15 text-gold' : 'border-gold/15 text-dark/80 group-hover:text-gold-mid'
            }`}>
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-gold" />
                {p.lawyer}
              </span>
              <span className="underline decoration-gold/40 underline-offset-4 font-semibold group-hover:decoration-gold">
                View Details
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PracticeGrid;
