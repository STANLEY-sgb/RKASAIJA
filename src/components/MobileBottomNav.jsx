import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, Calendar, PhoneCall, Sparkles } from 'lucide-react';

const MobileBottomNav = ({ onOpenChat }) => {
  const location = useLocation();

  // Hide bottom nav on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Practice', path: '/practice', icon: Briefcase },
    { label: 'Book', path: '/book', icon: Calendar, highlight: true },
    { label: 'Contact', path: '/contact', icon: PhoneCall },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark/95 backdrop-blur-xl border-t border-gold/20 shadow-[0_-4px_25px_rgba(0,0,0,0.3)] pb-safe transition-all duration-300">
      <div className="grid grid-cols-5 items-center h-16 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors focus:outline-none ${
                active ? 'text-gold' : 'text-cream/70 hover:text-cream'
              }`}
            >
              <div className={`p-1.5 rounded-full transition-transform ${item.highlight && !active ? 'bg-gold/20 text-gold' : ''} ${active ? 'scale-110' : ''}`}>
                <Icon size={19} />
              </div>
              <span className={`text-[10px] tracking-tight font-sans ${active ? 'font-semibold text-gold' : 'font-normal'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* AI Assistant Button */}
        <button
          onClick={onOpenChat}
          aria-label="Open AI Assistant"
          className="flex flex-col items-center justify-center h-full min-h-[44px] text-cream/80 hover:text-gold transition-colors focus:outline-none cursor-pointer"
        >
          <div className="p-1.5 rounded-full bg-gold/15 text-gold animate-pulse">
            <Sparkles size={19} />
          </div>
          <span className="text-[10px] tracking-tight font-sans font-medium text-gold">
            AI Assistant
          </span>
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;
