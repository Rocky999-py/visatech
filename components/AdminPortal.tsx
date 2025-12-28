
import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../services/soundService';
import { ChatMessage, DeploymentRequest } from '../types';
import { ADMIN_PIN } from '../constants';
import { db } from '../services/databaseService';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  const [pin, setPin] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'MESSENGER' | 'VAULT'>('MESSENGER');
  
  const [sessions, setSessions] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [requests, setRequests] = useState<DeploymentRequest[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const refreshMatrix = () => {
    const vault = db.getVault();
    const active = db.getSessions();
    setRequests(vault);
    setSessions(active);

    if (selectedSession) {
      setMessages(db.getMessages(selectedSession));
    }
  };

  useEffect(() => {
    if (!isAuthorized) return;
    refreshMatrix();

    const handleUpdate = () => refreshMatrix();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('VT_DB_UPDATE', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('VT_DB_UPDATE', handleUpdate);
    };
  }, [isAuthorized, selectedSession]);

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
      alert('ACCESS DENIED');
    }
  };

  const sendReply = () => {
    if (!replyText.trim() || !selectedSession) return;
    
    const reply: ChatMessage = {
      id: 'COO_' + Date.now(),
      sender: 'coo',
      text: replyText,
      timestamp: Date.now(),
      userId: selectedSession
    };

    db.saveMessage(selectedSession, reply);
    setReplyText('');
    sound.playClick();
  };

  const updateStatus = (id: string, status: DeploymentRequest['status']) => {
    const updated = requests.map(r => r.id === id ? { ...r, status } : r);
    db.saveVault(updated);
    sound.playSuccess();
  };

  const deleteRequest = (id: string) => {
    if (window.confirm('ERASE RECORD PERMANENTLY?')) {
      db.deleteVaultRequest(id);
      sound.playClick();
    }
  };

  const getDisplayName = (sid: string) => {
    const match = requests.find(r => r.userId === sid);
    return match ? match.name : `NODE_${sid.slice(-4)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl" />
      
      {!isAuthorized ? (
        <div className="relative bg-slate-900 p-8 sm:p-16 rounded-[2rem] sm:rounded-[4rem] border border-amber-500/30 w-full max-w-xl text-center space-y-10 shadow-2xl animate-in zoom-in">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-500/20 mb-4">
            <i className="fas fa-lock text-4xl"></i>
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">SECURE LOGIN</h2>
          <form onSubmit={handlePinSubmit} className="space-y-8">
            <input 
              type="password" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value)}
              placeholder="PIN" className="w-full bg-slate-950 border-2 border-white/10 rounded-3xl p-6 text-center text-4xl font-black text-amber-500 outline-none focus:border-amber-500"
              autoFocus
            />
            <div className="flex gap-4">
              <button onClick={onClose} type="button" className="flex-grow py-4 text-slate-500 font-black uppercase text-[10px] tracking-widest">Close</button>
              <button type="submit" className="flex-grow btn-neon-gold text-slate-950 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">Authorize Access</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="relative bg-slate-900 w-full max-w-7xl h-full sm:h-[90vh] sm:rounded-[4rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between bg-slate-950/50">
            <div className="flex items-center gap-6">
               <h2 className="text-xl font-black text-white tracking-tighter uppercase">COO <span className="neon-gold-text ml-1">CONSOLE</span></h2>
               <nav className="flex gap-2">
                  <button onClick={() => setActiveTab('MESSENGER')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'MESSENGER' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-slate-300'}`}>COMMS_LINK</button>
                  <button onClick={() => setActiveTab('VAULT')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'VAULT' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-slate-300'}`}>DATA_VAULT</button>
               </nav>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white transition-colors"><i className="fas fa-times text-xl"></i></button>
          </div>

          <div className="flex-grow flex flex-col sm:flex-row min-h-0 overflow-hidden">
            {activeTab === 'MESSENGER' ? (
              <>
                <div className="w-full sm:w-80 border-r border-white/5 flex flex-col bg-slate-950/40 shrink-0">
                  <div className="p-6 font-black text-amber-500 uppercase tracking-widest text-[9px]">ACTIVE_CHANNELS</div>
                  <div className="flex-grow overflow-y-auto px-4 pb-4 space-y-2">
                    {sessions.length === 0 ? (
                      <div className="text-[10px] text-slate-700 font-bold uppercase text-center py-10">No active transmissions</div>
                    ) : (
                      sessions.map(sid => (
                        <button 
                          key={sid} onClick={() => setSelectedSession(sid)}
                          className={`w-full p-4 rounded-2xl text-left transition flex items-center justify-between group ${selectedSession === sid ? 'bg-amber-500 text-slate-950' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                        >
                          <div className="flex items-center gap-3 truncate">
                            <i className={`fas fa-circle text-[6px] ${selectedSession === sid ? 'text-slate-950' : 'text-amber-500 animate-pulse'}`}></i>
                            <span className="font-black text-[10px] truncate uppercase">{getDisplayName(sid)}</span>
                          </div>
                          <i className="fas fa-chevron-right text-[8px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        </button>
                      ))
                    )}
                  </div>
                </div>
                <div className="flex-grow flex flex-col bg-slate-900 min-h-0">
                  {selectedSession ? (
                    <>
                      <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-950/30">
                        {messages.map(msg => (
                          <div key={msg.id} className={`flex ${msg.sender === 'coo' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === 'coo' ? 'bg-amber-500 text-slate-950 rounded-tr-none shadow-lg' : 'bg-slate-800 text-white rounded-tl-none border border-white/5'}`}>
                              <p className="text-[11px] font-bold uppercase leading-relaxed">{msg.text}</p>
                              <p className={`text-[7px] mt-2 font-black uppercase tracking-widest ${msg.sender === 'coo' ? 'opacity-60' : 'opacity-40'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-6 border-t border-white/5 flex gap-4 bg-slate-950/20">
                        <input 
                          type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendReply()}
                          placeholder="TRANSMIT RESPONSE..."
                          className="flex-grow bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white font-black uppercase text-[10px] tracking-widest focus:border-amber-500 outline-none transition-all"
                        />
                        <button onClick={sendReply} className="btn-neon-gold text-slate-950 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Transmit</button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
                      <i className="fas fa-satellite-dish text-6xl text-slate-800 mb-6"></i>
                      <p className="text-slate-600 font-black uppercase text-[10px] tracking-[0.5em]">Awaiting Transmission Link</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-grow overflow-y-auto p-6 sm:p-10 space-y-8 bg-slate-950/20">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">ENGINE_VAULT</h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">Operational Record History</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">{requests.length} TOTAL ENTRIES</span>
                  </div>
                </div>
                
                {requests.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
                    <i className="fas fa-database text-slate-800 text-5xl mb-6"></i>
                    <p className="text-slate-600 font-black text-xs uppercase tracking-widest">No records found in current database matrix</p>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {requests.map(req => (
                      <div key={req.id} className="bg-slate-950 border border-white/10 p-6 rounded-[2rem] hover:border-amber-500/30 transition-all duration-500 group relative">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex-grow truncate pr-4">
                            <h4 className="text-white font-black uppercase text-sm truncate">{req.name}</h4>
                            <p className="text-[9px] text-slate-500 font-bold truncate uppercase">{req.email}</p>
                          </div>
                          <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full border ${
                            req.status === 'DEPLOYED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        
                        <div className="space-y-4 mb-6">
                          <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                              <span className="text-slate-500">Route Protocol:</span>
                              <span className="text-white">{req.fromCountry} &rarr; {req.toCountry}</span>
                            </div>
                            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest mt-2">
                              <span className="text-slate-500">Timestamp:</span>
                              <span className="text-white">{new Date(req.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <div className="min-h-[60px]">
                            <p className="text-[10px] text-slate-400 font-medium italic leading-relaxed">
                              &ldquo;{req.message || 'No additional project specifications provided.'}&rdquo;
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                            onClick={() => updateStatus(req.id, 'DEPLOYED')} 
                            className="flex-grow py-3 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-slate-950 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all"
                           >
                            Mark Deployed
                           </button>
                           <button 
                            onClick={() => deleteRequest(req.id)} 
                            className="px-5 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-slate-950 rounded-xl transition-all"
                           >
                            <i className="fas fa-trash-alt"></i>
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
