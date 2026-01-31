import type { EraKey, EraTheme, EraThemes } from '@/types';

export const eraThemes: EraThemes = {
  prehistoric: {
    name: 'Prehistoric',
    bgColor: '#1a1410',
    textColor: '#d4c4b0',
    accentColor: '#c85a17',
    borderColor: '#5a3a22',
    fontFamily: 'Georgia, serif',
    pattern: 'cave-art',
    icon: '🦴'
  },
  ancient: {
    name: 'Ancient',
    bgColor: '#2d2418',
    textColor: '#e8dcc8',
    accentColor: '#c9a961',
    borderColor: '#8b7355',
    fontFamily: 'Georgia, serif',
    pattern: 'hieroglyph',
    icon: '🏛️'
  },
  classical: {
    name: 'Classical',
    bgColor: '#3d2817',
    textColor: '#f5e6d3',
    accentColor: '#c9a961',
    borderColor: '#a08060',
    fontFamily: 'Georgia, serif',
    pattern: 'greek-column',
    icon: '🏺'
  },
  medieval: {
    name: 'Medieval',
    bgColor: '#2a1f1a',
    textColor: '#dccbb6',
    accentColor: '#8b0000',
    borderColor: '#4a3728',
    fontFamily: 'Georgia, serif',
    pattern: 'illuminated',
    icon: '⚔️'
  },
  renaissance: {
    name: 'Renaissance',
    bgColor: '#3d3028',
    textColor: '#f0e6dc',
    accentColor: '#cd853f',
    borderColor: '#8b6914',
    fontFamily: 'Georgia, serif',
    pattern: 'ornate',
    icon: '🎨'
  },
  industrial: {
    name: 'Industrial',
    bgColor: '#2c2c2c',
    textColor: '#d0d0d0',
    accentColor: '#b87333',
    borderColor: '#4a4a4a',
    fontFamily: 'Times New Roman, serif',
    pattern: 'steam',
    icon: '⚙️'
  },
  earlyModern: {
    name: 'Early Modern',
    bgColor: '#3d3d3d',
    textColor: '#e8e8e8',
    accentColor: '#4682b4',
    borderColor: '#5a5a5a',
    fontFamily: 'Arial, sans-serif',
    pattern: 'deco',
    icon: '📻'
  },
  modern: {
    name: 'Modern',
    bgColor: '#1e3a5f',
    textColor: '#ffffff',
    accentColor: '#00bfff',
    borderColor: '#4a90e2',
    fontFamily: 'Helvetica, Arial, sans-serif',
    pattern: 'clean',
    icon: '🌐'
  },
  nearFuture: {
    name: 'Near Future',
    bgColor: '#0d1f2d',
    textColor: '#e0f7fa',
    accentColor: '#00e5ff',
    borderColor: '#1a659e',
    fontFamily: 'Consolas, monospace',
    pattern: 'tech',
    icon: '🚀'
  },
  future: {
    name: 'Future',
    bgColor: '#0a0a1a',
    textColor: '#e0e0ff',
    accentColor: '#ff00ff',
    borderColor: '#4b0082',
    fontFamily: 'Consolas, monospace',
    pattern: 'cyber',
    icon: '🤖'
  },
  farFuture: {
    name: 'Far Future',
    bgColor: '#050510',
    textColor: '#c0c0ff',
    accentColor: '#00ff88',
    borderColor: '#2d1b69',
    fontFamily: 'Consolas, monospace',
    pattern: 'holographic',
    icon: '🧬'
  },
  deepFuture: {
    name: 'Deep Future',
    bgColor: '#000000',
    textColor: '#00ff00',
    accentColor: '#00ff00',
    borderColor: '#003300',
    fontFamily: 'Courier New, monospace',
    pattern: 'matrix',
    icon: '👽'
  }
} as const;

export const getTheme = (era: EraKey): EraTheme => {
  return eraThemes[era] || eraThemes.modern;
};
