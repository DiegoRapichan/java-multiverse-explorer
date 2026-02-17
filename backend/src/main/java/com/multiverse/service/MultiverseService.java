package com.multiverse.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.multiverse.model.Character;
import com.multiverse.model.ComparisonResult;
import com.multiverse.model.ComparisonResult.RankedCharacter;
import com.multiverse.model.Universe;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MultiverseService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final Cache<String, List<Character>> cache;

    private long lastJikanRequest = 0;
    private static final long JIKAN_DELAY_MS = 350;

    public MultiverseService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.cache = CacheBuilder.newBuilder()
                .expireAfterWrite(30, TimeUnit.MINUTES)
                .maximumSize(1000)
                .build();
    }

    // =========================================================
    // PÚBLICO
    // =========================================================

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
        } else if (universe.isJikanApi()) {
            // Dragon Ball, Naruto, Demon Slayer e todos os outros via Jikan
            characters = fetchJikanCharacters(universe, limit, offset);
        } else {
            characters = new ArrayList<>();
        }

        cache.put(cacheKey, characters);
        return characters;
    }

    public Character getCharacterByName(Universe universe, String name) {
        List<Character> characters = getCharacters(universe, 200, 0);
        return characters.stream()
                .filter(c -> c.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseThrow(() -> new RuntimeException(
                        "Character '" + name + "' not found in universe " + universe.name()));
    }

    public ComparisonResult compareCharacters(List<Character> characters) {
        AtomicInteger position = new AtomicInteger(1);

        List<RankedCharacter> ranking = characters.stream()
                .map(c -> RankedCharacter.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .imageUrl(c.getImageUrl())
                        .type(c.getType())
                        .totalPower(calculatePower(c))
                        .build())
                .sorted(Comparator.comparingInt(RankedCharacter::getTotalPower).reversed())
                .peek(rc -> rc.setPosition(position.getAndIncrement()))
                .collect(Collectors.toList());

        Character winner = characters.stream()
                .filter(c -> c.getId().equals(ranking.get(0).getId()))
                .findFirst()
                .orElse(characters.get(0));

        return ComparisonResult.builder()
                .winner(winner)
                .analysis(buildAnalysis(ranking))
                .ranking(ranking)
                .build();
    }

    // =========================================================
    // PRIVADO — helpers
    // =========================================================

    private int calculatePower(Character character) {
        if (character.getStats() == null || character.getStats().isEmpty()) return 0;
        return character.getStats().values().stream()
                .mapToInt(val -> {
                    try {
                        String digits = val.toString().replaceAll("[^0-9]", "");
                        return digits.isEmpty() ? 0 : Integer.parseInt(digits);
                    } catch (NumberFormatException e) {
                        return 0;
                    }
                })
                .sum();
    }

    private String buildAnalysis(List<RankedCharacter> ranking) {
        RankedCharacter winner = ranking.get(0);
        StringBuilder sb = new StringBuilder();
        sb.append(winner.getName()).append(" vence com ")
          .append(winner.getTotalPower()).append(" pts. Ranking: ");
        for (RankedCharacter rc : ranking) {
            sb.append(rc.getPosition()).append("º ")
              .append(rc.getName()).append(" (").append(rc.getTotalPower()).append(" pts)");
            if (rc.getPosition() < ranking.size()) sb.append(", ");
        }
        return sb.toString();
    }

    // =========================================================
    // POKEMON — stats reais da PokeAPI
    // =========================================================
    private List<Character> fetchPokemonCharacters(int limit, int offset) {
        try {
            String url = "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset;
            log.info("Fetching Pokemon from: {}", url);

            JsonNode root = objectMapper.readTree(restTemplate.getForObject(url, String.class));
            JsonNode results = root.get("results");

            List<Character> characters = new ArrayList<>();
            if (results != null && results.isArray()) {
                for (JsonNode node : results) {
                    JsonNode detail = objectMapper.readTree(
                            restTemplate.getForObject(node.get("url").asText(), String.class));

                    Map<String, String> stats = new HashMap<>();
                    JsonNode statsNode = detail.get("stats");
                    if (statsNode != null && statsNode.isArray()) {
                        for (JsonNode stat : statsNode) {
                            stats.put(
                                stat.get("stat").get("name").asText(),
                                stat.get("base_stat").asText()
                            );
                        }
                    }

                    characters.add(Character.builder()
                            .id(detail.get("id").asText())
                            .name(node.get("name").asText())
                            .imageUrl(detail.get("sprites").get("front_default").asText())
                            .type(detail.get("types").get(0).get("type").get("name").asText())
                            .stats(stats)
                            .build());
                }
            }
            return characters;
        } catch (Exception e) {
            log.error("Error fetching Pokemon", e);
            return new ArrayList<>();
        }
    }

    // =========================================================
    // DIGIMON — stats gerados deterministicamente pelo level
    // =========================================================
    private List<Character> fetchDigimonCharacters(int limit, int offset) {
        try {
            String url = "https://digimon-api.vercel.app/api/digimon";
            log.info("Fetching Digimon from: {}", url);

            JsonNode root = objectMapper.readTree(restTemplate.getForObject(url, String.class));

            List<Character> characters = new ArrayList<>();
            if (root != null && root.isArray()) {
                int count = 0;
                for (int i = offset; i < root.size() && count < limit; i++, count++) {
                    JsonNode node = root.get(i);
                    String level = node.get("level").asText();

                    characters.add(Character.builder()
                            .id(String.valueOf(i))
                            .name(node.get("name").asText())
                            .imageUrl(node.get("img").asText())
                            .type(level)
                            .stats(generateDigimonStats(level, i))
                            .build());
                }
            }
            return characters;
        } catch (Exception e) {
            log.error("Error fetching Digimon", e);
            return new ArrayList<>();
        }
    }

    private Map<String, String> generateDigimonStats(String level, int index) {
        int base = switch (level.toLowerCase()) {
            case "fresh"       -> 10;
            case "in training" -> 20;
            case "rookie"      -> 40;
            case "champion"    -> 60;
            case "ultimate"    -> 80;
            case "mega"        -> 100;
            case "ultra"       -> 120;
            default            -> 30;
        };
        int seed = index % 20;
        Map<String, String> stats = new HashMap<>();
        stats.put("attack",  String.valueOf(base + seed));
        stats.put("defense", String.valueOf(base + (seed * 2 % 20)));
        stats.put("speed",   String.valueOf(base + (seed * 3 % 20)));
        return stats;
    }

    // =========================================================
    // JIKAN — todos os universos via MyAnimeList
    // Poder = favorites (MAL) + fallback por posição na lista
    // Personagens principais aparecem primeiro → posição alta = mais poder
    // =========================================================
    private List<Character> fetchJikanCharacters(Universe universe, int limit, int offset) {
        try {
            waitForJikanRateLimit();

            String url = "https://api.jikan.moe/v4/anime/" + universe.getEndpoint() + "/characters";
            log.info("Fetching {} from Jikan: {}", universe.getDisplayName(), url);

            JsonNode root = objectMapper.readTree(restTemplate.getForObject(url, String.class));
            JsonNode data = root.get("data");

            List<Character> characters = new ArrayList<>();
            if (data != null && data.isArray()) {
                // Tamanho total para calcular fallback por posição
                int totalSize = data.size();
                int count = 0;

                for (int i = offset; i < totalSize && count < limit; i++, count++) {
                    JsonNode node = data.get(i);
                    JsonNode charNode = node.get("character");

                    Map<String, String> stats = new HashMap<>();

                    // Favorites como proxy de poder principal
                    int favorites = 0;
                    if (node.has("favorites") && !node.get("favorites").isNull()) {
                        favorites = node.get("favorites").asInt(0);
                    }

                    if (favorites > 0) {
                        // Tem favorites reais — usa direto
                        stats.put("popularity", String.valueOf(favorites));
                    } else {
                        // Fallback: posição invertida na lista
                        // Posição 0 (personagem principal) = maior poder
                        // Posição N (personagem secundário) = menor poder
                        int positionPower = Math.max(10, (totalSize - i) * 10);
                        stats.put("popularity", String.valueOf(positionPower));
                    }

                    // Role como stat extra: Main > Supporting
                    String role = node.get("role").asText();
                    int rolePower = role.equalsIgnoreCase("Main") ? 500 : 100;
                    stats.put("role_power", String.valueOf(rolePower));

                    characters.add(Character.builder()
                            .id(charNode.get("mal_id").asText())
                            .name(charNode.get("name").asText())
                            .imageUrl(charNode.get("images").get("jpg").get("image_url").asText())
                            .type(role)
                            .stats(stats)
                            .build());
                }
            }
            return characters;
        } catch (Exception e) {
            log.error("Error fetching Jikan for {}", universe.getDisplayName(), e);
            return new ArrayList<>();
        }
    }

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
