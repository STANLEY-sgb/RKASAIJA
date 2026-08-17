import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import PracticeGrid from '../components/PracticeGrid';
import { PRACTICE_AREAS } from '../data/constants';

const Practice = () => {
  const location = useLocation();
  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => {
    if (location.state?.selectedId) {
      const area = PRACTICE_AREAS.find(a => a.id === location.state.selectedId);
      if (area) {
        setSelectedArea(area);
        // Smooth scroll to detail if needed
        setTimeout(() => {
          const el = document.getElementById('area-detail-view');
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [location]);

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-cream min-h-screen">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-6">§ What we do</div>
          <h1 className="font-serif text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] mb-20 tracking-tight">
            Practice <em className="accent">Areas.</em>
          </h1>
        </motion.div>

        <div className="mb-12">
          <PracticeGrid 
            onSelect={(p) => setSelectedArea(p.id === selectedArea?.id ? null : p)} 
            selectedId={selectedArea?.id}
          />
        </div>

        <AnimatePresence mode="wait">
          {selectedArea && (
            <motion.div 
              id="area-detail-view"
              key={selectedArea.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="p-10 lg:p-20 rounded-3xl relative overflow-hidden bg-gradient-to-br from-[#F6EDDA] to-[#E8D8B4] border border-gold/20"
            >
              <div className="absolute top-8 right-10 font-serif text-[120px] lg:text-[180px] opacity-10 leading-none pointer-events-none select-none">
                {selectedArea.num}
              </div>
              
              <div className="relative z-10">
                <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-6">§ Practice · {selectedArea.num}</div>
                <h2 className="font-serif text-4xl lg:text-6xl mb-10 tracking-tight text-dark max-w-3xl leading-[1.1]">
                  {selectedArea.name}
                </h2>
                <p className="text-[17px] lg:text-[20px] leading-relaxed mb-12 max-w-4xl text-dark/80">
                  {selectedArea.long}
                </p>
                
                <div className="flex flex-wrap items-center gap-8 pt-10 border-t border-gold/30">
                  <div>
                    <div className="font-mono text-[10px] tracking-widest uppercase opacity-60 mb-2">Lead advocate</div>
                    <div className="font-serif text-2xl lg:text-3xl text-dark">{selectedArea.lawyer}</div>
                  </div>
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('open-chat'))}
                    className="btn-primary lg:ml-auto"
                  >
                    <Sparkles size={16} /> Discuss this matter
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Practice;
