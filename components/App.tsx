
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Legal from './components/Legal';
import Documentation from './components/Documentation';
import Features from './components/Features';
import ContactModal from './components/ContactModal';
import MessengerPortal from './components/MessengerPortal';
import AdminPortal from './components/AdminPortal';
import Logo from './components/Logo';
import { PlanType } from './types';
import { PRICING_PLANS, WHATSAPP_NUMBER } from './constants';
import { sound } from './services/soundService';

type AppState = 'home' | 'docs' | 'terms' | 'privacy' | 'features';

const TECH_PHRASES = [
  "INITIALIZING_ENGINEERING_MATRIX...",
  "STATUS: AUTOMATION_UPLINK_STABLE",
  "FEASIBILITY_ANALYSIS: 99.9%_SUCCESS",
  "BYPASSING_VFS_ADVANCED_SHIELDS...",
  "USA_CONSULATE_SLOT_SNIPING: ACTIVE",
  "SPOOFING_HUMAN_DOM_INTERACTION...",
  "OCR_MODEL_V4: 100%_CONFIDENCE",
  "DEVELOPING_CUSTOM_BYPASS_SCRIPTS...",
  "GLOBAL_NODE_CLUSTER: READY"
];

const App: React.FC = () => {
  const [page, setPage] = useState<AppState>('home');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState({ from: '', to: '' });
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: number;
    const fullText = TECH_PHRASES[currentPhrase];
    
    if (isTyping) {
      if (displayText.length < fullText.length) {
        timeout = window.setTimeout(() => {
          setDisplayText(fullText.slice(0, displayText.length + 1));
        }, 40);
      } else {
        timeout = window.setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      if (displayText.length > 0) {
        timeout = window.setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 20);
      } else {
        setIsTyping(true);
        setCurrentPhrase((prev) => (prev + 1) % TECH_PHRASES.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayText, isTyping, currentPhrase]);

  const setPageWithSound = (p: AppState) => {
    sound.playTransition();
    setPage(p);
    window.scrollTo(0, 0);
  };

  const scrollToSection = (id: string) => {
    if (id === 'docs' || id === 'features') {
        setPageWithSound(id as AppState);
        return;
    }
    if (page !== 'home') {
      setPageWithSound('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (page === 'docs') return <Documentation onBack={() => setPageWithSound('home')} />;
  if (page === 'features') return <Features onBack={() => setPageWithSound('home')} />;
  if (page === 'terms' || page === 'privacy') return <Legal type={page} onBack={() => setPageWithSound('home')} />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-amber-500/30 selection:text-white">
      <Navbar 
        onContact={() => setIsContactModalOpen(true)} 
        onScrollTo={scrollToSection} 
        onSecretAccess={() => setIsAdminOpen(true)}
      />

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        defaultFrom={activeRoute.from}
        defaultTo={activeRoute.to}
      />

      <MessengerPortal isOpen={isMessengerOpen} onClose={() => setIsMessengerOpen(false)} />
      <AdminPortal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

      <main className="flex-grow">
        <section id="hero" className="relative pt-24 sm:pt-40 pb-20 sm:pb-32 hero-mesh overflow-hidden min-h-screen flex flex-col justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
             <Logo size={window.innerWidth < 640 ? 280 : 850} glow={true} className="opacity-[0.06] sm:opacity-[0.1]" />
             <div className="absolute inset-0 bg-amber-500/10 blur-[60px] sm:blur-[160px] animate-pulse"></div>
          </div>

          <div className="absolute inset-0 opacity-[0.02] sm:opacity-[0.05] pointer-events-none" style={{backgroundImage: 'radial-gradient(#f59e0b 0.5px, transparent 0.5px)', backgroundSize: '20px 20px sm:32px 32px'}}></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <div className="mb-6 sm:mb-10 h-8 sm:h-10 flex items-center justify-center">
              <div className="flex items-center gap-2 sm:gap-4 bg-slate-900/40 px-3 sm:px-6 py-1.5 sm:py-2 rounded-full border border-white/5 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 sm:w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]"></span>
                <span className="font-mono text-[8px] sm:text-[12px] text-amber-500/90 uppercase tracking-[0.2em] sm:tracking-[0.5em] text-glitch inline-block min-w-[180px] sm:min-w-[280px] truncate">
                  {displayText}<span className="animate-pulse">_</span>
                </span>
              </div>
            </div>

            <div className="mb-8 sm:mb-14 inline-flex items-center gap-3 sm:gap-4 bg-slate-900/80 border border-amber-500/20 px-6 sm:px-10 py-2 sm:py-3 rounded-full shadow-[0_0_60px_rgba(245,158,11,0.2)] backdrop-blur-2xl">
              <i className="fas fa-microchip text-amber-500 text-[10px] sm:text-xs animate-spin-slow"></i>
              <span className="text-[9px] sm:text-[11px] font-black text-amber-500 uppercase tracking-[0.3em] sm:tracking-[0.6em]">Enterprise Development Suite</span>
            </div>
            
            <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-black text-white tracking-tighter mb-6 sm:mb-10 leading-[1.1] sm:leading-[0.8] uppercase px-2">
              VISA SECTOR <br className="hidden sm:block"/>
              <span className="neon-gold-text">ENGINEERING</span>
            </h1>
            
            <p className="text-base sm:text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed font-medium mb-12 sm:mb-16 px-4">
              Bespoke software automation development for global agencies. 
              We build high-frequency booking engines that redefine speed and bypass detection.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center px-6">
              <button onClick={() => scrollToSection('dashboard')} className="btn-neon-gold text-slate-950 px-8 sm:px-16 py-5 sm:py-7 rounded-2xl sm:rounded-[2rem] font-black text-lg sm:text-xl uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                Initialize Build
              </button>
              <button onClick={() => setPageWithSound('features')} className="bg-slate-900/50 backdrop-blur-xl text-white border border-slate-700/50 px-8 sm:px-16 py-5 sm:py-7 rounded-2xl sm:rounded-[2rem] font-black text-lg sm:text-xl uppercase tracking-widest hover:bg-slate-800 transition-all hover:border-amber-500/50">
                Process Flow
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-32 relative z-20 pb-20 sm:pb-40">
          <Dashboard onOpenContact={(f, t) => { setActiveRoute({from: f, to: t}); setIsContactModalOpen(true); }} />
        </section>

        <section id="pricing" className="py-20 sm:py-40 bg-slate-950 border-t border-white/5">
           <div className="max-w-7xl mx-auto px-4">
             <div className="text-center mb-16 sm:mb-32">
                <span className="text-amber-500 font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-[10px] sm:text-xs">Architectural Tiers</span>
                <h2 className="text-4xl sm:text-7xl font-black text-white mt-4 sm:mt-6 uppercase tracking-tighter leading-none">Development <span className="neon-gold-text">Protocol</span></h2>
                <p className="text-slate-500 mt-6 sm:mt-8 max-w-2xl mx-auto font-medium text-base sm:text-lg leading-relaxed">Choose the engineering fidelity required for your target jurisdiction.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
               {PRICING_PLANS.map((plan, i) => (
                 <div key={i} className="bg-slate-900/40 p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[4rem] border border-white/5 hover:border-amber-500/40 transition-all duration-700 flex flex-col group hover:-translate-y-2 sm:hover:-translate-y-4 relative overflow-hidden shadow-2xl">
                   
                   {plan.mode === 'SUPER SONIC' && (
                     <div className="absolute top-8 sm:top-10 -right-14 rotate-45 bg-amber-500 text-slate-950 py-1.5 sm:py-2 px-12 sm:px-16 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl z-10 animate-pulse">
                       Super Sonic
                     </div>
                   )}

                   <div className="mb-6 sm:mb-10 flex items-center justify-between">
                     <h3 className="text-amber-500 font-black uppercase tracking-widest text-[10px] sm:text-[11px] flex items-center gap-3">
                       <div className="w-8 h-8 bg-amber-500/10 rounded-xl flex items-center justify-center">
                        <i className={`fas ${plan.type === PlanType.CUSTOM ? 'fa-crown' : 'fa-code-branch'} text-xs`}></i>
                       </div>
                       {plan.type}
                     </h3>
                   </div>

                   <div className="text-4xl sm:text-5xl font-black text-white mb-4 sm:mb-6 tracking-tighter">
                     {plan.type === PlanType.CUSTOM ? 'P.O.A' : `$${plan.minPrice.toLocaleString()}`}
                   </div>
                   
                   <p className="text-slate-500 text-[11px] sm:text-[12px] mb-8 sm:mb-10 font-bold leading-relaxed italic line-clamp-3">
                     &ldquo;{plan.description}&rdquo;
                   </p>

                   <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-12">
                     <div className="bg-slate-950 p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border border-white/5">
                       <span className="text-[7px] sm:text-[8px] text-slate-700 block uppercase font-black mb-1 tracking-widest">Accuracy</span>
                       <span className="text-[10px] sm:text-[11px] text-white font-black whitespace-nowrap">{plan.accuracy}</span>
                     </div>
                     <div className="bg-slate-950 p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border border-white/5">
                       <span className="text-[7px] sm:text-[8px] text-slate-700 block uppercase font-black mb-1 tracking-widest">Latency</span>
                       <span className={`text-[10px] sm:text-[11px] font-black whitespace-nowrap ${plan.mode === 'SUPER SONIC' ? 'text-amber-500' : 'text-slate-400'}`}>{plan.latency}</span>
                     </div>
                   </div>

                   <ul className="space-y-3 sm:space-y-5 mb-10 sm:mb-14 flex-grow">
                     {plan.features.map((f, j) => (
                       <li key={j} className="text-[11px] sm:text-[12px] font-bold text-slate-300 flex items-start gap-3">
                         <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${plan.mode === 'SUPER SONIC' ? 'bg-amber-500' : 'bg-slate-700'}`}></div>
                         <span className="leading-tight">{f}</span>
                       </li>
                     ))}
                   </ul>

                   <button 
                     onClick={() => { sound.playClick(); setIsContactModalOpen(true); }} 
                     className="w-full py-5 sm:py-6 rounded-2xl sm:rounded-[2rem] font-black uppercase tracking-widest text-[10px] sm:text-[11px] bg-white/5 text-white hover:bg-amber-500 hover:text-slate-950 transition-all duration-500 shadow-xl active:scale-95"
                   >
                     {plan.type === PlanType.CUSTOM ? 'Consult Architect' : 'Provision Build'}
                   </button>
                 </div>
               ))}
             </div>
           </div>
        </section>

        <section className="py-20 sm:py-40 bg-slate-950 relative overflow-hidden border-t border-white/5 px-4 sm:px-6">
          <div className="absolute top-0 right-0 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-amber-500/5 blur-[80px] sm:blur-[200px] -z-0"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
              <div className="space-y-8 sm:space-y-12 text-center lg:text-left">
                <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px] sm:text-xs">Global Infrastructure</span>
                <h2 className="text-4xl sm:text-8xl font-black text-white uppercase tracking-tighter leading-[1.0] sm:leading-[0.85]">Global Node <br className="hidden sm:block"/><span className="neon-gold-text">Network</span></h2>
                <p className="text-slate-400 text-lg sm:text-xl leading-relaxed font-medium">
                  We deploy your custom automation onto a proprietary node network situated in close physical proximity to major embassy data centers.
                </p>
                <div className="grid grid-cols-2 gap-4 sm:gap-8 max-w-lg mx-auto lg:mx-0">
                  <div className="bg-slate-900/50 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-white/5 backdrop-blur-xl">
                    <div className="text-3xl sm:text-5xl font-black text-white mb-2 tracking-tighter">195+</div>
                    <div className="text-[8px] sm:text-[10px] text-slate-600 uppercase font-black tracking-widest">Coverage Zones</div>
                  </div>
                  <div className="bg-slate-900/50 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-white/5 backdrop-blur-xl">
                    <div className="text-3xl sm:text-5xl font-black text-white mb-2 tracking-tighter">&lt; 40ms</div>
                    <div className="text-[8px] sm:text-[10px] text-slate-600 uppercase font-black tracking-widest">Execution Speed</div>
                  </div>
                </div>
              </div>
              <div className="relative group max-w-md sm:max-w-none mx-auto w-full">
                <div className="absolute inset-0 bg-amber-500/20 blur-[80px] sm:blur-[150px] rounded-full"></div>
                <div className="bg-slate-900 aspect-square rounded-[3rem] sm:rounded-[6rem] border border-amber-500/20 p-8 sm:p-16 relative overflow-hidden flex items-center justify-center shadow-3xl">
                   <i className="fas fa-globe-americas text-[15rem] sm:text-[25rem] text-amber-500/5 absolute -right-10 -bottom-10 pointer-events-none"></i>
                   <div className="grid grid-cols-3 gap-6 sm:gap-10 relative z-10">
                     {[...Array(9)].map((_, i) => (
                       <div key={i} className="w-14 h-14 sm:w-20 sm:h-20 bg-slate-800 rounded-xl sm:rounded-2xl border border-white/10 flex items-center justify-center text-amber-500 shadow-2xl" style={{animation: `breathe 4s infinite ease-in-out ${i*0.4}s`}}>
                         <i className="fas fa-microchip text-xl sm:text-2xl"></i>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 border-t border-white/5 pt-20 sm:pt-40 pb-12 sm:pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Logo size={80} className="mx-auto mb-10 sm:mb-16 opacity-30 grayscale" />
          <p className="text-slate-600 font-black text-[9px] sm:text-[11px] uppercase tracking-[0.5em] mb-12">
            © 2026 VISATECH AI • APOLLO IT SPECIALISTS MATRIX
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-16">
            <button onClick={() => setPageWithSound('privacy')} className="text-slate-700 hover:text-amber-500 text-[10px] sm:text-[12px] font-black uppercase tracking-widest transition-colors">Privacy Framework</button>
            <button onClick={() => setPageWithSound('terms')} className="text-slate-700 hover:text-amber-500 text-[10px] sm:text-[12px] font-black uppercase tracking-widest transition-colors">Engineering Terms</button>
            <button onClick={() => setPageWithSound('docs')} className="text-slate-700 hover:text-amber-500 text-[10px] sm:text-[12px] font-black uppercase tracking-widest transition-colors">Dev Documentation</button>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[100] flex flex-col gap-4 sm:gap-6 items-end">
        <div className="flex items-center gap-4 group">
          <span className="hidden sm:block bg-slate-900/95 border border-white/10 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-amber-500 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-xl">
            COO Private Line
          </span>
          <button 
            onClick={() => { sound.playMessengerLoud(); setIsMessengerOpen(true); }}
            className="w-14 h-14 sm:w-24 sm:h-24 bg-amber-500 text-slate-950 rounded-2xl sm:rounded-[3rem] flex items-center justify-center text-xl sm:text-4xl shadow-2xl hover:scale-110 active:scale-90 transition-all border-2 sm:border-4 border-white/10"
          >
            <i className="fas fa-user-secret"></i>
          </button>
        </div>

        <div className="flex items-center gap-4 group">
          <span className="hidden sm:block bg-slate-900/95 border border-white/10 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-green-500 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-xl">
            WhatsApp Uplink
          </span>
          <button 
            onClick={() => { sound.playClick(); window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}`, '_blank'); }}
            className="w-14 h-14 sm:w-24 sm:h-24 bg-green-500 text-white rounded-2xl sm:rounded-[3rem] flex items-center justify-center text-2xl sm:text-5xl shadow-2xl hover:scale-110 active:scale-90 transition-all border-2 sm:border-4 border-white/10"
          >
            <i className="fab fa-whatsapp"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
