package com.multiverse.model;

/**
 * Enum representando todos os universos de anime disponíveis
 * Dragon Ball, Naruto e Demon Slayer migrados para Jikan API
 */
public enum Universe {
    // APIs próprias
    POKEMON("Pokemon", "https://pokeapi.co/api/v2", "pokemon"),
    DIGIMON("Digimon", "https://digimon-api.vercel.app/api", "digimon"),

    // Via Jikan API (MyAnimeList) - todos os demais usam o anime ID
    DRAGON_BALL("Dragon Ball Z", "https://api.jikan.moe/v4", "813"),
    NARUTO("Naruto", "https://api.jikan.moe/v4", "20"),
    DEMON_SLAYER("Demon Slayer", "https://api.jikan.moe/v4", "38000"),
    MY_HERO_ACADEMIA("My Hero Academia", "https://api.jikan.moe/v4", "31964"),
    ONE_PIECE("One Piece", "https://api.jikan.moe/v4", "21"),
    ATTACK_ON_TITAN("Attack on Titan", "https://api.jikan.moe/v4", "16498"),
    DEATH_NOTE("Death Note", "https://api.jikan.moe/v4", "1535"),
    HUNTER_X_HUNTER("Hunter x Hunter", "https://api.jikan.moe/v4", "11061"),
    FULLMETAL_ALCHEMIST("Fullmetal Alchemist", "https://api.jikan.moe/v4", "5114"),
    BLEACH("Bleach", "https://api.jikan.moe/v4", "269"),
    ONE_PUNCH_MAN("One Punch Man", "https://api.jikan.moe/v4", "30276"),
    TOKYO_GHOUL("Tokyo Ghoul", "https://api.jikan.moe/v4", "22319"),
    SWORD_ART_ONLINE("Sword Art Online", "https://api.jikan.moe/v4", "11757"),
    FAIRY_TAIL("Fairy Tail", "https://api.jikan.moe/v4", "6702"),
    BLACK_CLOVER("Black Clover", "https://api.jikan.moe/v4", "34572"),
    JUJUTSU_KAISEN("Jujutsu Kaisen", "https://api.jikan.moe/v4", "40748"),
    CHAINSAW_MAN("Chainsaw Man", "https://api.jikan.moe/v4", "44511"),
    SPY_X_FAMILY("Spy x Family", "https://api.jikan.moe/v4", "50265"),
    YU_YU_HAKUSHO("Yu Yu Hakusho", "https://api.jikan.moe/v4", "392"),
    SAINT_SEIYA("Saint Seiya", "https://api.jikan.moe/v4", "1254");

    private final String displayName;
    private final String apiBaseUrl;
    private final String endpoint;

    Universe(String displayName, String apiBaseUrl, String endpoint) {
        this.displayName = displayName;
        this.apiBaseUrl = apiBaseUrl;
        this.endpoint = endpoint;
    }

    public String getDisplayName() { return displayName; }
    public String getApiBaseUrl()  { return apiBaseUrl; }
    public String getEndpoint()    { return endpoint; }

    public boolean isJikanApi() {
        return apiBaseUrl.contains("jikan.moe");
    }

    // Mantidos por compatibilidade — agora sempre false pois migraram para Jikan
    public boolean isDragonBallApi()  { return false; }
    public boolean isNarutoApi()      { return false; }
    public boolean isDemonSlayerApi() { return false; }
}
