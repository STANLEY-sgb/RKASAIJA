import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Practice', path: '/practice' },
    { name: 'Team', path: '/team' },
    { name: 'Book', path: '/book' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      id="navbar" 
      className={`fixed top-0 w-full z-50 transition-all duration-400 ${
        isScrolled 
          ? 'bg-cream/95 backdrop-blur-xl shadow-[0_2px_40px_-6px_rgba(42,29,16,0.14)] border-b border-gold/20' 
          : 'bg-cream/88 backdrop-blur-md border-b border-border'
      }`}
    >
      <div className="container-custom py-4 lg:py-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-dark rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
              <img 
                src="/assets/img/firm_logo.jpeg" 
                alt="R. Kasaija & Partners Logo" 
                loading="eager"
                width="44"
                height="44"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/img/remove.png';
                }}
              />
            </div>
            <div className="leading-none">
              <div className="font-serif text-[17px] text-dark">R. Kasaija <em className="accent">&</em> Partners</div>
              <div className="font-mono text-[9px] tracking-[0.25em] uppercase opacity-50 mt-1.5">Advocates · Kampala</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`text-[13px] relative transition-opacity duration-300 hover:opacity-100 ${
                  isActive(link.path) ? 'opacity-100 font-medium' : 'opacity-60'
                } after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:h-[1.5px] after:bg-gold-mid after:transition-all after:duration-400 ${
                  isActive(link.path) ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-chat'))}
              className="flex items-center gap-2 pl-4 pr-3 py-2 bg-dark text-cream rounded-full text-[13px] hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-[0_10px_30px_-8px_rgba(42,29,16,0.5)] overflow-hidden group relative"
            >
              <div className="w-2 h-2 bg-[#4ADE80] rounded-full animate-[aiPulse_2.4s_ease-in-out_infinite]" />
              Ask Kasaija AI
              <div className="w-7 h-7 bg-gold rounded-full flex items-center justify-center ml-1 group-hover:translate-x-0.5 transition-transform">
                <X className="w-3.5 h-3.5 text-dark rotate-45" />
              </div>
            </button>
          </div>

          {/* Hamburger */}
          <button 
            className="lg:hidden w-10 h-10 bg-dark text-cream rounded-full flex items-center justify-center transition-transform active:scale-95"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? 'max-h-[500px] py-6' : 'max-h-0 py-0'
          } border-t border-border mt-4`}
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsMenuOpen(false)}
                className="font-serif text-lg py-2.5 text-dark hover:text-gold-mid transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <button 
              onClick={() => { setIsMenuOpen(false); window.dispatchEvent(new CustomEvent('open-chat')); }}
              className="flex items-center justify-center gap-2 mt-4 px-4 py-4 bg-dark text-cream rounded-xl text-sm transition-transform active:scale-95"
            >
              Ask Kasaija AI
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
