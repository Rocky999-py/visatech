
import React, { useState, useEffect } from 'react';
import { sound } from '../services/soundService';

interface FeaturesProps {
  onBack: () => void;
}

const FRANCE_LOGS = [
  "> INITIALIZING VFS_GLOBAL_PROTO...",
  "> TARGET: BD_FR_RELAY_01",
  "> ESTABLISHING RESIDENTIAL ISP TUNNEL [DHAKA]",
  "> SYNTHESIZING HUMAN FINGERPRINT [CHROME_122_WIN11]",
  "> BYPASSING CLOUDFLARE_CHALLENGE_V3...",
  "> SUCCESS: SESSION_TOKEN_RETIREVED",
  "> SCANNING SLOT_MATRIX: PARIS_CENTRE",
  "> [!] SLOT DETECTED: 2026-03-14 09:30",
  "> EXECUTING RAPID_FILL_PROTOCOL...",
  "> SUBMITTING PASS_DATA: BD_094XXX...",
  "> BOOKING_SUCCESS: APPOINTMENT_CONFIRMED"
];

const USA_LOGS = [
  "> INITIALIZING CGI_FEDERAL_UPLINK...",
  "> TARGET: USA_CONSULATE_DHAKA",
  "> PROTOCOL: F1/B1/B2 HYBRID_SCAN",
  "> BYPASSING_CAPTCHA_STACK_v9...",
  "> AUTHENTICATING_MRV_FEE_VAULT...",
  "> SESSION_ESTABLISHED: PERSISTENT_NODE",
  "> WATCHING_DOM_CHANGES: SLOT_CALENDAR",
  "> [!] PRIORITY_SLOT_DETECTED: DHAKA_VAC",
  "> INJECTING_DS160_PAYLOAD: SYNC_COMPLETE",
  "> EXECUTING_RECAPTCHA_ENTERPRISE_BYPASS...",
  "> TRANSACTION_FINALIZED: APPOINTMENT_SECURED"
];

const Features: React.FC<FeaturesProps> = ({ onBack }) => {
  const [activeRoute, setActiveRoute] = useState<'FRANCE' | 'USA'>('USA');
  const [logIndex, setLogIndex] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [browserPhase, setBrowserPhase] = useState(0);

  const logs = activeRoute === 'FRANCE' ? FRANCE_LOGS : USA_LOGS;

  useEffect(() => {
    const interval = setInterval(() => {
      setLogIndex((prev) => {
        const next = (prev + 1) % logs.length;
        if (next === 0) {
          setVisibleLogs([]);
          setActiveStep(0);
          setBrowserPhase(0);
        } else {
          setVisibleLogs(prevLogs => [...prevLogs.slice(-6), logs[prev]]);
          if (prev % 3 === 0) setActiveStep(s => (s + 1) % 4);
          if (prev % 2 === 0) setBrowserPhase(p => (p + 1) % 5);
        }
        return next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [activeRoute, logs]);

  const toggleRoute = (route: 'FRANCE' | 'USA') => {
    sound.playClick();
    setActiveRoute(route);
    setLogIndex(0);
    setVisibleLogs([]);
    setActiveStep(0);
    setBrowserPhase(0);
  };

  return (
    <article className="min-h-screen bg-slate-950 text-slate-200 py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative">
        <nav className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-16">
          <button 
            onClick={() => { sound.playTransition(); onBack(); }} 
            className="flex items-center gap-3 text-amber-500 font-black uppercase tracking-widest hover:gap-5 transition-all group outline-none"
          >
            <i className="fas fa-chevron-left"></i> Home Matrix
          </button>
          
          <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
            <button 
              onClick={() => toggleRoute('USA')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeRoute === 'USA' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-white'}`}
            >
              USA TACTICAL
            </button>
            <button 
              onClick={() => toggleRoute('FRANCE')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeRoute === 'FRANCE' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-white'}`}
            >
              FRANCE PROTOCOL
            </button>
          </div>
        </nav>

        <header className="space-y-8 mb-24">
          <div className="flex items-center gap-4 mb-4">
             <div className="h-px w-12 bg-amber-500"></div>
             <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-xs sm:text-sm">Neural Execution Environment</span>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85]">
            {activeRoute === 'USA' ? 'DHAKA TO USA' : 'SYSTEM'} <br/>
            <span className="neon-gold-text">{activeRoute === 'USA' ? 'F1/B1/B2 SCAN' : 'MONITOR'}</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-400 font-medium max-w-3xl leading-relaxed">
            Witness our {activeRoute === 'USA' ? 'pro-grade browser-base engine' : 'high-frequency engine'} automating the <span className="text-white">Bangladesh ➔ {activeRoute === 'USA' ? 'USA Consulate' : 'France VFS'}</span> protocol.
          </p>
        </header>

        {/* FUTURISTIC MONITOR SECTION */}
        <section className="mb-40">
           <div className="bg-slate-900/40 rounded-[3rem] border border-white/5 p-4 sm:p-10 lg:p-12 relative overflow-hidden orange-glow-border shadow-2xl">
              <div className="scanner-line"></div>
              
              <div className="grid lg:grid-cols-12 gap-10">
                 
                 {/* Terminal / Code Side */}
                 <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                          <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                       </div>
                       <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">{activeRoute === 'USA' ? 'cgi_federal_dhaka_v9.ts' : 'vfs_auto_deploy_v4.py'}</span>
                    </div>
                    
                    <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 font-mono text-[11px] sm:text-sm border border-white/5 h-[400px] overflow-hidden flex flex-col justify-end">
                       <div className="space-y-2 opacity-80 mb-6">
                          <p className="text-blue-400">async function <span className="text-amber-500">{activeRoute === 'USA' ? 'initUSARouteDhaka' : 'initializeVFSRoute'}</span>(profile) {'{'}</p>
                          <p className="pl-4 text-slate-500">// {activeRoute === 'USA' ? 'CGI Federal Login & Slot Detection' : 'Bypassing VFS Global Anti-Bot Shards'}</p>
                          <p className="pl-4 text-slate-400">const fingerprint = <span className="text-green-400">await synthesizeDNA</span>('{activeRoute === 'USA' ? 'USA_EMB' : 'BD'}');</p>
                          <p className="pl-4 text-slate-400">const browser = <span className="text-green-400">await launchHeadless</span>('STEALTH_MODE');</p>
                          <p className="pl-4 text-purple-400">while (await browser.isMonitoring()) {'{'}</p>
                          <p className="pl-8 text-slate-400">const slots = <span className="text-green-400">await browser.getCalendar</span>();</p>
                          <p className="pl-8 text-amber-500">if (slots.hasPriorityMatch()) {'{'}</p>
                          <p className="pl-12 text-slate-200">await browser.injectData(DS160_PAYLOAD);</p>
                          <p className="pl-12 text-green-400">await browser.confirmAppointment();</p>
                          <p className="pl-8 text-amber-500">{'}'}</p>
                          <p className="pl-4 text-purple-400">{'}'}</p>
                          <p className="text-blue-400">{'}'}</p>
                        </div>
                        <div className="h-px bg-white/5 my-4"></div>
                        <div className="space-y-2 text-green-500 font-bold min-h-[140px]">
                           {visibleLogs.map((log, i) => (
                             <p key={i} className="animate-in slide-in-from-left duration-300">
                                {log}
                             </p>
                           ))}
                           <span className="inline-block w-2 h-4 bg-green-500 animate-pulse ml-1"></span>
                        </div>
                    </div>
                 </div>

                 {/* Visual Mapping Side */}
                 <div className="lg:col-span-5 flex flex-col gap-6">
                    {/* Browser Automation View - NEW */}
                    <div className="flex-grow bg-slate-950 rounded-3xl border border-white/5 p-6 relative overflow-hidden flex flex-col">
                       <div className="flex items-center gap-2 mb-4 bg-slate-900 p-2 rounded-xl">
                          <i className="fab fa-chrome text-amber-500 text-xs"></i>
                          <div className="flex-grow h-4 bg-slate-800 rounded-lg flex items-center px-3">
                             <span className="text-[8px] text-slate-600 truncate uppercase tracking-widest">https://portal.ustraveldocs.com/dhaka/login</span>
                          </div>
                          <i className="fas fa-redo text-[8px] text-slate-600"></i>
                       </div>

                       <div className="flex-grow border border-white/5 rounded-2xl bg-slate-900/20 p-4 flex flex-col gap-3 overflow-hidden">
                          {/* Browser DOM Injection Preview */}
                          <div className={`p-3 rounded-xl border transition-all duration-500 ${browserPhase >= 1 ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/5'}`}>
                             <div className="flex justify-between items-center mb-1">
                                <span className="text-[8px] font-black uppercase text-slate-600">Username Injection</span>
                                {browserPhase >= 1 && <i className="fas fa-check-circle text-amber-500 text-[10px]"></i>}
                             </div>
                             <div className="h-2 bg-slate-800 rounded w-full overflow-hidden">
                                <div className={`h-full bg-amber-500 transition-all duration-1000 ${browserPhase >= 1 ? 'w-full' : 'w-0'}`}></div>
                             </div>
                          </div>

                          <div className={`p-3 rounded-xl border transition-all duration-500 ${browserPhase >= 2 ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/5'}`}>
                             <div className="flex justify-between items-center mb-1">
                                <span className="text-[8px] font-black uppercase text-slate-600">Captcha Solving</span>
                                {browserPhase >= 2 && <i className="fas fa-brain text-amber-500 text-[10px] animate-pulse"></i>}
                             </div>
                             <div className="grid grid-cols-4 gap-1">
                                {[...Array(4)].map((_, i) => (
                                   <div key={i} className={`h-4 rounded border border-white/5 ${browserPhase >= 2 ? 'bg-amber-500/20 border-amber-500/30' : 'bg-slate-800'}`}></div>
                                ))}
                             </div>
                          </div>

                          <div className={`p-3 rounded-xl border transition-all duration-500 ${browserPhase >= 3 ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/5'}`}>
                             <div className="flex justify-between items-center mb-1">
                                <span className="text-[8px] font-black uppercase text-slate-600">Slot Sniping Radar</span>
                                {browserPhase >= 3 && <span className="text-[8px] font-black text-amber-500 animate-pulse">ACTIVE_SCAN</span>}
                             </div>
                             <div className="flex gap-2">
                                {[...Array(5)].map((_, i) => (
                                   <div key={i} className={`h-6 w-6 rounded-lg flex items-center justify-center border ${browserPhase >= 3 && i === 2 ? 'bg-amber-500 text-slate-950 border-amber-500' : 'border-white/5 text-slate-800'}`}>
                                      <span className="text-[8px] font-black">{12 + i}</span>
                                   </div>
                                ))}
                             </div>
                          </div>

                          <div className={`mt-auto p-4 rounded-xl border-2 border-dashed transition-all duration-500 ${browserPhase >= 4 ? 'border-green-500/50 bg-green-500/5' : 'border-white/10'}`}>
                             <p className={`text-[10px] font-black text-center uppercase tracking-widest ${browserPhase >= 4 ? 'text-green-500' : 'text-slate-700'}`}>
                                {browserPhase >= 4 ? 'APPOINTMENT SECURED' : 'AWAITING SELECTION'}
                             </p>
                          </div>
                       </div>

                       <div className="mt-4 flex justify-between">
                          <div className="flex gap-1">
                             <div className="w-1 h-1 rounded-full bg-amber-500"></div>
                             <div className="w-1 h-1 rounded-full bg-amber-500/30"></div>
                             <div className="w-1 h-1 rounded-full bg-amber-500/30"></div>
                          </div>
                          <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest">Headless Engine v9.0.4</span>
                       </div>
                    </div>

                    <div className="bg-amber-500 p-8 rounded-3xl flex flex-col justify-center items-center text-center space-y-2 group shadow-[0_20px_60px_#f59e0b33]">
                       <h4 className="text-slate-950 font-black uppercase text-xl tracking-tighter">ELITE {activeRoute === 'USA' ? 'CONSULATE' : 'VFS'} BYPASS</h4>
                       <p className="text-slate-800 text-[10px] font-bold uppercase tracking-widest">EXCLUSIVELY FOR BANGLADESH MARKET</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        <div className="h-px bg-white/5 w-full mb-24"></div>

        <div className="space-y-24 text-slate-300 font-medium text-base sm:text-lg leading-relaxed text-justify">
          
          <section className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter">1. CGI Federal & USTravelDocs Bypass</h2>
            <p>The US Visa system for Bangladesh (Dhaka Consulate) is one of the most protected portals globally. Our engine handles the complex <strong>Session Locking</strong> and <strong>MRV Receipt Synchronization</strong> required to secure F1, F2, B1, and B2 appointments before they are claimed by the public.</p>
            <p><strong>Anti-Rate-Limit Matrix:</strong> We distribute requests across hundreds of Dhaka-localized ISP nodes to avoid the "Temporary IP Block" and "Account Locked" errors triggered by standard botting attempts.</p>
          </section>

          <section className="bg-slate-900/40 p-8 sm:p-12 rounded-[2rem] sm:rounded-[4rem] border border-amber-500/10 space-y-8">
            <h2 className="text-3xl sm:text-4xl font-black text-amber-500 uppercase tracking-tighter">2. Automated DS-160 Data Injection</h2>
            <p>Manual data entry on the ustraveldocs portal is slow and prone to timing out. Our "Rapid Injection" protocol pulls data directly from our encrypted vault and populates all 12+ required fields in milliseconds, allowing the system to focus entirely on slot selection.</p>
            <p><strong>Real-Time Slot Sniping:</strong> As soon as a cancellation or a new batch of slots is released for the Dhaka VAC or Consulate, our high-frequency detector initiates the booking handshake instantly.</p>
          </section>

          <section className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter">3. Neural Recaptcha Enterprise Solutions</h2>
            <p>The US Consulate portal uses the highest tier of Google's Recaptcha Enterprise. We don't use external solvers; our locally-hosted neural networks solve these challenges in-memory, maintaining session integrity and bypassing detection patterns.</p>
          </section>

          <section className="p-8 sm:p-12 bg-slate-900/40 border border-white/5 rounded-[3rem] space-y-8">
            <h3 className="text-2xl font-black text-white uppercase tracking-widest">TECHNICAL SPECIFICATIONS: BD-USA ROUTE</h3>
            <div className="grid md:grid-cols-2 gap-8 text-sm sm:text-base text-slate-400">
              <div className="space-y-2">
                <span className="text-amber-500 font-bold block">F1/F2 Student Priority</span>
                <p>Specific sub-engines designed to detect and prioritize student emergency/regular slots for the Dhaka consulate.</p>
              </div>
              <div className="space-y-2">
                <span className="text-amber-500 font-bold block">Stealth Browser Telemetry</span>
                <p>Advanced Playwright-based spoofing that includes randomized GPU rendering and real human mouse-curves.</p>
              </div>
            </div>
          </section>

          <footer className="pt-20 border-t border-white/5 text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] leading-relaxed">
            <p>PROTOCOL v4.0 // ARCHITECT: APOLLO IT TEAM // (c) 2026</p>
          </footer>
        </div>
      </div>
    </article>
  );
};

export default Features;
