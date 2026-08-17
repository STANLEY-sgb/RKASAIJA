import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Mail, Award, CheckCircle2 } from 'lucide-react';
import { STAFF } from '../data/constants';
import { IMAGES, handleImageError } from '../data/images';

import TeamGroupBannerSlideshow from '../components/TeamGroupBannerSlideshow';

const Team = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 lg:pt-32 pb-32 bg-cream min-h-screen">
      <div className="container-custom">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mb-12"
        >
          <div className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-gold-mid mb-4 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold inline-block" />
            <span>§ Legal Professionals &amp; Advocates</span>
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[0.96] mb-6 tracking-tight text-dark font-medium">
            Experienced Counsel.<br /><em className="accent">Dedicated Advocates.</em>
          </h1>
          <p className="text-base sm:text-lg text-dark/75 leading-relaxed font-sans max-w-2xl">
            Our team combines senior legal expertise, Canadian/US justice advocacy training, and ICAMEK arbitration accreditation with dedicated associate support across corporate, litigation, and transactional practice.
          </p>
        </motion.div>

        {/* Prominent Official Dual Team Photo Banner (2s fluctuating cycle) */}
        <motion.div
          className="mb-20 rounded-[24px] sm:rounded-[32px] overflow-hidden bg-dark border border-gold/25 shadow-2xl relative group"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <TeamGroupBannerSlideshow />
        </motion.div>


        {/* Staff Grid - 3 Columns on LG, 2 on MD, 1 on SM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {STAFF.map((staffMember, i) => {
            const roleBadge = staffMember.role.split(' — ')[0];
            
            return (
              <motion.div 
                key={i} 
                className="flex flex-col rounded-3xl bg-white border border-gold/20 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              >
                {/* Image Portrait Box */}
                <div className="relative aspect-[4/5] overflow-hidden bg-dark">
                  {/* Role Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-dark/90 backdrop-blur-md text-gold text-[10px] font-mono uppercase tracking-widest rounded-lg border border-gold/30 shadow-md">
                      {roleBadge}
                    </span>
                  </div>

                  <img 
                    src={staffMember.photo} 
                    alt={staffMember.name}
                    loading="lazy" 
                    onError={(e) => handleImageError(e, staffMember.fallback || IMAGES.patterns.remove)}
                    className="w-full h-full object-cover object-[center_15%] transition-transform duration-500 group-hover:scale-103"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-85 pointer-events-none" />
                  
                  <div className="absolute bottom-5 left-5 right-5 z-10 text-cream">
                    <h3 className="font-serif text-2xl sm:text-3xl text-white tracking-tight font-medium mb-1">
                      {staffMember.name}
                    </h3>
                    <div className="text-[12px] font-mono text-gold uppercase tracking-widest font-medium">
                      {staffMember.role}
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Practice Focus */}
                    <div className="mb-4">
                      <div className="font-mono text-[9.5px] tracking-widest uppercase text-gold-mid mb-1.5 font-semibold">
                        Practice Focus
                      </div>
                      <p className="text-[13px] font-semibold text-dark leading-snug tracking-tight">
                        {staffMember.focus}
                      </p>
                    </div>
                    
                    {/* Bio */}
                    <p className="text-[14px] text-dark/70 leading-relaxed mb-6">
                      {staffMember.bio}
                    </p>
                  </div>

                  <div>
                    {/* Credentials Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-6 pt-4 border-t border-gold/15">
                      {staffMember.creds.map((cred, j) => (
                        <span 
                          key={j} 
                          className="text-[10.5px] px-2.5 py-1 bg-light/70 text-dark/80 font-medium border border-gold/15 rounded-md"
                        >
                          {cred}
                        </span>
                      ))}
                    </div>

                    {/* Booking Action Button */}
                    <button 
                      onClick={() => navigate('/book', { state: { lawyer: staffMember.name } })}
                      className="w-full btn-outline text-xs py-2.5 border-gold/40 text-dark hover:bg-dark hover:text-cream justify-center"
                    >
                      <Calendar size={13} />
                      Book Consultation with {staffMember.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Closing Quote Banner */}
        <motion.div 
          className="mt-24 p-10 rounded-3xl bg-light/50 border border-gold/20 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-12 h-0.5 bg-gold-mid mx-auto mb-6 opacity-40" />
          <p className="font-serif text-xl sm:text-2xl text-dark leading-relaxed italic">
            "We approach every legal issue with business acumen — combining high ethical integrity, technical precision, and practical outcome focus."
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Team;
