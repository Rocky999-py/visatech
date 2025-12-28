
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
  // Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout to avoid namespace issues in browser environments
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
    
    // Clear existing timer to prevent premature reset
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    setClickCount(prev => {
      const nextCount = prev + 1;
      
      if (nextCount >= LOGO_CLICK_TARGET) {
        onSecretAccess();
        return 0; // Reset after success
      }
      
      return nextCount;
    });

    // Set a new timer to reset the count if the user stops clicking for 4 seconds
    resetTimerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 4000);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass-dark py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20 items-center">
          <div className="flex items-center gap-3 sm:gap-4 cursor-pointer group" onClick={handleLogoClick}>
            <Logo size={36} className="group-hover:scale-110 transition-transform duration-300 sm:w-[44px] sm:h-[44px]" />
            <span className="font-bold text-xl sm:text-2xl tracking-tighter text-white uppercase flex items-center select-none">
              VISATECH <span className="neon-gold-text ml-1.5">AI</span>
              {clickCount > 0 && clickCount < LOGO_CLICK_TARGET && (
                <span className="ml-2 text-[10px] text-amber-500 font-mono animate-pulse">
                  [{clickCount}/{LOGO_CLICK_TARGET}]
                </span>
              )}
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-10">
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
              className="btn-neon-gold text-slate-950 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 transform active:scale-95 transition-all outline-none"
            >
              Consult Specialist
            </button>
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => { sound.playClick(); setIsMenuOpen(!isMenuOpen); }} 
              className="text-amber-500 focus:outline-none p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Toggle Menu"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl z-40 md:hidden flex flex-col p-8 pt-24 space-y-8 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            {['features', 'pricing', 'docs'].map(item => (
              <button 
                key={item}
                onClick={() => handleNavClick(item)} 
                className="block w-full text-left text-3xl font-black text-slate-300 hover:text-amber-500 border-b border-white/5 pb-4 uppercase tracking-tighter transition-all"
              >
                {item}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleContactClick}
            className="w-full btn-neon-gold text-slate-950 py-6 rounded-3xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl mt-4"
          >
            <i className="fas fa-paper-plane"></i>
            Consult Specialist
          </button>
          
          <div className="pt-12 text-center text-[10px] text-slate-600 font-bold uppercase tracking-[0.5em]">
            VISATECH AI • PLATFORM v4.0
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
