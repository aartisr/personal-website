import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ThemeMode } from '../types';
import { 
  ArrowRight, 
  Github, 
  Linkedin, 
  Mail, 
  Sparkles, 
  Terminal, 
  Zap, 
  Code2, 
  Layers, 
  Globe,
  Award
} from 'lucide-react';

interface HeroProps {
  theme: ThemeMode;
  onExploreProjects: () => void;
  onOpenMathDemo: () => void;
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  theme,
  onExploreProjects,
  onOpenMathDemo,
  onOpenContact,
}) => {
  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-blue-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern */}
      <div className={`absolute inset-0 pointer-events-none ${theme === 'dark' ? 'bg-grid-pattern' : 'bg-grid-pattern-light'}`} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Status Badge */}
        <div className="flex items-center space-x-3 mb-6">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-mono transition-colors ${
            theme === 'dark'
              ? 'bg-slate-900/90 border-slate-800 text-slate-300'
              : 'bg-white/90 border-slate-200 text-slate-700 shadow-sm'
          }`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{PERSONAL_INFO.availableFor}</span>
          </div>
        </div>

        {/* Main Headline & Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-mono tracking-wider uppercase text-amber-400 font-semibold">
                Systems Architect & Research Engineer
              </p>
              <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[1.08] ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Engineering <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">simplistic</span> solutions for complex systems.
              </h1>
            </div>

            <p className={`text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Hi, I'm <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Aarti Sri Ravikumar</strong> (<code className="text-amber-400 font-mono text-sm px-1 py-0.5 rounded bg-amber-400/10">aartisr</code>). PCSS scholar building high-performance reactive state graph runtimes, WebGL visual math engines, and spatial informatics pipelines.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <button
                id="hero-explore-projects-btn"
                onClick={onExploreProjects}
                className="group flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-amber-400 text-slate-950 font-display font-semibold text-sm hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20 hover:shadow-amber-400/30"
              >
                <span>Explore Showcase</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-math-demo-btn"
                onClick={onOpenMathDemo}
                className={`flex items-center space-x-2 px-6 py-3.5 rounded-xl font-display font-medium text-sm border transition-all ${
                  theme === 'dark'
                    ? 'border-slate-800 bg-slate-900/80 text-slate-200 hover:border-amber-400/50 hover:bg-slate-800'
                    : 'border-slate-300 bg-white text-slate-800 hover:border-amber-500/50 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Interactive Math Canvas</span>
              </button>

              <button
                id="hero-contact-btn"
                onClick={onOpenContact}
                className={`flex items-center space-x-2 px-5 py-3.5 rounded-xl font-display font-medium text-sm transition-colors ${
                  theme === 'dark'
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail className="w-4 h-4 text-slate-400" />
                <span>Contact</span>
              </button>
            </div>

            {/* Social Icons Quick Links */}
            <div className="pt-4 flex items-center space-x-4">
              <span className={`text-xs font-mono uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                Connect:
              </span>
              <a 
                href={PERSONAL_INFO.githubUrl} 
                target="_blank" 
                rel="noreferrer" 
                id="hero-github-link"
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="GitHub @aartisr"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href={PERSONAL_INFO.linkedinUrl} 
                target="_blank" 
                rel="noreferrer" 
                id="hero-linkedin-link"
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href={PERSONAL_INFO.peerlistUrl} 
                target="_blank" 
                rel="noreferrer" 
                id="hero-peerlist-link"
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Peerlist Profile"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right Card: Hero Metrics & Live Tech Card */}
          <div className="lg:col-span-4">
            <div className={`rounded-2xl p-6 border transition-all ${
              theme === 'dark'
                ? 'bg-slate-900/90 border-slate-800 shadow-2xl shadow-black/50'
                : 'bg-white border-slate-200 shadow-xl'
            }`}>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/40">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-400">
                    System Telemetry
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ONLINE
                </span>
              </div>

              {/* Metric Items */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-3.5 rounded-xl border ${
                  theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-2xl font-display font-bold text-amber-400">
                    &lt; 0.4ms
                  </div>
                  <div className={`text-xs font-mono mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    DAG Update Latency
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-2xl font-display font-bold text-amber-400">
                    60 FPS
                  </div>
                  <div className={`text-xs font-mono mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    WebGL 2.0 Render
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-2xl font-display font-bold text-emerald-400">
                    100/100
                  </div>
                  <div className={`text-xs font-mono mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Lighthouse Score
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-2xl font-display font-bold text-blue-400">
                    98.4%
                  </div>
                  <div className={`text-xs font-mono mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    GIS Telemetry Accuracy
                  </div>
                </div>
              </div>

              {/* Featured Stack Badges */}
              <div className="mt-5 pt-4 border-t border-slate-800/40">
                <p className={`text-xs font-mono mb-2.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Primary Stack Matrix:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['TypeScript', 'Python', 'WebGL 2.0', 'NumPy', 'React 19', 'GIS'].map((tag) => (
                    <span 
                      key={tag} 
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors ${
                        theme === 'dark'
                          ? 'bg-slate-800/50 border-slate-700/60 text-slate-300'
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
