import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, ArrowUpRight, CheckCircle2, UserCheck, Calendar } from 'lucide-react';
import PracticeGrid from '../components/PracticeGrid';
import { PRACTICE_AREAS } from '../data/constants';

const Practice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    if (location.state?.selectedId) {
      const area = PRACTICE_AREAS.find(a => a.id === location.state.selectedId);
      if (area) {
        setSelectedArea(area);
        setTimeout(() => {
          const el = document.getElementById('area-detail-view');
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [location]);

  const categories = ['All', 'Corporate & Finance', 'Dispute Resolution', 'Land & IP', 'Civil & Labour'];

  const filterCategoryMap = {
    'Corporate & Finance': ['banking', 'corporate', 'tax', 'compliance'],
    'Dispute Resolution': ['adr', 'criminal', 'debt'],
    'Land & IP': ['land', 'ip'],
    'Civil & Labour': ['family', 'employment', 'ngo'],
  };

  const filteredAreas = PRACTICE_AREAS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.lawyer.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'All') return matchesSearch;
    const catIds = filterCategoryMap[activeCategory] || [];
    return matchesSearch && catIds.includes(p.id);
  });

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-cream min-h-screen">
      <div className="container-custom">
        
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mb-12"
        >
          <div className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-gold-mid mb-4 font-semibold">
            § Full Practice Disciplines
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,7vw,6rem)] leading-[0.96] mb-6 tracking-tight text-dark font-medium">
            Twelve Disciplines.<br /><em className="accent">One Legal Standard.</em>
          </h1>
          <p className="text-base sm:text-lg text-dark/75 leading-relaxed font-sans max-w-2xl">
            Explore our practice capabilities across commercial, financial, regulatory, dispute resolution, and private client matters. Select any discipline to view specialized counsel details.
          </p>
        </motion.div>

        {/* Search & Category Filter Controls */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" size={18} />
            <input 
              type="text"
              placeholder="Search practice areas or advocate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gold/25 rounded-2xl text-sm outline-none focus:border-gold-mid transition-all shadow-sm text-dark placeholder:text-dark/40"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-dark text-cream font-semibold shadow-sm'
                    : 'bg-light/60 text-dark/70 hover:bg-gold/20 hover:text-dark'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid View */}
        <div className="mb-16">
          {filteredAreas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/20 rounded-2xl overflow-hidden shadow-sm border border-gold/20">
              {filteredAreas.map((p, i) => (
                <motion.button 
                  key={p.id} 
                  onClick={() => setSelectedArea(p.id === selectedArea?.id ? null : p)}
                  className={`pcard group text-left p-6 sm:p-8 lg:p-10 transition-all duration-500 relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                    selectedArea?.id === p.id ? 'bg-dark text-cream' : 'bg-cream text-dark hover:bg-gold/5'
                  }`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gold-mid transition-transform duration-500 origin-left ${
                    selectedArea?.id === p.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className={`font-mono text-[11px] tracking-widest ${
                        selectedArea?.id === p.id ? 'text-gold' : 'text-gold-mid font-semibold'
                      }`}>
                        {p.num}
                      </span>
                      <ArrowUpRight 
                        className={`w-4 h-4 transition-all ${
                          selectedArea?.id === p.id ? 'text-gold translate-x-0.5 -translate-y-0.5' : 'text-dark/40 group-hover:text-gold-mid'
                        }`} 
                      />
                    </div>

                    <h3 className="font-serif text-[22px] sm:text-[24px] mb-3 leading-tight tracking-tight font-medium">
                      {p.name}
                    </h3>
                    <p className="text-[13.5px] opacity-75 leading-relaxed mb-6 line-clamp-3">
                      {p.desc}
                    </p>
                  </div>

                  <div className={`pt-4 border-t flex items-center justify-between font-mono text-[10px] tracking-widest uppercase ${
                    selectedArea?.id === p.id ? 'border-cream/15 text-cream/60' : 'border-gold/20 text-dark/60'
                  }`}>
                    <span>Lead Advocate</span>
                    <span className={selectedArea?.id === p.id ? 'text-gold' : 'text-gold-mid font-medium'}>{p.lawyer}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-gold/15 text-dark/60 font-serif">
              No practice area found matching "{searchQuery}".
            </div>
          )}
        </div>

        {/* Detailed Expanded View Drawer / Section */}
        <AnimatePresence mode="wait">
          {selectedArea && (
            <motion.div 
              id="area-detail-view"
              key={selectedArea.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.4 }}
              className="p-8 sm:p-12 lg:p-16 rounded-3xl relative overflow-hidden bg-gradient-to-br from-[#F6EDDA] via-[#EFE0C2] to-[#E8D8B4] border border-gold/25 shadow-xl"
            >
              <div className="absolute top-6 right-8 font-serif text-[100px] sm:text-[140px] lg:text-[180px] opacity-[0.08] leading-none pointer-events-none select-none font-bold">
                {selectedArea.num}
              </div>
              
              <div className="relative z-10 max-w-4xl">
                <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-4 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold-mid" />
                  Detailed Scope · Practice {selectedArea.num}
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-6 tracking-tight text-dark font-medium leading-tight">
                  {selectedArea.name}
                </h2>
                <p className="text-base sm:text-lg lg:text-xl leading-relaxed mb-10 text-dark/85 font-sans">
                  {selectedArea.long}
                </p>
                
                <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-gold/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-dark text-gold flex items-center justify-center font-serif text-sm">
                      <UserCheck size={18} />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-widest uppercase opacity-60">Lead Advocate</div>
                      <div className="font-serif text-xl text-dark font-medium">{selectedArea.lawyer}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 sm:ml-auto">
                    <button 
                      onClick={() => navigate('/book', { state: { area: selectedArea.name, lawyer: selectedArea.lawyer } })}
                      className="btn-primary text-xs py-3 px-5"
                    >
                      <Calendar size={14} /> Book for {selectedArea.name}
                    </button>
                    <button 
                      onClick={() => window.dispatchEvent(new CustomEvent('open-chat'))}
                      className="btn-outline border-dark text-dark text-xs py-3 px-5 hover:bg-dark hover:text-cream"
                    >
                      <Sparkles size={14} className="text-gold-mid" /> AI Assistant Intake
                    </button>
                  </div>
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
