import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-darker text-cream pt-20 pb-10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse at top, #B8956A 0%, transparent 60%)" }}></div>
      
      <div className="container-custom relative">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-mid flex items-center justify-center overflow-hidden">
                <img 
                  src="/RKASAIJA/assets/img/firm_logo.jpeg" 
                  alt="Logo" 
                  loading="eager"
                  width="48"
                  height="48"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/RKASAIJA/assets/img/remove.png';
                  }}
                />
              </div>
            </div>
            <h3 className="font-serif text-4xl md:text-5xl leading-none mb-6 tracking-tight">
              Counsel, <em className="accent !text-gold">considered.</em>
            </h3>
            <p className="text-[15px] opacity-55 leading-relaxed max-w-md">
              Indigenous Ugandan firm serving domestic and international clientele across East Africa and beyond.
            </p>
          </div>

          {/* Visit Column */}
          <div className="lg:col-span-2">
            <div className="font-mono text-[10px] tracking-widest uppercase opacity-45 mb-6">Visit</div>
            <p className="text-[14px] opacity-85 leading-relaxed">
              Plot 75 Kampala Road<br />
              E-Tower Building<br />
              4th Floor, Suite D-06<br />
              P.O. Box 70643<br />
              Kampala, Uganda
            </p>
          </div>

          {/* Direct Column */}
          <div className="lg:col-span-2">
            <div className="font-mono text-[10px] tracking-widest uppercase opacity-45 mb-6">Direct</div>
            <div className="flex flex-col gap-2.5 text-[14px]">
              <a href="tel:+256772418707" className="opacity-80 hover:opacity-100 hover:text-gold transition-all duration-300 w-fit">+256 772 418 707</a>
              <a href="tel:+256776044004" className="opacity-80 hover:opacity-100 hover:text-gold transition-all duration-300 w-fit">+256 776 044 004</a>
              <a href="mailto:kasaijaandpartners@gmail.com" className="opacity-80 hover:opacity-100 hover:text-gold transition-all duration-300 w-fit mt-3">kasaijaandpartners@gmail.com</a>
            </div>
          </div>

          {/* Links Column */}
          <div className="lg:col-span-2">
            <div className="font-mono text-[10px] tracking-widest uppercase opacity-45 mb-6">Quick Links</div>
            <div className="flex flex-col gap-3">
              {['About the Firm', 'Practice Areas', 'Our Team', 'Book Appointment'].map((label) => (
                <button 
                  key={label}
                  onClick={() => {
                    const paths = { 'About the Firm': '/about', 'Practice Areas': '/practice', 'Our Team': '/team', 'Book Appointment': '/book' };
                    window.location.href = paths[label];
                  }}
                  className="text-cream font-sans text-[13px] opacity-70 text-left hover:opacity-100 hover:text-gold transition-all duration-300"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-gold/15 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] opacity-45">
          <div>© 2026 R. Kasaija & Partners Advocates. All rights reserved.</div>
          <div className="font-mono tracking-wider">ULS · EALS · ICAMEK</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
