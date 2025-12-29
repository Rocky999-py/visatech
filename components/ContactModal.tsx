
import React, { useState } from 'react';
import { sound } from '../services/soundService';
import { WHATSAPP_NUMBER } from '../constants';
import { DeploymentRequest } from '../types';
import { db } from '../services/databaseService';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFrom?: string;
  defaultTo?: string;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, defaultFrom = "N/A", defaultTo = "N/A" }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) return;
    
    setIsSubmitting(true);
    sound.playSuccess();
    const userId = db.getUserId();

    const newRequest: DeploymentRequest = {
      id: 'REQ_' + Date.now(),
      userId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      fromCountry: defaultFrom,
      toCountry: defaultTo,
      message: formData.message,
      timestamp: Date.now(),
      status: 'PENDING',
      priority: 'MEDIUM'
    };

    // Save to simulated database
    db.addVaultRequest(newRequest);
    
    // Redirect to WhatsApp as fallback action
    const text = `*NEW DEPLOYMENT REQUEST ARCHIVED*\nName: ${formData.name}\nWhatsApp: ${formData.phone}\nRoute: ${defaultFrom} -> ${defaultTo}\nStatus: ARCHIVED_IN_CONSOLE`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodeURIComponent(text)}`;
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      <div className="bg-slate-900 w-full max-w-lg rounded-[3rem] p-1 shadow-2xl relative z-10 animate-in zoom-in duration-300 orange-glow-border">
        <div className="bg-slate-950 rounded-[2.85rem] p-8 sm:p-12 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">DEPLOYMENT <span className="neon-gold-text">REQUEST</span></h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">Initialize Architectural Build</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="FULL NAME / ENTITY" className="w-full p-4 bg-slate-900 border border-white/5 rounded-2xl outline-none text-white font-bold uppercase text-xs focus:border-amber-500/50 transition-all" />
              <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="PHONE / WHATSAPP" className="w-full p-4 bg-slate-900 border border-white/5 rounded-2xl outline-none text-white font-bold uppercase text-xs focus:border-amber-500/50 transition-all" />
              <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="EMAIL ADDRESS" className="w-full p-4 bg-slate-900 border border-white/5 rounded-2xl outline-none text-white font-bold uppercase text-xs focus:border-amber-500/50 transition-all" />
              <textarea rows={2} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="TECHNICAL SPECIFICATIONS..." className="w-full p-4 bg-slate-900 border border-white/5 rounded-2xl outline-none text-white font-bold uppercase text-xs resize-none focus:border-amber-500/50 transition-all" />
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-900/30 rounded-2xl cursor-pointer hover:bg-slate-900 transition-colors" onClick={() => setAcceptedTerms(!acceptedTerms)}>
              <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${acceptedTerms ? 'bg-amber-500 border-amber-500' : 'border-slate-700'}`}>
                {acceptedTerms && <i className="fas fa-check text-[10px] text-slate-950"></i>}
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-tight select-none">I accept the engineering protocol and technical service terms of Visatech AI.</p>
            </div>

            <button 
              type="submit" 
              disabled={!acceptedTerms || isSubmitting} 
              className={`w-full py-5 rounded-2xl font-black uppercase text-sm tracking-widest transition flex items-center justify-center gap-3 ${acceptedTerms && !isSubmitting ? 'btn-neon-gold text-slate-950 shadow-xl' : 'bg-slate-800 text-slate-600'}`}
            >
              {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
              {isSubmitting ? 'ENCRYPTING...' : 'INITIATE REQUEST'}
            </button>
          </form>
          
          <button onClick={onClose} className="w-full text-[9px] text-slate-600 font-black uppercase tracking-widest hover:text-white transition">Exit Portal</button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
