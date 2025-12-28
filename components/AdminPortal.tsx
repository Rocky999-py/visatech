
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
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<DeploymentRequest>>({});

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
    if (confirm('ERASE RECORD PERMANENTLY?')) {
      db.deleteVaultRequest(id);
      sound.playClick();
    }
  };

  // Helper to map User ID to a Name if they filled a form
  const getDisplayName = (sid: string) => {
    const match = requests.find(r => r.userId === sid);
    return match ? match.name : sid;
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
              <button onClick={onClose} type="button" className="flex-grow py-4 text-slate-500 font-black uppercase text-xs">Close</button>
              <button type="submit" className="flex-grow btn-neon-gold text-slate-950 py-4 rounded-2xl font-black uppercase text-xs">Enter</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="relative bg-slate-900 w-full max-w-7xl h-full sm:h-[90vh] sm:rounded-[4rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between bg-slate-950/50">
            <div className="flex items-center gap-6">
               <h2 className="text-xl font-black text-white tracking-tighter">COO <span className="neon-gold-text">WORKSPACE</span></h2>
               <nav className="flex gap-4">
                  <button onClick={() => setActiveTab('MESSENGER')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeTab === 'MESSENGER' ? 'bg-amber-500 text-slate-950' : 'text-slate-500'}`}>COMMS</button>
                  <button onClick={() => setActiveTab('VAULT')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeTab === 'VAULT' ? 'bg-amber-500 text-slate-950' : 'text-slate-500'}`}>VAULT</button>
               </nav>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white"><i className="fas fa-times text-xl"></i></button>
          </div>

          <div className="flex-grow flex flex-col sm:flex-row min-h-0 overflow-hidden">
            {activeTab === 'MESSENGER' ? (
              <>
                <div className="w-full sm:w-80 border-r border-white/5 flex flex-col bg-slate-950/40 shrink-0">
                  <div className="p-4 font-black text-amber-500 uppercase tracking-widest text-[9px]">Transmissions</div>
                  <div className="flex-grow overflow-y-auto p-4 space-y-2">
                    {sessions.map(sid => (
                      <button 
                        key={sid} onClick={() => setSelectedSession(sid)}
                        className={`w-full p-4 rounded-2xl text-left transition flex items-center gap-3 ${selectedSession === sid ? 'bg-amber-500 text-slate-950' : 'bg-white/5 text-slate-400'}`}
                      >
                        <i className="fas fa-circle text-[6px]"></i>
                        <span className="font-black text-[10px] truncate uppercase">{getDisplayName(sid)}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-grow flex flex-col bg-slate-900 min-h-0">
                  {selectedSession ? (
                    <>
                      <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-950/30">
                        {messages.map(msg => (
                          <div key={msg.id} className={`flex ${msg.sender === 'coo' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === 'coo' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-white'}`}>
                              <p className="text-xs font-bold uppercase">{msg.text}</p>
                              <p className="text-[8px] mt-2 opacity-50 font-black">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-6 border-t border-white/5 flex gap-4">
                        <input 
                          type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendReply()}
                          placeholder="REPLY..."
                          className="flex-grow bg-slate-950 border border-white/10 rounded-xl px-6 py-4 text-white font-black uppercase text-xs focus:border-amber-500 outline-none"
                        />
                        <button onClick={sendReply} className="bg-amber-500 text-slate-950 px-8 rounded-xl font-black uppercase text-xs">Send</button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-grow flex items-center justify-center opacity-10">Select Transmission</div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-grow overflow-y-auto p-8 space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {requests.map(req => (
                    <div key={req.id} className="bg-slate-950 border border-white/10 p-6 rounded-3xl relative">
                      <div className="flex justify-between mb-4">
                        <h4 className="text-white font-black uppercase text-lg">{req.name}</h4>
                        <span className="text-[9px] font-black uppercase px-2 py-1 rounded bg-amber-500/10 text-amber-500">{req.status}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-[10px] mb-4">
                        <div className="text-slate-500 font-bold uppercase">Route: <span className="text-white">{req.fromCountry} > {req.toCountry}</span></div>
                        <div className="text-slate-500 font-bold uppercase">Date: <span className="text-white">{new Date(req.timestamp).toLocaleDateString()}</span></div>
                      </div>
                      <p className="text-[11px] text-slate-400 italic mb-6">"{req.message}"</p>
                      <div className="flex gap-2">
                         <button onClick={() => updateStatus(req.id, 'DEPLOYED')} className="flex-grow py-2 bg-green-500/10 text-green-500 rounded-lg font-black text-[9px] uppercase">Mark Deployed</button>
                         <button onClick={() => deleteRequest(req.id)} className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg"><i className="fas fa-trash"></i></button>
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
