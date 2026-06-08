import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Menu, X } from 'lucide-react';
import { cn } from '../utils/cn';
import { CAMPUS_SUBTITLE } from '../constants/campus';

interface PublicNavbarProps {
  transparent?: boolean;
}

export default function PublicNavbar({ transparent = false }: PublicNavbarProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const currentPath = location.pathname;
  const isTransparent = transparent && !isOpen && !isScrolled;

  useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setIsScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [transparent]);

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Fitur', path: '/fitur' },
    { name: 'Tentang', path: '/tentang' },
    { name: 'Agenda', path: '/agenda' },
    { name: 'Galeri', path: '/galeri' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isTransparent
        ? "bg-transparent border-b border-transparent"
        : "bg-white/75 backdrop-blur-xl border-b border-white/50 shadow-sm"
    )}>
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-4 group">
          <div className="relative">
            <div className="absolute inset-0 bg-pesantren-yellow rounded-full blur-md opacity-45 group-hover:scale-110 transition-transform duration-300"></div>
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-14 h-14 rounded-full relative z-10 bg-white p-1 object-contain transition-transform duration-300 group-hover:rotate-6" 
              onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=RU&background=A4C95A&color=fff'; }} 
            />
          </div>
          <div>
            <span className={cn(
              "text-2xl font-display font-extrabold tracking-tight block leading-none transition-colors",
              isTransparent ? "text-white group-hover:text-pesantren-green" : "text-pesantren-dark group-hover:text-pesantren-green"
            )}>Roudlotul 'Ulum</span>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-[0.2em] block mt-1",
              isTransparent ? "text-pesantren-green" : "text-pesantren-blue"
            )}>{CAMPUS_SUBTITLE}</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <div className={cn(
            "flex items-center space-x-8 text-sm font-extrabold",
            isTransparent ? "text-white/90" : "text-slate-600"
          )}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "hover:text-pesantren-green transition-colors py-2 relative",
                  currentPath === link.path
                    ? "text-pesantren-green font-black"
                    : isTransparent ? "hover:text-white" : ""
                )}
              >
                {link.name}
                {currentPath === link.path && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pesantren-green rounded-full" />
                )}
              </Link>
            ))}
          </div>
          <Link 
            to="/login" 
            className={cn(
              "px-8 py-3 rounded-xl text-sm font-extrabold transition-all flex items-center space-x-2 group",
              isTransparent
                ? "bg-pesantren-green text-pesantren-dark hover:bg-[#b5db69] hover:shadow-[0_8px_30px_rgba(164,201,90,0.4)]"
                : "bg-white text-pesantren-dark border-2 border-pesantren-green hover:bg-pesantren-green hover:shadow-[0_8px_30px_rgba(164,201,90,0.3)]"
            )}
          >
            <span>Masuk Portal</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "md:hidden p-2 rounded-xl transition-colors",
            isTransparent
              ? "text-white hover:text-pesantren-green hover:bg-white/10"
              : "text-slate-600 hover:text-pesantren-green hover:bg-slate-50"
          )}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-100 px-6 py-6 space-y-4 absolute top-24 left-0 w-full shadow-lg animate-fade-in">
          <div className="flex flex-col space-y-3 font-extrabold text-slate-600">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "hover:text-pesantren-green transition-colors py-2 text-base",
                  currentPath === link.path ? "text-pesantren-green pl-2 border-l-4 border-pesantren-green" : ""
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-100">
            <Link 
              to="/login" 
              onClick={() => setIsOpen(false)}
              className="w-full py-3 bg-pesantren-green text-pesantren-dark rounded-xl text-center text-sm font-extrabold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <span>Masuk Portal</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
