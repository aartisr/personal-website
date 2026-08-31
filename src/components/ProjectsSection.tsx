import React, { useState, useMemo } from 'react';
import { Project, ProjectCategory, ThemeMode } from '../types';
import { PROJECTS_DATA } from '../data/portfolioData';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Github, 
  Star, 
  GitFork, 
  Sparkles, 
  Layers, 
  Code2, 
  LayoutGrid, 
  List,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';

interface ProjectsSectionProps {
  theme: ThemeMode;
  onSelectProject: (project: Project) => void;
  onOpenMathDemo: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  theme,
  onSelectProject,
  onOpenMathDemo
}) => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories: { id: ProjectCategory; label: string }[] = [
    { id: 'all', label: 'All Showcase' },
    { id: 'systems', label: 'Systems & Runtime' },
    { id: 'gis', label: 'Spatial & GIS' },
    { id: 'math', label: 'Visual Math' },
    { id: 'web', label: 'Web Architecture' },
    { id: 'ai-ml', label: 'AI & Compiler' },
  ];

  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter((project) => {
      const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-wider mb-2">
              <Code2 className="w-4 h-4" />
              <span>Engineered Projects & Repositories</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-display font-bold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Featured Project Showcase
            </h2>
            <p className={`mt-2 text-sm sm:text-base max-w-xl ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Open-source software systems, mathematical solvers, spatial informatics telemetry, and high-performance TypeScript state engines.
            </p>
          </div>

          {/* Search & View Mode Controls */}
          <div className="mt-6 md:mt-0 flex flex-wrap items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="projects-search-input"
                type="text"
                placeholder="Search stack, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-9 pr-4 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-900/90 border-slate-800 text-slate-200 placeholder-slate-500'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* View Grid / List Toggle */}
            <div className={`flex items-center p-1 rounded-xl border ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                id="projects-view-grid-btn"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                id="projects-view-list-btn"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`projects-cat-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-semibold shadow-md shadow-amber-400/20'
                    : theme === 'dark'
                    ? 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Empty Search Result */}
        {filteredProjects.length === 0 && (
          <div className={`text-center py-16 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <p className={`font-mono text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              No projects found matching "<strong className="text-amber-400">{searchQuery}</strong>"
            </p>
            <button
              id="projects-reset-search-btn"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-mono bg-amber-400 text-slate-950 font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* GRID VIEW */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                id={`project-card-${project.id}`}
                className={`group flex flex-col justify-between rounded-2xl p-6 border transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-slate-900/80 border-slate-800/80 hover:border-amber-400/40 hover:bg-slate-900 shadow-xl'
                    : 'bg-white border-slate-200 hover:border-amber-500/40 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  {/* Category Badge & Stars */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/20">
                      {project.categoryLabel}
                    </span>
                    {project.stars && (
                      <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>{project.stars}</span>
                        </span>
                        {project.forks && (
                          <span className="flex items-center space-x-1">
                            <GitFork className="w-3.5 h-3.5 text-slate-400" />
                            <span>{project.forks}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Title & Tagline */}
                  <h3 className={`text-xl font-display font-bold group-hover:text-amber-400 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {project.title}
                  </h3>
                  <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {project.tagline}
                  </p>

                  {/* Metric Chips */}
                  {project.metrics && project.metrics.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {project.metrics.slice(0, 2).map((m, idx) => (
                        <div key={idx} className={`p-2 rounded-lg border text-left ${
                          theme === 'dark' ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className="text-amber-400 font-display font-bold text-xs">
                            {m.value}
                          </div>
                          <div className={`text-[10px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Stack Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                          theme === 'dark'
                            ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                            : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-6 pt-4 border-t border-slate-800/40 flex items-center justify-between">
                  <button
                    id={`project-details-btn-${project.id}`}
                    onClick={() => onSelectProject(project)}
                    className="flex items-center space-x-1.5 text-xs font-mono font-semibold text-amber-400 hover:text-amber-300"
                  >
                    <span>Architecture Deep-Dive</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center space-x-2">
                    {project.hasInteractiveDemo && (
                      <button
                        id={`project-demo-btn-${project.id}`}
                        onClick={onOpenMathDemo}
                        className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/30 hover:bg-amber-400 hover:text-slate-950 transition-colors"
                        title="Interactive Canvas Demo"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      id={`project-repo-link-${project.id}`}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        theme === 'dark'
                          ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                          : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                      title="View GitHub Repository"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                id={`project-list-card-${project.id}`}
                className={`p-5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-900/80 border-slate-800 hover:border-amber-400/40'
                    : 'bg-white border-slate-200 hover:border-amber-500/40 shadow-sm'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-400/10 text-amber-400 border border-amber-400/20">
                      {project.categoryLabel}
                    </span>
                    <h3 className={`text-lg font-display font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {project.title}
                    </h3>
                  </div>
                  <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    {project.tagline}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-mono text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0">
                  <button
                    id={`project-list-details-btn-${project.id}`}
                    onClick={() => onSelectProject(project)}
                    className="px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors"
                  >
                    View Specs
                  </button>
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    id={`project-list-repo-${project.id}`}
                    className={`p-2 rounded-xl border ${
                      theme === 'dark' ? 'border-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
