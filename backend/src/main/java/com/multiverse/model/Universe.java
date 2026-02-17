package com.multiverse.model;

/**
 * Enum com os melhores animes do IMDB/MAL mapeados para a Jikan API
 * IDs = MyAnimeList anime ID
 */
public enum Universe {

    // ── APIs próprias ──────────────────────────────────────────
    POKEMON("Pokémon",           "https://pokeapi.co/api/v2",           "pokemon"),
    DIGIMON("Digimon",           "https://digimon-api.vercel.app/api",  "digimon"),

    // ── Jikan API (MAL) ────────────────────────────────────────
    // Shonen clássicos
    DRAGON_BALL("Dragon Ball Z",               "https://api.jikan.moe/v4", "813"),
    DRAGON_BALL_GT("Dragon Ball GT",           "https://api.jikan.moe/v4", "14"),
    NARUTO("Naruto",                           "https://api.jikan.moe/v4", "20"),
    NARUTO_SHIPPUDEN("Naruto Shippuden",       "https://api.jikan.moe/v4", "1735"),
    BLEACH("Bleach",                           "https://api.jikan.moe/v4", "269"),
    BLEACH_TYBW("Bleach: TYBW",               "https://api.jikan.moe/v4", "41467"),
    ONE_PIECE("One Piece",                     "https://api.jikan.moe/v4", "21"),
    FAIRY_TAIL("Fairy Tail",                   "https://api.jikan.moe/v4", "6702"),
    SAINT_SEIYA("Saint Seiya",                 "https://api.jikan.moe/v4", "1254"),
    YU_YU_HAKUSHO("Yu Yu Hakusho",             "https://api.jikan.moe/v4", "392"),
    INUYASHA("Inuyasha",                       "https://api.jikan.moe/v4", "249"),

    // Shonen moderno
    DEMON_SLAYER("Demon Slayer",               "https://api.jikan.moe/v4", "38000"),
    MY_HERO_ACADEMIA("My Hero Academia",       "https://api.jikan.moe/v4", "31964"),
    ATTACK_ON_TITAN("Attack on Titan",         "https://api.jikan.moe/v4", "16498"),
    JUJUTSU_KAISEN("Jujutsu Kaisen",           "https://api.jikan.moe/v4", "40748"),
    CHAINSAW_MAN("Chainsaw Man",               "https://api.jikan.moe/v4", "44511"),
    BLACK_CLOVER("Black Clover",               "https://api.jikan.moe/v4", "34572"),
    HUNTER_X_HUNTER("Hunter x Hunter",         "https://api.jikan.moe/v4", "11061"),
    ONE_PUNCH_MAN("One Punch Man",             "https://api.jikan.moe/v4", "30276"),
    MOB_PSYCHO("Mob Psycho 100",               "https://api.jikan.moe/v4", "32182"),
    SOLO_LEVELING("Solo Leveling",             "https://api.jikan.moe/v4", "55888"),
    BLUE_LOCK("Blue Lock",                     "https://api.jikan.moe/v4", "49596"),
    DANDADAN("Dandadan",                       "https://api.jikan.moe/v4", "57334"),

    // Ação / Aventura
    FULLMETAL_ALCHEMIST("FMA: Brotherhood",    "https://api.jikan.moe/v4", "5114"),
    DEATH_NOTE("Death Note",                   "https://api.jikan.moe/v4", "1535"),
    SWORD_ART_ONLINE("Sword Art Online",       "https://api.jikan.moe/v4", "11757"),
    TOKYO_GHOUL("Tokyo Ghoul",                 "https://api.jikan.moe/v4", "22319"),
    BERSERK("Berserk",                         "https://api.jikan.moe/v4", "33"),
    CODE_GEASS("Code Geass",                   "https://api.jikan.moe/v4", "1575"),
    VINLAND_SAGA("Vinland Saga",               "https://api.jikan.moe/v4", "37521"),
    AKAME_GA_KILL("Akame ga Kill",             "https://api.jikan.moe/v4", "22177"),
    SEVEN_DEADLY_SINS("Seven Deadly Sins",     "https://api.jikan.moe/v4", "23755"),
    RE_ZERO("Re:Zero",                         "https://api.jikan.moe/v4", "31240"),
    OVERLORD("Overlord",                       "https://api.jikan.moe/v4", "29803"),
    RISING_SHIELD_HERO("Rising of Shield Hero","https://api.jikan.moe/v4", "37278"),
    HELLS_PARADISE("Hell's Paradise",          "https://api.jikan.moe/v4", "50738"),
    FIRE_FORCE("Fire Force",                   "https://api.jikan.moe/v4", "38671"),
    DORORO("Dororo",                           "https://api.jikan.moe/v4", "38481"),
    PARASYTE("Parasyte",                       "https://api.jikan.moe/v4", "22535"),
    STEINS_GATE("Steins;Gate",                 "https://api.jikan.moe/v4", "9253"),
    NEON_GENESIS("Neon Genesis Evangelion",    "https://api.jikan.moe/v4", "30"),
    COWBOY_BEBOP("Cowboy Bebop",               "https://api.jikan.moe/v4", "1"),
    SAMURAI_CHAMPLOO("Samurai Champloo",       "https://api.jikan.moe/v4", "205"),
    FATE_STAY_NIGHT("Fate/Zero",               "https://api.jikan.moe/v4", "10087"),
    PSYCHO_PASS("Psycho-Pass",                 "https://api.jikan.moe/v4", "13601"),
    JOJOS_BIZARRE("JoJo's Bizarre Adventure",  "https://api.jikan.moe/v4", "14719"),
    PROMISED_NEVERLAND("Promised Neverland",   "https://api.jikan.moe/v4", "37779"),
    DR_STONE("Dr. Stone",                      "https://api.jikan.moe/v4", "38691"),
    MUSHOKU_TENSEI("Mushoku Tensei",           "https://api.jikan.moe/v4", "39535"),
    TENSURA("That Time I Got Reincarnated",    "https://api.jikan.moe/v4", "37430"),
    CYBERPUNK_EDGERUNNERS("Cyberpunk: Edgerunners","https://api.jikan.moe/v4","42310"),
    SPY_X_FAMILY("Spy x Family",               "https://api.jikan.moe/v4", "50265"),
    FRIEREN("Frieren",                         "https://api.jikan.moe/v4", "52991"),

    // Esportes / outros populares
    HAIKYUU("Haikyuu!!",                       "https://api.jikan.moe/v4", "20583"),
    SWORD_ART_ONLINE_2("SAO II",               "https://api.jikan.moe/v4", "21881");

    private final String displayName;
    private final String apiBaseUrl;
    private final String endpoint;

    Universe(String displayName, String apiBaseUrl, String endpoint) {
        this.displayName = displayName;
        this.apiBaseUrl  = apiBaseUrl;
        this.endpoint    = endpoint;
    }

    public String getDisplayName() { return displayName; }
    public String getApiBaseUrl()  { return apiBaseUrl; }
    public String getEndpoint()    { return endpoint; }

    public boolean isJikanApi()       { return apiBaseUrl.contains("jikan.moe"); }
    public boolean isDragonBallApi()  { return false; }
    public boolean isNarutoApi()      { return false; }
    public boolean isDemonSlayerApi() { return false; }
}
