
import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../services/soundService';
import { ChatMessage } from '../types';
import { db } from '../services/databaseService';

interface MessengerPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MessengerPortal: React.FC<MessengerPortalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [userId] = useState(() => db.getUserId());

  // Fixed: Made hydrateChat async to correctly await the promise from db.getMessages and db.saveMessage
  const hydrateChat = async () => {
    const stored = await db.getMessages(userId);
    if (stored.length === 0) {
      const greeting: ChatMessage = {
        id: 'INIT_' + Date.now(),
        sender: 'coo',
        text: 'Greetings. This is the office of the COO. Your connection is secure. How can we facilitate your automation requirements today?',
        timestamp: Date.now(),
        userId
      };
      await db.saveMessage(userId, greeting);
      setMessages([greeting]);
    } else {
      setMessages(stored);
    }
  };

  useEffect(() => {
    if (isOpen) {
      hydrateChat();
      
      const syncHandler = () => {
        hydrateChat();
      };
      window.addEventListener('storage', syncHandler); // Other tabs
      window.addEventListener('VT_DB_UPDATE', syncHandler); // Same tab

      return () => {
        window.removeEventListener('storage', syncHandler);
        window.removeEventListener('VT_DB_UPDATE', syncHandler);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  // Fixed: Made handleSend async to correctly await the promise from db.saveMessage
  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const newMessage: ChatMessage = {
      id: 'MSG_' + Date.now(),
      sender: 'user',
      text: inputValue,
      timestamp: Date.now(),
      userId
    };

    await db.saveMessage(userId, newMessage);
    setInputValue('');
    sound.playClick();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-0 right-0 sm:bottom-10 sm:right-10 w-full sm:max-w-[380px] z-[150] transition-all duration-500 transform ${isMinimized ? 'h-[80px]' : 'h-[65vh] sm:h-[520px]'}`}>
      <div className="bg-slate-900 border-t sm:border border-amber-500/30 rounded-t-3xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-full mx-2 sm:mx-0">
        <div 
          className="bg-amber-500 p-4 sm:p-6 flex items-center justify-between shadow-lg cursor-pointer shrink-0"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900 flex items-center justify-center text-amber-500 border-2 border-white/20">
              <i className="fas fa-user-tie text-xl sm:text-2xl"></i>
            </div>
            <div>
              <h3 className="text-slate-950 font-black text-xs sm:text-sm uppercase tracking-tighter">COO DIRECT</h3>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-pulse"></span>
                <span className="text-[8px] sm:text-[10px] text-slate-800 font-bold uppercase">Encrypted Session</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-950 hover:scale-110 transition">
              <i className={`fas ${isMinimized ? 'fa-chevron-up' : 'fa-chevron-down'} text-lg`}></i>
            </button>
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-slate-950 hover:scale-110 transition">
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div ref={scrollRef} className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-950/50 scroll-smooth">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 sm:p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-amber-500 text-slate-950 rounded-tr-none' 
                      : 'bg-slate-800 text-white rounded-tl-none border border-white/5'
                  }`}>
                    {msg.text}
                    <div className="text-[8px] mt-2 opacity-40 uppercase font-black">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 sm:p-4 bg-slate-900 border-t border-white/5 flex gap-2 sm:gap-3 shrink-0">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="INPUT DATA..."
                className="flex-grow bg-slate-950 border border-white/10 rounded-xl px-4 py-2 sm:py-3 text-white text-[10px] sm:text-xs font-bold focus:border-amber-500 outline-none transition uppercase placeholder:text-slate-700"
              />
              <button onClick={handleSend} className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 text-slate-950 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition shrink-0">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessengerPortal;
