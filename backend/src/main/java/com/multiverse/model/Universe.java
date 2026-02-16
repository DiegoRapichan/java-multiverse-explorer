package com.multiverse.model;

/**
 * Universos disponíveis para exploração
 */
public enum Universe {
    POKEMON("Pokémon", "https://pokeapi.co/api/v2"),
    DIGIMON("Digimon", "https://digimon-api.vercel.app/api/digimon");

    private final String displayName;
    private final String apiBaseUrl;

    Universe(String displayName, String apiBaseUrl) {
        this.displayName = displayName;
        this.apiBaseUrl = apiBaseUrl;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getApiBaseUrl() {
        return apiBaseUrl;
    }
}
