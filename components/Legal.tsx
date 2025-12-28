
import React from 'react';
import { sound } from '../services/soundService';

interface LegalPageProps {
  type: 'terms' | 'privacy';
  onBack: () => void;
}

const Legal: React.FC<LegalPageProps> = ({ type, onBack }) => {
  return (
    <article className="min-h-screen bg-slate-950 text-slate-200 py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-[120px] -z-10"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-8 relative">
        <nav>
          <button 
            onClick={() => { sound.playTransition(); onBack(); }} 
            className="flex items-center gap-3 text-amber-500 font-black uppercase tracking-widest mb-20 hover:gap-5 transition-all outline-none"
          >
            <i className="fas fa-chevron-left"></i> Home Matrix
          </button>
        </nav>

        <header className="space-y-4 mb-24">
          <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-xs sm:text-sm">Official Protocol</span>
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tighter uppercase leading-[0.85]">
            {type === 'terms' ? 'Terms of' : 'Privacy'}<br/>
            <span className="neon-gold-text">{type === 'terms' ? 'Service' : 'Protocol'}</span>
          </h1>
          <p className="text-slate-500 font-black text-xs tracking-widest mt-6 uppercase">REVISION 5.0.1 // JAN 2026 // LEGAL DEPLOYMENT FRAMEWORK</p>
        </header>

        <div className="h-px bg-white/5 w-full mb-24"></div>

        <div className="space-y-16 text-slate-400 font-medium text-base sm:text-lg leading-relaxed text-justify">
          {type === 'terms' ? (
            <div className="space-y-16">
              <section className="space-y-6">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">1. Digital Protocol & Master Agreement</h2>
                <p>By engaging VISATECH AI (a subsidiary of Apollo IT Specialists, hereafter "the Provider"), the "Client" acknowledges and consents to the following engineering terms. This contract governs the development, licensing, and maintenance of high-frequency automation software for the visa and appointment sector. The Client warrants they are a legal business entity authorized to operate in their respective jurisdiction.</p>
              </section>

              <section className="bg-slate-900/50 p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] border border-amber-500/20 space-y-8">
                <h2 className="text-2xl font-black text-amber-500 uppercase tracking-tighter">2. Financial Commitment & Milestone Matrix</h2>
                <p>Our engineering lifecycle is predicated on a strictly enforced two-phase payment protocol. There are no exceptions to this structure, as it ensures resource availability for high-paying tasks.</p>
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="p-6 bg-slate-950 rounded-2xl border border-white/5">
                    <h4 className="text-white font-black uppercase text-xs mb-3 tracking-widest">Phase 1: 45% Tech Cost</h4>
                    <p className="text-[11px] leading-relaxed">Due immediately upon deal confirmation. This non-refundable levy covers infrastructure allocation, residential node binding, and the synthesis of custom behavioral fingerprints. Development does not initialize until Phase 1 is cleared.</p>
                  </div>
                  <div className="p-6 bg-slate-950 rounded-2xl border border-white/5">
                    <h4 className="text-white font-black uppercase text-xs mb-3 tracking-widest">Phase 2: 65% Development Cost</h4>
                    <p className="text-[11px] leading-relaxed">The final balance is due immediately after the "Proof-of-Task" demonstration. This confirms the engine has reached its intended target page. Final binary delivery or credential release occurs only after this 65% success fee is processed.</p>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">3. Scope of Engineering & Non-Agency Disclaimer</h2>
                <p>VISATECH AI is exclusively a **Software Development Firm**. We do not provide visa counseling, travel agency services, or diplomatic assistance. We provide the "Stealth Engine" (Tools); the Client is responsible for the data and the ethics of the appointment. We have no affiliation with VFS Global, BLS, TLScontact, or any government consulate.</p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">4. The "No-Issue" Liability Shield</h2>
                <p>Automation software exists in a state of entropy. The following clauses protect the Provider from external volatility:</p>
                <ul className="list-disc pl-6 space-y-4">
                  <li><strong>Third-Party Layout Changes:</strong> Target portals may change their front-end architecture. While we provide maintenance, we are not liable for downtime caused by portal updates.</li>
                  <li><strong>Slot Absence:</strong> The engine scans for slots; it does not "create" them. If a consulate releases zero slots, the engine has no task to perform.</li>
                  <li><strong>Account Flagging:</strong> While our behavioral DNA is elite, no system is 100% invisible. The risk of account locking or IP blacklisting is assumed entirely by the Client.</li>
                </ul>
              </section>

              <section className="bg-slate-900/40 p-10 border border-white/5 rounded-[3rem] space-y-6">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">5. Intellectual Property & Code Sovereignty</h2>
                <p>All bypass algorithms, OCR models, and node architectures are the proprietary property of Apollo IT Specialists. The Client receives a **Usage License**, not ownership of the source code. Decompilation, reverse-engineering, or sharing bypass logic with third-party developers constitutes a criminal breach of contract and will result in immediate engine termination without refund.</p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">6. Force Majeure & Network Failure</h2>
                <p>The Provider is not liable for failures caused by global internet routing disruptions, government-mandated internet shutdowns in the source region (e.g., Bangladesh ISP blocks), or planetary-scale server outages (AWS/Azure/GCP).</p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">7. Ethical Compliance & Legal Venue</h2>
                <p>The Client agrees to use the software for operational efficiency only. Any use for malicious DDoS activity or data harvesting is strictly prohibited. All legal disputes arising from this contract shall be settled via binding arbitration in the jurisdiction of the Provider's choosing.</p>
              </section>

              <footer className="pt-20 text-[10px] sm:text-xs uppercase tracking-[0.5em] text-slate-700 font-bold space-y-4 leading-relaxed border-t border-white/5">
                 <p>DOCUMENT ID: VT_LEGAL_2026_V5</p>
                 <p>BY PROCEEDING WITH PHASE 1 (45%), THE CLIENT ACCEPTS ALL 3,800+ WORDS OF THE FULL LEGAL BRIEFING.</p>
                 <p>VISATECH AI // APOLLO IT ARCHITECTS // END OF TRANSMISSION.</p>
              </footer>
            </div>
          ) : (
            <div className="space-y-16">
              <section className="space-y-6">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">01. Data Sovereignty & Privacy</h2>
                <p>We operate under a "Privacy by Design" philosophy. Since our software handles sensitive applicant data (Passport numbers, Home addresses), we use a Zero-Knowledge local-storage model. This means that data is processed in the RAM of your dedicated node and is never transmitted to our central database. You are the sole owner and guardian of your clients' data.</p>
              </section>
              <section className="bg-slate-900/50 p-10 rounded-[3rem] border border-orange-500/20 space-y-4">
                <h2 className="text-xl font-black text-amber-500 uppercase tracking-widest">02. Encryption & Key Management</h2>
                <p>All environment variables, API keys, and session tokens are encrypted using AES-256-GCM. We rotate our master keys every 90 days and follow strict SOC2-type protocols for internal access to our server infrastructure. Your business secrets are safe within the VISATECH AI Matrix.</p>
              </section>
              <section className="space-y-6">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">03. Audit & Transparency</h2>
                <p>We welcome third-party security audits from our Enterprise clients. If your legal team requires a technical audit of our code's behavior, we provide supervised access to our logic engines under a strict Non-Disclosure Agreement (NDA).</p>
              </section>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default Legal;
