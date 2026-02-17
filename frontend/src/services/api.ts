// ============================================
// API COM SUPORTE A OFFSET (PAGINAÇÃO)
// ============================================

// No arquivo frontend/src/services/api.ts

import axios from 'axios';
import { Character, ComparisonResult, Universe } from '../types';

const API_URL = 'http://localhost:8080/api/multiverse';

export const api = {
  // ✅ ATUALIZADO: Adicionar parâmetro offset
  getCharacters: async (universe: Universe, limit: number = 50, offset: number = 0): Promise<Character[]> => {
    const response = await axios.get(`${API_URL}/${universe}/characters`, {
      params: { limit, offset }  // ← ADICIONAR OFFSET
    });
    return response.data;
  },

  getCharacter: async (universe: Universe, name: string): Promise<Character> => {
    const response = await axios.get(`${API_URL}/${universe}/characters/${name}`);
    return response.data;
  },

  compareCharacters: async (char1: Character, char2: Character): Promise<ComparisonResult> => {
    const response = await axios.post(`${API_URL}/compare`, {
      character1: char1,
      character2: char2,
    });
    return response.data;
  },
};
