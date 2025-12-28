import React, { useState } from 'react';
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

  const handleGenerate = async () => {
    sound.playTransition();
    setLoading(true);
    const result = await generateVisaStrategy(fromCountry, toCountry);
    setStrategy(result);
    setLoading(false);
    sound.playSuccess();
  };

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
            <span className="font-mono text-[9px] text-green-500 uppercase tracking-[0.4em]">Node_Stream: Active</span>
          </div>
          <span className="font-mono text-[9px] text-slate-600 hidden sm:inline">ENCRYPTED_SSL_AES256</span>
        </div>

        {jsonContent && (
          <div className="font-mono text-[10px] sm:text-[11px] bg-slate-950 p-4 sm:p-6 rounded-2xl border border-amber-500/20 text-amber-500/80 overflow-x-auto">
            <pre className="whitespace-pre-wrap">{jsonContent}</pre>
          </div>
        )}

        <div className="bg-slate-900/50 p-4 sm:p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/40"></div>
          <p className="text-slate-300 text-sm leading-relaxed italic">
            {textContent}
          </p>
        </div>

        <button 
          onClick={() => onOpenContact(fromCountry, toCountry)}
          className="w-full py-4 bg-amber-500 text-slate-950 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition flex items-center justify-center gap-2 transform active:scale-95 shadow-xl"
        >
          <i className="fas fa-microchip"></i> Deploy Custom Engine
        </button>
      </div>
    );
  };

  return (
    <div id="dashboard" className="bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl overflow-hidden orange-glow-border relative z-10">
      <div className="grid lg:grid-cols-5 min-h-[600px]">
        {/* Input Panel */}
        <div className="lg:col-span-2 p-8 sm:p-10 lg:p-14 space-y-10 border-b lg:border-b-0 lg:border-r border-white/5 bg-slate-950/20">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight">ENGINE<br/><span className="neon-gold-text">CONFIG</span></h2>
            <div className="h-1 w-12 bg-amber-500 mt-4"></div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Source Region</label>
              <select 
                value={fromCountry}
                onChange={(e) => { sound.playClick(); setFromCountry(e.target.value); }}
                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold outline-none focus:border-amber-500 transition-all cursor-pointer"
              >
                {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
              </select>
            </div>

            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-600 border border-white/5">
                <i className="fas fa-random"></i>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Target Embassy</label>
              <select 
                value={toCountry}
                onChange={(e) => { sound.playClick(); setToCountry(e.target.value); }}
                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold outline-none focus:border-amber-500 transition-all cursor-pointer"
              >
                {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
              </select>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-5 rounded-xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 transform active:scale-95 ${loading ? 'bg-slate-800 text-slate-500' : 'btn-neon-gold text-slate-950 shadow-xl'}`}
            >
              {loading ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-bolt"></i>}
              {loading ? 'ANALYZING...' : 'INITIALIZE ROUTE'}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-3 p-8 sm:p-10 lg:p-14 bg-slate-950/40 relative flex flex-col justify-center min-h-[400px]">
          <div className="scanner-line opacity-20 pointer-events-none"></div>
          {strategy ? renderStrategy() : (
            <div className="text-center space-y-6 relative z-10">
              <div className="w-20 h-20 bg-slate-900 rounded-3xl border border-white/5 flex items-center justify-center mx-auto mb-8 shadow-inner">
                <i className="fas fa-satellite-dish text-3xl text-slate-700 animate-pulse"></i>
              </div>
              <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.4em] max-w-[200px] mx-auto">Awaiting Technical Parameters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;