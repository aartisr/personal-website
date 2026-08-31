import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ThemeMode } from '../types';
import { Mail, Copy, Check, Send, Github, Linkedin, Globe, Clock, Sparkles } from 'lucide-react';

interface ContactSectionProps {
  theme: ThemeMode;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ theme }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Systems Architecture & Research',
    message: ''
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    // Simulate clean submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: 'Systems Architecture & Research',
        message: ''
      });
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-left">
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-wider mb-2">
            <Mail className="w-4 h-4" />
            <span>Collaboration & Inquiries</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-display font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Get in Touch
          </h2>
          <p className={`mt-2 text-sm sm:text-base max-w-xl ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Available for systems architecture advisory, computational research discussions, and open-source inquiries. Zero clutter, rapid responses.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Info & Copy Email */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Email Box Card */}
            <div className={`p-6 rounded-2xl border ${
              theme === 'dark'
                ? 'bg-slate-900/90 border-slate-800 shadow-xl'
                : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase mb-3">
                <Mail className="w-4 h-4" />
                <span>Primary Transmission Address</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                <span className="text-amber-300 font-semibold truncate">
                  {PERSONAL_INFO.email}
                </span>
                <button
                  id="contact-copy-email-btn"
                  onClick={handleCopyEmail}
                  className={`ml-2 p-2 rounded-lg transition-colors flex items-center space-x-1 ${
                    copiedEmail
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span className="text-[10px] hidden sm:inline">{copiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Status Pill */}
              <div className="mt-4 pt-4 border-t border-slate-800/40 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Response SLA:</span>
                <span className="text-emerald-400 font-semibold">&lt; 24 Hours</span>
              </div>
            </div>

            {/* Social & Peer Profiles */}
            <div className={`p-6 rounded-2xl border ${
              theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <h4 className={`text-sm font-display font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Digital Footprint
              </h4>

              <div className="space-y-2.5">
                {[
                  { label: 'GitHub Repositories (@aartisr)', url: PERSONAL_INFO.githubUrl, icon: Github },
                  { label: 'LinkedIn Professional Profile', url: PERSONAL_INFO.linkedinUrl, icon: Linkedin },
                  { label: 'Peerlist Developer Portfolio', url: PERSONAL_INFO.peerlistUrl, icon: Globe },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                        theme === 'dark'
                          ? 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-amber-400/40 hover:text-amber-400'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-amber-500/40 hover:text-amber-600'
                      }`}
                    >
                      <div className="flex items-center space-x-2 text-xs font-mono">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-xs">→</span>
                    </a>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Message Composer Form */}
          <div className="lg:col-span-7">
            <div className={`p-6 sm:p-8 rounded-2xl border ${
              theme === 'dark'
                ? 'bg-slate-900/90 border-slate-800 shadow-2xl'
                : 'bg-white border-slate-200 shadow-md'
            }`}>
              <h3 className={`text-xl font-display font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Direct Message Composer
              </h3>
              <p className={`text-xs sm:text-sm mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Send a direct dispatch to Aarti Sri Ravikumar.
              </p>

              {submitted ? (
                <div className="p-8 text-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-2">
                  <Check className="w-8 h-8 mx-auto" />
                  <h4 className="font-display font-bold text-lg">Transmission Dispatched</h4>
                  <p className="text-xs font-mono text-emerald-300">
                    Thank you! Your message has been routed to Aarti's inbox.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-mono mb-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        Your Name *
                      </label>
                      <input
                        id="contact-name-input"
                        type="text"
                        required
                        placeholder="e.g. Elena Rostova"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl text-xs font-sans border focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${
                          theme === 'dark'
                            ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600'
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-mono mb-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        Your Email *
                      </label>
                      <input
                        id="contact-email-input"
                        type="email"
                        required
                        placeholder="e.g. elena@research.org"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl text-xs font-sans border focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${
                          theme === 'dark'
                            ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600'
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-mono mb-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      Inquiry Category
                    </label>
                    <select
                      id="contact-subject-select"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${
                        theme === 'dark'
                          ? 'bg-slate-950 border-slate-800 text-slate-200'
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="Systems Architecture & Research">Systems Architecture & Research</option>
                      <option value="Open Source Collaboration">Open Source Collaboration (Aether / Fractals)</option>
                      <option value="GIS & Spatial Informatics">GIS & Spatial Informatics Advisory</option>
                      <option value="General Technical Inquiry">General Technical Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-mono mb-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      Message Specification *
                    </label>
                    <textarea
                      id="contact-message-input"
                      required
                      rows={5}
                      placeholder="Describe your technical inquiry or collaboration scope..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs font-sans border focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${
                        theme === 'dark'
                          ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>

                  <button
                    id="contact-submit-btn"
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-amber-400/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>Dispatch Transmission</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
