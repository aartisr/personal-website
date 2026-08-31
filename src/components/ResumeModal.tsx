import React from 'react';
import { PERSONAL_INFO, PROJECTS_DATA, EXPERIENCE_DATA, SKILL_GROUPS } from '../data/portfolioData';
import { ThemeMode } from '../types';
import { X, Printer, Download, Mail, Github, Globe, MapPin, ExternalLink } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  theme: ThemeMode;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, theme, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className={`relative w-full max-w-4xl rounded-2xl border shadow-2xl p-6 sm:p-10 my-8 max-h-[90vh] overflow-y-auto ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Top Actions */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800/60 print:hidden">
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-400">
            <span>Curriculum Vitae</span>
            <span>•</span>
            <span>ATS Optimized</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="resume-modal-print-btn"
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-semibold text-xs transition-colors shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              id="resume-modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Document */}
        <div id="printable-cv" className="space-y-8 text-left font-sans">
          
          {/* Header */}
          <div className="border-b border-slate-700/60 pb-6">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-amber-400 tracking-tight">
              {PERSONAL_INFO.name}
            </h1>
            <p className="text-sm font-mono text-slate-400 mt-1">
              {PERSONAL_INFO.title} • GitHub: <code className="text-amber-400">@aartisr</code>
            </p>

            <div className="flex flex-wrap gap-4 mt-3 text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{PERSONAL_INFO.email}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{PERSONAL_INFO.location}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Github className="w-3.5 h-3.5 text-amber-400" />
                <span>github.com/aartisr</span>
              </span>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-2">
              Executive Summary
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              {PERSONAL_INFO.bio}
            </p>
          </div>

          {/* Education & Academic Milestones */}
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-3">
              Academic & Research Track
            </h2>
            <div className="space-y-4">
              {EXPERIENCE_DATA.map((exp) => (
                <div key={exp.id} className="border-l-2 border-amber-400/40 pl-4 space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <strong className="text-white text-sm font-sans">{exp.role}</strong>
                    <span className="text-slate-400">{exp.period}</span>
                  </div>
                  <div className="text-xs font-mono text-amber-400">{exp.organization} — {exp.location}</div>
                  <p className="text-xs text-slate-300 pt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills Matrix */}
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-3">
              Core Technical Competencies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {SKILL_GROUPS.map((grp) => (
                <div key={grp.category} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-mono font-semibold text-amber-400 mb-1">{grp.category}</div>
                  <div className="text-slate-300 leading-normal">
                    {grp.skills.map((s) => s.name).join(' • ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Source Projects */}
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-3">
              Key Open Source & Systems Repositories
            </h2>
            <div className="space-y-3">
              {PROJECTS_DATA.slice(0, 4).map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between font-mono">
                    <strong className="text-white">{p.title}</strong>
                    <span className="text-amber-400">{p.categoryLabel}</span>
                  </div>
                  <p className="text-slate-300">{p.tagline}</p>
                  <div className="text-[10px] font-mono text-slate-400">
                    Stack: {p.tags.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
