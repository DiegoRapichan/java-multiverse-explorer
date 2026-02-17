import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import {
  FaSearch,
  FaBolt,
  FaExchangeAlt,
  FaTrophy,
  FaGlobe,
} from "react-icons/fa";
import {
  Character,
  Universe,
  UNIVERSE_CONFIG,
  ComparisonResult,
} from "../types";
import { api } from "../services/api";

const MAX_CHARACTERS = 8;

export default function MultiverseExplorer() {
  const [selectedUniverse, setSelectedUniverse] = useState<Universe>("POKEMON");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Scroll infinito
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadCharacters = useCallback(
    async (universe: Universe, pageNum: number, append = false) => {
      if (pageNum === 0) setLoading(true);
      else setLoadingMore(true);
      setError(null);
      try {
        const limit = 50;
        const offset = pageNum * limit;
        const data = await api.getCharacters(universe, limit, offset);
        if (append) setCharacters((prev) => [...prev, ...data]);
        else setCharacters(data);
        setHasMore(data.length === limit);
      } catch (err) {
        setError("Erro ao carregar personagens");
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    setCharacters([]);
    setSelectedCharacters([]);
    loadCharacters(selectedUniverse, 0, false);
  }, [selectedUniverse, loadCharacters]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          const next = page + 1;
          setPage(next);
          loadCharacters(selectedUniverse, next, true);
        }
      },
      { threshold: 0.1 },
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [hasMore, loading, loadingMore, page, selectedUniverse, loadCharacters]);

  const handleSelectCharacter = (char: Character) => {
    if (selectedCharacters.some((c) => c.id === char.id)) {
      setSelectedCharacters(selectedCharacters.filter((c) => c.id !== char.id));
    } else if (selectedCharacters.length < MAX_CHARACTERS) {
      setSelectedCharacters([...selectedCharacters, char]);
    }
  };

  const handleCompare = async () => {
    if (selectedCharacters.length < 2) return;
    try {
      const result = await api.compareCharacters(selectedCharacters);
      setComparison(result);
      setShowModal(true);
    } catch (err) {
      console.error("Error comparing:", err);
    }
  };

  const filteredCharacters = characters.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      fire: "#ef4444",
      water: "#3b82f6",
      grass: "#22c55e",
      electric: "#eab308",
      psychic: "#a855f7",
      ice: "#06b6d4",
      dragon: "#6366f1",
      dark: "#374151",
      fighting: "#dc2626",
      normal: "#6b7280",
      poison: "#a21caf",
      ground: "#ca8a04",
      flying: "#7dd3fc",
      bug: "#65a30d",
      rock: "#78716c",
      ghost: "#7c3aed",
      steel: "#94a3b8",
      fairy: "#f9a8d4",
      rookie: "#3b82f6",
      champion: "#6366f1",
      ultimate: "#a855f7",
      mega: "#ef4444",
      ultra: "#f97316",
      "in training": "#06b6d4",
      fresh: "#22d3ee",
    };
    return colors[type?.toLowerCase()] || "#3b82f6";
  };

  const getRadarData = (stats: Record<string, string | number>) => {
    return Object.entries(stats)
      .filter(([, v]) => !isNaN(Number(v)))
      .slice(0, 6)
      .map(([key, value]) => ({
        stat: key.substring(0, 6).toUpperCase(),
        value: Number(value),
        fullMark: 150,
      }));
  };

  const universeConfig = UNIVERSE_CONFIG as Record<
    string,
    { displayName: string; icon: string }
  >;

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, #1e3a8a 0%, #0f172a 40%, #0f172a 60%, #1e3a5f 100%)",
      }}
    >
      {/* HEADER */}
      <div className="relative overflow-hidden border-b border-blue-900/40">
        {/* Grid pattern de fundo */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative container mx-auto px-4 py-10 text-center">
          {/* Logo + Título */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mb-2"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{
                background: "linear-gradient(135deg, #38bdf8, #3b82f6)",
              }}
            >
              <FaGlobe />
            </div>
            <h1
              className="text-6xl font-black tracking-tight"
              style={{
                color: "#38bdf8",
                textShadow: "0 0 40px rgba(56,189,248,0.4)",
              }}
            >
              MULTIVERSE
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-blue-300 text-lg font-semibold tracking-widest mb-1">
              DATA EXPLORER
            </p>
            <p className="text-slate-400 text-sm mb-8">
              Explore, compare and discover characters across multiple universes
            </p>
          </motion.div>

          {/* Seletor de Universo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 mb-6 max-w-4xl mx-auto"
          >
            {Object.entries(universeConfig).map(([key, config]) => {
              const isActive = selectedUniverse === key;
              return (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedUniverse(key as Universe)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, #38bdf8, #3b82f6)"
                      : "rgba(255,255,255,0.05)",
                    border: isActive
                      ? "1px solid #38bdf8"
                      : "1px solid rgba(255,255,255,0.1)",
                    color: isActive ? "#fff" : "#94a3b8",
                    boxShadow: isActive
                      ? "0 0 20px rgba(56,189,248,0.3)"
                      : "none",
                  }}
                >
                  <span>{config.icon}</span>
                  <span>{config.displayName}</span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Busca */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-xl mx-auto"
          >
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" />
              <input
                type="text"
                placeholder="Search character..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl text-white placeholder-slate-500 focus:outline-none transition-all"
                style={{
                  background: "rgba(15,23,42,0.8)",
                  border: "1px solid rgba(56,189,248,0.3)",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="container mx-auto px-4 py-6">
        {/* Contador de personagens */}
        {!loading && characters.length > 0 && (
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 text-sm text-slate-400">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse inline-block"></span>
              {filteredCharacters.length} characters
            </span>
          </div>
        )}

        {/* LOADING INICIAL */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-14 h-14 rounded-full border-4 border-t-transparent"
              style={{ borderColor: "#3b82f6", borderTopColor: "transparent" }}
            />
          </div>
        )}

        {/* ERRO */}
        {error && <div className="text-center py-10 text-red-400">{error}</div>}

        {/* GRID DE PERSONAGENS */}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredCharacters.map((char, index) => {
              const isSelected = selectedCharacters.some(
                (c) => c.id === char.id,
              );
              const typeColor = getTypeColor(char.type);

              return (
                <motion.div
                  key={char.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(index * 0.03, 0.5) }}
                  whileHover={{ scale: 1.04, y: -4 }}
                  onClick={() => handleSelectCharacter(char)}
                  className="cursor-pointer rounded-2xl overflow-hidden transition-all"
                  style={{
                    background: "rgba(15,23,42,0.9)",
                    border: isSelected
                      ? "2px solid #facc15"
                      : "1px solid rgba(56,189,248,0.2)",
                    boxShadow: isSelected
                      ? "0 0 20px rgba(250,204,21,0.3)"
                      : "0 2px 12px rgba(0,0,0,0.4)",
                  }}
                >
                  {/* Imagem */}
                  <div
                    className="w-full flex items-center justify-center overflow-hidden"
                    style={{
                      background: "rgba(241,245,249,0.97)",
                      height: "140px",
                    }}
                  >
                    <img
                      src={char.imageUrl || "https://via.placeholder.com/120"}
                      alt={char.name}
                      className="h-full w-full object-contain p-2 transition-transform group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/120";
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="font-bold text-sm text-white text-center mb-2 truncate capitalize">
                      {char.name}
                    </h3>

                    {/* Badge de tipo */}
                    <div className="flex justify-center mb-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
                        style={{
                          background: `${typeColor}22`,
                          border: `1px solid ${typeColor}66`,
                          color: typeColor,
                        }}
                      >
                        {char.type}
                      </span>
                    </div>

                    {/* Mini stats */}
                    {Object.keys(char.stats || {}).length > 0 && (
                      <div className="grid grid-cols-3 gap-1">
                        {Object.entries(char.stats)
                          .slice(0, 3)
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="text-center rounded-lg py-1"
                              style={{ background: "rgba(30,58,138,0.4)" }}
                            >
                              <div
                                className="text-blue-400 uppercase text-xs font-bold"
                                style={{ fontSize: "9px" }}
                              >
                                {key.substring(0, 3)}
                              </div>
                              <div className="text-white font-bold text-xs">
                                {String(value)
                                  .replace(/[^0-9]/g, "")
                                  .substring(0, 4) || value}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* LOADING MORE */}
        {loadingMore && (
          <div className="flex justify-center items-center py-8 gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 rounded-full border-2 border-t-transparent"
              style={{ borderColor: "#3b82f6", borderTopColor: "transparent" }}
            />
            <span className="text-slate-400 text-sm">Loading more...</span>
          </div>
        )}

        {/* Observer trigger */}
        <div ref={observerTarget} className="h-10" />

        {/* Fim da lista */}
        {!hasMore && characters.length > 0 && (
          <div className="text-center py-6 text-slate-500 text-sm">
            ✨ All characters loaded
          </div>
        )}
      </div>

      {/* BOTÃO FLUTUANTE DE COMPARAÇÃO */}
      <AnimatePresence>
        {selectedCharacters.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <button
              onClick={handleCompare}
              className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg shadow-2xl transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                boxShadow: "0 0 30px rgba(34,197,94,0.5)",
              }}
            >
              <FaExchangeAlt className="animate-pulse" />
              Compare {selectedCharacters.length} Characters
              <FaBolt />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DE COMPARAÇÃO */}
      <AnimatePresence>
        {showModal && comparison && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(8px)",
            }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              style={{
                background: "linear-gradient(135deg, #0f172a, #1e3a8a22)",
                border: "2px solid rgba(56,189,248,0.3)",
                boxShadow: "0 0 60px rgba(56,189,248,0.15)",
              }}
            >
              <h2
                className="text-4xl font-black text-center mb-8"
                style={{
                  color: "#38bdf8",
                  textShadow: "0 0 30px rgba(56,189,248,0.5)",
                }}
              >
                ⚔️ BATTLE COMPARISON
              </h2>

              {/* VENCEDOR */}
              <div
                className="rounded-2xl p-5 text-center mb-6"
                style={{
                  background: "linear-gradient(135deg, #ca8a04, #ea580c)",
                }}
              >
                <FaTrophy className="text-4xl mx-auto mb-2" />
                <div className="text-sm font-bold uppercase tracking-widest mb-1 opacity-80">
                  Winner
                </div>
                <div className="text-4xl font-black capitalize">
                  {comparison.winner.name}
                </div>
              </div>

              {/* ANÁLISE */}
              {comparison.analysis && (
                <p className="text-slate-400 text-center text-sm mb-6 italic px-4">
                  {comparison.analysis}
                </p>
              )}

              {/* RANKING */}
              <div className="space-y-2 mb-6">
                <h3 className="text-blue-300 font-bold text-lg mb-3 flex items-center gap-2">
                  <FaTrophy /> Power Ranking
                </h3>
                {comparison.ranking.map((char, index) => (
                  <motion.div
                    key={char.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.07 }}
                    className="flex items-center gap-4 p-3 rounded-xl"
                    style={{
                      background:
                        index === 0
                          ? "linear-gradient(135deg, rgba(202,138,4,0.3), rgba(234,88,12,0.3))"
                          : index === 1
                            ? "rgba(148,163,184,0.1)"
                            : index === 2
                              ? "rgba(180,83,9,0.15)"
                              : "rgba(255,255,255,0.04)",
                      border:
                        index === 0
                          ? "1px solid rgba(202,138,4,0.4)"
                          : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="text-2xl w-8 text-center">
                      {index === 0
                        ? "🥇"
                        : index === 1
                          ? "🥈"
                          : index === 2
                            ? "🥉"
                            : `#${index + 1}`}
                    </div>
                    <img
                      src={char.imageUrl}
                      alt={char.name}
                      className="w-12 h-12 rounded-xl object-contain"
                      style={{
                        background: "rgba(241,245,249,0.9)",
                        padding: "2px",
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-bold text-white capitalize">
                        {char.name}
                      </div>
                      <div className="text-xs text-slate-400">{char.type}</div>
                    </div>
                    <div
                      className="font-black text-lg px-3 py-1 rounded-lg"
                      style={{
                        background: "rgba(56,189,248,0.15)",
                        color: "#38bdf8",
                        border: "1px solid rgba(56,189,248,0.3)",
                      }}
                    >
                      {char.totalPower} pts
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* RADAR CHART — até 2 personagens */}
              {comparison.ranking.length === 2 && (
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {[comparison.ranking[0], comparison.ranking[1]].map(
                    (char, i) => {
                      const fullChar = selectedCharacters.find(
                        (c) => c.id === char.id,
                      );
                      const radarData = fullChar
                        ? getRadarData(fullChar.stats)
                        : [];
                      if (radarData.length === 0) return null;
                      return (
                        <div
                          key={char.id}
                          className="rounded-2xl p-4"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(56,189,248,0.15)",
                          }}
                        >
                          <p className="text-center text-sm font-bold text-blue-300 mb-2 capitalize">
                            {char.name}
                          </p>
                          <ResponsiveContainer width="100%" height={200}>
                            <RadarChart data={radarData}>
                              <PolarGrid stroke="rgba(56,189,248,0.2)" />
                              <PolarAngleAxis
                                dataKey="stat"
                                stroke="#94a3b8"
                                tick={{ fontSize: 10 }}
                              />
                              <PolarRadiusAxis stroke="rgba(56,189,248,0.1)" />
                              <Radar
                                name={char.name}
                                dataKey="value"
                                stroke={i === 0 ? "#38bdf8" : "#f472b6"}
                                fill={i === 0 ? "#38bdf8" : "#f472b6"}
                                fillOpacity={0.25}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      );
                    },
                  )}
                </div>
              )}

              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 rounded-xl font-bold transition-all hover:opacity-80"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8",
                }}
              >
                Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
