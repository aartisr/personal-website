import React, { useState } from 'react';
import { Article, ThemeMode } from '../types';
import { ARTICLES_DATA } from '../data/portfolioData';
import { BookOpen, Clock, Tag, ArrowRight, X, Copy, Check, Share2 } from 'lucide-react';

interface WritingsSectionProps {
  theme: ThemeMode;
}

export const WritingsSection: React.FC<WritingsSectionProps> = ({ theme }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = (article: Article) => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="writings" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Research & Technical Writings</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-display font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Articles & Systems Publications
          </h2>
          <p className={`mt-2 text-sm sm:text-base max-w-xl ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Deep-dives into reactive state graph topology, WebGL GPU numerical simulation, and multispectral spatial informatics.
          </p>
        </div>

        {/* Articles Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES_DATA.map((article) => (
            <div
              key={article.id}
              id={`article-card-${article.id}`}
              className={`flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-800/80 hover:border-amber-400/40 hover:bg-slate-900 shadow-xl'
                  : 'bg-white border-slate-200 hover:border-amber-500/40 shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                  <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    {article.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className={`text-xl font-display font-bold leading-snug hover:text-amber-400 transition-colors cursor-pointer ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
                onClick={() => setSelectedArticle(article)}
                >
                  {article.title}
                </h3>

                <p className={`mt-3 text-xs sm:text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {article.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/40 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  {article.date}
                </span>

                <button
                  id={`article-read-btn-${article.id}`}
                  onClick={() => setSelectedArticle(article)}
                  className="flex items-center space-x-1 text-xs font-mono font-semibold text-amber-400 hover:text-amber-300"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="fixed inset-0" onClick={() => setSelectedArticle(null)} />

          <div className={`relative w-full max-w-3xl rounded-2xl border shadow-2xl p-6 sm:p-10 my-8 ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-amber-400/10 text-amber-400 border border-amber-400/20">
                {selectedArticle.category} • {selectedArticle.readTime}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  id="article-share-btn"
                  onClick={() => handleShare(selectedArticle)}
                  className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white"
                  title="Share Link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>

                <button
                  id="article-modal-close-btn"
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-display font-bold leading-tight mb-4">
              {selectedArticle.title}
            </h2>

            <p className="text-xs font-mono text-slate-400 mb-8 border-b border-slate-800/60 pb-4">
              Published on {selectedArticle.date} by Aarti Sri Ravikumar (aartisr)
            </p>

            {/* Markdown / Formatted Text Content */}
            <div className={`space-y-4 text-sm leading-relaxed font-sans whitespace-pre-line ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              {selectedArticle.content}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/60 flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                {selectedArticle.tags.map((t) => (
                  <span key={t} className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md">
                    #{t}
                  </span>
                ))}
              </div>

              <button
                id="article-modal-done-btn"
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono bg-amber-400 text-slate-950 font-semibold"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
