
import React, { useState, useEffect } from 'react';
import { COUNTRIES } from '../constants';
import { generateVisaStrategy } from '../services/geminiService';
import { sound } from '../services/soundService';

interface DashboardProps {
  onOpenContact: (from: string, to: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onOpenContact }) => {
  const [fromCountry, setFromCountry] = useState(COUNTRIES[7].name);
  const [toCountry, setToCountry] = useState(COUNTRIES[0].name);
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'STRATEGY' | 'METRICS'>('STRATEGY');

  // Simulated live metrics
  const [metrics, setMetrics] = useState({
    latency: '...',
    success: '...',
    nodes: 0,
    entropy: '0.00'
  });

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setMetrics({
          latency: `${Math.floor(Math.random() * 50 + 20)}ms`,
          success: `${(Math.random() * 5 + 94).toFixed(1)}%`,
          nodes: Math.floor(Math.random() * 1000 + 500),
          entropy: (Math.random() * 0.1).toFixed(4)
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleGenerate = async () => {
    sound.playTransition();
    setLoading(true);
    setStrategy(null);
    const result = await generateVisaStrategy(fromCountry, toCountry);
    setStrategy(result);
    setLoading(false);
    sound.playSuccess();
    setActiveTab('STRATEGY');
  };

  const renderMetrics = () => (
    <div className="animate-in fade-in slide-in-from-bottom duration-700 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Network Latency', value: metrics.latency, color: 'text-amber-500' },
          { label: 'Booking Success', value: metrics.success, color: 'text-green-500' },
          { label: 'Active Proxies', value: metrics.nodes.toLocaleString(), color: 'text-blue-500' },
          { label: 'Detection Entropy', value: metrics.entropy, color: 'text-purple-500' }
        ].map((m, i) => (
          <div key={i} className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 flex flex-col items-center text-center">
            <span className="text-[8px] font-black uppercase text-slate-600 mb-2 tracking-[0.2em]">{m.label}</span>
            <span className={`text-2xl font-black ${m.color} tracking-tighter`}>{m.value}</span>
          </div>
        ))}
      </div>
      <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-right from-amber-500 to-transparent opacity-20"></div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Route Risk Analysis</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-500 uppercase">Bot Protection Shield</span>
            <span className="text-[9px] font-black text-red-500 uppercase">HIGH_ALERT</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 animate-pulse w-[85%]"></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-500 uppercase">Bypass Confidence</span>
            <span className="text-[9px] font-black text-green-500 uppercase">99.2%_VERIFIED</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-[99.2%]"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStrategy = () => {
    if (!strategy) return null;
    
    const jsonMatch = strategy.match(/```json?\n([\s\S]*?)\n```/);
    const jsonContent = jsonMatch ? jsonMatch[1] : null;
    const textContent = strategy.replace(/```json?[\s\S]*?```/, '').trim();

    return (
      <div className="animate-in fade-in slide-in-from-right duration-1000 flex flex-col h-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
            <span className="font-mono text-[9px] text-green-500 uppercase tracking-[0.4em]">Engine_Core: Operational</span>
          </div>
          <span className="font-mono text-[9px] text-slate-600 hidden sm:inline">RSA_4096_ENCRYPTION</span>
        </div>

        {jsonContent && (
          <div className="font-mono text-[10px] sm:text-[11px] bg-slate-950 p-4 sm:p-6 rounded-2xl border border-amber-500/20 text-amber-500/80 overflow-x-auto custom-scrollbar shadow-inner">
            <pre className="whitespace-pre-wrap">{jsonContent}</pre>
          </div>
        )}

        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/40"></div>
          <p className="text-slate-300 text-sm leading-relaxed italic">
            {textContent}
          </p>
        </div>

        <button 
          onClick={() => onOpenContact(fromCountry, toCountry)}
          className="w-full py-5 btn-neon-gold text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 transform active:scale-95 shadow-2xl"
        >
          <i className="fas fa-microchip"></i> Request Custom Build Development
        </button>
      </div>
    );
  };

  return (
    <div id="dashboard" className="bg-slate-900/95 backdrop-blur-2xl rounded-[3rem] sm:rounded-[4rem] shadow-2xl overflow-hidden orange-glow-border relative z-10">
      <div className="grid lg:grid-cols-5 min-h-[650px]">
        {/* Input Panel */}
        <div className="lg:col-span-2 p-8 sm:p-12 lg:p-14 space-y-12 border-b lg:border-b-0 lg:border-r border-white/5 bg-slate-950/40">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-[1px] bg-amber-500"></span>
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Automation v4.0</span>
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">BUILD<br/><span className="neon-gold-text">ARCHITECT</span></h2>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Source Pipeline</label>
              <select 
                value={fromCountry}
                onChange={(e) => { sound.playClick(); setFromCountry(e.target.value); }}
                className="w-full p-5 bg-slate-900 border border-slate-800 rounded-2xl text-white font-bold outline-none focus:border-amber-500 transition-all cursor-pointer appearance-none"
              >
                {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
              </select>
            </div>

            <div className="flex justify-center relative">
               <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-white/5"></div>
               </div>
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-amber-500 border border-white/5 relative z-10 shadow-lg animate-pulse">
                <i className="fas fa-random text-xs"></i>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Target Portal</label>
              <select 
                value={toCountry}
                onChange={(e) => { sound.playClick(); setToCountry(e.target.value); }}
                className="w-full p-5 bg-slate-900 border border-slate-800 rounded-2xl text-white font-bold outline-none focus:border-amber-500 transition-all cursor-pointer appearance-none"
              >
                {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
              </select>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 transform active:scale-95 text-sm ${loading ? 'bg-slate-800 text-slate-500' : 'btn-neon-gold text-slate-950 shadow-[0_15px_40px_rgba(245,158,11,0.3)]'}`}
            >
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-terminal"></i>}
              {loading ? 'ANALYZING_PATH...' : 'INITIALIZE DEVELOPMENT'}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-3 p-8 sm:p-12 lg:p-16 bg-slate-950/60 relative flex flex-col min-h-[450px]">
          <div className="scanner-line opacity-30 pointer-events-none"></div>
          
          {strategy || loading ? (
            <div className="flex flex-col h-full">
              <div className="flex gap-4 mb-8">
                <button 
                  onClick={() => { sound.playClick(); setActiveTab('STRATEGY'); }}
                  className={`text-[9px] font-black uppercase tracking-[0.3em] pb-2 border-b-2 transition-all ${activeTab === 'STRATEGY' ? 'text-amber-500 border-amber-500' : 'text-slate-600 border-transparent hover:text-slate-400'}`}
                >
                  Tech Strategy
                </button>
                <button 
                  onClick={() => { sound.playClick(); setActiveTab('METRICS'); }}
                  className={`text-[9px] font-black uppercase tracking-[0.3em] pb-2 border-b-2 transition-all ${activeTab === 'METRICS' ? 'text-amber-500 border-amber-500' : 'text-slate-600 border-transparent hover:text-slate-400'}`}
                >
                  Live Metrics
                </button>
              </div>
              
              <div className="flex-grow">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-pulse">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-3xl border-2 border-amber-500/20 flex items-center justify-center">
                        <i className="fas fa-microchip text-4xl text-amber-500/40"></i>
                      </div>
                      <div className="absolute inset-0 w-24 h-24 border-2 border-amber-500 rounded-3xl animate-ping opacity-20"></div>
                    </div>
                    <div className="space-y-2">
                       <p className="text-amber-500 font-mono text-[10px] uppercase tracking-[0.5em]">Compiling Routines...</p>
                       <p className="text-slate-700 font-mono text-[8px] uppercase tracking-widest">Synthetic Session Mapping in Progress</p>
                    </div>
                  </div>
                ) : (
                  activeTab === 'STRATEGY' ? renderStrategy() : renderMetrics()
                )}
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center space-y-8 opacity-40">
              <div className="w-24 h-24 bg-slate-900/50 rounded-[2rem] border border-white/5 flex items-center justify-center shadow-inner">
                <i className="fas fa-project-diagram text-4xl text-slate-700"></i>
              </div>
              <div className="space-y-2">
                <h3 className="text-slate-500 font-black uppercase text-xs tracking-[0.5em]">Awaiting Uplink</h3>
                <p className="text-slate-700 text-[9px] font-bold uppercase tracking-widest max-w-[240px]">Select source and target parameters to begin automation architecture generation</p>
              </div>
            </div>
          )}

          <div className="absolute bottom-8 right-8 pointer-events-none hidden sm:block">
            <span className="text-[7px] text-slate-800 font-black uppercase tracking-[0.8em]">VT-AI_QUANTUM_CORE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
