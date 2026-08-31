import React, { useState, useEffect } from 'react';
import { ThemeMode } from '../types';
import { PERSONAL_INFO, PROJECTS_DATA } from '../data/portfolioData';
import { 
  Search, 
  Command, 
  Sun, 
  Moon, 
  FileText, 
  Mail, 
  Code2, 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Github, 
  X,
  ArrowRight
} from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  theme: ThemeMode;
  onClose: () => void;
  onToggleTheme: () => void;
  onOpenResumeModal: () => void;
  onSelectProject: (projectId: string) => void;
  onOpenMathDemo: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  theme,
  onClose,
  onToggleTheme,
  onOpenResumeModal,
  onSelectProject,
  onOpenMathDemo
}) => {
  const [query, setQuery] = useState('');

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'cmd-theme',
      label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      icon: theme === 'dark' ? Sun : Moon,
      action: () => {
        onToggleTheme();
        onClose();
      }
    },
    {
      id: 'cmd-resume',
      label: 'View Full Academic & Engineering CV',
      icon: FileText,
      action: () => {
        onClose();
        onOpenResumeModal();
      }
    },
    {
      id: 'cmd-math',
      label: 'Launch Interactive Complex Dynamics Canvas',
      icon: Sparkles,
      action: () => {
        onClose();
        onOpenMathDemo();
      }
    },
    {
      id: 'cmd-contact',
      label: 'Copy Email Address (aartisr.dev@gmail.com)',
      icon: Mail,
      action: () => {
        navigator.clipboard.writeText(PERSONAL_INFO.email);
        onClose();
      }
    },
    {
      id: 'cmd-github',
      label: 'Open GitHub Profile (@aartisr)',
      icon: Github,
      action: () => {
        window.open(PERSONAL_INFO.githubUrl, '_blank');
        onClose();
      }
    }
  ];

  const filteredProjects = PROJECTS_DATA.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredActions = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md">
      <div className="fixed inset-0" onClick={onClose} />

      <div className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden z-10 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800/60">
          <Search className="w-4 h-4 text-amber-400 mr-3" />
          <input
            id="command-palette-input"
            type="text"
            autoFocus
            placeholder="Type a command or project name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-sans focus:outline-none placeholder-slate-500"
          />
          <button
            id="command-palette-close-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command Options List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/40">
          
          {/* System Actions */}
          {filteredActions.length > 0 && (
            <div className="py-2">
              <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                System Commands
              </div>
              {filteredActions.map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.id}
                    id={act.id}
                    onClick={act.action}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-sans hover:bg-amber-400/10 hover:text-amber-400 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4 text-amber-400" />
                      <span>{act.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Projects Quick Jump */}
          {filteredProjects.length > 0 && (
            <div className="py-2">
              <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Project Repositories
              </div>
              {filteredProjects.map((proj) => (
                <button
                  key={proj.id}
                  id={`cmd-proj-${proj.id}`}
                  onClick={() => {
                    onClose();
                    onSelectProject(proj.id);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-sans hover:bg-amber-400/10 hover:text-amber-400 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <Code2 className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="font-semibold">{proj.title}</div>
                      <div className="text-[10px] font-mono text-slate-500 truncate max-w-md">{proj.tagline}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {proj.categoryLabel}
                  </span>
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>Navigate with mouse or keyboard</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">Esc</kbd> to close</span>
        </div>

      </div>
    </div>
  );
};
