
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
        <div className="relative bg-slate-900 p-8 sm:p-16 rounded-[2rem] sm:rounded-[4rem] border border-amber-500/30 w-full max-w-xl text-center space-y-10 shadow-2xl mx-4 sm:mx-0">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-500/20 mb-4">
            <i className="fas fa-lock text-3xl"></i>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">SECURE LOGIN</h2>
          <form onSubmit={handlePinSubmit} className="space-y-6">
            <input 
              type="password" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value)}
              placeholder="PIN" className="w-full bg-slate-950 border-2 border-white/10 rounded-2xl p-4 text-center text-3xl font-black text-amber-500 outline-none focus:border-amber-500"
              autoFocus
            />
            <div className="flex gap-4">
              <button onClick={onClose} type="button" className="flex-grow py-4 text-slate-500 font-black uppercase text-[10px] tracking-widest">Close</button>
              <button type="submit" className="flex-grow btn-neon-gold text-slate-950 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest">Authorize</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="relative bg-slate-900 w-full max-w-7xl h-full sm:h-[90vh] sm:rounded-[3rem] border-x sm:border border-white/10 shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 sm:p-8 border-b border-white/5 flex items-center justify-between bg-slate-950/50">
            <div className="flex items-center gap-4">
               <h2 className="text-base sm:text-xl font-black text-white tracking-tighter uppercase">COO <span className="neon-gold-text ml-1">CONSOLE</span></h2>
               <nav className="flex gap-1.5 sm:gap-2">
                  <button onClick={() => setActiveTab('MESSENGER')} className={`px-3 py-1.5 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'MESSENGER' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-slate-300'}`}>COMMS</button>
                  <button onClick={() => setActiveTab('VAULT')} className={`px-3 py-1.5 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'VAULT' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-slate-300'}`}>VAULT</button>
               </nav>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-white"><i className="fas fa-times text-lg"></i></button>
          </div>

          <div className="flex-grow flex flex-col sm:flex-row min-h-0 overflow-hidden">
            {activeTab === 'MESSENGER' ? (
              <>
                <div className="w-full sm:w-80 border-b sm:border-b-0 sm:border-r border-white/5 flex flex-col bg-slate-950/40 shrink-0">
                  <div className="p-4 font-black text-amber-500 uppercase tracking-widest text-[8px] hidden sm:block">ACTIVE_NODES</div>
                  <div className="flex-grow overflow-x-auto sm:overflow-y-auto p-4 flex sm:flex-col gap-2 no-scrollbar">
                    {sessions.length === 0 ? (
                      <div className="text-[9px] text-slate-700 font-bold uppercase text-center py-4 w-full">Offline</div>
                    ) : (
                      sessions.map(sid => (
                        <button 
                          key={sid} onClick={() => setSelectedSession(sid)}
                          className={`shrink-0 sm:shrink-1 w-auto sm:w-full p-3 sm:p-4 rounded-xl text-left transition flex items-center justify-between group whitespace-nowrap ${selectedSession === sid ? 'bg-amber-500 text-slate-950' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <i className={`fas fa-circle text-[6px] ${selectedSession === sid ? 'text-slate-950' : 'text-amber-500 animate-pulse'}`}></i>
                            <span className="font-black text-[9px] sm:text-[10px] truncate uppercase">{getDisplayName(sid)}</span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
                <div className="flex-grow flex flex-col bg-slate-900 min-h-0">
                  {selectedSession ? (
                    <>
                      <div ref={scrollRef} className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-950/30">
                        {messages.map(msg => (
                          <div key={msg.id} className={`flex ${msg.sender === 'coo' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[90%] sm:max-w-[80%] p-3 sm:p-4 rounded-xl ${msg.sender === 'coo' ? 'bg-amber-500 text-slate-950 rounded-tr-none' : 'bg-slate-800 text-white rounded-tl-none border border-white/5'}`}>
                              <p className="text-[10px] sm:text-[11px] font-bold uppercase leading-relaxed">{msg.text}</p>
                              <p className="text-[7px] mt-1.5 font-black uppercase tracking-widest opacity-40">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 sm:p-6 border-t border-white/5 flex gap-3 bg-slate-950/20">
                        <input 
                          type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendReply()}
                          placeholder="REPLY..."
                          className="flex-grow bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white font-black uppercase text-[10px] outline-none"
                        />
                        <button onClick={sendReply} className="bg-amber-500 text-slate-950 px-6 rounded-xl font-black uppercase text-[10px] shrink-0">Send</button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center p-8 opacity-20">
                      <i className="fas fa-satellite-dish text-4xl mb-4"></i>
                      <p className="text-[9px] font-black uppercase tracking-widest">Select Protocol</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-grow overflow-y-auto p-4 sm:p-10 space-y-6 sm:space-y-8 bg-slate-950/20">
                <div className="flex justify-between items-end gap-3 border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter leading-none">ENGINE_VAULT</h3>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1">Operational Record History</p>
                  </div>
                  <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">{requests.length} RECORDS</span>
                </div>
                
                {requests.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl opacity-30">
                    <p className="text-slate-600 font-black text-[10px] uppercase tracking-widest">No records found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-12">
                    {requests.map(req => (
                      <div key={req.id} className="bg-slate-950 border border-white/10 p-5 sm:p-6 rounded-[1.5rem] hover:border-amber-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-grow truncate pr-2">
                            <h4 className="text-white font-black uppercase text-[12px] truncate">{req.name}</h4>
                            <p className="text-[8px] text-slate-500 font-bold truncate uppercase">{req.email}</p>
                          </div>
                          <span className={`shrink-0 text-[7px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            req.status === 'DEPLOYED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                          <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 text-[8px] font-black uppercase tracking-widest">
                            <div className="flex justify-between mb-1">
                              <span className="text-slate-500">Route:</span>
                              <span className="text-white truncate max-w-[120px]">{req.fromCountry} &rarr; {req.toCountry}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Date:</span>
                              <span className="text-white">{new Date(req.timestamp).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <p className="text-[9px] text-slate-400 font-medium italic line-clamp-2 leading-relaxed">
                            &ldquo;{req.message || 'No technical notes.'}&rdquo;
                          </p>
                        </div>

                        <div className="flex gap-2">
                           <button onClick={() => updateStatus(req.id, 'DEPLOYED')} className="flex-grow py-2.5 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-slate-950 rounded-lg font-black text-[8px] uppercase transition-all">Deploy</button>
                           <button onClick={() => deleteRequest(req.id)} className="px-4 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-slate-950 rounded-lg transition-all"><i className="fas fa-trash-alt text-[9px]"></i></button>
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
