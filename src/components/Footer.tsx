import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ThemeMode } from '../types';
import { ArrowUp, Github, Linkedin, Globe, Heart, Clock } from 'lucide-react';

interface FooterProps {
  theme: ThemeMode;
  onOpenCommandPalette: () => void;
}

export const Footer: React.FC<FooterProps> = ({ theme, onOpenCommandPalette }) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Los_Angeles',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setTimeStr(now.toLocaleTimeString('en-US', options) + ' PT');
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`border-t py-12 transition-colors ${
      theme === 'dark' ? 'bg-slate-950 border-slate-800/80 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/40">
          
          {/* Brand Info */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-display font-bold flex items-center justify-center text-sm shadow-md shadow-amber-400/20">
              AS
            </div>
            <div>
              <div className={`font-display font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Aarti Sri Ravikumar
              </div>
              <p className="text-xs font-mono text-slate-500">
                @aartisr • Personal Website & Systems Portfolio
              </p>
            </div>
          </div>

          {/* Local Time Indicator */}
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>San Francisco: <strong className="text-amber-300">{timeStr}</strong></span>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a href={PERSONAL_INFO.githubUrl} target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href={PERSONAL_INFO.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href={PERSONAL_INFO.peerlistUrl} target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">
              <Globe className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div>
            © {new Date().getFullYear()} Aarti Sri Ravikumar. Engineered for zero cognitive overload & 100/100 performance.
          </div>

          <button
            id="footer-back-to-top"
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-amber-400/50 hover:text-amber-400 transition-all"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
