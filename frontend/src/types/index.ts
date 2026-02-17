export type Universe =
  | "POKEMON"
  | "DIGIMON"
  | "DRAGON_BALL"
  | "NARUTO"
  | "DEMON_SLAYER"
  | "MY_HERO_ACADEMIA"
  | "ONE_PIECE"
  | "ATTACK_ON_TITAN"
  | "DEATH_NOTE"
  | "HUNTER_X_HUNTER"
  | "FULLMETAL_ALCHEMIST"
  | "BLEACH"
  | "ONE_PUNCH_MAN"
  | "TOKYO_GHOUL"
  | "SWORD_ART_ONLINE"
  | "FAIRY_TAIL"
  | "BLACK_CLOVER"
  | "JUJUTSU_KAISEN"
  | "CHAINSAW_MAN"
  | "SPY_X_FAMILY"
  | "YU_YU_HAKUSHO"
  | "SAINT_SEIYA";

export interface Character {
  id: string;
  name: string;
  imageUrl: string;
  type: string;
  stats: Record<string, any>;
}

export interface ComparisonResult {
  winner: Character;
  analysis: string;
  ranking: Array<Character & { totalPower: number }>;
}

// Configuração visual de cada universo
export const UNIVERSE_CONFIG: Record<
  Universe,
  {
    displayName: string;
    gradient: string;
    icon: string;
    description: string;
  }
> = {
  POKEMON: {
    displayName: "Pokémon",
    gradient: "from-yellow-400 to-red-500",
    icon: "⚡",
    description: "Capture and train monsters",
  },
  DIGIMON: {
    displayName: "Digimon",
    gradient: "from-blue-400 to-cyan-500",
    icon: "🔷",
    description: "Digital Monsters",
  },
  DRAGON_BALL: {
    displayName: "Dragon Ball",
    gradient: "from-orange-400 to-red-600",
    icon: "🐉",
    description: "Z, GT, Super - All sagas",
  },
  NARUTO: {
    displayName: "Naruto",
    gradient: "from-orange-500 to-yellow-400",
    icon: "🍥",
    description: "Ninjas and Shinobi",
  },
  DEMON_SLAYER: {
    displayName: "Demon Slayer",
    gradient: "from-purple-600 to-red-500",
    icon: "👺",
    description: "Kimetsu no Yaiba",
  },
  MY_HERO_ACADEMIA: {
    displayName: "My Hero Academia",
    gradient: "from-green-400 to-blue-500",
    icon: "🦸",
    description: "Heroes and Quirks",
  },
  ONE_PIECE: {
    displayName: "One Piece",
    gradient: "from-blue-500 to-cyan-400",
    icon: "⚓",
    description: "Pirates and Devil Fruits",
  },
  ATTACK_ON_TITAN: {
    displayName: "Attack on Titan",
    gradient: "from-gray-700 to-red-800",
    icon: "⚔️",
    description: "Humanity vs Titans",
  },
  DEATH_NOTE: {
    displayName: "Death Note",
    gradient: "from-black to-red-900",
    icon: "📓",
    description: "Psychological thriller",
  },
  HUNTER_X_HUNTER: {
    displayName: "Hunter x Hunter",
    gradient: "from-green-500 to-emerald-600",
    icon: "🎣",
    description: "Nen and Hunters",
  },
  FULLMETAL_ALCHEMIST: {
    displayName: "Fullmetal Alchemist",
    gradient: "from-amber-600 to-red-700",
    icon: "⚗️",
    description: "Alchemy and brotherhood",
  },
  BLEACH: {
    displayName: "Bleach",
    gradient: "from-orange-500 to-red-600",
    icon: "⚔️",
    description: "Soul Reapers",
  },
  ONE_PUNCH_MAN: {
    displayName: "One Punch Man",
    gradient: "from-yellow-400 to-red-500",
    icon: "👊",
    description: "Overpowered hero",
  },
  TOKYO_GHOUL: {
    displayName: "Tokyo Ghoul",
    gradient: "from-red-800 to-black",
    icon: "😈",
    description: "Humans vs Ghouls",
  },
  SWORD_ART_ONLINE: {
    displayName: "Sword Art Online",
    gradient: "from-blue-600 to-purple-600",
    icon: "⚔️",
    description: "Virtual reality MMO",
  },
  FAIRY_TAIL: {
    displayName: "Fairy Tail",
    gradient: "from-pink-500 to-blue-500",
    icon: "🧚",
    description: "Magic guilds",
  },
  BLACK_CLOVER: {
    displayName: "Black Clover",
    gradient: "from-black to-green-600",
    icon: "🍀",
    description: "Magic knights",
  },
  JUJUTSU_KAISEN: {
    displayName: "Jujutsu Kaisen",
    gradient: "from-purple-800 to-red-600",
    icon: "👹",
    description: "Cursed energy",
  },
  CHAINSAW_MAN: {
    displayName: "Chainsaw Man",
    gradient: "from-red-600 to-orange-500",
    icon: "🪚",
    description: "Devils and hunters",
  },
  SPY_X_FAMILY: {
    displayName: "Spy x Family",
    gradient: "from-pink-400 to-rose-500",
    icon: "🕵️",
    description: "Spy comedy",
  },
  YU_YU_HAKUSHO: {
    displayName: "Yu Yu Hakusho",
    gradient: "from-blue-600 to-purple-700",
    icon: "👻",
    description: "Spirit detective",
  },
  SAINT_SEIYA: {
    displayName: "Saint Seiya",
    gradient: "from-yellow-500 to-amber-700",
    icon: "♈",
    description: "Knights of the Zodiac",
  },
};
