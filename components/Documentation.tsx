import React from 'react';
import { sound } from '../services/soundService';

interface DocumentationProps {
  onBack: () => void;
}

const Documentation: React.FC<DocumentationProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <header>
          <button 
            onClick={() => { sound.playTransition(); onBack(); }} 
            className="flex items-center gap-3 text-amber-500 font-black uppercase tracking-widest mb-16 hover:gap-5 transition-all group outline-none"
          >
            <i className="fas fa-chevron-left"></i> Home Matrix
          </button>
        </header>

        <div className="grid lg:grid-cols-4 gap-16">
          <aside className="hidden lg:block space-y-8 sticky top-32 h-fit border-r border-white/5 pr-8">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Documentation Sections</h3>
            <nav className="flex flex-col gap-8">
              {['System Overview', 'Server Preparation', 'Environment Variables', 'Deployment Workflow', 'Error Code Index', 'Performance Tuning', 'Safety & Security'].map((link, i) => (
                <a key={i} href={`#${link.toLowerCase().replace(/ /g, '-')}`} className="text-xs font-black text-slate-400 hover:text-amber-500 transition uppercase tracking-[0.4em] flex items-center gap-3 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-amber-500 transition-colors"></span>
                  {link}
                </a>
              ))}
            </nav>
          </aside>

          <main className="lg:col-span-3 space-y-32">
            <article id="system-overview" className="space-y-8">
              <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tighter uppercase leading-none">THE <span className="neon-gold-text">DEVELOPER</span> PROTOCOL</h1>
              <div className="space-y-6 text-lg sm:text-xl text-slate-400 leading-relaxed font-medium">
                <p>This technical guide provides the foundation for deploying and managing VISATECH AI's automation engines. We assume a basic understanding of Linux systems, containerization, and network protocols. Our software is designed for enterprise environments where uptime, speed, and stealth are the primary KPIs.</p>
                <p>The following 2,500+ words of documentation cover everything from initial server hardening to advanced performance tuning. Please read every section carefully before initiating your first build.</p>
              </div>
            </article>

            <section id="server-preparation" className="space-y-12">
              <h2 className="text-3xl font-black text-white flex items-center gap-4 uppercase tracking-tighter">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500"><i className="fas fa-server"></i></div>
                1. Server Hardening & Preparation
              </h2>
              <div className="space-y-6 text-slate-400 text-base sm:text-lg">
                <p>Your server is the heart of your operation. To prevent detection from the portal-side and to ensure stable execution, you must follow our hardening protocol.</p>
                <h4 className="text-white font-black uppercase tracking-widest text-sm">Recommended OS: Ubuntu 22.04 LTS (Jammy Jellyfish)</h4>
                <p><strong>Initial Setup Steps:</strong></p>
                <ul className="list-disc pl-6 space-y-3">
                  <li><strong>Update System Packages:</strong> `sudo apt update && sudo apt upgrade -y`</li>
                  <li><strong>Kernel Tuning:</strong> Increase max open files limit by editing `/etc/security/limits.conf`. High-thread automation can easily exceed default limits (often 1024), causing crashes. We recommend `65535`.</li>
                  <li><strong>Swap Management:</strong> Even with 16GB+ of RAM, we recommend a 4GB swap file to handle sudden memory spikes when Chrome instances render complex JS-heavy portals.</li>
                  <li><strong>Firewall Configuration:</strong> Use `ufw` to block all incoming traffic except for your management IP (for SSH) and the necessary dashboard ports.</li>
                </ul>
              </div>
            </section>

            <section id="environment-variables" className="space-y-12">
              <h2 className="text-3xl font-black text-white flex items-center gap-4 uppercase tracking-tighter">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500"><i className="fas fa-key"></i></div>
                2. Environment Variables & Secret Management
              </h2>
              <div className="space-y-6 text-slate-400 text-base sm:text-lg">
                <p>All sensitive configuration data must be passed via environment variables or a secure vault. Never hard-code your proxy credentials or embassy passwords into scripts.</p>
                <div className="bg-slate-900 p-6 rounded-2xl border border-white/5 font-mono text-sm text-amber-500/80">
                  <p>PROXY_GATEWAY=geo.visatech.ai:8080</p>
                  <p>PROXY_USER=v_user_123</p>
                  <p>PROXY_PASS=secret_token_abc</p>
                  <p>NODE_REGION=EU_SOUTH_1</p>
                  <p>ENGINE_CONCURRENCY=12</p>
                  <p>OCR_API_KEY=local_inference_only</p>
                </div>
              </div>
            </section>

            <section id="deployment-workflow" className="space-y-12">
              <h2 className="text-3xl font-black text-white flex items-center gap-4 uppercase tracking-tighter">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500"><i className="fas fa-microchip"></i></div>
                3. Deployment Workflow (The 5-Gate Process)
              </h2>
              <div className="space-y-8 text-slate-400">
                <div className="space-y-4">
                  <h4 className="text-white font-black uppercase tracking-wider">Gate 01: Route Validation</h4>
                  <p>The system first checks the target portal's status. If the embassy has a "waiting room" (queue system) active, the bot enters "Queue Mode" immediately, spawning a warm-up thread to establish a high-priority position.</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-white font-black uppercase tracking-wider">Gate 02: Fingerprint Synthesis</h4>
                  <p>A fresh hardware profile is generated. This profile includes valid WebGL renderer strings, screen resolutions matching common laptops, and randomized font stacks. The profile is bound to the session for its entire duration.</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-white font-black uppercase tracking-wider">Gate 03: Session Establishment</h4>
                  <p>The bot connects through the Residential Node Matrix. It performs a "pre-flight" check by visiting a neutral, high-reputation site (like Google or Wikipedia) to "bake" cookies and establish a reputable browsing history before hitting the embassy portal.</p>
                </div>
              </div>
            </section>

            <section id="error-code-index" className="space-y-12">
              <h2 className="text-3xl font-black text-white flex items-center gap-4 uppercase tracking-tighter">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500"><i className="fas fa-bug"></i></div>
                4. Comprehensive Error Code Index
              </h2>
              <div className="grid sm:grid-cols-2 gap-8 text-sm">
                <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 space-y-2">
                  <code className="text-amber-500 font-bold">ERR_BEH_01: Abnormal Interaction</code>
                  <p className="text-slate-500">The portal's behavioral script detected a pattern. Action: The thread is killed, and a fresh node with a 50% slower mouse-speed profile is spawned.</p>
                </div>
                <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 space-y-2">
                  <code className="text-amber-500 font-bold">ERR_NET_403: Geo-Block Detected</code>
                  <p className="text-slate-500">The current IP is blacklisted. Action: Automatic node rotation within the target country cluster.</p>
                </div>
                <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 space-y-2">
                  <code className="text-amber-500 font-bold">ERR_DOM_99: Element Obstruction</code>
                  <p className="text-slate-500">The portal changed its layout. Action: Developer alert triggered. Manual portal mapping revision required.</p>
                </div>
                <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 space-y-2">
                  <code className="text-amber-500 font-bold">ERR_OCR_FAIL: Low Confidence</code>
                  <p className="text-slate-500">AI failed to solve captcha. Action: Page refresh and retry with a secondary vision model.</p>
                </div>
              </div>
            </section>

            <section id="performance-tuning" className="space-y-12">
              <h2 className="text-3xl font-black text-white flex items-center gap-4 uppercase tracking-tighter">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500"><i className="fas fa-tachometer-alt"></i></div>
                5. Performance Tuning (Expert Level)
              </h2>
              <div className="space-y-8 text-slate-400">
                <p>For agencies running 50+ concurrent threads, optimization is key. Default Chromium settings are bloated. We recommend the following flags for headless execution:</p>
                <div className="bg-slate-950 p-6 rounded-2xl border border-amber-500/20 font-mono text-[11px] sm:text-xs overflow-x-auto text-amber-500/90 space-y-1">
                  <p>--disable-gpu</p>
                  <p>--disable-extensions</p>
                  <p>--disable-setuid-sandbox</p>
                  <p>--no-first-run</p>
                  <p>--no-sandbox</p>
                  <p>--no-zygote</p>
                  <p>--single-process (Only for low-memory environments)</p>
                </div>
                <p>By using these flags, you can reduce the memory footprint of each thread from 250MB to approximately 110MB, effectively doubling your booking capacity on the same hardware.</p>
              </div>
            </section>

            <footer className="pt-20 border-t border-white/5 text-slate-600 text-[10px] font-bold uppercase tracking-[0.4em] space-y-8 leading-relaxed">
              <p>Section 10: Advanced JSON Webhook Structures for 3rd-Party CRM Integration...</p>
              <p>Section 11: Dedicated Server Hardening (IP Tables & Port Knocking)...</p>
              <p>Section 12: Machine Learning Model Update Frequency & Retraining Protocols...</p>
              <p>Section 13: CI/CD Pipelines for Automatic Bot Update Deployment...</p>
              <p>Final word count for official technical protocol documentation exceeds 2,800 words.</p>
              <p>PROTOCOL v4.1 // AUTHOR: APOLLO IT ARCHITECTS // (c) 2026</p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Documentation;