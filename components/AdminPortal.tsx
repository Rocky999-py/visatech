
import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../services/soundService';
import { ChatMessage, DeploymentRequest, UserSession, SystemStatus } from '../types';
import { ADMIN_PIN, IS_PRODUCTION } from '../constants';
import { db } from '../services/databaseService';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  const [pin, setPin] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'MESSENGER' | 'VAULT'>('MESSENGER');
  const [isLoading, setIsLoading] = useState(false);
  
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [requests, setRequests] = useState<DeploymentRequest[]>([]);
  
  const [status, setStatus] = useState<SystemStatus>({
    dbConnected: IS_PRODUCTION,
    activeNodes: 0,
    serverLoad: '0.0%',
    latency: '0ms'
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const refreshMatrix = async () => {
    setIsLoading(true);
    try {
      const [vault, active] = await Promise.all([
        db.getVault(),
        db.getSessions()
      ]);
      
      setRequests(vault);
      setSessions(active);

      if (selectedUserId) {
        const msgs = await db.getMessages(selectedUserId);
        setMessages(msgs);
      }

      setStatus({
        dbConnected: true,
        activeNodes: active.length,
        serverLoad: `${(Math.random() * 8 + 2).toFixed(1)}%`,
        latency: `${Math.floor(Math.random() * 30 + 15)}ms`
      });
    } catch (e) {
      setStatus(prev => ({ ...prev, dbConnected: false }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthorized || !isOpen) return;

    refreshMatrix();
    const poll = setInterval(refreshMatrix, 10000); // Global sync every 10s
    
    const handler = () => refreshMatrix();
    window.addEventListener('VT_DB_UPDATE', handler);

    return () => {
      clearInterval(poll);
      window.removeEventListener('VT_DB_UPDATE', handler);
    };
  }, [isAuthorized, isOpen, selectedUserId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthorized(true);
      sound.playSuccess();
    } else {
      setPin('');
      alert('INVALID_CREDENTIALS');
    }
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedUserId) return;
    
    const reply: ChatMessage = {
      id: 'COO_' + Date.now(),
      sender: 'coo',
      text: replyText,
      timestamp: Date.now(),
      userId: selectedUserId
    };

    await db.saveMessage(selectedUserId, reply);
    setReplyText('');
    sound.playClick();
    refreshMatrix();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/98 backdrop-blur-3xl p-0 sm:p-4">
      {!isAuthorized ? (
        <div className="bg-slate-900 p-8 sm:p-16 rounded-[4rem] border border-amber-500/30 w-full max-w-xl text-center space-y-10">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-500/20 shadow-2xl animate-pulse">
            <i className="fas fa-lock text-4xl"></i>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">GLOBAL_ADMIN_SYNC</h2>
          <form onSubmit={handlePinSubmit} className="space-y-6">
            <input 
              type="password" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value)}
              placeholder="••••••" className="w-full bg-slate-950 border-2 border-white/10 rounded-2xl p-6 text-center text-4xl font-black text-amber-500 outline-none focus:border-amber-500 tracking-[0.5em]"
              autoFocus
            />
            <button type="submit" className="w-full btn-neon-gold text-slate-950 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Authorize Global Link</button>
          </form>
        </div>
      ) : (
        <div className="relative bg-slate-900 w-full max-w-7xl h-full sm:h-[92vh] sm:rounded-[3rem] border-x sm:border border-white/10 shadow-3xl flex flex-col overflow-hidden">
          {/* Production Status Header */}
          <div className="p-4 sm:p-8 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between bg-slate-950/70 backdrop-blur-md gap-4">
            <div className="flex items-center gap-6">
               <div className="flex flex-col">
                  <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">COO <span className="neon-gold-text">CONSOLE</span></h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`w-2 h-2 rounded-full ${status.dbConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                      Production Database: {status.dbConnected ? 'SYNC_ACTIVE' : 'OFFLINE_MODE'}
                    </span>
                  </div>
               </div>
               <nav className="flex bg-slate-900 p-1 rounded-xl border border-white/5">
                  <button onClick={() => setActiveTab('MESSENGER')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'MESSENGER' ? 'bg-amber-500 text-slate-950' : 'text-slate-500'}`}>GLOBAL_COMMS</button>
                  <button onClick={() => setActiveTab('VAULT')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'VAULT' ? 'bg-amber-500 text-slate-950' : 'text-slate-500'}`}>VAULT_INDEX</button>
               </nav>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white bg-white/5 rounded-full"><i className="fas fa-times"></i></button>
          </div>

          <div className="flex-grow flex flex-col sm:flex-row min-h-0 overflow-hidden">
            {activeTab === 'MESSENGER' ? (
              <>
                <div className="w-full sm:w-80 border-b sm:border-r border-white/5 flex flex-col bg-slate-950/40 shrink-0">
                  <div className="p-6 border-b border-white/5 font-black text-amber-500 text-[9px] tracking-widest">TRANSMISSION_NODES</div>
                  <div className="flex-grow overflow-y-auto p-4 space-y-3">
                    {sessions.map(s => (
                      <button 
                        key={s.id} onClick={() => { setSelectedUserId(s.id); sound.playClick(); }}
                        className={`w-full p-4 rounded-2xl text-left border transition-all ${selectedUserId === s.id ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-900/50 text-slate-400 border-white/5'}`}
                      >
                        <span className="font-black text-[10px] uppercase truncate block">{s.name || s.id.slice(-6)}</span>
                        <span className="text-[7px] font-bold opacity-60">ID: {s.id.slice(0,10)}...</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-grow flex flex-col bg-slate-900 min-h-0 relative">
                  {selectedUserId ? (
                    <>
                      <div ref={scrollRef} className="flex-grow p-4 sm:p-8 overflow-y-auto space-y-6 bg-slate-950/20">
                        {messages.map((m, i) => (
                          <div key={m.id || i} className={`flex ${m.sender === 'coo' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl ${m.sender === 'coo' ? 'bg-amber-500 text-slate-950 rounded-tr-none' : 'bg-slate-800 text-white rounded-tl-none border border-white/10'}`}>
                              <p className="text-[11px] font-bold uppercase">{m.text}</p>
                              <p className="text-[7px] font-black uppercase mt-2 opacity-50">{new Date(m.timestamp).toLocaleTimeString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 sm:p-6 border-t border-white/5 flex gap-4 bg-slate-950/80">
                        <input 
                          type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendReply()}
                          placeholder="TRANSMIT GLOBAL COMMAND..."
                          className="flex-grow bg-slate-900 border border-white/10 rounded-xl px-6 py-4 text-white font-black text-[10px] tracking-widest outline-none focus:border-amber-500"
                        />
                        <button onClick={sendReply} className="btn-neon-gold text-slate-950 px-10 rounded-xl font-black uppercase text-[10px]">Send</button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center p-12 opacity-10">
                      <i className="fas fa-satellite-dish text-[8rem] mb-12 animate-pulse text-amber-500"></i>
                      <p className="text-[14px] font-black uppercase tracking-[1em]">AWAITING_PRODUCTION_LINK</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-grow overflow-y-auto p-4 sm:p-10 space-y-8 bg-slate-950/20">
                <div className="flex items-end justify-between border-b border-white/5 pb-8">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter">GLOBAL_VAULT</h3>
                  <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20">PRODUCTION_LIVE</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {requests.map(req => (
                    <div key={req.id} className="bg-slate-950 border border-white/10 p-8 rounded-[2.5rem] flex flex-col shadow-3xl">
                      <div className="flex justify-between items-start mb-6">
                        <div className="truncate pr-4">
                          <h4 className="text-white font-black uppercase text-[14px] truncate">{req.name}</h4>
                          <p className="text-[9px] text-slate-500 font-bold uppercase">{req.email}</p>
                        </div>
                        <span className="text-[8px] font-black uppercase px-3 py-1 bg-amber-500 text-slate-950 rounded-full">{req.status}</span>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 text-[9px] font-black uppercase space-y-2 mb-6">
                         <div className="flex justify-between"><span>Phone:</span><span className="text-white">{req.phone}</span></div>
                         <div className="flex justify-between"><span>Route:</span><span className="text-white">{req.fromCountry} &rarr; {req.toCountry}</span></div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium italic leading-relaxed flex-grow">"{req.message || 'No technical notes recorded.'}"</p>
                      <div className="flex gap-2 mt-8">
                         <button onClick={() => db.updateVaultStatus(req.id, 'DEPLOYED')} className="flex-grow py-3 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-slate-950 rounded-xl font-black text-[9px] transition-all">Mark Deployed</button>
                         <button onClick={() => db.deleteVaultRequest(req.id)} className="px-4 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><i className="fas fa-trash-alt"></i></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
