import { getEra } from './parseTime';
import type { 
  Place, 
  EraKey, 
  EraData, 
  WeatherPatterns, 
  LanguageEvolution
} from '@/types';

const WEATHER_PATTERNS: WeatherPatterns = {
  arctic: ['Freezing', 'Icy winds', 'Snowfall', 'Blizzard', 'Extreme cold'],
  desert: ['Scorching heat', 'Dry', 'Sandstorm', 'Blistering sun', 'Arid'],
  tropical: ['Humid', 'Monsoon', 'Tropical storm', 'Hot and wet', 'Rainforest humidity'],
  temperate: ['Mild', 'Partly cloudy', 'Gentle breeze', 'Clear skies', 'Seasonal'],
  mountain: ['Thin air', 'Crisp and cold', 'Mountain winds', 'Variable', 'Brisk'],
  coastal: ['Ocean breeze', 'Misty', 'Salt air', 'Moderate', 'Temperate maritime']
};

const LANGUAGE_EVOLUTION: LanguageEvolution = {
  prehistoric: ['Primitive gestures', 'Proto-speech', 'Basic vocalizations', 'Tribal dialects'],
  ancient: ['Proto-Indo-European', 'Ancient Sumerian', 'Early Semitic', 'Archaic Chinese', 'Dravidian roots'],
  classical: ['Latin', 'Classical Greek', 'Sanskrit', 'Old Chinese', 'Pali', 'Hebrew', 'Coptic'],
  medieval: ['Old English', 'Vulgar Latin', 'Medieval Arabic', 'Byzantine Greek', 'Old Norse', 'Persian'],
  renaissance: ['Early Modern English', 'Renaissance Italian', 'Classical Arabic', 'Mandarin Chinese', 'Spanish'],
  industrial: ['Victorian English', 'French', 'German', 'Russian', 'Japanese', 'Hindi/Urdu'],
  earlyModern: ['English', 'French', 'Spanish', 'German', 'Russian', 'Mandarin', 'Japanese'],
  modern: ['English', 'Mandarin', 'Spanish', 'Hindi', 'Arabic', 'French', 'Bengali', 'Portuguese', 'Russian'],
  nearFuture: ['Global English', 'Mandarin-English hybrid', 'Pan-Asian', 'Neo-Spanish', 'African Union lingua'],
  future: ['Terran Standard', 'Regional dialects', 'Trade languages', 'Constructed universal'],
  farFuture: ['Unified Terran', 'Evolved dialects', 'Post-national languages', 'Synthesized speech'],
  deepFuture: ['Galactic Basic', 'Transhuman communication', 'Neural-linked language', 'Symbolic thought-sharing']
};

export const generateData = (year: number, place: Place): EraData => {
  const era = getEra(year);
  
  return {
    weather: generateWeather(era, place),
    language: generateLanguage(era),
    population: generatePopulation(year, place),
    lifeExpectancy: generateLifeExpectancy(year)
  };
};

const generateWeather = (era: EraKey, place: Place): string => {
  let patterns: string[];
  
  if (place.terrain === 'arctic' || place.region === 'arctic') {
    patterns = WEATHER_PATTERNS.arctic;
  } else if (place.terrain === 'desert' || place.region === 'desert') {
    patterns = WEATHER_PATTERNS.desert;
  } else if (place.latitude < 20 && place.latitude > -20) {
    patterns = WEATHER_PATTERNS.tropical;
  } else if (place.terrain === 'mountain') {
    patterns = WEATHER_PATTERNS.mountain;
  } else if (place.terrain === 'coastal' || place.isCoastal) {
    patterns = WEATHER_PATTERNS.coastal;
  } else {
    patterns = WEATHER_PATTERNS.temperate;
  }
  
  // Adjust for era climate changes
  if (era === 'prehistoric' || era === 'ancient') {
    return patterns[0] + ' (Ice Age remnants)';
  } else if (era === 'farFuture' || era === 'deepFuture') {
    return patterns[Math.floor(Math.random() * patterns.length)] + ' (Climate engineered)';
  }
  
  return patterns[Math.floor(Math.random() * patterns.length)];
};

const generateLanguage = (era: EraKey): string => {
  const languages = LANGUAGE_EVOLUTION[era] ?? LANGUAGE_EVOLUTION.modern;
  const primary = languages[Math.floor(Math.random() * languages.length)];
  
  if (era === 'prehistoric') {
    return primary;
  } else if (era === 'deepFuture') {
    return `${primary} (telepathic elements)`;
  }
  
  return primary;
};

const generatePopulation = (year: number, place: Place): string => {
  const basePopulation = calculateBasePopulation(year);
  
  // Adjust for place type
  let multiplier = 1;
  if (place.isUrban) multiplier = 0.1;
  if (place.terrain === 'desert') multiplier *= 0.3;
  if (place.terrain === 'arctic') multiplier *= 0.1;
  if (place.terrain === 'mountain') multiplier *= 0.5;
  
  const localPop = Math.floor(basePopulation * multiplier);
  
  if (year < -10000) return 'Small tribal groups (50-200)';
  if (year < 0) return `~${localPop.toLocaleString()} inhabitants`;
  if (year > 10000) return `${(localPop / 1000000).toFixed(1)}M (post-scarcity society)`;
  
  return `~${localPop.toLocaleString()} people`;
};

const calculateBasePopulation = (year: number): number => {
  // Rough population model
  if (year < -50000) return 100;
  if (year < -10000) return 1000;
  if (year < -3000) return 50000;
  if (year < 0) return Math.floor(170000000 * Math.exp((year + 3000) / 2000));
  if (year < 1900) return Math.floor(400000000 * Math.exp((year - 1500) / 400));
  if (year < 2024) return Math.floor(1600000000 * Math.exp((year - 1900) / 100));
  if (year < 3000) return Math.floor(8000000000 * Math.exp((year - 2024) / 500));
  if (year < 5000) return 20000000000;
  return 50000000000; // Post-scarcity, distributed populations
};

const generateLifeExpectancy = (year: number): string => {
  if (year < -50000) return '20-25 years';
  if (year < -10000) return '25-30 years';
  if (year < -3000) return '30-35 years';
  if (year < 0) return '35-40 years';
  if (year < 500) return '40-45 years';
  if (year < 1500) return '45-50 years';
  if (year < 1800) return '50-55 years';
  if (year < 1900) return '55-60 years';
  if (year <= 2024) return '70-80 years';
  if (year < 2100) return '85-100 years';
  if (year < 3000) return '120-150 years';
  if (year < 5000) return '200-500 years (regeneration tech)';
  return 'Indefinite (consciousness transfer available)';
};
