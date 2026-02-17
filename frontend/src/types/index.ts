export type Universe =
  | "POKEMON"
  | "DIGIMON"
  | "DRAGON_BALL"
  | "DRAGON_BALL_GT"
  | "NARUTO"
  | "NARUTO_SHIPPUDEN"
  | "BLEACH"
  | "BLEACH_TYBW"
  | "ONE_PIECE"
  | "FAIRY_TAIL"
  | "SAINT_SEIYA"
  | "YU_YU_HAKUSHO"
  | "INUYASHA"
  | "DEMON_SLAYER"
  | "MY_HERO_ACADEMIA"
  | "ATTACK_ON_TITAN"
  | "JUJUTSU_KAISEN"
  | "CHAINSAW_MAN"
  | "BLACK_CLOVER"
  | "HUNTER_X_HUNTER"
  | "ONE_PUNCH_MAN"
  | "MOB_PSYCHO"
  | "SOLO_LEVELING"
  | "BLUE_LOCK"
  | "DANDADAN"
  | "FULLMETAL_ALCHEMIST"
  | "DEATH_NOTE"
  | "SWORD_ART_ONLINE"
  | "TOKYO_GHOUL"
  | "BERSERK"
  | "CODE_GEASS"
  | "VINLAND_SAGA"
  | "AKAME_GA_KILL"
  | "SEVEN_DEADLY_SINS"
  | "RE_ZERO"
  | "OVERLORD"
  | "RISING_SHIELD_HERO"
  | "HELLS_PARADISE"
  | "FIRE_FORCE"
  | "DORORO"
  | "PARASYTE"
  | "STEINS_GATE"
  | "NEON_GENESIS"
  | "COWBOY_BEBOP"
  | "SAMURAI_CHAMPLOO"
  | "FATE_STAY_NIGHT"
  | "PSYCHO_PASS"
  | "JOJOS_BIZARRE"
  | "PROMISED_NEVERLAND"
  | "DR_STONE"
  | "MUSHOKU_TENSEI"
  | "TENSURA"
  | "CYBERPUNK_EDGERUNNERS"
  | "SPY_X_FAMILY"
  | "FRIEREN"
  | "HAIKYUU"
  | "SWORD_ART_ONLINE_2";

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
  ranking: Array<{
    id: string;
    name: string;
    imageUrl: string;
    type: string;
    totalPower: number;
    position: number;
  }>;
}

export const UNIVERSE_CONFIG: Record<
  Universe,
  { displayName: string; gradient: string; icon: string; description: string }
> = {
  // APIs próprias
  POKEMON: {
    displayName: "Pokémon",
    icon: "⚡",
    gradient: "from-yellow-400 to-red-500",
    description: "Capture and train monsters",
  },
  DIGIMON: {
    displayName: "Digimon",
    icon: "🔷",
    gradient: "from-blue-400 to-cyan-500",
    description: "Digital Monsters",
  },

  // Shonen clássico
  DRAGON_BALL: {
    displayName: "Dragon Ball Z",
    icon: "🐉",
    gradient: "from-orange-400 to-red-600",
    description: "Z Warriors",
  },
  DRAGON_BALL_GT: {
    displayName: "Dragon Ball GT",
    icon: "🌟",
    gradient: "from-orange-500 to-yellow-500",
    description: "GT saga",
  },
  NARUTO: {
    displayName: "Naruto",
    icon: "🍥",
    gradient: "from-orange-500 to-yellow-400",
    description: "Ninjas and Shinobi",
  },
  NARUTO_SHIPPUDEN: {
    displayName: "Naruto Shippuden",
    icon: "🌀",
    gradient: "from-orange-600 to-red-500",
    description: "Shippuden arc",
  },
  BLEACH: {
    displayName: "Bleach",
    icon: "⚔️",
    gradient: "from-orange-500 to-red-600",
    description: "Soul Reapers",
  },
  BLEACH_TYBW: {
    displayName: "Bleach: TYBW",
    icon: "🩸",
    gradient: "from-red-600 to-black",
    description: "Thousand-Year Blood War",
  },
  ONE_PIECE: {
    displayName: "One Piece",
    icon: "⚓",
    gradient: "from-blue-500 to-cyan-400",
    description: "Pirates and Devil Fruits",
  },
  FAIRY_TAIL: {
    displayName: "Fairy Tail",
    icon: "🧚",
    gradient: "from-pink-500 to-blue-500",
    description: "Magic guilds",
  },
  SAINT_SEIYA: {
    displayName: "Saint Seiya",
    icon: "♈",
    gradient: "from-yellow-500 to-amber-700",
    description: "Knights of the Zodiac",
  },
  YU_YU_HAKUSHO: {
    displayName: "Yu Yu Hakusho",
    icon: "👻",
    gradient: "from-blue-600 to-purple-700",
    description: "Spirit detective",
  },
  INUYASHA: {
    displayName: "Inuyasha",
    icon: "🐺",
    gradient: "from-red-500 to-purple-600",
    description: "Feudal era demons",
  },

  // Shonen moderno
  DEMON_SLAYER: {
    displayName: "Demon Slayer",
    icon: "👺",
    gradient: "from-purple-600 to-red-500",
    description: "Kimetsu no Yaiba",
  },
  MY_HERO_ACADEMIA: {
    displayName: "My Hero Academia",
    icon: "🦸",
    gradient: "from-green-400 to-blue-500",
    description: "Heroes and Quirks",
  },
  ATTACK_ON_TITAN: {
    displayName: "Attack on Titan",
    icon: "🗡️",
    gradient: "from-gray-700 to-red-800",
    description: "Humanity vs Titans",
  },
  JUJUTSU_KAISEN: {
    displayName: "Jujutsu Kaisen",
    icon: "👹",
    gradient: "from-purple-800 to-red-600",
    description: "Cursed energy",
  },
  CHAINSAW_MAN: {
    displayName: "Chainsaw Man",
    icon: "🪚",
    gradient: "from-red-600 to-orange-500",
    description: "Devils and hunters",
  },
  BLACK_CLOVER: {
    displayName: "Black Clover",
    icon: "🍀",
    gradient: "from-black to-green-600",
    description: "Magic knights",
  },
  HUNTER_X_HUNTER: {
    displayName: "Hunter x Hunter",
    icon: "🎣",
    gradient: "from-green-500 to-emerald-600",
    description: "Nen and Hunters",
  },
  ONE_PUNCH_MAN: {
    displayName: "One Punch Man",
    icon: "👊",
    gradient: "from-yellow-400 to-red-500",
    description: "Overpowered hero",
  },
  MOB_PSYCHO: {
    displayName: "Mob Psycho 100",
    icon: "🧠",
    gradient: "from-cyan-500 to-purple-600",
    description: "Psychic powers",
  },
  SOLO_LEVELING: {
    displayName: "Solo Leveling",
    icon: "⬆️",
    gradient: "from-blue-700 to-purple-900",
    description: "Hunters and dungeons",
  },
  BLUE_LOCK: {
    displayName: "Blue Lock",
    icon: "⚽",
    gradient: "from-blue-600 to-cyan-500",
    description: "Football battle royale",
  },
  DANDADAN: {
    displayName: "Dandadan",
    icon: "👽",
    gradient: "from-green-500 to-purple-600",
    description: "Aliens and spirits",
  },

  // Ação / Aventura
  FULLMETAL_ALCHEMIST: {
    displayName: "FMA: Brotherhood",
    icon: "⚗️",
    gradient: "from-amber-600 to-red-700",
    description: "Alchemy and brotherhood",
  },
  DEATH_NOTE: {
    displayName: "Death Note",
    icon: "📓",
    gradient: "from-gray-900 to-red-900",
    description: "Psychological thriller",
  },
  SWORD_ART_ONLINE: {
    displayName: "Sword Art Online",
    icon: "🗡️",
    gradient: "from-blue-600 to-purple-600",
    description: "Virtual reality MMO",
  },
  TOKYO_GHOUL: {
    displayName: "Tokyo Ghoul",
    icon: "😈",
    gradient: "from-red-800 to-gray-900",
    description: "Humans vs Ghouls",
  },
  BERSERK: {
    displayName: "Berserk",
    icon: "🗡️",
    gradient: "from-gray-800 to-red-900",
    description: "Dark fantasy",
  },
  CODE_GEASS: {
    displayName: "Code Geass",
    icon: "👁️",
    gradient: "from-red-700 to-purple-800",
    description: "Power of the king",
  },
  VINLAND_SAGA: {
    displayName: "Vinland Saga",
    icon: "⚔️",
    gradient: "from-blue-800 to-gray-700",
    description: "Vikings",
  },
  AKAME_GA_KILL: {
    displayName: "Akame ga Kill",
    icon: "🗡️",
    gradient: "from-red-600 to-black",
    description: "Night Raid assassins",
  },
  SEVEN_DEADLY_SINS: {
    displayName: "Seven Deadly Sins",
    icon: "😈",
    gradient: "from-purple-600 to-red-600",
    description: "Holy knights",
  },
  RE_ZERO: {
    displayName: "Re:Zero",
    icon: "🔄",
    gradient: "from-blue-500 to-purple-600",
    description: "Return by death",
  },
  OVERLORD: {
    displayName: "Overlord",
    icon: "💀",
    gradient: "from-gray-900 to-purple-900",
    description: "Undead ruler",
  },
  RISING_SHIELD_HERO: {
    displayName: "Rising of Shield Hero",
    icon: "🛡️",
    gradient: "from-green-700 to-teal-600",
    description: "Shield hero",
  },
  HELLS_PARADISE: {
    displayName: "Hell's Paradise",
    icon: "🌸",
    gradient: "from-pink-600 to-red-700",
    description: "Gabimaru",
  },
  FIRE_FORCE: {
    displayName: "Fire Force",
    icon: "🔥",
    gradient: "from-orange-600 to-red-700",
    description: "Special fire force",
  },
  DORORO: {
    displayName: "Dororo",
    icon: "👁️",
    gradient: "from-gray-700 to-red-800",
    description: "Samurai demons",
  },
  PARASYTE: {
    displayName: "Parasyte",
    icon: "🧬",
    gradient: "from-green-600 to-gray-700",
    description: "Alien parasites",
  },
  STEINS_GATE: {
    displayName: "Steins;Gate",
    icon: "⏰",
    gradient: "from-yellow-600 to-orange-700",
    description: "Time travel",
  },
  NEON_GENESIS: {
    displayName: "Neon Genesis Eva",
    icon: "🤖",
    gradient: "from-purple-700 to-green-700",
    description: "Evangelion",
  },
  COWBOY_BEBOP: {
    displayName: "Cowboy Bebop",
    icon: "🚀",
    gradient: "from-yellow-600 to-blue-700",
    description: "Space bounty hunters",
  },
  SAMURAI_CHAMPLOO: {
    displayName: "Samurai Champloo",
    icon: "🎵",
    gradient: "from-amber-600 to-red-600",
    description: "Edo hip-hop samurai",
  },
  FATE_STAY_NIGHT: {
    displayName: "Fate/Zero",
    icon: "⚜️",
    gradient: "from-blue-700 to-purple-800",
    description: "Holy Grail War",
  },
  PSYCHO_PASS: {
    displayName: "Psycho-Pass",
    icon: "🔫",
    gradient: "from-cyan-700 to-blue-900",
    description: "Dystopian future",
  },
  JOJOS_BIZARRE: {
    displayName: "JoJo's Bizarre Adv.",
    icon: "💪",
    gradient: "from-purple-500 to-pink-600",
    description: "Stands and Joestars",
  },
  PROMISED_NEVERLAND: {
    displayName: "Promised Neverland",
    icon: "🌿",
    gradient: "from-green-600 to-gray-800",
    description: "Escape the farm",
  },
  DR_STONE: {
    displayName: "Dr. Stone",
    icon: "🧪",
    gradient: "from-green-500 to-teal-600",
    description: "Science and survival",
  },
  MUSHOKU_TENSEI: {
    displayName: "Mushoku Tensei",
    icon: "📖",
    gradient: "from-blue-500 to-purple-600",
    description: "Isekai reincarnation",
  },
  TENSURA: {
    displayName: "That Time Reincarnated",
    icon: "🐛",
    gradient: "from-blue-400 to-teal-500",
    description: "Slime isekai",
  },
  CYBERPUNK_EDGERUNNERS: {
    displayName: "Cyberpunk Edgerunners",
    icon: "🤖",
    gradient: "from-yellow-400 to-red-600",
    description: "Night City",
  },
  SPY_X_FAMILY: {
    displayName: "Spy x Family",
    icon: "🕵️",
    gradient: "from-pink-400 to-rose-500",
    description: "Spy comedy",
  },
  FRIEREN: {
    displayName: "Frieren",
    icon: "🧝",
    gradient: "from-purple-400 to-blue-500",
    description: "Elf mage journey",
  },
  HAIKYUU: {
    displayName: "Haikyuu!!",
    icon: "🏐",
    gradient: "from-orange-500 to-black",
    description: "Volleyball battles",
  },
  SWORD_ART_ONLINE_2: {
    displayName: "SAO II",
    icon: "🔫",
    gradient: "from-gray-500 to-blue-600",
    description: "Gun Gale Online",
  },
};
