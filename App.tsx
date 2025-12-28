
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
  "INITIALIZING_SUPER_SONIC_ENGINE...",
  "STATUS: LATENCY_MINIMIZED_TO_42MS",
  "FEASIBILITY_ANALYSIS: 99.9%_SUCCESS",
  "BYPASSING_VFS_ADVANCED_SHIELDS...",
  "USA_CONSULATE_SLOT_SNIPING: ACTIVE",
  "SPOOFING_HUMAN_DOM_INTERACTION...",
  "OCR_MODEL_V4: 100%_CONFIDENCE",
  "ESTABLISHING_HIGH_SPEED_RELAY...",
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

  // Typewriter effect for artistic reel
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
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (page === 'docs') return <Documentation onBack={() => setPageWithSound('home')} />;
  if (page === 'features') return <Features onBack={() => setPageWithSound('home')} />;
  if (page === 'terms' || page === 'privacy') return <Legal type={page} onBack={() => setPageWithSound('home')} />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden">
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
        <section id="hero" className="relative pt-32 pb-32 hero-mesh overflow-hidden min-h-screen flex flex-col justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
             <Logo size={900} glow={true} className="opacity-[0.12]" />
             <div className="absolute inset-0 bg-amber-500/10 blur-[160px] animate-pulse"></div>
          </div>

          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{backgroundImage: 'radial-gradient(#f59e0b 0.5px, transparent 0.5px)', backgroundSize: '32px 32px'}}></div>
          
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <div className="mb-8 h-8 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="font-mono text-[12px] text-amber-500/90 uppercase tracking-[0.6em] text-glitch inline-block min-w-[300px]">
                  {displayText}<span className="animate-pulse">_</span>
                </span>
              </div>
            </div>

            <div className="mb-12 inline-flex items-center gap-3 bg-slate-900/80 border border-amber-500/20 px-8 py-2.5 rounded-full shadow-[0_0_50px_rgba(245,158,11,0.15)] backdrop-blur-xl">
              <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_15px_#f59e0b] animate-ping"></div>
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em]">Super Sonic Mode Active</span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl md:text-9xl font-black text-white tracking-tighter mb-10 leading-[0.85] uppercase">
              SUPER FAST <br/>
              <span className="neon-gold-text">AUTOMATION</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium mb-14 px-4">
              Enterprise software development specializing in high-speed visa appointment booking. 
              Sub-50ms execution latency for the world's most competitive routes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center px-4">
              <button onClick={() => scrollToSection('dashboard')} className="btn-neon-gold text-slate-950 px-14 py-6 rounded-3xl font-black text-xl uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform active:scale-95">
                Configure Build
              </button>
              <button onClick={() => setPageWithSound('features')} className="bg-slate-900/50 backdrop-blur-xl text-white border border-slate-700/50 px-14 py-6 rounded-3xl font-black text-xl uppercase tracking-widest hover:bg-slate-800 transition-colors">
                View Automation
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 -mt-32 relative z-20 pb-40">
          <Dashboard onOpenContact={(f, t) => { setActiveRoute({from: f, to: t}); setIsContactModalOpen(true); }} />
        </section>

        <section id="pricing" className="py-40 bg-slate-950 border-t border-white/5">
           <div className="max-w-7xl mx-auto px-4">
             <div className="text-center mb-32">
                <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-xs">Licensing Matrix</span>
                <h2 className="text-5xl md:text-6xl font-black text-white mt-4 uppercase tracking-tighter">Development <span className="neon-gold-text">Tiers</span></h2>
                <p className="text-slate-500 mt-6 max-w-2xl mx-auto font-medium">Critical feasibility benchmarks for high-paying visa sectors.</p>
             </div>
             
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
               {PRICING_PLANS.map((plan, i) => (
                 <div key={i} className="bg-slate-900/40 p-8 sm:p-10 rounded-[3rem] border border-white/5 hover:border-amber-500/40 transition-all duration-500 flex flex-col group hover:-translate-y-2 relative overflow-hidden">
                   
                   {plan.mode === 'SUPER SONIC' && (
                     <div className="absolute top-8 -right-12 rotate-45 bg-amber-500 text-slate-950 py-1 px-14 text-[8px] font-black uppercase tracking-widest shadow-xl z-10 animate-pulse">
                       Super Sonic
                     </div>
                   )}

                   <div className="mb-8 flex items-center justify-between">
                     <h3 className="text-amber-500 font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                       <i className={`fas ${plan.type === PlanType.CUSTOM ? 'fa-crown' : 'fa-code'}`}></i>
                       {plan.type}
                     </h3>
                     {plan.mode === 'SUPER SONIC' && <i className="fas fa-bolt text-amber-500 text-xs animate-pulse"></i>}
                   </div>

                   <div className="text-4xl font-black text-white mb-4">
                     {plan.type === PlanType.CUSTOM ? 'POA' : `$${plan.minPrice.toLocaleString()}`}
                   </div>
                   
                   <p className="text-slate-400 text-[11px] mb-8 font-medium leading-relaxed italic h-16">
                     "{plan.description}"
                   </p>

                   {/* Tech Metrics Matrix - Highlighting Accuracy and Latency */}
                   <div className="grid grid-cols-2 gap-3 mb-10">
                     <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 group-hover:border-amber-500/20 transition-colors">
                       <span className="text-[7px] text-slate-600 block uppercase font-black mb-1 tracking-widest">Accuracy</span>
                       <span className="text-[10px] text-white font-black">{plan.accuracy}</span>
                     </div>
                     <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 group-hover:border-amber-500/20 transition-colors">
                       <span className="text-[7px] text-slate-600 block uppercase font-black mb-1 tracking-widest">Latency</span>
                       <span className={`text-[10px] font-black ${plan.mode === 'SUPER SONIC' ? 'text-amber-500' : 'text-slate-400'}`}>{plan.latency}</span>
                     </div>
                   </div>

                   <ul className="space-y-4 mb-12 flex-grow">
                     {plan.features.map((f, j) => (
                       <li key={j} className="text-[11px] font-bold text-slate-300 flex items-center gap-3">
                         <i className={`fas fa-check-circle text-[10px] ${plan.mode === 'SUPER SONIC' ? 'text-amber-500' : 'text-slate-700'}`}></i> {f}
                       </li>
                     ))}
                   </ul>

                   <button 
                     onClick={() => { sound.playClick(); setIsContactModalOpen(true); }} 
                     className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] bg-white/5 text-white hover:bg-amber-500 hover:text-slate-950 transition duration-500 shadow-lg group-hover:scale-105 active:scale-95"
                   >
                     {plan.type === PlanType.CUSTOM ? 'Architect Call' : 'Deploy Engine'}
                   </button>
                 </div>
               ))}
             </div>

             {/* Accuracy & Feasibility Explanation */}
             <div className="mt-24 grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
               <div className="p-8 bg-slate-900/30 rounded-[2.5rem] border border-white/5 space-y-4">
                 <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                    <i className="fas fa-bullseye"></i>
                 </div>
                 <h4 className="text-white font-black uppercase text-xs tracking-widest">Task Feasibility</h4>
                 <p className="text-slate-500 text-[10px] font-bold uppercase leading-relaxed tracking-widest">
                   For high-paying tasks (Schengen, USA), success isn't optional. Standard bots fail at the payment gateway; our Express/Custom tiers use pre-computed sessions to ensure 99%+ success.
                 </p>
               </div>

               <div className="p-8 bg-slate-900/30 rounded-[2.5rem] border border-amber-500/10 space-y-4">
                 <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 animate-pulse">
                    <i className="fas fa-tachometer-alt"></i>
                 </div>
                 <h4 className="text-amber-500 font-black uppercase text-xs tracking-widest">Super Sonic Mode</h4>
                 <p className="text-slate-500 text-[10px] font-bold uppercase leading-relaxed tracking-widest">
                   The fastest execution protocol on the market. We optimize the TCP/IP stack specifically for VFS and BLS servers to hit slots in under 50 milliseconds.
                 </p>
               </div>

               <div className="p-8 bg-slate-900/30 rounded-[2.5rem] border border-white/5 space-y-4">
                 <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                    <i className="fas fa-shield-virus"></i>
                 </div>
                 <h4 className="text-white font-black uppercase text-xs tracking-widest">Accuracy metrics</h4>
                 <p className="text-slate-500 text-[10px] font-bold uppercase leading-relaxed tracking-widest">
                   Our ML models predict slot releases based on historical data. Higher tiers include the Predictive Scan module, increasing accuracy for the most difficult consulate routes.
                 </p>
               </div>
             </div>
           </div>
        </section>

        {/* Global Node Matrix */}
        <section className="py-40 bg-slate-950 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 blur-[150px] -z-0"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div className="space-y-10 text-center md:text-left">
                <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-xs">Infrastructure</span>
                <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight">Global Node <br/><span className="neon-gold-text">Matrix</span></h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
                  Speed is a result of proximity. Our node matrix places our execution engines directly next to embassy data centers in 190+ regions.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                    <div className="text-4xl font-black text-white mb-2 tracking-tighter">1,500+</div>
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Active Proxy Nodes</div>
                  </div>
                  <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                    <div className="text-4xl font-black text-white mb-2 tracking-tighter">&lt; 150ms</div>
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Edge Latency</div>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-amber-500/20 blur-[120px] rounded-full group-hover:bg-amber-500/30 transition-all duration-1000"></div>
                <div className="bg-slate-900 aspect-square rounded-[5rem] border border-amber-500/20 p-12 relative overflow-hidden flex items-center justify-center shadow-2xl">
                   <i className="fas fa-globe-americas text-[18rem] text-amber-500/10 absolute -right-12 -bottom-12"></i>
                   <div className="grid grid-cols-3 gap-8 relative z-10">
                     {[...Array(9)].map((_, i) => (
                       <div key={i} className="w-16 h-16 bg-slate-800 rounded-2xl border border-white/5 flex items-center justify-center text-amber-500 shadow-xl" style={{animation: `breathe 4s infinite ease-in-out ${i*0.4}s`}}>
                         <i className="fas fa-microchip text-xl"></i>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 border-t border-white/5 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Logo size={80} className="mx-auto mb-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700" />
          <p className="text-slate-600 font-black text-[10px] uppercase tracking-[0.6em] mb-12">
            © 2026 VISATECH AI • Apollo IT Development Matrix
          </p>
          <div className="flex justify-center gap-12">
            <button onClick={() => setPageWithSound('privacy')} className="text-slate-500 hover:text-amber-500 text-[11px] font-black uppercase tracking-[0.2em] transition">Privacy Protocol</button>
            <button onClick={() => setPageWithSound('terms')} className="text-slate-500 hover:text-amber-500 text-[11px] font-black uppercase tracking-[0.2em] transition">Terms of Service</button>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-6 items-end">
        <div className="flex items-center gap-4 group">
          <span className="bg-slate-900/90 border border-white/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-amber-500 opacity-0 group-hover:opacity-100 transition-all shadow-2xl whitespace-nowrap">
            Consult Specialist
          </span>
          <button 
            onClick={() => { sound.playClick(); setIsMessengerOpen(true); }}
            className="w-20 h-20 bg-amber-500 text-slate-950 rounded-[2.5rem] flex items-center justify-center text-3xl shadow-[0_20px_50px_rgba(245,158,11,0.3)] hover:scale-110 active:scale-90 transition-all duration-500"
          >
            <i className="fas fa-user-tie"></i>
          </button>
        </div>

        <div className="flex items-center gap-4 group">
          <span className="bg-slate-900/90 border border-white/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-green-500 opacity-0 group-hover:opacity-100 transition-all shadow-2xl whitespace-nowrap">
            WhatsApp Protocol
          </span>
          <button 
            onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}`, '_blank')}
            className="w-20 h-20 bg-green-500 text-white rounded-[2.5rem] flex items-center justify-center text-4xl shadow-[0_20px_50px_rgba(34,197,94,0.3)] hover:scale-110 active:scale-90 transition-all duration-500"
          >
            <i className="fab fa-whatsapp"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
