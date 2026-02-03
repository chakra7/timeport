// Era Types
export type EraKey = 
  | 'prehistoric' 
  | 'ancient' 
  | 'classical' 
  | 'medieval' 
  | 'renaissance' 
  | 'industrial' 
  | 'earlyModern' 
  | 'modern' 
  | 'nearFuture' 
  | 'future' 
  | 'farFuture' 
  | 'deepFuture';

export interface EraTheme {
  name: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  fontFamily: string;
  pattern: string;
  icon: string;
}

export type EraThemes = Record<EraKey, EraTheme>;

// Place Types
export type RegionKey = 
  | 'europe' 
  | 'asia' 
  | 'africa' 
  | 'americas' 
  | 'oceania' 
  | 'middleEast' 
  | 'arctic' 
  | 'desert' 
  | 'unknown';

export type TerrainKey = 
  | 'coastal' 
  | 'mountain' 
  | 'forest' 
  | 'plains' 
  | 'desert' 
  | 'urban' 
  | 'rural' 
  | 'mixed' 
  | 'arctic';

export interface Place {
  name: string;
  region: RegionKey;
  terrain: TerrainKey;
  isCoastal: boolean;
  isUrban: boolean;
 latitude: number;
}

// Data Types
export interface EraData {
  weather: string;
  language: string;
  population: string;
  lifeExpectancy: string;
}

export interface ApiPredictionResponse extends EraData {
  context: string;
  imageUrl?: string;
  imageUrls?: string[];
}

export interface JourneyData {
  year: number;
  place: Place;
  data: EraData;
  era: EraKey;
  formattedYear: string;
  context?: string;
  imageUrl?: string;
  imageUrls?: string[];
}

// Component Props
export interface TimeMachineProps {
  onTravel: (journeyData: JourneyData) => void;
  isLoading?: boolean;
}

export interface EraDisplayProps {
  journey: JourneyData;
  onReset: () => void;
}

// Internal Types
export type WeatherRegion = 
  | 'arctic' 
  | 'desert' 
  | 'tropical' 
  | 'temperate' 
  | 'mountain' 
  | 'coastal';

export type RegionsMap = Record<RegionKey, string[]>;
export type TerrainMap = Record<TerrainKey, string[]>;
export type WeatherPatterns = Record<WeatherRegion, string[]>;
export type LanguageEvolution = Record<EraKey, string[]>;
