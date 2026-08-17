import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { IMAGES, handleImageError } from '../data/images';
import { STAFF } from '../data/constants';

import TeamGroupBannerSlideshow from './TeamGroupBannerSlideshow';

const TeamSectionShowcase = ({ isFullPage = false }) => {
  const navigate = useNavigate();

  // Take top key advocates for the preview on homepage or display all on full page
  const displayStaff = isFullPage ? STAFF : STAFF.slice(0, 4);

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-cream via-light/30 to-cream relative overflow-hidden border-b border-gold/15">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-gold-mid mb-3 font-semibold flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold inline-block" />
            <span>§ Our Legal Team</span>
          </div>
          <h2 className="font-serif text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.96] tracking-tight text-dark font-medium mb-5">
            Meet the professionals behind<br />
            <em className="accent">R. Kasaija &amp; Partners Advocates</em>
          </h2>
          <p className="text-base sm:text-lg text-dark/75 leading-relaxed font-sans">
            An indigenous Ugandan legal practice defined by senior courtroom advocacy, ICAMEK arbitration accreditation, international justice training, and outcome-oriented commercial counsel.
          </p>
        </motion.div>

        {/* Feature Display: Group Banner */}
        <motion.div
          className="mb-20 rounded-[24px] sm:rounded-[32px] overflow-hidden bg-dark border border-gold/25 shadow-2xl relative group"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <TeamGroupBannerSlideshow />
        </motion.div>

        {/* Individual Advocate Portraits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayStaff.map((member, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-[20px] border border-gold/20 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              {/* Individual Portrait Container with Clean Zoom-Free Reveal */}
              <div className="relative aspect-[4/5] bg-dark overflow-hidden group/portrait shrink-0">
                <img
                  src={member.photo}
                  alt={member.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => handleImageError(e, member.fallback || IMAGES.patterns.remove)}
                  className="w-full h-full object-cover object-[center_15%] transition-transform duration-500 group-hover/portrait:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/25 to-transparent opacity-85 pointer-events-none" />
                
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <h4 className="font-serif text-xl sm:text-2xl text-cream font-medium tracking-tight">
                    {member.name}
                  </h4>
                  <div className="font-mono text-[11px] text-gold uppercase tracking-wider mt-0.5">
                    {member.role.split(' — ')[0]}
                  </div>
                </div>
              </div>

              {/* Card Summary */}
              <div className="p-5 flex flex-col flex-grow justify-between bg-white">
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-gold-mid mb-1 font-semibold">
                    Focus Area
                  </div>
                  <p className="text-[12.5px] font-semibold text-dark leading-snug mb-3">
                    {member.focus}
                  </p>
                  <p className="text-[13px] text-dark/70 line-clamp-3 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gold/15 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-dark/60">
                    {member.creds[0]}
                  </span>
                  <button
                    onClick={() => navigate('/team')}
                    className="text-xs font-serif italic text-gold-mid hover:text-dark font-medium transition-colors cursor-pointer"
                  >
                    View Bio →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button for Homepage preview */}
        {!isFullPage && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => navigate('/team')}
              className="btn-outline border-dark text-dark hover:bg-dark hover:text-cream px-8 py-3.5 text-sm cursor-pointer"
            >
              Explore Full Legal Advocate Directory ({STAFF.length} Advocates)
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TeamSectionShowcase;
