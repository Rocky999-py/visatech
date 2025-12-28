
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
    <div className="animate-in fade-in slide-in-from-bottom duration-700 space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {[
          { label: 'Latency', value: metrics.latency, color: 'text-amber-500' },
          { label: 'Success', value: metrics.success, color: 'text-green-500' },
          { label: 'Nodes', value: metrics.nodes.toLocaleString(), color: 'text-blue-500' },
          { label: 'Entropy', value: metrics.entropy, color: 'text-purple-500' }
        ].map((m, i) => (
          <div key={i} className="bg-slate-900/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/5 flex flex-col items-center text-center">
            <span className="text-[7px] sm:text-[8px] font-black uppercase text-slate-600 mb-1 tracking-widest">{m.label}</span>
            <span className={`text-lg sm:text-2xl font-black ${m.color} tracking-tighter`}>{m.value}</span>
          </div>
        ))}
      </div>
      <div className="bg-slate-900/50 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/5 relative overflow-hidden">
        <h4 className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Route Risk Analysis</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase">Bot Protection Shield</span>
            <span className="text-[8px] sm:text-[9px] font-black text-red-500 uppercase">HIGH_ALERT</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 animate-pulse w-[85%]"></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase">Bypass Confidence</span>
            <span className="text-[8px] sm:text-[9px] font-black text-green-500 uppercase">99.2%_VERIFIED</span>
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
      <div className="animate-in fade-in slide-in-from-right duration-1000 flex flex-col h-full space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
            <span className="font-mono text-[8px] sm:text-[9px] text-green-500 uppercase tracking-widest">Engine_Core: Active</span>
          </div>
        </div>

        {jsonContent && (
          <div className="font-mono text-[9px] sm:text-[11px] bg-slate-950 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-amber-500/20 text-amber-500/80 overflow-x-auto custom-scrollbar max-h-[140px] sm:max-h-[220px]">
            <pre className="whitespace-pre-wrap">{jsonContent}</pre>
          </div>
        )}

        <div className="bg-slate-900/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/40"></div>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic">
            {textContent}
          </p>
        </div>

        <button 
          onClick={() => onOpenContact(fromCountry, toCountry)}
          className="w-full py-4 sm:py-5 btn-neon-gold text-slate-950 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all flex items-center justify-center gap-2 sm:gap-3 transform active:scale-95 shadow-2xl"
        >
          <i className="fas fa-microchip"></i> Request Custom Build Development
        </button>
      </div>
    );
  };

  return (
    <div id="dashboard" className="bg-slate-900/95 backdrop-blur-2xl rounded-[2rem] sm:rounded-[4rem] shadow-3xl overflow-hidden orange-glow-border relative z-10 w-full max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-0 sm:min-h-[600px]">
        {/* Input Panel */}
        <div className="lg:col-span-2 p-6 sm:p-10 lg:p-14 space-y-8 sm:space-y-12 border-b lg:border-b-0 lg:border-r border-white/5 bg-slate-950/40">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <span className="w-8 h-[1px] bg-amber-500"></span>
              <span className="text-[8px] sm:text-[10px] font-black text-amber-500 uppercase tracking-widest">Automation v4.0</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">BUILD<br/><span className="neon-gold-text">ARCHITECT</span></h2>
          </div>

          <div className="space-y-6 sm:space-y-10">
            <div className="space-y-2 sm:space-y-4">
              <label className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Source Pipeline</label>
              <select 
                value={fromCountry}
                onChange={(e) => { sound.playClick(); setFromCountry(e.target.value); }}
                className="w-full p-4 sm:p-5 bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl text-white text-sm sm:text-base font-bold outline-none focus:border-amber-500 transition-all cursor-pointer"
              >
                {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
              </select>
            </div>

            <div className="flex justify-center relative">
               <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-white/5"></div>
               </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-800 flex items-center justify-center text-amber-500 border border-white/5 relative z-10 shadow-lg animate-pulse">
                <i className="fas fa-random text-[10px] sm:text-xs"></i>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-4">
              <label className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Target Portal</label>
              <select 
                value={toCountry}
                onChange={(e) => { sound.playClick(); setToCountry(e.target.value); }}
                className="w-full p-4 sm:p-5 bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl text-white text-sm sm:text-base font-bold outline-none focus:border-amber-500 transition-all cursor-pointer"
              >
                {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
              </select>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-5 sm:py-6 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 transform active:scale-95 text-xs sm:text-sm ${loading ? 'bg-slate-800 text-slate-500' : 'btn-neon-gold text-slate-950 shadow-2xl'}`}
            >
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-terminal"></i>}
              {loading ? 'ANALYZING...' : 'INITIALIZE DEVELOPMENT'}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-3 p-6 sm:p-10 lg:p-16 bg-slate-950/60 relative flex flex-col min-h-[350px] sm:min-h-[500px]">
          <div className="scanner-line opacity-20 pointer-events-none"></div>
          
          {strategy || loading ? (
            <div className="flex flex-col h-full">
              <div className="flex gap-4 sm:gap-6 mb-6 sm:mb-8 border-b border-white/5">
                <button 
                  onClick={() => { sound.playClick(); setActiveTab('STRATEGY'); }}
                  className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest pb-2 transition-all border-b-2 ${activeTab === 'STRATEGY' ? 'text-amber-500 border-amber-500' : 'text-slate-600 border-transparent hover:text-slate-400'}`}
                >
                  Strategy
                </button>
                <button 
                  onClick={() => { sound.playClick(); setActiveTab('METRICS'); }}
                  className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest pb-2 transition-all border-b-2 ${activeTab === 'METRICS' ? 'text-amber-500 border-amber-500' : 'text-slate-600 border-transparent hover:text-slate-400'}`}
                >
                  Live Metrics
                </button>
              </div>
              
              <div className="flex-grow">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-pulse">
                    <div className="relative">
                      <div className="w-16 h-16 sm:w-24 rounded-2xl border-2 border-amber-500/20 flex items-center justify-center">
                        <i className="fas fa-microchip text-2xl sm:text-4xl text-amber-500/40"></i>
                      </div>
                      <div className="absolute inset-0 w-16 h-16 sm:w-24 sm:h-24 border-2 border-amber-500 rounded-2xl sm:rounded-3xl animate-ping opacity-10"></div>
                    </div>
                    <div className="space-y-1">
                       <p className="text-amber-500 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest">Compiling Routines...</p>
                    </div>
                  </div>
                ) : (
                  activeTab === 'STRATEGY' ? renderStrategy() : renderMetrics()
                )}
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center space-y-6 opacity-30">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900/50 rounded-2xl border border-white/5 flex items-center justify-center">
                <i className="fas fa-project-diagram text-2xl sm:text-3xl text-slate-700"></i>
              </div>
              <p className="text-slate-700 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest max-w-[180px]">Select parameters to begin generation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
