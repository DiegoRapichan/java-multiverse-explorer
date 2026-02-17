package com.multiverse.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.multiverse.model.Character;
import com.multiverse.model.Universe;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class MultiverseService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final Cache<String, List<Character>> cache;

    // Rate limit para Jikan API (3 req/segundo)
    private long lastJikanRequest = 0;
    private static final long JIKAN_DELAY_MS = 350; // ~3 por segundo

    public MultiverseService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.cache = CacheBuilder.newBuilder()
                .expireAfterWrite(30, TimeUnit.MINUTES)
                .maximumSize(1000)
                .build();
    }

    public List<Character> getCharacters(Universe universe, int limit, int offset) {
        String cacheKey = universe.name() + "_" + limit + "_" + offset;
        
        List<Character> cached = cache.getIfPresent(cacheKey);
        if (cached != null) {
            log.info("Cache hit for {}", cacheKey);
            return cached;
        }

        List<Character> characters;
        
        if (universe == Universe.POKEMON) {
            characters = fetchPokemonCharacters(limit, offset);
        } else if (universe == Universe.DIGIMON) {
            characters = fetchDigimonCharacters(limit, offset);
        } else if (universe.isDragonBallApi()) {
            characters = fetchDragonBallCharacters(limit, offset);
        } else if (universe.isNarutoApi()) {
            characters = fetchNarutoCharacters(limit, offset);
        } else if (universe.isDemonSlayerApi()) {
            characters = fetchDemonSlayerCharacters(limit, offset);
        } else if (universe.isJikanApi()) {
            characters = fetchJikanCharacters(universe, limit, offset);
        } else {
            characters = new ArrayList<>();
        }

        cache.put(cacheKey, characters);
        return characters;
    }

    // ============================================
    // POKEMON (já existe)
    // ============================================
    private List<Character> fetchPokemonCharacters(int limit, int offset) {
        String url = "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset;
        // ... código existente ...
        return new ArrayList<>(); // placeholder
    }

    // ============================================
    // DIGIMON (já existe)
    // ============================================
    private List<Character> fetchDigimonCharacters(int limit, int offset) {
        String url = "https://digimon-api.vercel.app/api/digimon?limit=" + limit + "&offset=" + offset;
        // ... código existente ...
        return new ArrayList<>(); // placeholder
    }

    // ============================================
    // DRAGON BALL 🐉
    // ============================================
    private List<Character> fetchDragonBallCharacters(int limit, int offset) {
        try {
            String url = "https://web.dragonball-api.com/api/characters?page=" + (offset / limit + 1) + "&limit=" + limit;
            log.info("Fetching Dragon Ball characters from: {}", url);
            
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode items = root.get("items");
            
            List<Character> characters = new ArrayList<>();
            if (items != null && items.isArray()) {
                for (JsonNode node : items) {
                    Character character = Character.builder()
                            .id(node.get("id").asText())
                            .name(node.get("name").asText())
                            .imageUrl(node.get("image").asText())
                            .type(node.has("race") ? node.get("race").asText() : "Unknown")
                            .stats(new java.util.HashMap<>())
                            .build();
                    
                    // Power level
                    if (node.has("ki")) {
                        character.getStats().put("ki", node.get("ki").asText());
                    }
                    if (node.has("maxKi")) {
                        character.getStats().put("maxKi", node.get("maxKi").asText());
                    }
                    
                    characters.add(character);
                }
            }
            
            return characters;
        } catch (Exception e) {
            log.error("Error fetching Dragon Ball characters", e);
            return new ArrayList<>();
        }
    }

    // ============================================
    // NARUTO 🍥
    // ============================================
    private List<Character> fetchNarutoCharacters(int limit, int offset) {
        try {
            // Dattebayo API não tem paginação direta, então busca tudo e filtra
            String url = "https://api-dattebayo.vercel.app/anime/characters";
            log.info("Fetching Naruto characters from: {}", url);
            
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode charactersNode = root.get("characters");
            
            List<Character> characters = new ArrayList<>();
            if (charactersNode != null && charactersNode.isArray()) {
                int count = 0;
                for (int i = offset; i < charactersNode.size() && count < limit; i++, count++) {
                    JsonNode node = charactersNode.get(i);
                    
                    Character character = Character.builder()
                            .id(String.valueOf(i))
                            .name(node.get("name").asText())
                            .imageUrl(node.has("images") && node.get("images").isArray() ? 
                                     node.get("images").get(0).asText() : "")
                            .type(node.has("rank") ? node.get("rank").asText() : "Ninja")
                            .stats(new java.util.HashMap<>())
                            .build();
                    
                    if (node.has("debut")) {
                        character.getStats().put("debut", node.get("debut").asText());
                    }
                    
                    characters.add(character);
                }
            }
            
            return characters;
        } catch (Exception e) {
            log.error("Error fetching Naruto characters", e);
            return new ArrayList<>();
        }
    }

    // ============================================
    // DEMON SLAYER 👺
    // ============================================
    private List<Character> fetchDemonSlayerCharacters(int limit, int offset) {
        try {
            String url = "https://demon-slayer-api.onrender.com/v1?limit=" + limit;
            log.info("Fetching Demon Slayer characters from: {}", url);
            
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            
            List<Character> characters = new ArrayList<>();
            if (root != null && root.isArray()) {
                int count = 0;
                for (int i = offset; i < root.size() && count < limit; i++, count++) {
                    JsonNode node = root.get(i);
                    
                    Character character = Character.builder()
                            .id(node.get("id").asText())
                            .name(node.get("name").asText())
                            .imageUrl(node.has("img") ? node.get("img").asText() : "")
                            .type(node.has("category") ? node.get("category").asText() : "Unknown")
                            .stats(new java.util.HashMap<>())
                            .build();
                    
                    if (node.has("breathingStyle")) {
                        character.getStats().put("breathing", node.get("breathingStyle").asText());
                    }
                    
                    characters.add(character);
                }
            }
            
            return characters;
        } catch (Exception e) {
            log.error("Error fetching Demon Slayer characters", e);
            return new ArrayList<>();
        }
    }

    // ============================================
    // JIKAN API (MyAnimeList) - UNIVERSAL 📺
    // ============================================
    private List<Character> fetchJikanCharacters(Universe universe, int limit, int offset) {
        try {
            // Rate limiting
            waitForJikanRateLimit();
            
            String animeId = universe.getEndpoint();
            String url = "https://api.jikan.moe/v4/anime/" + animeId + "/characters";
            log.info("Fetching {} characters from Jikan: {}", universe.getDisplayName(), url);
            
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode data = root.get("data");
            
            List<Character> characters = new ArrayList<>();
            if (data != null && data.isArray()) {
                int count = 0;
                for (int i = offset; i < data.size() && count < limit; i++, count++) {
                    JsonNode node = data.get(i);
                    JsonNode charNode = node.get("character");
                    
                    Character character = Character.builder()
                            .id(charNode.get("mal_id").asText())
                            .name(charNode.get("name").asText())
                            .imageUrl(charNode.get("images").get("jpg").get("image_url").asText())
                            .type(node.get("role").asText())
                            .stats(new java.util.HashMap<>())
                            .build();
                    
                    if (charNode.has("url")) {
                        character.getStats().put("mal_url", charNode.get("url").asText());
                    }
                    
                    characters.add(character);
                }
            }
            
            return characters;
        } catch (Exception e) {
            log.error("Error fetching Jikan characters for {}", universe.getDisplayName(), e);
            return new ArrayList<>();
        }
    }

    // Rate limit helper para Jikan
    private synchronized void waitForJikanRateLimit() {
        long now = System.currentTimeMillis();
        long elapsed = now - lastJikanRequest;
        
        if (elapsed < JIKAN_DELAY_MS) {
            try {
                Thread.sleep(JIKAN_DELAY_MS - elapsed);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        lastJikanRequest = System.currentTimeMillis();
    }
}
