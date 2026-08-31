export type ThemeMode = 'dark' | 'light';

export type ProjectCategory = 'all' | 'systems' | 'ai-ml' | 'math' | 'web' | 'gis';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: ProjectCategory;
  categoryLabel: string;
  description: string;
  longDescription: string;
  repoUrl: string;
  liveUrl?: string;
  featured: boolean;
  stars?: number;
  forks?: number;
  tags: string[];
  metrics: { label: string; value: string }[];
  keyFeatures: string[];
  architectureOverview: string;
  codeSnippet?: {
    language: string;
    filename: string;
    code: string;
  };
  hasInteractiveDemo?: boolean;
}

export interface SkillGroup {
  category: string;
  iconName: string;
  skills: {
    name: string;
    level: number; // 0 to 100
    description: string;
    highlight?: boolean;
  }[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  type: 'education' | 'research' | 'engineering' | 'honor';
  description: string;
  highlights: string[];
  skillsUsed: string[];
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
  content: string;
  tags: string[];
}

export interface SystemStats {
  performanceScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  seoScore: number;
  loadTimeMs: number;
  bundleSizeKb: number;
}
