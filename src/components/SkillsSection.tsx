import React, { useState } from 'react';
import { SKILL_GROUPS } from '../data/portfolioData';
import { ThemeMode } from '../types';
import { Cpu, Code2, Layout, Terminal, CheckCircle, Sparkles, ShieldCheck } from 'lucide-react';

interface SkillsSectionProps {
  theme: ThemeMode;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ theme }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(SKILL_GROUPS[0].category);

  const activeGroup = SKILL_GROUPS.find((g) => g.category === selectedCategory) || SKILL_GROUPS[0];

  const categoryIcons: Record<string, React.ReactNode> = {
    "Languages & Core": <Code2 className="w-4 h-4 text-amber-400" />,
    "Systems & Architecture": <Cpu className="w-4 h-4 text-amber-400" />,
    "Frontend & UI Craft": <Layout className="w-4 h-4 text-amber-400" />,
    "Tooling & Cloud": <Terminal className="w-4 h-4 text-amber-400" />,
  };

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-wider mb-2">
            <Cpu className="w-4 h-4" />
            <span>Systems Engineering & Competencies</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-display font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Engineering Competencies & Mastery
          </h2>
          <p className={`mt-2 text-sm sm:text-base max-w-xl ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Domain expertise across low-level reactive state engines, geospatial spatial telemetry pipelines, mathematical simulations, and modern web architectures.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {SKILL_GROUPS.map((group) => {
            const isActive = group.category === selectedCategory;
            return (
              <button
                key={group.category}
                id={`skills-tab-${group.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setSelectedCategory(group.category)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-semibold shadow-lg shadow-amber-400/20'
                    : theme === 'dark'
                    ? 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {categoryIcons[group.category]}
                <span>{group.category}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Skills List */}
          <div className={`lg:col-span-8 p-6 sm:p-8 rounded-2xl border ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-slate-800 shadow-xl'
              : 'bg-white border-slate-200 shadow-md'
          }`}>
            <h3 className="text-lg font-display font-bold mb-6 flex items-center space-x-2">
              <span>{activeGroup.category}</span>
              <span className="text-xs font-mono font-normal text-amber-400 px-2 py-0.5 rounded bg-amber-400/10">
                {activeGroup.skills.length} Competencies
              </span>
            </h3>

            <div className="space-y-6">
              {activeGroup.skills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`font-display font-semibold text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        {skill.name}
                      </span>
                      {skill.highlight && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-400/10 text-amber-400 border border-amber-400/20">
                          Core Specialization
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs text-amber-400 font-semibold">
                      {skill.level}%
                    </span>
                  </div>

                  {/* Meter Progress Bar */}
                  <div className={`w-full h-2 rounded-full overflow-hidden ${
                    theme === 'dark' ? 'bg-slate-950' : 'bg-slate-100'
                  }`}>
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>

                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Architectural Principles Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className={`p-6 rounded-2xl border ${
              theme === 'dark'
                ? 'bg-slate-900/90 border-slate-800 shadow-xl'
                : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-semibold uppercase mb-3">
                <ShieldCheck className="w-4 h-4" />
                <span>Architectural Manifesto</span>
              </div>

              <h4 className={`text-base font-display font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Core Design Axioms
              </h4>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className={`p-3 rounded-xl border ${
                  theme === 'dark' ? 'bg-slate-950/60 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <strong className="text-amber-400 font-mono block mb-1">1. Zero Cognitive Overload:</strong>
                  Interfaces should provide maximum clarity with minimal visual clutter. Information density scales with intent.
                </div>

                <div className={`p-3 rounded-xl border ${
                  theme === 'dark' ? 'bg-slate-950/60 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <strong className="text-amber-400 font-mono block mb-1">2. Deterministic State:</strong>
                  System mutations should follow acyclic DAG propagation rules for reproducible, race-condition-free runtime behavior.
                </div>

                <div className={`p-3 rounded-xl border ${
                  theme === 'dark' ? 'bg-slate-950/60 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <strong className="text-amber-400 font-mono block mb-1">3. Mechanical Sympathy:</strong>
                  Code should match runtime memory layouts (typed arrays, contiguous buffers, zero allocation hot loops).
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
