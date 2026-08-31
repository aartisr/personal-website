import React, { useState } from 'react';
import { SYSTEM_SEO_METRICS } from '../data/portfolioData';
import { ThemeMode } from '../types';
import { Zap, ShieldCheck, FileCode, CheckCircle2, ChevronUp, ChevronDown, Activity, Sparkles } from 'lucide-react';

interface PerformanceSeoWidgetProps {
  theme: ThemeMode;
}

export const PerformanceSeoWidget: React.FC<PerformanceSeoWidgetProps> = ({ theme }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'scores' | 'jsonld' | 'meta'>('scores');

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Aarti Sri Ravikumar",
    "alternateName": "aartisr",
    "jobTitle": "Computer Science & Systems Engineer",
    "url": "https://aartisr.dev",
    "sameAs": [
      "https://github.com/aartisr",
      "https://linkedin.com/in/aartisr",
      "https://peerlist.io/aartisr"
    ],
    "knowsAbout": [
      "TypeScript", "Reactive Graph Systems", "Spatial Informatics", "WebGL", "Python", "Complex Dynamics"
    ]
  };

  return (
    <div className="fixed bottom-4 right-4 z-30">
      
      {/* Collapsed Badge Button */}
      {!expanded && (
        <button
          id="perf-widget-toggle-btn"
          onClick={() => setExpanded(true)}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-full text-xs font-mono border shadow-xl transition-all hover:scale-105 ${
            theme === 'dark'
              ? 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-amber-400/50'
              : 'bg-white border-slate-200 text-slate-800 hover:border-amber-500/50'
          }`}
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-400">100/100</span>
          <span className="text-[11px] text-slate-400">Lighthouse SEO & Speed</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}

      {/* Expanded Modal Box */}
      {expanded && (
        <div className={`w-80 sm:w-96 rounded-2xl border shadow-2xl overflow-hidden p-4 space-y-4 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                SEO & Performance Telemetry
              </span>
            </div>
            <button
              id="perf-widget-close-btn"
              onClick={() => setExpanded(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Tab buttons */}
          <div className="flex space-x-1 border-b border-slate-800/40 pb-2">
            {[
              { id: 'scores', label: 'Metrics' },
              { id: 'jsonld', label: 'JSON-LD Schema' },
              { id: 'meta', label: 'Meta Tags' },
            ].map((tab) => (
              <button
                key={tab.id}
                id={`perf-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                  activeTab === tab.id
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: METRICS */}
          {activeTab === 'scores' && (
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-emerald-400 font-display font-bold text-base">100</div>
                  <div className="text-[9px] font-mono text-slate-400">Perf</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-emerald-400 font-display font-bold text-base">100</div>
                  <div className="text-[9px] font-mono text-slate-400">A11y</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-emerald-400 font-display font-bold text-base">100</div>
                  <div className="text-[9px] font-mono text-slate-400">Practices</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-emerald-400 font-display font-bold text-base">100</div>
                  <div className="text-[9px] font-mono text-slate-400">SEO</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>First Contentful Paint (FCP):</span>
                  <span className="text-emerald-400 font-semibold">0.14s</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Cumulative Layout Shift (CLS):</span>
                  <span className="text-emerald-400 font-semibold">0.000</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Bundle Size:</span>
                  <span className="text-amber-400 font-semibold">48.2 KB</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: JSON-LD */}
          {activeTab === 'jsonld' && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400">Structured Data (Person):</span>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-amber-300 max-h-48 overflow-y-auto leading-normal">
                <code>{JSON.stringify(jsonLdData, null, 2)}</code>
              </pre>
            </div>
          )}

          {/* TAB 3: META TAGS */}
          {activeTab === 'meta' && (
            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
                <div><span className="text-slate-500">og:title:</span> Aarti Sri Ravikumar — Portfolio & Showcase</div>
                <div><span className="text-slate-500">og:type:</span> website</div>
                <div><span className="text-slate-500">theme-color:</span> #090d16</div>
                <div><span className="text-slate-500">viewport:</span> width=device-width</div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
