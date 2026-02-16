import axios from "axios";
import { Character, UniverseType, ComparisonResult } from "../types";

// Base URL da API (ajuste conforme necessário)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api/multiverse";

// Configuração do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para logs (desenvolvimento)
api.interceptors.request.use(
  (config) => {
    console.log("🚀 Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", error.response?.status, error.message);
    return Promise.reject(error);
  },
);

export const multiverseService = {
  /**
   * Lista todos os universos disponíveis
   */
  async getUniverses() {
    try {
      const response = await api.get("/universes");
      return response.data;
    } catch (error) {
      console.error("Error fetching universes:", error);
      throw error;
    }
  },

  /**
   * Busca personagens de um universo específico
   */
  async getCharacters(
    universe: UniverseType,
    limit: number = 50,
  ): Promise<Character[]> {
    try {
      const response = await api.get(`/${universe}/characters`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching characters from ${universe}:`, error);
      throw error;
    }
  },

  /**
   * Busca um personagem específico por nome
   */
  async getCharacterByName(
    universe: UniverseType,
    name: string,
  ): Promise<Character> {
    try {
      const response = await api.get(`/${universe}/characters/${name}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching character ${name} from ${universe}:`,
        error,
      );
      throw error;
    }
  },

  /**
   * Compara dois personagens
   */
  async compareCharacters(
    universe1: UniverseType,
    name1: string,
    universe2: UniverseType,
    name2: string,
  ): Promise<ComparisonResult> {
    try {
      const response = await api.post("/compare", null, {
        params: {
          universe1,
          name1,
          universe2,
          name2,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error comparing characters:", error);
      throw error;
    }
  },

  /**
   * Health check da API
   */
  async healthCheck() {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      console.error("Error checking API health:", error);
      throw error;
    }
  },
};

export default multiverseService;
