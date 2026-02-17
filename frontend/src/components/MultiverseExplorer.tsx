// ============================================
// SCROLL INFINITO PARA MULTIVERSE EXPLORER
// ============================================

// Adicione essas mudanças no arquivo MultiverseExplorer.tsx:

import React, { useState, useEffect, useCallback, useRef } from "react";
// ... outros imports

export default function MultiverseExplorer() {
  const [selectedUniverse, setSelectedUniverse] = useState<Universe>("POKEMON");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ NOVOS ESTADOS PARA SCROLL INFINITO
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // ✅ FUNÇÃO PARA CARREGAR PERSONAGENS COM PAGINAÇÃO
  const loadCharacters = useCallback(
    async (universe: string, pageNum: number, append = false) => {
      if (pageNum === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      try {
        const limit = 50;
        const offset = pageNum * limit;

        // Modificar a chamada da API para incluir offset
        const data = await api.getCharacters(universe, limit, offset);

        if (append) {
          setCharacters((prev) => [...prev, ...data]);
        } else {
          setCharacters(data);
        }

        // Se retornar menos que o limite, não tem mais
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

  // ... resto do código permanece igual até o render

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* ... header e seletor de universo ... */}

      {/* Grid de personagens */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredCharacters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            isSelected={selectedCharacters.some((c) => c.id === character.id)}
            onSelect={() => handleSelectCharacter(character)}
          />
        ))}
      </motion.div>

      {/* ✅ LOADING INDICATOR PARA SCROLL INFINITO */}
      {loadingMore && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
          <p className="ml-4 text-white text-lg">
            Carregando mais personagens...
          </p>
        </div>
      )}

      {/* ✅ ELEMENTO OBSERVADO PARA TRIGGER DO SCROLL */}
      <div ref={observerTarget} className="h-10"></div>

      {/* ✅ MENSAGEM QUANDO NÃO TEM MAIS */}
      {!hasMore && characters.length > 0 && (
        <div className="text-center py-8">
          <p className="text-white text-lg">
            ✨ Todos os personagens carregados!
          </p>
        </div>
      )}

      {/* ... resto do código (modal, etc) ... */}
    </div>
  );
}
