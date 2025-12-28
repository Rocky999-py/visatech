
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

const ENGINEERING_STEPS = [
  {
    title: 'Portal Reconnaissance',
    desc: 'Deep analysis of WAF (Web Application Firewall) and behavioral monitoring tools (DataDome, Cloudflare, Akamai) used by the target embassy portal.',
    icon: 'fa-search-location'
  },
  {
    title: 'DNA Synthesis',
    desc: 'Creation of persistent, high-reputation browser fingerprints that perfectly mimic localized human interaction patterns to remain non-detectable.',
    icon: 'fa-dna'
  },
  {
    title: 'Node Deployment',
    desc: 'Routing automation through our 4G/5G residential proxy backbone localized to the target city (e.g., Dhaka, Delhi, London) for maximum trust score.',
    icon: 'fa-network-wired'
  },
  {
    title: 'Slot Sniping',
    desc: 'Low-latency execution engine monitoring slot releases 24/7 with millisecond response times, securing appointments the moment they appear.',
    icon: 'fa-crosshairs'
  }
];

const Features: React.FC<FeaturesProps> = ({ onBack }) => {
  const [activeRoute, setActiveRoute] = useState<'FRANCE' | 'USA'>('USA');
  const [logIndex, setLogIndex] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [browserPhase, setBrowserPhase] = useState(0);

  const logs = activeRoute === 'FRANCE' ? FRANCE_LOGS : USA_LOGS;

  useEffect(() => {
    const interval = setInterval(() => {
      setLogIndex((prev) => {
        const next = (prev + 1) % logs.length;
        if (next === 0) {
          setVisibleLogs([]);
          setBrowserPhase(0);
        } else {
          setVisibleLogs(prevLogs => [...prevLogs.slice(-5), logs[prev]]);
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
    setBrowserPhase(0);
  };

  return (
    <article className="min-h-screen bg-slate-950 text-slate-200 py-16 sm:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-amber-500/5 rounded-full blur-[80px] sm:blur-[150px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative">
        <nav className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-8 mb-12 sm:mb-16">
          <button 
            onClick={() => { sound.playTransition(); onBack(); }} 
            className="flex items-center gap-2 sm:gap-3 text-amber-500 font-black uppercase tracking-widest hover:gap-5 transition-all text-xs sm:text-base outline-none"
          >
            <i className="fas fa-chevron-left"></i> Home Matrix
          </button>
          
          <div className="flex bg-slate-900/50 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-white/5 backdrop-blur-xl w-full sm:w-auto">
            <button 
              onClick={() => toggleRoute('USA')}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeRoute === 'USA' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-white'}`}
            >
              USA TACTICAL
            </button>
            <button 
              onClick={() => toggleRoute('FRANCE')}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeRoute === 'FRANCE' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-white'}`}
            >
              FRANCE PROTOCOL
            </button>
          </div>
        </nav>

        <header className="space-y-4 sm:space-y-8 mb-12 sm:mb-24">
          <div className="flex items-center gap-3">
             <div className="h-[2px] w-8 sm:w-12 bg-amber-500"></div>
             <span className="text-amber-500 font-black uppercase tracking-widest text-[9px] sm:text-sm">Engineering Lifecycle</span>
          </div>
          <h1 className="text-4xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[1.1] sm:leading-[0.85]">
            AUTOMATION <br className="hidden sm:block"/>
            <span className="neon-gold-text">DEVELOPMENT</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-slate-400 font-medium max-w-3xl leading-relaxed">
            We don't just provide bots; we build <span className="text-white">enterprise-grade infrastructure</span> for the global visa sector.
          </p>
        </header>

        {/* MONITOR SECTION */}
        <section className="mb-20 sm:mb-40">
           <div className="bg-slate-900/40 rounded-[2rem] sm:rounded-[3rem] border border-white/5 p-4 sm:p-12 lg:p-14 relative overflow-hidden orange-glow-border shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
                 {/* Terminal */}
                 <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between px-2">
                       <div className="flex gap-1.5">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500/30"></div>
                          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-500/30"></div>
                          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500/30"></div>
                       </div>
                       <span className="font-mono text-[8px] sm:text-[10px] text-slate-500 uppercase tracking-widest">LIVE_CORE: {activeRoute}</span>
                    </div>
                    
                    <div className="bg-slate-950 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 font-mono text-[9px] sm:text-xs border border-white/5 h-[300px] sm:h-[450px] overflow-hidden flex flex-col justify-end shadow-inner relative group">
                        <div className="space-y-2 opacity-50 mb-6 sm:mb-10 select-none hidden sm:block">
                          <p className="text-blue-500">export const <span className="text-amber-500">deployAutomation</span> = async () =&gt; {'{'}</p>
                          <p className="pl-4 text-slate-600">// Secure SSL Handshake</p>
                          <p className="pl-4 text-slate-400">const bypass = <span className="text-green-500">new NeuralEngine</span>();</p>
                          <p className="pl-4 text-purple-500">bypass.on('SLOT_DETECTED', (slot) =&gt; {'{'}</p>
                          <p className="pl-8 text-green-500">slot.confirm();</p>
                          <p className="pl-4 text-purple-500">{'}'});</p>
                          <p className="text-blue-500">{'}'}</p>
                        </div>
                        <div className="space-y-2 text-green-500 font-bold min-h-[140px] sm:min-h-[180px]">
                           {visibleLogs.map((log, i) => (
                             <p key={i} className="animate-in slide-in-from-left duration-300 flex items-center gap-2">
                                <span className="text-[8px] text-slate-700 whitespace-nowrap">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                                <span className="truncate">{log}</span>
                             </p>
                           ))}
                           <span className="inline-block w-2 h-4 bg-green-500 animate-pulse"></span>
                        </div>
                    </div>
                 </div>

                 {/* Visual Mapping */}
                 <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8">
                    <div className="flex-grow bg-slate-950 rounded-2xl sm:rounded-[2.5rem] border border-white/5 p-6 sm:p-8 flex flex-col shadow-2xl min-h-[350px]">
                       <div className="flex items-center gap-2 mb-6 bg-slate-900/80 p-2 sm:p-3 rounded-xl border border-white/5">
                          <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                            <i className="fab fa-chrome text-slate-950 text-[7px]"></i>
                          </div>
                          <div className="flex-grow h-4 bg-slate-800 rounded flex items-center px-3 overflow-hidden">
                             <span className="text-[8px] text-slate-500 truncate uppercase tracking-widest font-black">https://portal.secure/login</span>
                          </div>
                       </div>

                       <div className="flex-grow border border-white/5 rounded-xl sm:rounded-2xl bg-slate-900/10 p-4 sm:p-6 flex flex-col gap-4 overflow-hidden relative">
                          <div className={`p-3 rounded-xl border transition-all duration-700 ${browserPhase >= 1 ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/5 opacity-40'}`}>
                             <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Fingerprint Alignment</span>
                                {browserPhase >= 1 && <i className="fas fa-check text-amber-500 text-[8px]"></i>}
                             </div>
                             <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full bg-amber-500 transition-all duration-1000 ${browserPhase >= 1 ? 'w-full' : 'w-0'}`}></div>
                             </div>
                          </div>

                          <div className={`p-3 rounded-xl border transition-all duration-700 ${browserPhase >= 2 ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/5 opacity-40'}`}>
                             <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Neural Captcha Resolve</span>
                                {browserPhase >= 2 && <span className="text-[7px] font-black text-amber-500 animate-pulse">LIVE</span>}
                             </div>
                             <div className="grid grid-cols-6 gap-1">
                                {[...Array(6)].map((_, i) => (
                                   <div key={i} className={`h-4 rounded border border-white/5 transition-all duration-500 ${browserPhase >= 2 && i < 4 ? 'bg-amber-500/40 border-amber-500/50' : 'bg-slate-800'}`}></div>
                                ))}
                             </div>
                          </div>

                          <div className={`p-3 rounded-xl border transition-all duration-700 ${browserPhase >= 3 ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/5 opacity-40'}`}>
                             <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Slot Scan Matrix</span>
                                {browserPhase >= 3 && <div className="flex gap-1"><div className="w-1 h-1 bg-amber-500 rounded-full animate-ping"></div></div>}
                             </div>
                             <div className="flex gap-1.5">
                                {[...Array(5)].map((_, i) => (
                                   <div key={i} className={`h-6 w-8 rounded flex items-center justify-center border transition-all duration-500 ${browserPhase >= 3 && i === 2 ? 'bg-amber-500 text-slate-950 border-amber-500' : 'border-white/10 text-slate-700'}`}>
                                      <span className="text-[9px] font-black">{14 + i}</span>
                                   </div>
                                ))}
                             </div>
                          </div>

                          <div className={`mt-auto p-4 rounded-xl border border-dashed transition-all duration-1000 ${browserPhase >= 4 ? 'border-green-500 bg-green-500/10' : 'border-white/10 opacity-20'}`}>
                             <p className={`text-[9px] font-black text-center uppercase tracking-widest ${browserPhase >= 4 ? 'text-green-500 animate-pulse' : 'text-slate-700'}`}>
                                {browserPhase >= 4 ? 'UPLINK_BOUND: APPOINTMENT_SECURED' : 'AWAITING_TRIGGER'}
                             </p>
                          </div>
                       </div>
                    </div>

                    <div className="bg-amber-500 p-8 rounded-2xl sm:rounded-[2.5rem] flex flex-col justify-center items-center text-center space-y-2 shadow-xl hover:scale-[1.02] transition-transform cursor-default">
                       <h4 className="text-slate-950 font-black uppercase text-xl tracking-tighter">ELITE BYPASS DEV</h4>
                       <p className="text-slate-900 text-[8px] font-bold uppercase tracking-widest opacity-80">Custom Engineering for Agencies</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* STEPS GRID */}
        <section className="mb-20 sm:mb-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
           {ENGINEERING_STEPS.map((step, i) => (
             <div key={i} className="bg-slate-900/30 p-8 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-white/5 hover:border-amber-500/40 transition-all duration-500 group">
                <div className="w-12 h-12 bg-slate-950 rounded-xl border border-white/10 flex items-center justify-center text-amber-500 text-xl mb-6 shadow-xl">
                   <i className={`fas ${step.icon}`}></i>
                </div>
                <h3 className="text-white font-black uppercase text-base sm:text-lg mb-3 tracking-tighter">{step.title}</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">{step.desc}</p>
             </div>
           ))}
        </section>

        <div className="h-px bg-white/5 w-full mb-16 sm:mb-32"></div>

        {/* TECH SPECS */}
        <div className="space-y-20 sm:space-y-32 text-slate-300 font-medium text-base sm:text-lg leading-relaxed text-justify">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
            <div className="space-y-6 sm:space-y-8 text-left">
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-none">01. Portal <br/><span className="neon-gold-text">Deconstruction</span></h2>
              <p className="text-sm sm:text-lg">Standard bots fail because they move like machines. Our development process begins with deconstructing the portal's security scripts to mimic high-reputation localized human behavior.</p>
              <div className="space-y-3">
                 {[
                   'Canvas & WebGL Fingerprint Masking',
                   'TLS Handshake Obfuscation',
                   'Synthetic DOM Interaction Heatmaps',
                   'Automated 2FA Hooking'
                 ].map((item, j) => (
                   <div key={j} className="flex items-center gap-3 text-[9px] sm:text-xs font-black uppercase tracking-widest text-slate-500">
                      <i className="fas fa-check text-amber-500 text-[9px]"></i>
                      <span>{item}</span>
                   </div>
                 ))}
              </div>
            </div>
            <div className="bg-slate-900/50 p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[4rem] border border-amber-500/10 relative overflow-hidden group">
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 text-base font-black">AI</div>
                     <h4 className="text-white font-black uppercase tracking-widest text-[10px]">Neural Bypass Layer</h4>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">Our proprietary OCR models achieve 99.8% resolution accuracy in under 400ms on VFS & BLS captchas.</p>
                  <button onClick={() => { sound.playClick(); onBack(); }} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white hover:bg-amber-500 hover:text-slate-950 transition-all">
                     Technical Docs
                  </button>
               </div>
            </div>
          </section>

          <section className="bg-slate-900/40 p-8 sm:p-20 rounded-[2.5rem] sm:rounded-[4rem] border border-white/5 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-4">
               <h2 className="text-3xl sm:text-6xl font-black text-white uppercase tracking-tighter">Scale Your <span className="neon-gold-text">Business</span></h2>
               <p className="text-slate-500 text-sm sm:text-lg">We provide the technical backbone for the world's most successful visa agencies.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 text-center">
               <div className="p-8 bg-slate-950 rounded-[2rem] border border-white/5">
                  <h5 className="text-amber-500 font-black uppercase text-[9px] tracking-widest mb-4">Speed</h5>
                  <div className="text-3xl font-black text-white mb-2">&lt; 15ms</div>
                  <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Processing Time</p>
               </div>
               <div className="p-8 bg-slate-950 rounded-[2rem] border border-white/5">
                  <h5 className="text-amber-500 font-black uppercase text-[9px] tracking-widest mb-4">Availability</h5>
                  <div className="text-3xl font-black text-white mb-2">99.99%</div>
                  <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Uptime Metric</p>
               </div>
               <div className="p-8 bg-slate-950 rounded-[2rem] border border-white/5">
                  <h5 className="text-amber-500 font-black uppercase text-[9px] tracking-widest mb-4">Concurrency</h5>
                  <div className="text-3xl font-black text-white mb-2">UNLIMITED</div>
                  <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Thread Density</p>
               </div>
            </div>
          </section>

          <footer className="pt-12 sm:pt-24 border-t border-white/5 text-slate-500 text-[9px] sm:text-xs font-bold uppercase tracking-widest text-center leading-relaxed">
            <p className="mb-2">ENGINEERING PROTOCOL v4.1 // REVISED JAN 2026</p>
            <p>VISATECH AI // APOLLO IT DEVELOPMENT MATRIX // ALL RIGHTS RESERVED</p>
          </footer>
        </div>
      </div>
    </article>
  );
};

export default Features;
