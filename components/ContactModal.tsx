
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) return;
    
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
      status: 'PENDING'
    };

    db.addVaultRequest(newRequest);
    
    const text = `*NEW DEPLOYMENT REQUEST*\nName: ${formData.name}\nWhatsApp: ${formData.phone}\nRoute: ${defaultFrom} -> ${defaultTo}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose} />
      <div className="bg-slate-900 w-full max-w-lg rounded-[3rem] p-1 shadow-2xl relative z-10 animate-modal orange-glow-border">
        <div className="bg-slate-950 rounded-[2.85rem] p-8 sm:p-12 space-y-8">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter text-center">DEPLOYMENT <span className="neon-gold-text">REQUEST</span></h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="FULL NAME" className="w-full p-4 bg-slate-900 border border-white/5 rounded-2xl outline-none text-white font-bold uppercase text-xs" />
            <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="PHONE / WHATSAPP" className="w-full p-4 bg-slate-900 border border-white/5 rounded-2xl outline-none text-white font-bold uppercase text-xs" />
            <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="EMAIL ADDRESS" className="w-full p-4 bg-slate-900 border border-white/5 rounded-2xl outline-none text-white font-bold uppercase text-xs" />
            <textarea rows={2} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="ADDITIONAL NOTES..." className="w-full p-4 bg-slate-900 border border-white/5 rounded-2xl outline-none text-white font-bold uppercase text-xs resize-none" />
            <div className="flex items-start gap-3 p-4 bg-slate-900/30 rounded-2xl cursor-pointer" onClick={() => setAcceptedTerms(!acceptedTerms)}>
              <div className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${acceptedTerms ? 'bg-amber-500 border-amber-500' : 'border-slate-700'}`}>
                {acceptedTerms && <i className="fas fa-check text-[10px] text-slate-950"></i>}
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-tight">I ACCEPT THE PROTOCOL TERMS</p>
            </div>
            <button type="submit" disabled={!acceptedTerms} className={`w-full py-5 rounded-2xl font-black uppercase text-sm transition ${acceptedTerms ? 'btn-neon-gold text-slate-950' : 'bg-slate-800 text-slate-600'}`}>INITIALIZE VIA WHATSAPP</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
