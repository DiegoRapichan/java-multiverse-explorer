import axios from "axios";
import { Character, ComparisonResult, Universe } from "../types";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api/multiverse";

export const api = {
  getCharacters: async (
    universe: Universe,
    limit = 50,
    offset = 0,
  ): Promise<Character[]> => {
    const response = await axios.get(`${API_URL}/${universe}/characters`, {
      params: { limit, offset },
    });
    return response.data;
  },

  getCharacter: async (
    universe: Universe,
    name: string,
  ): Promise<Character> => {
    const response = await axios.get(
      `${API_URL}/${universe}/characters/${name}`,
    );
    return response.data;
  },

  compareCharacters: async (
    characters: Character[],
  ): Promise<ComparisonResult> => {
    const response = await axios.post(`${API_URL}/compare`, { characters });
    return response.data;
  },
};
