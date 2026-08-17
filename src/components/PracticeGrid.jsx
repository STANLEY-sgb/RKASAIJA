import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PRACTICE_AREAS } from '../data/constants';

const PracticeGrid = ({ limit = 12, onSelect = null, selectedId = null }) => {
  const navigate = useNavigate();
  const displayAreas = PRACTICE_AREAS.slice(0, limit);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/20">
      {displayAreas.map((p, i) => (
        <motion.button 
          key={p.id} 
          onClick={() => {
            if (onSelect) {
              onSelect(p);
            } else {
              navigate('/practice', { state: { selectedId: p.id } });
            }
          }}
          className={`pcard group text-left p-8 lg:p-12 transition-all duration-500 relative overflow-hidden ${
            selectedId === p.id ? 'bg-dark text-cream' : 'bg-cream text-dark hover:bg-gold/5'
          }`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
        >
          {/* Bottom underline accent */}
          <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gold-mid transition-transform duration-500 origin-left ${
            selectedId === p.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
          }`} />

          <div className="flex items-start justify-between mb-8">
            <span className={`font-mono text-[11px] tracking-widest opacity-40 transition-all duration-500 ${
              selectedId === p.id ? 'opacity-100 text-gold' : 'group-hover:opacity-100 group-hover:text-gold-mid'
            }`}>
              {p.num}
            </span>
            <ArrowUpRight 
              className={`w-4 h-4 transition-all duration-500 ${
                selectedId === p.id ? 'opacity-100 text-gold translate-x-1 -translate-y-1' : 'opacity-40 group-hover:opacity-100 group-hover:text-gold-mid group-hover:translate-x-1 group-hover:-translate-y-1'
              }`} 
            />
          </div>

          <div className="font-serif text-[26px] mb-4 leading-tight tracking-tight">{p.name}</div>
          <p className="text-[13.5px] opacity-65 leading-relaxed mb-8 line-clamp-2">
            {p.desc}
          </p>

          <div className={`pt-6 border-t flex items-center justify-between font-mono text-[10px] tracking-widest uppercase transition-colors duration-500 ${
            selectedId === p.id ? 'border-cream/15 text-cream/50' : 'border-gold/20 text-dark/50'
          }`}>
            <span>Lead</span>
            <span className={selectedId === p.id ? 'text-gold' : 'text-gold-mid font-semibold'}>{p.lawyer}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default PracticeGrid;
