import axios from 'axios';
import { Character, Universe, ComparisonResult, UniverseType } from '../types';

const API_URL = 'http://localhost:8080/api/multiverse';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const multiverseService = {
  // Listar universos
  async getUniverses(): Promise<Universe[]> {
    const response = await api.get<Universe[]>('/universes');
    return response.data;
  },

  // Listar personagens de um universo
  async getCharacters(universe: UniverseType, limit: number = 20): Promise<Character[]> {
    const response = await api.get<Character[]>(`/${universe}/characters`, {
      params: { limit }
    });
    return response.data;
  },

  // Buscar personagem por nome
  async getCharacter(universe: UniverseType, name: string): Promise<Character> {
    const response = await api.get<Character>(`/${universe}/characters/${name}`);
    return response.data;
  },

  // Comparar dois personagens
  async compareCharacters(
    universe1: UniverseType,
    name1: string,
    universe2: UniverseType,
    name2: string
  ): Promise<ComparisonResult> {
    const response = await api.post<ComparisonResult>('/compare', null, {
      params: { universe1, name1, universe2, name2 }
    });
    return response.data;
  },

  // Health check
  async healthCheck(): Promise<any> {
    const response = await api.get('/health');
    return response.data;
  }
};
