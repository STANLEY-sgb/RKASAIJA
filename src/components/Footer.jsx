import React from 'react';
import { Link } from 'react-router-dom';
import { IMAGES, handleImageError } from '../data/images';
import Logo from './Logo';
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-darker text-cream pt-20 pb-10 overflow-hidden border-t border-gold/20">
      {/* Subtle radial glow overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{ backgroundImage: "radial-gradient(ellipse at top, #B8956A 0%, transparent 65%)" }} 
      />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <Link to="/" className="inline-block mb-6 focus:outline-none focus:ring-2 focus:ring-gold rounded-lg">
              <Logo variant="dark" size="md" />
            </Link>

            <h3 className="font-serif text-3xl sm:text-4xl leading-tight mb-4 tracking-tight text-[#F0E4CE]">
              Counsel, <em className="accent !text-gold">considered.</em>
            </h3>
            <p className="text-[14.5px] text-cream/70 leading-relaxed max-w-md">
              Indigenous Ugandan commercial law firm serving corporate clients, financial institutions, investors, and individuals across East Africa with strategic, business-minded advice.
            </p>
          </div>

          {/* Visit / Location Column */}
          <div className="lg:col-span-3">
            <div className="font-mono text-[10px] tracking-widest uppercase text-gold mb-5 flex items-center gap-2">
              <MapPin size={12} className="text-gold" />
              Office Address
            </div>
            <p className="text-[14px] text-cream/80 leading-relaxed font-sans">
              Plot 75 Kampala Road<br />
              E-Tower Building<br />
              4th Floor, Suite D-06<br />
              P.O. Box 70643<br />
              Kampala, Uganda
            </p>
          </div>

          {/* Direct Contact Column */}
          <div className="lg:col-span-2">
            <div className="font-mono text-[10px] tracking-widest uppercase text-gold mb-5 flex items-center gap-2">
              <Phone size={12} className="text-gold" />
              Direct Contacts
            </div>
            <div className="flex flex-col gap-2 text-[13.5px]">
              <a 
                href="tel:+256772418707" 
                className="text-cream/80 hover:text-gold transition-colors w-fit flex items-center gap-1.5"
              >
                +256 772 418 707
              </a>
              <a 
                href="tel:+256776044004" 
                className="text-cream/80 hover:text-gold transition-colors w-fit flex items-center gap-1.5"
              >
                +256 776 044 004
              </a>
              <a 
                href="mailto:kasaijaandpartners@gmail.com" 
                className="text-cream/80 hover:text-gold transition-colors w-fit mt-2 break-all flex items-center gap-1.5"
              >
                <Mail size={12} className="text-gold flex-shrink-0" />
                <span>kasaijaandpartners@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2">
            <div className="font-mono text-[10px] tracking-widest uppercase text-gold mb-5">
              Quick Links
            </div>
            <div className="flex flex-col gap-2.5 text-[13.5px]">
              <Link to="/about" className="text-cream/70 hover:text-gold transition-colors w-fit">About the Firm</Link>
              <Link to="/practice" className="text-cream/70 hover:text-gold transition-colors w-fit">Practice Areas</Link>
              <Link to="/team" className="text-cream/70 hover:text-gold transition-colors w-fit">Our Team</Link>
              <Link to="/book" className="text-cream/70 hover:text-gold transition-colors w-fit">Book Consultation</Link>
              <Link to="/contact" className="text-cream/70 hover:text-gold transition-colors w-fit">Contact Us</Link>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 border-t border-gold/15 flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] text-cream/50">
          <div>
            © {new Date().getFullYear()} R. Kasaija & Partners Advocates. All rights reserved.
          </div>
          <div className="font-mono tracking-widest uppercase flex items-center gap-4 text-gold/80 text-[11px]">
            <span>ULS</span>
            <span>·</span>
            <span>EALS</span>
            <span>·</span>
            <span>ICAMEK</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
