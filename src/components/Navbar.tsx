import React, { useState, useEffect } from 'react';
import { ThemeMode } from '../types';
import { 
  Terminal, 
  Sun, 
  Moon, 
  Command, 
  Sparkles, 
  Menu, 
  X,
  FileText,
  Code2
} from 'lucide-react';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenCommandPalette: () => void;
  onOpenResumeModal: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onOpenCommandPalette,
  onOpenResumeModal,
  activeSection
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'projects', label: 'Projects' },
    { id: 'demo-math', label: 'Interactive Math' },
    { id: 'skills', label: 'Systems & Skills' },
    { id: 'experience', label: 'Timeline' },
    { id: 'writings', label: 'Writings' },
    { id: 'contact', label: 'Contact' },
  ];

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? theme === 'dark'
            ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-xl shadow-black/20'
            : 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-md'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo / Brand */}
          <button 
            id="nav-brand-btn"
            onClick={() => scrollTo('hero')} 
            className="group flex items-center space-x-3 text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-bold font-display shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              AS
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`font-display font-semibold text-lg tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Aarti Sri Ravikumar
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  aartisr
                </span>
              </div>
              <p className={`text-xs font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Computer Science & Systems
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-slate-900/40 dark:bg-slate-900/60 p-1.5 rounded-full border border-slate-800/60 backdrop-blur-sm">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => scrollTo(item.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-semibold shadow-md shadow-amber-400/20'
                      : theme === 'dark'
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Resume Button */}
            <button
              id="nav-resume-btn"
              onClick={onOpenResumeModal}
              className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                theme === 'dark'
                  ? 'border-slate-800 bg-slate-900/80 text-slate-300 hover:text-amber-400 hover:border-amber-400/40'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:text-amber-600 hover:border-amber-500/40'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Resume</span>
            </button>

            {/* Command Palette Trigger */}
            <button
              id="nav-cmd-btn"
              onClick={onOpenCommandPalette}
              title="Open Command Palette (Cmd + K)"
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                theme === 'dark'
                  ? 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  : 'border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Command className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden lg:inline">Cmd K</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              id="nav-theme-toggle"
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className={`p-2 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'border-slate-800 bg-slate-900 text-amber-400 hover:bg-slate-800'
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="nav-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden px-4 pt-3 pb-6 border-b shadow-2xl ${
          theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-link-${item.id}`}
                onClick={() => scrollTo(item.id)}
                className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-amber-400/10 text-amber-400 font-semibold border border-amber-400/30'
                    : theme === 'dark'
                    ? 'text-slate-300 hover:bg-slate-900'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 flex items-center space-x-2">
              <button
                id="mobile-nav-resume-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResumeModal();
                }}
                className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg bg-amber-400 text-slate-950 font-medium text-sm"
              >
                <FileText className="w-4 h-4" />
                <span>View Full CV</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
