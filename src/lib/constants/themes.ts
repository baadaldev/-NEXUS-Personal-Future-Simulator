import { ThemeConfig, ThemeId } from '@/types/nexus';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Void',
    tagline: 'Deep space obsidian with cyan neon & purple radial aura',
    accentHex: '#06b6d4',
    accentClass: 'text-cyan-400 border-cyan-500/30',
    bgHex: '#05070f',
    cardBgHex: 'rgba(15, 23, 42, 0.75)',
    particleColors: {
      primary: 'rgba(6, 182, 212,',
      secondary: 'rgba(139, 92, 246,',
      bg: '#05070f',
    },
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Cyber',
    tagline: 'Deep abyssal navy with electric blue & hot magenta glow',
    accentHex: '#3b82f6',
    accentClass: 'text-blue-400 border-blue-500/30',
    bgHex: '#070b1a',
    cardBgHex: 'rgba(17, 24, 52, 0.75)',
    particleColors: {
      primary: 'rgba(59, 130, 246,',
      secondary: 'rgba(236, 72, 153,',
      bg: '#070b1a',
    },
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix Terminal',
    tagline: 'Classic cybernetic hacker console with emerald phosphors',
    accentHex: '#10b981',
    accentClass: 'text-emerald-400 border-emerald-500/30',
    bgHex: '#030d06',
    cardBgHex: 'rgba(10, 30, 18, 0.75)',
    particleColors: {
      primary: 'rgba(16, 185, 129,',
      secondary: 'rgba(52, 211, 153,',
      bg: '#030d06',
    },
  },
  sunset: {
    id: 'sunset',
    name: 'Solar Sunset',
    tagline: 'Warm cosmic dusk with golden amber & crimson dawn radiance',
    accentHex: '#f59e0b',
    accentClass: 'text-amber-400 border-amber-500/30',
    bgHex: '#120904',
    cardBgHex: 'rgba(36, 20, 12, 0.75)',
    particleColors: {
      primary: 'rgba(245, 158, 11,',
      secondary: 'rgba(244, 63, 94,',
      bg: '#120904',
    },
  },
  light: {
    id: 'light',
    name: 'Clean Horizon',
    tagline: 'Modern high-contrast architectural slate & vivid indigo',
    accentHex: '#6366f1',
    accentClass: 'text-indigo-600 border-indigo-400/30',
    bgHex: '#0f172a',
    cardBgHex: 'rgba(30, 41, 59, 0.85)',
    particleColors: {
      primary: 'rgba(99, 102, 241,',
      secondary: 'rgba(14, 165, 233,',
      bg: '#0f172a',
    },
  },
};

export const THEME_LIST = Object.values(THEMES);
