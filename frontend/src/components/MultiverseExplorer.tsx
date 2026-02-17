// ============================================
// MULTIVERSE EXPLORER - SUPORTE A 8 PERSONAGENS
// ============================================

// No arquivo MultiverseExplorer.tsx, faça estas mudanças:

// 1. MUDAR O LIMITE DE SELEÇÃO
const MAX_CHARACTERS = 8; // ← ERA 2, AGORA É 8

// 2. ATUALIZAR A MENSAGEM
{selectedCharacters.length >= MAX_CHARACTERS && (
  <div className="text-yellow-400 text-center mb-4">
    ⚠️ Máximo de {MAX_CHARACTERS} personagens selecionados!
  </div>
)}

// 3. ATUALIZAR O BOTÃO DE COMPARAR
<button
  onClick={() => setShowModal(true)}
  disabled={selectedCharacters.length < 2} // ← Mínimo 2, máximo 8
  className="..."
>
  ⚔️ Comparar {selectedCharacters.length} Personagens
</button>

// 4. ATUALIZAR O MODAL PARA GRID RESPONSIVO
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {selectedCharacters.map((character) => (
    <div key={character.id} className="bg-gray-800 rounded-xl p-4">
      <img
        src={character.imageUrl}
        alt={character.name}
        className="w-full h-48 object-cover rounded-lg mb-3"
      />
      <h3 className="text-xl font-bold text-white mb-2">
        {character.name}
      </h3>
      <p className="text-cyan-400 text-sm mb-3">{character.type}</p>
      
      {/* Stats */}
      <div className="space-y-2">
        {Object.entries(character.stats).map(([key, value]) => (
          <div key={key} className="flex justify-between text-sm">
            <span className="text-gray-400">{key}:</span>
            <span className="text-white font-semibold">{value}</span>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>

// 5. ADICIONAR VISUALIZAÇÃO DE RANKING
{comparison && (
  <div className="mt-6">
    <h3 className="text-2xl font-bold text-white mb-4">
      🏆 Ranking de Poder
    </h3>
    <div className="space-y-3">
      {comparison.ranking.map((char, index) => (
        <div
          key={char.id}
          className={`flex items-center gap-4 p-4 rounded-xl ${
            index === 0
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
              : index === 1
              ? 'bg-gradient-to-r from-gray-400 to-gray-500'
              : index === 2
              ? 'bg-gradient-to-r from-orange-700 to-orange-800'
              : 'bg-gray-700'
          }`}
        >
          <div className="text-3xl font-bold">
            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
          </div>
          <img
            src={char.imageUrl}
            alt={char.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h4 className="text-xl font-bold text-white">{char.name}</h4>
            <p className="text-sm opacity-90">{char.type}</p>
          </div>
          <div className="text-2xl font-bold text-white">
            {char.totalPower}
          </div>
        </div>
      ))}
    </div>
  </div>
)}
