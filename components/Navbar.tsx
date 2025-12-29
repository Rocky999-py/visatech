
import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../services/soundService';
import Logo from './Logo';
import { LOGO_CLICK_TARGET } from '../constants';

interface NavbarProps {
  onContact: () => void;
  onScrollTo: (id: string) => void;
  onSecretAccess: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onContact, onScrollTo, onSecretAccess }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    sound.playClick();
    onScrollTo(id);
    setIsMenuOpen(false);
  };

  const handleContactClick = () => {
    sound.playClick();
    onContact();
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    sound.playClick();
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    
    setClickCount(prev => {
      const nextCount = prev + 1;
      if (nextCount >= LOGO_CLICK_TARGET) {
        onSecretAccess();
        return 0;
      }
      return nextCount;
    });

    // Reset counter if user stops clicking
    resetTimerRef.current = setTimeout(() => setClickCount(0), 3000);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass-dark py-2 sm:py-3' : 'bg-transparent py-4 sm:py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12 sm:h-16 items-center">
          <div className="flex items-center gap-3 cursor-pointer group select-none shrink-0" onClick={handleLogoClick}>
            <Logo size={window.innerWidth < 640 ? 30 : 42} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold text-lg sm:text-2xl tracking-tighter text-white uppercase flex items-center">
              VISATECH <span className="neon-gold-text ml-1.5">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
            {['features', 'pricing', 'docs'].map(item => (
              <button 
                key={item}
                onClick={() => handleNavClick(item)} 
                className="text-slate-300 hover:text-amber-400 font-semibold transition-colors uppercase text-[10px] tracking-[0.25em] outline-none"
              >
                {item}
              </button>
            ))}
            
            <button 
              onClick={handleContactClick}
              className="btn-neon-gold text-slate-950 px-6 lg:px-8 py-2.5 rounded-full font-black text-xs uppercase tracking-widest shadow-xl transform active:scale-95 transition-all outline-none"
            >
              Consult
            </button>
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => { sound.playClick(); setIsMenuOpen(!isMenuOpen); }} 
              className="text-amber-500 p-2 outline-none"
              aria-label="Toggle Menu"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl z-40 md:hidden flex flex-col p-8 pt-24 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-6">
            {['features', 'pricing', 'docs'].map(item => (
              <button 
                key={item}
                onClick={() => handleNavClick(item)} 
                className="block w-full text-left text-4xl font-black text-slate-300 hover:text-amber-500 border-b border-white/5 pb-4 uppercase tracking-tighter transition-all"
              >
                {item}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleContactClick}
            className="w-full btn-neon-gold text-slate-950 py-6 rounded-2xl font-black text-lg uppercase tracking-widest mt-12 flex items-center justify-center gap-4"
          >
            <i className="fas fa-paper-plane"></i>
            Consult Now
          </button>
          
          <div className="mt-auto pb-8 text-center text-[9px] text-slate-700 font-bold uppercase tracking-[0.5em]">
            VISATECH AI • PLATFORM v4.0
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
