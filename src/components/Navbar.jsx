import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Calendar, ArrowRight } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background body scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Practice Areas', path: '/practice' },
    { name: 'Our Team', path: '/team' },
    { name: 'Book Consultation', path: '/book' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleOpenChat = () => {
    setIsMenuOpen(false);
    window.dispatchEvent(new CustomEvent('open-chat'));
  };

  return (
    <>
      <nav 
        id="navbar" 
        aria-label="Main Navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-cream/95 backdrop-blur-xl shadow-[0_4px_30px_-6px_rgba(42,29,16,0.12)] border-b border-gold/25 py-2.5' 
            : 'bg-cream/90 backdrop-blur-md border-b border-gold/15 py-3.5 lg:py-4.5'
        }`}
      >
        <div className="container-custom flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px] flex items-center"
            aria-label="R. Kasaija & Partners Advocates Home"
          >
            <Logo variant="light" size="md" />
          </Link>

          {/* Desktop Nav (Large Screens >= 1280px) */}
          <div className="hidden xl:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link 
                  key={link.path} 
                  to={link.path}
                  aria-current={active ? 'page' : undefined}
                  className={`text-[13.5px] relative transition-colors duration-300 py-1.5 font-sans flex items-center gap-1.5 ${
                    active ? 'text-dark font-semibold' : 'text-dark/75 hover:text-dark'
                  }`}
                >
                  <span>{link.name}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                  )}
                  <span 
                    className={`absolute left-0 bottom-0 h-[2px] bg-gold-mid transition-all duration-300 ${
                      active ? 'w-full' : 'w-0 hover:w-full'
                    }`} 
                  />
                </Link>
              );
            })}

            {/* Primary AI CTA */}
            <button 
              onClick={handleOpenChat}
              aria-label="Open Kasaija AI Assistant"
              className="flex items-center gap-2 pl-4 pr-3 py-2 bg-dark text-cream rounded-full text-[13px] font-medium hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-[0_10px_25px_-8px_rgba(42,29,16,0.5)] cursor-pointer group min-h-[44px]"
            >
              <span className="w-2 h-2 bg-[#4ADE80] rounded-full animate-pulse" />
              <span>Ask Kasaija AI</span>
              <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center ml-1 group-hover:rotate-12 transition-transform duration-300">
                <Sparkles size={12} className="text-dark" />
              </div>
            </button>
          </div>

          {/* Medium Desktop / Tablet Quick Actions (1024px to 1279px) */}
          <div className="hidden lg:flex xl:hidden items-center gap-3">
            <Link 
              to="/book" 
              className="btn-outline text-xs px-4 py-2 border-dark text-dark hover:bg-dark hover:text-cream min-h-[44px] flex items-center"
            >
              <Calendar size={13} />
              Book Consultation
            </Link>
            <button 
              onClick={handleOpenChat}
              className="flex items-center gap-2 px-4 py-2 bg-dark text-cream rounded-full text-xs font-medium min-h-[44px]"
            >
              <Sparkles size={13} className="text-gold" />
              AI Assistant
            </button>
            <button 
              className="w-11 h-11 bg-cream border border-gold/30 text-dark rounded-full flex items-center justify-center transition-transform active:scale-95 ml-1 min-h-[44px] min-w-[44px] cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile Header Right Actions (< 1024px) */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              to="/book"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-gold/20 text-dark border border-gold/40 rounded-full text-xs font-medium min-h-[44px] hover:bg-gold/30 transition-colors"
            >
              <Calendar size={13} />
              <span>Book</span>
            </Link>

            <button 
              className="w-11 h-11 min-h-[44px] min-w-[44px] bg-dark text-cream rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Drawer Overlay */}
      <div 
        aria-hidden={!isMenuOpen}
        className={`fixed inset-0 z-40 bg-dark/70 backdrop-blur-md transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-[88vw] max-w-[400px] z-50 bg-cream border-l border-gold/25 shadow-2xl flex flex-col transition-transform duration-300 ease-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-gold/15 flex items-center justify-between bg-light/50">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gold" />
            <span className="font-serif text-lg font-medium text-dark">R. Kasaija &amp; Partners</span>
          </div>
          <button 
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
            className="w-11 h-11 min-h-[44px] min-w-[44px] bg-dark/5 hover:bg-dark/10 text-dark rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Drawer Navigation List */}
        <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link 
                key={link.path} 
                to={link.path} 
                aria-current={active ? 'page' : undefined}
                onClick={() => setIsMenuOpen(false)}
                className={`font-serif text-lg py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-between min-h-[48px] ${
                  active 
                    ? 'bg-gold/20 text-dark font-semibold border-l-4 border-gold pl-4' 
                    : 'text-dark/85 hover:bg-dark/5 hover:text-dark'
                }`}
              >
                <span>{link.name}</span>
                <ArrowRight size={16} className={`transition-transform ${active ? 'text-gold translate-x-1' : 'text-dark/30'}`} />
              </Link>
            );
          })}

          <div className="my-3 border-t border-gold/15" />

          {/* Primary Action Buttons inside Drawer */}
          <Link
            to="/book"
            onClick={() => setIsMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-gold text-dark font-semibold rounded-xl text-base shadow-md active:scale-95 transition-transform min-h-[48px]"
          >
            <Calendar size={18} />
            <span>Book a Consultation</span>
          </Link>

          <button 
            onClick={handleOpenChat}
            className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-dark text-cream font-medium rounded-xl text-base shadow-md active:scale-95 transition-transform cursor-pointer min-h-[48px] mt-2"
          >
            <Sparkles size={18} className="text-gold" />
            <span>Ask Kasaija AI Assistant</span>
          </button>
        </div>

        {/* Drawer Footer Contact Info */}
        <div className="p-5 border-t border-gold/15 bg-light/80 text-xs text-dark/70 font-sans">
          <div className="font-semibold text-dark mb-1">Kampala Chambers</div>
          <div>Plot 75 Kampala Road, E-Tower Suite D-06</div>
          <div className="mt-1 font-mono text-gold-mid font-semibold">+256 772 418 707 | +256 776 044 004</div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
