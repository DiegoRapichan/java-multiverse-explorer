import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { FaSearch, FaBolt, FaExchangeAlt } from 'react-icons/fa';
import { Character, UniverseType, ComparisonResult } from '../types';
import { multiverseService } from '../services/api';

export default function MultiverseExplorer() {
  const [selectedUniverse, setSelectedUniverse] = useState<UniverseType>('POKEMON');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForComparison, setSelectedForComparison] = useState<Character[]>([]);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    loadCharacters();
  }, [selectedUniverse]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = characters.filter(char =>
        char.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      console.error('Error loading characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUniverseSelection = (char: Character) => {
    const isSelected = selectedForComparison.some(c => c.id === char.id);
    if (isSelected) {
      setSelectedForComparison(selectedForComparison.filter(c => c.id !== char.id));
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
          selectedForComparison[1].name
        );
        setComparisonResult(result);
        setShowComparison(true);
      } catch (error) {
        console.error('Error comparing:', error);
      }
    }
  };

  const getRadarData = (stats: Record<string, number>) => {
    return Object.entries(stats).map(([key, value]) => ({
      stat: key,
      value: value,
      fullMark: 150
    }));
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      fire: 'from-red-500 to-orange-500',
      water: 'from-blue-500 to-cyan-500',
      grass: 'from-green-500 to-emerald-500',
      electric: 'from-yellow-400 to-yellow-600',
      psychic: 'from-pink-500 to-purple-500',
      rookie: 'from-gray-400 to-gray-600',
      champion: 'from-blue-400 to-blue-600',
      ultimate: 'from-purple-500 to-purple-700',
      mega: 'from-red-500 to-red-700',
    };
    return colors[type.toLowerCase()] || 'from-gray-400 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 text-white">
      {/* Header Futurista */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative container mx-auto px-4 py-12"
        >
          <h1 className="text-7xl font-black text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            🌌 MULTIVERSE EXPLORER
          </h1>
          <p className="text-center text-xl text-purple-200 mb-8">
            Explore, Compare e Descubra Personagens de Múltiplos Universos
          </p>

          {/* Seletor de Universo */}
          <div className="flex justify-center gap-4 mb-8">
            {(['POKEMON', 'DIGIMON'] as UniverseType[]).map((universe) => (
              <motion.button
                key={universe}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedUniverse(universe);
                  setSelectedForComparison([]);
                }}
                className={`px-8 py-4 rounded-2xl font-bold text-xl transition-all ${
                  selectedUniverse === universe
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 shadow-2xl shadow-purple-500/50'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {universe === 'POKEMON' ? '🎮 Pokémon' : '👾 Digimon'}
              </motion.button>
            ))}
          </div>

          {/* Busca */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
              <input
                type="text"
                placeholder="Buscar personagem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition-all"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Botão de Comparação */}
      <AnimatePresence>
        {selectedForComparison.length === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          >
            <button
              onClick={compareSelected}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full font-bold text-xl shadow-2xl shadow-green-500/50 hover:shadow-green-500/70 transition-all flex items-center gap-3"
            >
              <FaExchangeAlt className="animate-pulse" />
              Comparar Selecionados
              <FaBolt />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid de Personagens */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredCharacters.map((char, index) => (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -10 }}
                onClick={() => toggleUniverseSelection(char)}
                className={`relative cursor-pointer group ${
                  selectedForComparison.some(c => c.id === char.id)
                    ? 'ring-4 ring-yellow-400'
                    : ''
                }`}
              >
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:border-purple-400 transition-all">
                  {/* Imagem */}
                  <div className="relative aspect-square bg-white/10 rounded-xl mb-3 overflow-hidden">
                    <img
                      src={char.imageUrl || 'https://via.placeholder.com/150'}
                      alt={char.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>

                  {/* Nome */}
                  <h3 className="font-bold text-lg capitalize text-center mb-2 truncate">
                    {char.name}
                  </h3>

                  {/* Tipos */}
                  <div className="flex flex-wrap gap-1 justify-center mb-2">
                    {char.types.map((type) => (
                      <span
                        key={type}
                        className={`px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getTypeColor(type)}`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>

                  {/* Mini stats */}
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    {Object.entries(char.stats).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-purple-300 uppercase">{key.substring(0, 3)}</div>
                        <div className="font-bold">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Comparação */}
      <AnimatePresence>
        {showComparison && comparisonResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowComparison(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-500"
            >
              <h2 className="text-4xl font-black text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-400">
                ⚔️ BATTLE COMPARISON
              </h2>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Personagem 1 */}
                <div className="bg-white/10 rounded-2xl p-6">
                  <img
                    src={comparisonResult.character1.imageUrl}
                    alt={comparisonResult.character1.name}
                    className="w-48 h-48 mx-auto object-contain mb-4"
                  />
                  <h3 className="text-2xl font-bold text-center capitalize mb-4">
                    {comparisonResult.character1.name}
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={getRadarData(comparisonResult.character1.stats)}>
                      <PolarGrid stroke="#8b5cf6" />
                      <PolarAngleAxis dataKey="stat" stroke="#fff" />
                      <PolarRadiusAxis stroke="#8b5cf6" />
                      <Radar name={comparisonResult.character1.name} dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Personagem 2 */}
                <div className="bg-white/10 rounded-2xl p-6">
                  <img
                    src={comparisonResult.character2.imageUrl}
                    alt={comparisonResult.character2.name}
                    className="w-48 h-48 mx-auto object-contain mb-4"
                  />
                  <h3 className="text-2xl font-bold text-center capitalize mb-4">
                    {comparisonResult.character2.name}
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={getRadarData(comparisonResult.character2.stats)}>
                      <PolarGrid stroke="#8b5cf6" />
                      <PolarAngleAxis dataKey="stat" stroke="#fff" />
                      <PolarRadiusAxis stroke="#8b5cf6" />
                      <Radar name={comparisonResult.character2.name} dataKey="value" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Vencedor */}
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-center">
                <div className="text-3xl font-black mb-2">🏆 VENCEDOR</div>
                <div className="text-5xl font-black capitalize">{comparisonResult.winner}</div>
                <div className="text-xl mt-2">{comparisonResult.recommendation}</div>
              </div>

              <button
                onClick={() => setShowComparison(false)}
                className="mt-6 w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all"
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
