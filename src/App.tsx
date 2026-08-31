import React, { useState, useEffect } from 'react';
import { ThemeMode, Project } from './types';
import { PROJECTS_DATA } from './data/portfolioData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InteractiveFractalCanvas } from './components/InteractiveFractalCanvas';
import { ProjectsSection } from './components/ProjectsSection';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { SkillsSection } from './components/SkillsSection';
import { TimelineSection } from './components/TimelineSection';
import { WritingsSection } from './components/WritingsSection';
import { ContactSection } from './components/ContactSection';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { ResumeModal } from './components/ResumeModal';
import { PerformanceSeoWidget } from './components/PerformanceSeoWidget';
import { Footer } from './components/Footer';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Toggle Dark / Light mode
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Scroll spy to highlight active section in navbar
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'projects', 'demo-math', 'skills', 'experience', 'writings', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectProjectById = (projectId: string) => {
    const proj = PROJECTS_DATA.find((p) => p.id === projectId);
    if (proj) {
      setSelectedProject(proj);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Navbar */}
      <Navbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenResumeModal={() => setResumeModalOpen(true)}
        activeSection={activeSection}
      />

      {/* Main Page Content */}
      <main>
        {/* Hero Banner Section */}
        <Hero
          theme={theme}
          onExploreProjects={() => scrollToSection('projects')}
          onOpenMathDemo={() => scrollToSection('demo-math')}
          onOpenContact={() => scrollToSection('contact')}
        />

        {/* Featured Projects Section */}
        <ProjectsSection
          theme={theme}
          onSelectProject={(proj) => setSelectedProject(proj)}
          onOpenMathDemo={() => scrollToSection('demo-math')}
        />

        {/* Interactive Fractals & Visual Math Canvas */}
        <InteractiveFractalCanvas theme={theme} />

        {/* Skills & Systems Competencies */}
        <SkillsSection theme={theme} />

        {/* Experience & Academic Timeline */}
        <TimelineSection theme={theme} />

        {/* Research Writings & Notes */}
        <WritingsSection theme={theme} />

        {/* Contact & Inquiries Suite */}
        <ContactSection theme={theme} />
      </main>

      {/* Footer */}
      <Footer
        theme={theme}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* Modals & Overlays */}
      <ProjectDetailModal
        project={selectedProject}
        theme={theme}
        onClose={() => setSelectedProject(null)}
        onOpenMathDemo={() => scrollToSection('demo-math')}
      />

      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        theme={theme}
        onClose={() => setCommandPaletteOpen(false)}
        onToggleTheme={handleToggleTheme}
        onOpenResumeModal={() => setResumeModalOpen(true)}
        onSelectProject={handleSelectProjectById}
        onOpenMathDemo={() => scrollToSection('demo-math')}
      />

      <ResumeModal
        isOpen={resumeModalOpen}
        theme={theme}
        onClose={() => setResumeModalOpen(false)}
      />

      {/* Floating SEO & Performance Telemetry Drawer */}
      <PerformanceSeoWidget theme={theme} />

    </div>
  );
}
