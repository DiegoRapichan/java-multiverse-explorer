import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Character,
  Universe,
  UNIVERSE_CONFIG,
  ComparisonResult,
} from "../types";
import { api } from "../services/api";

const MAX_CHARACTERS = 8; // ← Máximo de personagens para comparar

export default function MultiverseExplorer() {
  const [selectedUniverse, setSelectedUniverse] = useState<Universe>("POKEMON");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ SCROLL INFINITO
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // ✅ CARREGAR PERSONAGENS COM PAGINAÇÃO
  const loadCharacters = useCallback(
    async (universe: Universe, pageNum: number, append = false) => {
      if (pageNum === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      try {
        const limit = 50;
        const offset = pageNum * limit;

        const data = await api.getCharacters(universe, limit, offset);

        if (append) {
          setCharacters((prev) => [...prev, ...data]);
        } else {
          setCharacters(data);
        }

        setHasMore(data.length === limit);
      } catch (err) {
        setError("Failed to load characters");
        console.error("Error loading characters:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  // ✅ CARREGAR PRIMEIRA PÁGINA AO MUDAR UNIVERSO
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    setCharacters([]);
    setSelectedCharacters([]);
    loadCharacters(selectedUniverse, 0, false);
  }, [selectedUniverse, loadCharacters]);

  // ✅ INTERSECTION OBSERVER PARA SCROLL INFINITO
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          loadCharacters(selectedUniverse, nextPage, true);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading, loadingMore, page, selectedUniverse, loadCharacters]);

  // ✅ SELECIONAR/DESELECIONAR PERSONAGEM
  const handleSelectCharacter = (character: Character) => {
    if (selectedCharacters.some((c) => c.id === character.id)) {
      setSelectedCharacters(
        selectedCharacters.filter((c) => c.id !== character.id),
      );
    } else {
      if (selectedCharacters.length < MAX_CHARACTERS) {
        setSelectedCharacters([...selectedCharacters, character]);
      }
    }
  };

  // ✅ COMPARAR PERSONAGENS
  const handleCompare = async () => {
    if (selectedCharacters.length < 2) return;

    try {
      const result = await api.compareCharacters(
        selectedCharacters[0],
        selectedCharacters[1],
      );
      setComparison(result);
      setShowModal(true);
    } catch (err) {
      console.error("Error comparing characters:", err);
    }
  };

  // ✅ FILTRAR PERSONAGENS
  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ✅ ANIMAÇÕES
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-4 text-white">
            🌌 Multiverse Explorer
          </h1>
          <p className="text-xl text-cyan-400">
            Compare personagens de 22 universos diferentes!
          </p>
        </motion.div>

        {/* SELETOR DE UNIVERSO */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {Object.entries(UNIVERSE_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setSelectedUniverse(key as Universe)}
              className={`p-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
                selectedUniverse === key
                  ? `bg-gradient-to-r ${config.gradient} text-white shadow-2xl scale-105`
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              <div className="text-3xl mb-2">{config.icon}</div>
              <div className="text-sm">{config.displayName}</div>
            </button>
          ))}
        </div>

        {/* BUSCA */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="🔍 Buscar personagem..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 bg-gray-800 text-white rounded-xl border-2 border-gray-700 focus:border-cyan-400 focus:outline-none text-lg"
          />
        </div>

        {/* PERSONAGENS SELECIONADOS */}
        {selectedCharacters.length > 0 && (
          <div className="mb-8 p-6 bg-gray-800 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white">
                Selecionados: {selectedCharacters.length}/{MAX_CHARACTERS}
              </h3>
              <button
                onClick={handleCompare}
                disabled={selectedCharacters.length < 2}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                ⚔️ Comparar {selectedCharacters.length} Personagens
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {selectedCharacters.map((char) => (
                <div key={char.id} className="flex-shrink-0 w-24 text-center">
                  <img
                    src={char.imageUrl}
                    alt={char.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-2 ring-4 ring-cyan-400"
                  />
                  <p className="text-white text-sm truncate">{char.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALERTA MÁXIMO */}
        {selectedCharacters.length >= MAX_CHARACTERS && (
          <div className="mb-4 p-4 bg-yellow-500 bg-opacity-20 border-2 border-yellow-500 rounded-xl text-yellow-300 text-center">
            ⚠️ Máximo de {MAX_CHARACTERS} personagens selecionados!
          </div>
        )}

        {/* LOADING INICIAL */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-400"></div>
          </div>
        )}

        {/* ERRO */}
        {error && (
          <div className="text-center py-8 text-red-400 text-xl">{error}</div>
        )}

        {/* GRID DE PERSONAGENS */}
        {!loading && !error && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredCharacters.map((character) => (
              <motion.div
                key={character.id}
                variants={itemVariants}
                onClick={() => handleSelectCharacter(character)}
                className={`bg-gray-800 rounded-xl p-4 cursor-pointer transition-all transform hover:scale-105 hover:shadow-2xl ${
                  selectedCharacters.some((c) => c.id === character.id)
                    ? "ring-4 ring-cyan-400 scale-105"
                    : ""
                }`}
              >
                <img
                  src={character.imageUrl}
                  alt={character.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h3 className="text-lg font-bold text-white mb-1 truncate">
                  {character.name}
                </h3>
                <p className="text-cyan-400 text-sm">{character.type}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* LOADING MORE */}
        {loadingMore && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
            <p className="ml-4 text-white text-lg">
              Carregando mais personagens...
            </p>
          </div>
        )}

        {/* OBSERVER TRIGGER */}
        <div ref={observerTarget} className="h-10"></div>

        {/* MENSAGEM FIM */}
        {!hasMore && characters.length > 0 && (
          <div className="text-center py-8">
            <p className="text-white text-lg">
              ✨ Todos os personagens carregados!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
