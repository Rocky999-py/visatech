
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
          setVisibleLogs(prevLogs => [...prevLogs.slice(-6), logs[prev]]);
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
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeRoute === 'USA' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              USA TACTICAL
            </button>
            <button 
              onClick={() => toggleRoute('FRANCE')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeRoute === 'FRANCE' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              FRANCE PROTOCOL
            </button>
          </div>
        </nav>

        <header className="space-y-8 mb-24">
          <div className="flex items-center gap-4 mb-4">
             <div className="h-[2px] w-12 bg-amber-500"></div>
             <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-xs sm:text-sm">Software Engineering Lifecycle</span>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85]">
            AUTOMATION <br/>
            <span className="neon-gold-text">DEVELOPMENT</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-400 font-medium max-w-3xl leading-relaxed">
            We don't just provide bots; we build <span className="text-white">enterprise-grade infrastructure</span> for the global visa sector.
          </p>
        </header>

        {/* FUTURISTIC MONITOR SECTION */}
        <section className="mb-40">
           <div className="bg-slate-900/40 rounded-[3rem] border border-white/5 p-4 sm:p-12 lg:p-14 relative overflow-hidden orange-glow-border shadow-2xl">
              <div className="scanner-line"></div>
              
              <div className="grid lg:grid-cols-12 gap-12">
                 
                 {/* Terminal / Code Side */}
                 <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between px-2">
                       <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/30"></div>
                          <div className="w-3 h-3 rounded-full bg-amber-500/30"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/30"></div>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">LIVE_COMPILATION: {activeRoute}</span>
                       </div>
                    </div>
                    
                    <div className="bg-slate-950 rounded-[2.5rem] p-8 sm:p-10 font-mono text-[11px] sm:text-xs border border-white/5 h-[450px] overflow-hidden flex flex-col justify-end shadow-inner relative group">
                        <div className="absolute inset-0 bg-gradient-to-bottom from-amber-500/5 to-transparent pointer-events-none"></div>
                       <div className="space-y-2 opacity-60 mb-8 select-none">
                          <p className="text-blue-500">export const <span className="text-amber-500">{activeRoute === 'USA' ? 'deployUSASniper' : 'deployVFSAutomation'}</span> = async () => {'{'}</p>
                          <p className="pl-4 text-slate-600">// Secure Handshake & SSL Pinning</p>
                          <p className="pl-4 text-slate-400">const bypass = <span className="text-green-500">new NeuralEngine</span>('{activeRoute}');</p>
                          <p className="pl-4 text-slate-400">await bypass.setResidencyProxy('STATIC_IP_PORT');</p>
                          <p className="pl-4 text-purple-500">bypass.on('SLOT_DETECTED', (slot) => {'{'}</p>
                          <p className="pl-8 text-slate-400">slot.fillData(CLIENT_VAULT);</p>
                          <p className="pl-8 text-green-500">slot.confirm();</p>
                          <p className="pl-4 text-purple-500">{'}'});</p>
                          <p className="text-blue-500">{'}'}</p>
                        </div>
                        <div className="h-px bg-white/5 my-6"></div>
                        <div className="space-y-3 text-green-500 font-bold min-h-[160px]">
                           {visibleLogs.map((log, i) => (
                             <p key={i} className="animate-in slide-in-from-left duration-300 flex items-center gap-3">
                                <span className="text-[10px] text-slate-700">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                                {log}
                             </p>
                           ))}
                           <span className="inline-block w-2.5 h-5 bg-green-500 animate-pulse ml-1 align-middle"></span>
                        </div>
                    </div>
                 </div>

                 {/* Visual Mapping Side */}
                 <div className="lg:col-span-5 flex flex-col gap-8">
                    <div className="flex-grow bg-slate-950 rounded-[2.5rem] border border-white/5 p-8 relative overflow-hidden flex flex-col shadow-2xl">
                       <div className="flex items-center gap-3 mb-6 bg-slate-900/80 p-3 rounded-2xl border border-white/5">
                          <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                            <i className="fab fa-chrome text-slate-950 text-[8px]"></i>
                          </div>
                          <div className="flex-grow h-5 bg-slate-800 rounded-lg flex items-center px-4">
                             <span className="text-[9px] text-slate-500 truncate uppercase tracking-widest font-black">https://embassy-portal.secure/auth/login</span>
                          </div>
                          <i className="fas fa-shield-alt text-[10px] text-green-500"></i>
                       </div>

                       <div className="flex-grow border border-white/5 rounded-3xl bg-slate-900/10 p-6 flex flex-col gap-5 overflow-hidden relative">
                          {/* Browser DOM Injection Preview */}
                          <div className={`p-4 rounded-2xl border transition-all duration-700 ${browserPhase >= 1 ? 'border-amber-500/50 bg-amber-500/5 shadow-lg shadow-amber-500/5' : 'border-white/5 opacity-40'}`}>
                             <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Fingerprint Alignment</span>
                                {browserPhase >= 1 && <i className="fas fa-check-double text-amber-500 text-[10px]"></i>}
                             </div>
                             <div className="h-1.5 bg-slate-800 rounded-full w-full overflow-hidden">
                                <div className={`h-full bg-amber-500 transition-all duration-1000 ${browserPhase >= 1 ? 'w-full' : 'w-0'}`}></div>
                             </div>
                          </div>

                          <div className={`p-4 rounded-2xl border transition-all duration-700 ${browserPhase >= 2 ? 'border-amber-500/50 bg-amber-500/5 shadow-lg shadow-amber-500/5' : 'border-white/5 opacity-40'}`}>
                             <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Neural Captcha Solve</span>
                                {browserPhase >= 2 && <span className="text-[8px] font-black text-amber-500 animate-pulse">SOLVING...</span>}
                             </div>
                             <div className="grid grid-cols-6 gap-1.5">
                                {[...Array(6)].map((_, i) => (
                                   <div key={i} className={`h-6 rounded-lg border border-white/5 transition-all duration-500 ${browserPhase >= 2 && i < 4 ? 'bg-amber-500/40 border-amber-500/50 scale-105' : 'bg-slate-800'}`}></div>
                                ))}
                             </div>
                          </div>

                          <div className={`p-4 rounded-2xl border transition-all duration-700 ${browserPhase >= 3 ? 'border-amber-500/50 bg-amber-500/5 shadow-lg shadow-amber-500/5' : 'border-white/5 opacity-40'}`}>
                             <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Real-Time Slot Scan</span>
                                {browserPhase >= 3 && <div className="flex gap-1"><div className="w-1 h-1 bg-amber-500 rounded-full animate-ping"></div><span className="text-[8px] font-black text-amber-500">LIVE</span></div>}
                             </div>
                             <div className="flex gap-3">
                                {[...Array(4)].map((_, i) => (
                                   <div key={i} className={`h-8 w-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${browserPhase >= 3 && i === 2 ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xl' : 'border-white/10 text-slate-700'}`}>
                                      <span className="text-[10px] font-black">{14 + i}</span>
                                   </div>
                                ))}
                             </div>
                          </div>

                          <div className={`mt-auto p-6 rounded-2xl border-2 border-dashed transition-all duration-1000 ${browserPhase >= 4 ? 'border-green-500 bg-green-500/10' : 'border-white/10 opacity-20'}`}>
                             <p className={`text-[11px] font-black text-center uppercase tracking-[0.3em] ${browserPhase >= 4 ? 'text-green-500 animate-pulse' : 'text-slate-700'}`}>
                                {browserPhase >= 4 ? 'SUCCESS: APPOINTMENT_BOUND' : 'AWAITING_TRIGGER'}
                             </p>
                          </div>
                       </div>
                    </div>

                    <div className="bg-amber-500 p-10 rounded-[2.5rem] flex flex-col justify-center items-center text-center space-y-3 group shadow-[0_30px_80px_rgba(245,158,11,0.25)] hover:scale-[1.02] transition-transform duration-500">
                       <h4 className="text-slate-950 font-black uppercase text-2xl tracking-tighter">ELITE BYPASS DEV</h4>
                       <p className="text-slate-900 text-[10px] font-bold uppercase tracking-[0.4em] opacity-80">Custom Engineering for Agencies</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* ENGINEERING STEPS GRID */}
        <section className="mb-40 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
           {ENGINEERING_STEPS.map((step, i) => (
             <div key={i} className="bg-slate-900/30 p-10 rounded-[3rem] border border-white/5 hover:border-amber-500/40 transition-all duration-500 group">
                <div className="w-14 h-14 bg-slate-950 rounded-2xl border border-white/10 flex items-center justify-center text-amber-500 text-2xl mb-8 group-hover:scale-110 transition-transform shadow-xl">
                   <i className={`fas ${step.icon}`}></i>
                </div>
                <h3 className="text-white font-black uppercase text-lg mb-4 tracking-tighter">{step.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed leading-relaxed">{step.desc}</p>
             </div>
           ))}
        </section>

        <div className="h-px bg-white/5 w-full mb-32"></div>

        {/* DETAILED TECH SPECS */}
        <div className="space-y-32 text-slate-300 font-medium text-lg leading-relaxed text-justify">
          
          <section className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-none">01. Portal <br/><span className="neon-gold-text">Deconstruction</span></h2>
              <p>Every visa portal has a unique "Behavioral Signature". Standard bots fail because they move like machines—perfect lines, instant clicks, zero variance. Our development process begins with deconstructing the portal's front-end scripts.</p>
              <div className="space-y-4">
                 {[
                   'Canvas & WebGL Fingerprint Obfuscation',
                   'TCP/IP Stack Customization for Embassy Nodes',
                   'Synthetic DOM interaction via ML-generated heatmaps',
                   'Automated Email & SMS Verification Hooking'
                 ].map((item, j) => (
                   <div key={j} className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-slate-500">
                      <i className="fas fa-check text-amber-500 text-xs"></i>
                      {item}
                   </div>
                 ))}
              </div>
            </div>
            <div className="bg-slate-900/50 p-10 rounded-[4rem] border border-amber-500/10 relative overflow-hidden group">
               <div className="absolute inset-0 bg-amber-500/5 blur-3xl group-hover:bg-amber-500/10 transition-colors"></div>
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 text-xl font-black">AI</div>
                     <h4 className="text-white font-black uppercase tracking-widest text-xs">Machine Learning Bypass</h4>
                  </div>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">Our proprietary OCR models are trained on over 500,000 specific embassy captcha variants, achieving 99.8% resolution accuracy in under 400ms.</p>
                  <button onClick={() => { sound.playClick(); onBack(); }} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-amber-500 hover:text-slate-950 transition-all duration-500">
                     View Source Documentation
                  </button>
               </div>
            </div>
          </section>

          <section className="bg-slate-900/40 p-12 sm:p-20 rounded-[4rem] border border-white/5 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-6">
               <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter">Scale Your <span className="neon-gold-text">Business</span></h2>
               <p className="text-slate-500 text-lg">We provide the technical backbone for the world's most successful visa agencies.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
               <div className="p-10 bg-slate-950 rounded-[3rem] border border-white/5 hover:border-amber-500/20 transition-all">
                  <h5 className="text-amber-500 font-black uppercase text-[10px] tracking-widest mb-4">Speed Benchmark</h5>
                  <div className="text-4xl font-black text-white mb-4 tracking-tighter">&lt; 15ms</div>
                  <p className="text-slate-600 text-[11px] font-bold uppercase tracking-widest leading-relaxed">Average request processing time for BLS & VFS portals.</p>
               </div>
               <div className="p-10 bg-slate-950 rounded-[3rem] border border-white/5 hover:border-amber-500/20 transition-all">
                  <h5 className="text-amber-500 font-black uppercase text-[10px] tracking-widest mb-4">Availability</h5>
                  <div className="text-4xl font-black text-white mb-4 tracking-tighter">99.99%</div>
                  <p className="text-slate-600 text-[11px] font-bold uppercase tracking-widest leading-relaxed">Uptime for our global residential node matrix.</p>
               </div>
               <div className="p-10 bg-slate-950 rounded-[3rem] border border-white/5 hover:border-amber-500/20 transition-all">
                  <h5 className="text-amber-500 font-black uppercase text-[10px] tracking-widest mb-4">Thread Concurrency</h5>
                  <div className="text-4xl font-black text-white mb-4 tracking-tighter">UNLIMITED</div>
                  <p className="text-slate-600 text-[11px] font-bold uppercase tracking-widest leading-relaxed">Scale to thousands of simultaneous bookings without detection.</p>
               </div>
            </div>
          </section>

          <footer className="pt-24 border-t border-white/5 text-slate-500 text-xs font-bold uppercase tracking-[0.5em] leading-relaxed text-center">
            <p className="mb-4">ENGINEERING PROTOCOL v4.1 // REVISED JAN 2026</p>
            <p>VISATECH AI // APOLLO IT DEVELOPMENT MATRIX // ALL RIGHTS RESERVED</p>
          </footer>
        </div>
      </div>
    </article>
  );
};

export default Features;
