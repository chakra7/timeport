import type { EraKey } from '@/types';

export const parseTime = (input: string): number | null => {
  const normalized = input.toLowerCase().trim();
  
  // Direct year formats
  const bcMatch = normalized.match(/(\d+)\s*(bc|bce)/i);
  if (bcMatch) {
    return -parseInt(bcMatch[1], 10);
  }
  
  const adMatch = normalized.match(/(\d+)\s*(ad|ce)/i);
  if (adMatch) {
    return parseInt(adMatch[1], 10);
  }
  
  // Year XXXX format
  const yearMatch = normalized.match(/year\s*(\d+)/i);
  if (yearMatch) {
    return parseInt(yearMatch[1], 10);
  }
  
  // Relative time
  const yearsAgoMatch = normalized.match(/(\d+)\s*years?\s*ago/i);
  if (yearsAgoMatch) {
    return new Date().getFullYear() - parseInt(yearsAgoMatch[1], 10);
  }
  
  const yearsFutureMatch = normalized.match(/(\d+)\s*years?\s*(from now|in the future)/i);
  if (yearsFutureMatch) {
    return new Date().getFullYear() + parseInt(yearsFutureMatch[1], 10);
  }
  
  // Just a number
  const numberMatch = normalized.match(/^(\d+)$/);
  if (numberMatch) {
    const year = parseInt(numberMatch[1], 10);
    return year > 2000 ? year : -year;
  }
  
  return null;
};

export const getEra = (year: number): EraKey => {
  if (year < -10000) return 'prehistoric';
  if (year < -3000) return 'ancient';
  if (year < 500) return 'classical';
  if (year < 1500) return 'medieval';
  if (year < 1800) return 'renaissance';
  if (year < 1900) return 'industrial';
  if (year < 1950) return 'earlyModern';
  if (year <= 2024) return 'modern';
  if (year < 2100) return 'nearFuture';
  if (year < 3000) return 'future';
  if (year < 5000) return 'farFuture';
  return 'deepFuture';
};

export const getEraName = (year: number): string => {
  const era = getEra(year);
  const eraNames: Record<EraKey, string> = {
    prehistoric: 'Prehistoric Era',
    ancient: 'Ancient Times',
    classical: 'Classical Antiquity',
    medieval: 'Medieval Period',
    renaissance: 'Renaissance Era',
    industrial: 'Industrial Age',
    earlyModern: 'Early Modern Era',
    modern: 'Modern Era',
    nearFuture: 'Near Future',
    future: 'Future Era',
    farFuture: 'Far Future',
    deepFuture: 'Deep Future'
  };
  return eraNames[era] || 'Unknown Era';
};

export const formatYear = (year: number): string => {
  if (year < 0) {
    return `${Math.abs(year)} BC`;
  }
  return `${year} AD`;
};
