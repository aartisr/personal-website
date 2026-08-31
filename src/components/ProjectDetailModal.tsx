import React, { useState } from 'react';
import { Project, ThemeMode } from '../types';
import { 
  X, 
  Github, 
  ExternalLink, 
  Code2, 
  Layers, 
  Zap, 
  Copy, 
  Check, 
  Sparkles, 
  Activity,
  Terminal
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  theme: ThemeMode;
  onClose: () => void;
  onOpenMathDemo: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  theme,
  onClose,
  onOpenMathDemo
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'code' | 'metrics'>('overview');
  const [copied, setCopied] = useState(false);

  if (!project) return null;

  const handleCopyCode = () => {
    if (project.codeSnippet) {
      navigator.clipboard.writeText(project.codeSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      
      {/* Backdrop click listener */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card Container */}
      <div 
        id="project-modal-container"
        className={`relative w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden my-8 transition-all ${
          theme === 'dark'
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        
        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-slate-800/60 relative">
          <button
            id="project-modal-close-btn"
            onClick={onClose}
            className={`absolute top-6 right-6 p-2 rounded-xl border transition-colors ${
              theme === 'dark'
                ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/20">
              {project.categoryLabel}
            </span>
            {project.stars && (
              <span className="text-xs font-mono text-slate-400 flex items-center space-x-1">
                <span>★ {project.stars} Stars</span>
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-4xl font-display font-bold pr-12">
            {project.title}
          </h2>
          <p className={`mt-2 text-sm sm:text-base ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            {project.tagline}
          </p>

          {/* Tab Navigation */}
          <div className="mt-6 flex space-x-2 border-b border-slate-800/40 pb-0 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview & Spec', icon: Layers },
              { id: 'architecture', label: 'Architecture', icon: Zap },
              { id: 'code', label: 'Code Snippet', icon: Code2 },
              { id: 'metrics', label: 'Metrics', icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`project-modal-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-amber-400 text-amber-400 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 min-h-[300px]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold mb-2">
                  System Context & Problem Statement
                </h4>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {project.longDescription}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold mb-3">
                  Core Engineering Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.keyFeatures.map((feat, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border flex items-start space-x-2.5 ${
                      theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                      <span className="text-xs font-sans text-slate-300 leading-normal">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  Technology Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-800 border border-slate-700 text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold mb-2">
                  Data Flow Topology & Execution Pipeline
                </h4>
                <div className={`p-4 rounded-xl font-mono text-xs border leading-relaxed ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800 text-amber-300/90' : 'bg-slate-900 text-amber-300'
                }`}>
                  {project.architectureOverview}
                </div>
              </div>

              <div className={`p-5 rounded-2xl border ${
                theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center space-x-2 mb-3">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-xs font-semibold text-emerald-400 uppercase">
                    Execution Guarantees
                  </span>
                </div>
                <ul className="space-y-2 text-xs font-sans text-slate-300">
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Memory allocations bounded via pre-allocated array buffers</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Zero cyclic topological dependencies evaluated during runtime build phase</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Strict type safety enforced across all ingress and egress boundaries</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: CODE SNIPPET */}
          {activeTab === 'code' && project.codeSnippet && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-amber-400">
                  {project.codeSnippet.filename}
                </span>
                <button
                  id="project-modal-copy-code-btn"
                  onClick={handleCopyCode}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono border transition-colors ${
                    copied
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Snippet'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                <code>{project.codeSnippet.code}</code>
              </pre>
            </div>
          )}

          {/* TAB 4: METRICS */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold mb-2">
                Performance Benchmarks & Profiling Telemetry
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {project.metrics.map((m, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="text-3xl font-display font-bold text-amber-400 mb-1">
                      {m.value}
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              id="project-modal-repo-link"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs transition-colors border border-slate-700"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>

            {project.hasInteractiveDemo && (
              <button
                id="project-modal-demo-btn"
                onClick={() => {
                  onClose();
                  onOpenMathDemo();
                }}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-semibold text-xs transition-colors shadow-lg shadow-amber-400/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Interactive Demo</span>
              </button>
            )}
          </div>

          <button
            id="project-modal-done-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
