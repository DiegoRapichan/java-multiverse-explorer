import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { FaSearch, FaBolt, FaExchangeAlt, FaRocket } from "react-icons/fa";
import { Character, UniverseType, ComparisonResult } from "../types";
import { multiverseService } from "../services/api";

console.log(
  "🔥 BG COLOR:",
  "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900",
);

export default function MultiverseExplorer() {
  const [selectedUniverse, setSelectedUniverse] =
    useState<UniverseType>("POKEMON");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedForComparison, setSelectedForComparison] = useState<
    Character[]
  >([]);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    loadCharacters();
  }, [selectedUniverse]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = characters.filter((char) =>
        char.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredCharacters(filtered);
    } else {
      setFilteredCharacters(characters);
    }
  }, [searchTerm, characters]);

  const loadCharacters = async () => {
    setLoading(true);
    try {
      const data = await multiverseService.getCharacters(selectedUniverse, 50);
      setCharacters(data);
      setFilteredCharacters(data);
    } catch (error) {
      console.error("Error loading characters:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUniverseSelection = (char: Character) => {
    const isSelected = selectedForComparison.some((c) => c.id === char.id);
    if (isSelected) {
      setSelectedForComparison(
        selectedForComparison.filter((c) => c.id !== char.id),
      );
    } else {
      if (selectedForComparison.length < 2) {
        setSelectedForComparison([...selectedForComparison, char]);
      }
    }
  };

  const compareSelected = async () => {
    if (selectedForComparison.length === 2) {
      try {
        const result = await multiverseService.compareCharacters(
          selectedForComparison[0].universe,
          selectedForComparison[0].name,
          selectedForComparison[1].universe,
          selectedForComparison[1].name,
        );
        setComparisonResult(result);
        setShowComparison(true);
      } catch (error) {
        console.error("Error comparing:", error);
      }
    }
  };

  const getRadarData = (stats: Record<string, number>) => {
    return Object.entries(stats).map(([key, value]) => ({
      stat: key.toUpperCase(),
      value: value,
      fullMark: 150,
    }));
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      fire: "from-orange-500 to-red-600",
      water: "from-blue-500 to-cyan-400",
      grass: "from-green-500 to-emerald-400",
      electric: "from-yellow-400 to-amber-500",
      psychic: "from-indigo-500 to-blue-400",
      ice: "from-cyan-400 to-blue-300",
      dragon: "from-indigo-600 to-blue-500",
      dark: "from-gray-700 to-gray-900",
      fairy: "from-pink-400 to-rose-300",
      fighting: "from-red-600 to-orange-700",
      flying: "from-sky-400 to-blue-300",
      poison: "from-purple-600 to-violet-500",
      ground: "from-amber-600 to-yellow-700",
      rock: "from-stone-600 to-amber-700",
      bug: "from-lime-600 to-green-500",
      ghost: "from-purple-700 to-indigo-600",
      steel: "from-slate-500 to-gray-400",
      normal: "from-slate-400 to-gray-500",
      rookie: "from-slate-500 to-gray-600",
      champion: "from-blue-500 to-cyan-400",
      ultimate: "from-indigo-600 to-blue-500",
      mega: "from-red-600 to-orange-500",
    };
    return colors[type.toLowerCase()] || "from-slate-500 to-gray-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Subtle Gradient Orbs */}
      <div className="fixed top-0 -left-40 w-96 h-96 bg-cyan-400/10 rounded-full mix-blend-screen filter blur-3xl animate-blob" />
      <div className="fixed top-0 -right-40 w-96 h-96 bg-blue-400/10 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000" />
      <div className="fixed -bottom-40 left-20 w-96 h-96 bg-indigo-400/10 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000" />

      {/* Header */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 pt-8 pb-6"
        >
          {/* Logo & Title - Centralizado */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-4"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                🌌 MULTIVERSE
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-cyan-300 tracking-widest">
                DATA EXPLORER
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-lg text-blue-100/90 max-w-2xl mx-auto font-light"
            >
              Explore, compare and discover characters across multiple universes
            </motion.p>
          </div>

          {/* Universe Selector - Centralizado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3 md:gap-4 mb-6"
          >
            {(["POKEMON", "DIGIMON"] as UniverseType[]).map(
              (universe, index) => (
                <motion.button
                  key={universe}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedUniverse(universe);
                    setSelectedForComparison([]);
                  }}
                  className={`group relative px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg tracking-wide transition-all duration-300 ${
                    selectedUniverse === universe
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                      : "bg-white/10 text-blue-100 border-2 border-blue-400/30 hover:border-cyan-400/50 hover:bg-white/20"
                  }`}
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-xl md:text-2xl">
                      {universe === "POKEMON" ? "🎮" : "👾"}
                    </span>
                    <span>
                      {universe === "POKEMON" ? "Pokémon" : "Digimon"}
                    </span>
                  </div>
                  {selectedUniverse === universe && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-xl"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                </motion.button>
              ),
            )}
          </motion.div>

          {/* Search Bar - Melhor contraste */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative flex items-center bg-slate-800/80 backdrop-blur-xl border-2 border-cyan-400/30 rounded-2xl overflow-hidden">
                <FaSearch className="absolute left-5 md:left-6 text-cyan-400 text-lg md:text-xl z-10" />
                <input
                  type="text"
                  placeholder="Search character..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 md:pl-16 pr-4 md:pr-6 py-3 md:py-4 bg-transparent text-white placeholder-blue-200/60 focus:outline-none text-base md:text-lg"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Bar */}
      {!loading && filteredCharacters.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 container mx-auto px-4 mb-6"
        >
          <div className="flex items-center justify-center gap-6 md:gap-8 text-xs md:text-sm bg-slate-800/50 backdrop-blur-sm rounded-lg py-2 px-4 w-fit mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-cyan-100 font-medium">
                {filteredCharacters.length} characters
              </span>
            </div>
            {selectedForComparison.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-yellow-200 font-medium">
                  {selectedForComparison.length} selected
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Compare Button */}
      <AnimatePresence>
        {selectedForComparison.length === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 15 }}
            className="fixed bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-50"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={compareSelected}
              className="relative group px-6 md:px-10 py-4 md:py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold text-base md:text-xl shadow-[0_0_50px_rgba(6,182,212,0.6)] hover:shadow-[0_0_70px_rgba(6,182,212,0.8)] transition-all duration-300"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <motion.div
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <FaExchangeAlt className="text-lg md:text-2xl" />
                </motion.div>
                <span className="tracking-wide">COMPARE BATTLE</span>
                <FaBolt className="text-lg md:text-2xl animate-pulse" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Characters Grid */}
      <div className="relative z-10 container mx-auto px-4 pb-24 md:pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-6">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity },
              }}
              className="relative"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full" />
              <FaRocket className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400 text-xl md:text-2xl" />
            </motion.div>
            <p className="text-blue-100 text-base md:text-lg animate-pulse font-medium">
              Loading universe...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
            {filteredCharacters.map((char, index) => {
              const isSelected = selectedForComparison.some(
                (c) => c.id === char.id,
              );

              return (
                <motion.div
                  key={char.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: Math.min(index * 0.03, 1),
                    duration: 0.4,
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => toggleUniverseSelection(char)}
                  className="group relative cursor-pointer"
                >
                  {/* Glow Effect */}
                  {isSelected && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                  )}

                  {/* Card */}
                  <div
                    className={`relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-3 md:p-4 border-2 transition-all duration-300 ${
                      isSelected
                        ? "border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.4)]"
                        : "border-cyan-400/20 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                    }`}
                  >
                    {/* Selection Badge */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-7 h-7 md:w-8 md:h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg z-10"
                      >
                        <span className="text-xs md:text-sm font-black text-slate-900">
                          ✓
                        </span>
                      </motion.div>
                    )}

                    {/* Image Container */}
                    <div className="relative aspect-square bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-xl mb-2 md:mb-3 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      <img
                        src={char.imageUrl || "https://via.placeholder.com/150"}
                        alt={char.name}
                        className="w-full h-full object-contain p-1 md:p-2 group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/150?text=" + char.name;
                        }}
                      />
                    </div>

                    {/* Name */}
                    <h3 className="font-bold text-xs md:text-base capitalize text-center mb-2 truncate text-white group-hover:text-cyan-300 transition-colors">
                      {char.name}
                    </h3>

                    {/* Types */}
                    <div className="flex flex-wrap gap-1 justify-center mb-2 md:mb-3">
                      {char.types.slice(0, 2).map((type) => (
                        <span
                          key={type}
                          className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg text-[10px] md:text-xs font-bold bg-gradient-to-r ${getTypeColor(type)} shadow-lg uppercase tracking-wide`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>

                    {/* Stats Preview */}
                    <div className="grid grid-cols-3 gap-1 md:gap-2 text-[10px] md:text-xs">
                      {Object.entries(char.stats)
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <div
                            key={key}
                            className="text-center bg-cyan-500/10 rounded-lg py-1 md:py-1.5 border border-cyan-400/20"
                          >
                            <div className="text-cyan-300 uppercase font-bold text-[8px] md:text-[10px] mb-0.5">
                              {key.substring(0, 3)}
                            </div>
                            <div className="font-black text-white text-xs md:text-sm">
                              {value}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showComparison && comparisonResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowComparison(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900 rounded-3xl p-4 md:p-6 lg:p-10 max-w-7xl w-full max-h-[95vh] overflow-y-auto border-2 border-cyan-400/30 shadow-[0_0_80px_rgba(6,182,212,0.3)]"
            >
              {/* Header */}
              <div className="text-center mb-6 md:mb-10">
                <motion.h2
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-3xl md:text-5xl lg:text-6xl font-black mb-2 md:mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent"
                >
                  ⚔️ BATTLE ANALYSIS
                </motion.h2>
                <p className="text-blue-200/70 text-sm md:text-lg">
                  Statistical Comparison
                </p>
              </div>

              {/* Comparison Grid */}
              <div className="grid md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-10">
                {/* Character 1 */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl p-4 md:p-6 border-2 border-cyan-400/30"
                >
                  <div className="absolute top-2 md:top-4 right-2 md:right-4 text-2xl md:text-4xl opacity-20">
                    🔵
                  </div>
                  <img
                    src={comparisonResult.character1.imageUrl}
                    alt={comparisonResult.character1.name}
                    className="w-28 h-28 md:w-40 md:h-40 mx-auto object-contain mb-3 md:mb-4 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                  />
                  <h3 className="text-2xl md:text-3xl font-black text-center capitalize mb-4 md:mb-6 text-cyan-300">
                    {comparisonResult.character1.name}
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart
                      data={getRadarData(comparisonResult.character1.stats)}
                    >
                      <PolarGrid stroke="#0ea5e9" strokeOpacity={0.3} />
                      <PolarAngleAxis
                        dataKey="stat"
                        stroke="#fff"
                        style={{ fontSize: "11px", fontWeight: "bold" }}
                      />
                      <PolarRadiusAxis stroke="#0ea5e9" strokeOpacity={0.5} />
                      <Radar
                        name={comparisonResult.character1.name}
                        dataKey="value"
                        stroke="#06b6d4"
                        fill="#06b6d4"
                        fillOpacity={0.6}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Character 2 */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative bg-gradient-to-br from-indigo-500/10 to-blue-600/10 rounded-2xl p-4 md:p-6 border-2 border-indigo-400/30"
                >
                  <div className="absolute top-2 md:top-4 right-2 md:right-4 text-2xl md:text-4xl opacity-20">
                    🟣
                  </div>
                  <img
                    src={comparisonResult.character2.imageUrl}
                    alt={comparisonResult.character2.name}
                    className="w-28 h-28 md:w-40 md:h-40 mx-auto object-contain mb-3 md:mb-4 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                  />
                  <h3 className="text-2xl md:text-3xl font-black text-center capitalize mb-4 md:mb-6 text-indigo-300">
                    {comparisonResult.character2.name}
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart
                      data={getRadarData(comparisonResult.character2.stats)}
                    >
                      <PolarGrid stroke="#6366f1" strokeOpacity={0.3} />
                      <PolarAngleAxis
                        dataKey="stat"
                        stroke="#fff"
                        style={{ fontSize: "11px", fontWeight: "bold" }}
                      />
                      <PolarRadiusAxis stroke="#6366f1" strokeOpacity={0.5} />
                      <Radar
                        name={comparisonResult.character2.name}
                        dataKey="value"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.6}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              {/* Winner Banner */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="relative bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-orange-500/20 rounded-2xl p-6 md:p-8 text-center border-2 border-yellow-400/50 shadow-[0_0_50px_rgba(250,204,21,0.3)]"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl md:text-6xl mb-2 md:mb-3"
                  >
                    🏆
                  </motion.div>
                  <div className="text-lg md:text-2xl font-bold text-yellow-300 mb-1 md:mb-2 tracking-wider">
                    CHAMPION
                  </div>
                  <div className="text-3xl md:text-5xl lg:text-6xl font-black capitalize bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-400 bg-clip-text text-transparent mb-2 md:mb-4">
                    {comparisonResult.winner}
                  </div>
                  <div className="text-sm md:text-lg text-yellow-100/90 font-medium">
                    {comparisonResult.recommendation}
                  </div>
                </div>
              </motion.div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowComparison(false)}
                className="mt-6 md:mt-8 w-full py-3 md:py-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-2 border-cyan-400/30 hover:border-cyan-400/50 rounded-xl font-bold text-base md:text-lg text-cyan-300 hover:text-cyan-200 transition-all"
              >
                Close Analysis
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
