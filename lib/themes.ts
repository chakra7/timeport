import type { EraKey, EraTheme } from '@/types';

// unified modern sci-fi theme for the whole application
export const unifiedTheme: EraTheme = {
  name: 'TimePort',
  bgColor: '#0a0f18', // deep sleek dark blue-black
  textColor: '#f8fafc', // very light gray-white for clarity
  accentColor: '#38bdf8', // bright modern sky blue
  borderColor: 'rgba(56, 189, 248, 0.2)', // translucent accent color
  fontFamily: '"Inter", "System-ui", sans-serif',
  pattern: 'modern-sci-fi',
  icon: '🕰️'
};

export const getTheme = (_era: EraKey): EraTheme => {
  return unifiedTheme;
};
