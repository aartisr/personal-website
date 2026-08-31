import React, { useState } from 'react';
import { EXPERIENCE_DATA } from '../data/portfolioData';
import { ThemeMode } from '../types';
import { GraduationCap, Briefcase, Award, Microscope, Calendar, MapPin, CheckCircle } from 'lucide-react';

interface TimelineSectionProps {
  theme: ThemeMode;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ theme }) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredItems = filterType === 'all'
    ? EXPERIENCE_DATA
    : EXPERIENCE_DATA.filter((item) => item.type === filterType);

  const typeIcons: Record<string, React.ReactNode> = {
    education: <GraduationCap className="w-4 h-4 text-amber-400" />,
    research: <Microscope className="w-4 h-4 text-amber-400" />,
    engineering: <Briefcase className="w-4 h-4 text-amber-400" />,
    honor: <Award className="w-4 h-4 text-amber-400" />,
  };

  return (
    <section id="experience" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-wider mb-2">
              <GraduationCap className="w-4 h-4" />
              <span>Academic & Research Trajectory</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-display font-bold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Experience & Academic Journey
            </h2>
            <p className={`mt-2 text-sm sm:text-base max-w-xl ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Computer Science & Systems scholarship, computational informatics research fellowships, and open-source leadership.
            </p>
          </div>

          {/* Type Filter Buttons */}
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Milestones' },
              { id: 'education', label: 'Academic' },
              { id: 'research', label: 'Research' },
              { id: 'engineering', label: 'Engineering' },
            ].map((t) => {
              const isActive = filterType === t.id;
              return (
                <button
                  key={t.id}
                  id={`timeline-filter-${t.id}`}
                  onClick={() => setFilterType(t.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-semibold shadow-md shadow-amber-400/20'
                      : theme === 'dark'
                      ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline Stack */}
        <div className="relative border-l-2 border-slate-800/80 ml-4 sm:ml-8 space-y-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="relative pl-6 sm:pl-10 group">
              
              {/* Node Circle */}
              <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-400/20 group-hover:scale-110 transition-transform">
                {typeIcons[item.type] || <Briefcase className="w-4 h-4" />}
              </div>

              {/* Card Container */}
              <div className={`p-6 rounded-2xl border transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-800/80 hover:border-amber-400/40 shadow-xl'
                  : 'bg-white border-slate-200 hover:border-amber-500/40 shadow-sm'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className={`text-xl font-display font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {item.role}
                    </h3>
                    <p className="text-sm font-mono text-amber-400 font-medium">
                      {item.organization}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.period}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.location}</span>
                    </span>
                  </div>
                </div>

                <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {item.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-2 mb-4">
                  {item.highlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{hl}</span>
                    </li>
                  ))}
                </ul>

                {/* Skills used */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/40">
                  {item.skillsUsed.map((sk) => (
                    <span key={sk} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800/60 text-slate-400 border border-slate-700/40">
                      {sk}
                    </span>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
