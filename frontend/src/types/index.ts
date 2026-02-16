export interface Character {
  id: string;
  name: string;
  universe: 'POKEMON' | 'DIGIMON';
  types: string[];
  level?: string;
  stats: Record<string, number>;
  abilities?: string[];
  imageUrl: string;
  thumbnailUrl?: string;
  evolutionChain?: string[];
  description?: string;
  height?: number;
  weight?: number;
}

export interface Universe {
  id: string;
  name: string;
  apiUrl: string;
}

export interface ComparisonResult {
  character1: Character;
  character2: Character;
  statsDifference: Record<string, StatComparison>;
  winner: string;
  totalDifference: number;
  recommendation: string;
}

export interface StatComparison {
  value1: number;
  value2: number;
  difference: number;
  advantage: 'character1' | 'character2' | 'tie';
}

export type UniverseType = 'POKEMON' | 'DIGIMON';
