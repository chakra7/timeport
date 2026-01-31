import type { Place, RegionKey, TerrainKey, RegionsMap, TerrainMap } from '@/types';

const REGIONS: RegionsMap = {
  europe: ['europe', 'rome', 'athens', 'london', 'paris', 'berlin', 'madrid', 'vienna', 'amsterdam', 'moscow', 'barcelona', 'milan'],
  asia: ['asia', 'china', 'japan', 'india', 'tokyo', 'beijing', 'shanghai', 'bangkok', 'seoul', 'singapore', 'hong kong', 'mumbai', 'delhi'],
  africa: ['africa', 'egypt', 'cairo', 'lagos', 'nairobi', 'casablanca', 'addis ababa', 'tunis', 'algiers'],
  americas: ['america', 'usa', 'canada', 'mexico', 'brazil', 'new york', 'los angeles', 'chicago', 'toronto', 'vancouver', 'mexico city', 'rio', 'buenos aires'],
  oceania: ['australia', 'sydney', 'melbourne', 'auckland', 'fiji', 'new zealand'],
  middleEast: ['middle east', 'dubai', 'istanbul', 'tehran', 'baghdad', 'jerusalem', 'tel aviv', 'riyadh'],
  arctic: ['arctic', 'antarctica', 'greenland', 'alaska', 'siberia'],
  desert: ['sahara', 'desert', 'gobi', 'kalahari', 'arabian', 'outback'],
  unknown: []
};

const TERRAIN_TYPES: TerrainMap = {
  coastal: ['coast', 'beach', 'shore', 'seaside', 'port', 'harbor', 'bay'],
  mountain: ['mountain', 'alps', 'himalaya', 'rocky', 'andes', 'peak', 'summit'],
  forest: ['forest', 'jungle', 'rainforest', 'woods', 'amazon', 'congo'],
  plains: ['plains', 'prairie', 'steppe', 'savanna', 'grassland', 'valley'],
  desert: ['desert', 'sahara', 'arid', 'dunes', 'wasteland'],
  urban: ['city', 'metro', 'urban', 'downtown', 'metropolis'],
  rural: ['village', 'rural', 'countryside', 'farm', 'pastoral'],
  mixed: [],
  arctic: []
};

export const parsePlace = (input: string): Place => {
  const normalized = input.toLowerCase().trim();
  
  // Determine region
  let region: RegionKey = 'unknown';
  for (const [regionName, keywords] of Object.entries(REGIONS) as [RegionKey, string[]][]) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      region = regionName;
      break;
    }
  }
  
  // Determine terrain
  let terrain: TerrainKey = 'mixed';
  for (const [terrainName, keywords] of Object.entries(TERRAIN_TYPES) as [TerrainKey, string[]][]) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      terrain = terrainName;
      break;
    }
  }
  
  // Default terrain based on region if not specified
  if (terrain === 'mixed') {
    if (region === 'arctic') terrain = 'arctic';
    if (region === 'desert') terrain = 'desert';
  }
  
  return {
    name: input,
    region,
    terrain,
    isCoastal: terrain === 'coastal' || ['europe', 'asia', 'americas'].includes(region),
    isUrban: terrain === 'urban' || normalized.includes('city'),
    latitude: estimateLatitude(region)
  };
};

const estimateLatitude = (region: RegionKey): number => {
  const latitudes: Record<RegionKey, number> = {
    europe: 50,
    asia: 35,
    africa: 10,
    americas: 40,
    oceania: -30,
    middleEast: 25,
    arctic: 70,
    desert: 25,
    unknown: 30
  };
  return latitudes[region] || 30;
};
