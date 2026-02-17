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

    private int calculatePower(Character character) {
        if (character.getStats() == null || character.getStats().isEmpty()) {
            return 0;
        }
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
        sb.append(winner.getName())
          .append(" vence com ")
          .append(winner.getTotalPower())
          .append(" pts. Ranking: ");
        for (RankedCharacter rc : ranking) {
            sb.append(rc.getPosition()).append("º ")
              .append(rc.getName())
              .append(" (").append(rc.getTotalPower()).append(" pts)");
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
    // DRAGON BALL — dragonballapp.vercel.app
    // Resposta: [ { id, name, image, race, description }, ... ]
    // =========================================================
    private List<Character> fetchDragonBallCharacters(int limit, int offset) {
        try {
            // API paginada: page começa em 1, pageSize fixo em 10
            int page = (offset / 10) + 1;
            String url = "https://dragonball-api.com/api/characters?page=" + page + "&limit=" + Math.min(limit, 10);
            log.info("Fetching Dragon Ball from: {}", url);

            JsonNode root = objectMapper.readTree(restTemplate.getForObject(url, String.class));

            // Resposta: { "items": [...], "meta": { "totalItems": ..., "currentPage": ... } }
            JsonNode items = root.has("items") ? root.get("items") : root;

            List<Character> characters = new ArrayList<>();
            if (items != null && items.isArray()) {
                for (JsonNode node : items) {
                    Map<String, String> stats = new HashMap<>();

                    // Stats de ki se disponíveis
                    if (node.has("ki") && !node.get("ki").isNull())
                        stats.put("ki", node.get("ki").asText());
                    if (node.has("maxKi") && !node.get("maxKi").isNull())
                        stats.put("maxKi", node.get("maxKi").asText());

                    // Affiliation como stat simbólico
                    if (node.has("affiliation") && !node.get("affiliation").isNull())
                        stats.put("affiliation", node.get("affiliation").asText());

                    // Gera stats baseados na posição se ki não existir
                    if (!stats.containsKey("ki")) {
                        int base = 50 + (node.has("id") ? node.get("id").asInt() * 5 : 0);
                        stats.put("power", String.valueOf(base));
                    }

                    String imageUrl = "";
                    if (node.has("image") && !node.get("image").isNull())
                        imageUrl = node.get("image").asText();

                    characters.add(Character.builder()
                            .id(node.has("id") ? node.get("id").asText() : String.valueOf(characters.size()))
                            .name(node.has("name") ? node.get("name").asText() : "Unknown")
                            .imageUrl(imageUrl)
                            .type(node.has("race") ? node.get("race").asText() : "Unknown")
                            .stats(stats)
                            .build());
                }
            }
            return characters;
        } catch (Exception e) {
            log.error("Error fetching Dragon Ball characters", e);
            return new ArrayList<>();
        }
    }

    // =========================================================
    // NARUTO — narutodb.xyz/api/character (URL ATUALIZADA)
    // Resposta: { "characters": [ { id, name, images[], rank, personal } ] }
    // =========================================================
    private List<Character> fetchNarutoCharacters(int limit, int offset) {
        try {
            int page = (offset / limit) + 1;
            String url = "https://narutodb.xyz/api/character?page=" + page + "&limit=" + limit;
            log.info("Fetching Naruto from: {}", url);

            JsonNode root = objectMapper.readTree(restTemplate.getForObject(url, String.class));
            JsonNode charactersNode = root.get("characters");

            List<Character> characters = new ArrayList<>();
            if (charactersNode != null && charactersNode.isArray()) {
                for (JsonNode node : charactersNode) {
                    Map<String, String> stats = new HashMap<>();

                    // Rank ninja
                    if (node.has("rank") && !node.get("rank").isNull()) {
                        JsonNode rank = node.get("rank");
                        if (rank.has("ninjaRank") && !rank.get("ninjaRank").isNull()) {
                            // ninjaRank é objeto com chaves como "Part I", "Part II"
                            JsonNode ninjaRank = rank.get("ninjaRank");
                            ninjaRank.fields().forEachRemaining(entry ->
                                stats.put("rank_" + entry.getKey(), entry.getValue().asText())
                            );
                        }
                    }

                    // Personal info (sexo, afiliação, clã)
                    if (node.has("personal") && !node.get("personal").isNull()) {
                        JsonNode personal = node.get("personal");
                        if (personal.has("sex")) stats.put("sex", personal.get("sex").asText());
                        if (personal.has("affiliation")) stats.put("affiliation", personal.get("affiliation").asText());
                        if (personal.has("clan")) stats.put("clan", personal.get("clan").asText());
                    }

                    // Jutsu count como proxy de poder
                    if (node.has("jutsu") && node.get("jutsu").isArray()) {
                        stats.put("jutsu_count", String.valueOf(node.get("jutsu").size() * 10));
                    }

                    // Imagem
                    String imageUrl = "";
                    if (node.has("images") && node.get("images").isArray() && node.get("images").size() > 0) {
                        imageUrl = node.get("images").get(0).asText();
                    }

                    // Tipo = rank mais recente ou "Ninja"
                    String type = "Ninja";
                    if (node.has("rank") && !node.get("rank").isNull()) {
                        JsonNode rank = node.get("rank");
                        if (rank.has("ninjaRank") && !rank.get("ninjaRank").isNull()) {
                            JsonNode ninjaRank = rank.get("ninjaRank");
                            if (ninjaRank.fields().hasNext()) {
                                type = ninjaRank.fields().next().getValue().asText();
                            }
                        }
                    }

                    characters.add(Character.builder()
                            .id(String.valueOf(node.has("id") ? node.get("id").asInt() : characters.size()))
                            .name(node.has("name") ? node.get("name").asText() : "Unknown")
                            .imageUrl(imageUrl)
                            .type(type)
                            .stats(stats)
                            .build());
                }
            }
            return characters;
        } catch (Exception e) {
            log.error("Error fetching Naruto characters", e);
            return new ArrayList<>();
        }
    }

    // =========================================================
    // DEMON SLAYER — demon-slayer-api-9c6c.onrender.com
    // Resposta: [ { name, affiliation, race, quote }, ... ]
    // =========================================================
    private List<Character> fetchDemonSlayerCharacters(int limit, int offset) {
        try {
            // Esta API não tem paginação, retorna todos
            String url = "https://demon-slayer-api-9c6c.onrender.com/api/v1/characters";
            log.info("Fetching Demon Slayer from: {}", url);

            JsonNode root = objectMapper.readTree(restTemplate.getForObject(url, String.class));

            List<Character> characters = new ArrayList<>();
            if (root != null && root.isArray()) {
                int count = 0;
                for (int i = offset; i < root.size() && count < limit; i++, count++) {
                    JsonNode node = root.get(i);

                    Map<String, String> stats = generateDemonSlayerStats(
                        node.has("affiliation") ? node.get("affiliation").asText() : "",
                        i
                    );

                    if (node.has("race") && !node.get("race").isNull())
                        stats.put("race", node.get("race").asText());
                    if (node.has("affiliation") && !node.get("affiliation").isNull())
                        stats.put("affiliation", node.get("affiliation").asText());

                    characters.add(Character.builder()
                            .id(String.valueOf(i))
                            .name(node.has("name") ? node.get("name").asText() : "Unknown")
                            .imageUrl(node.has("img") ? node.get("img").asText() :
                                     node.has("image") ? node.get("image").asText() : "")
                            .type(node.has("affiliation") ? node.get("affiliation").asText() : "Demon Slayer")
                            .stats(stats)
                            .build());
                }
            }
            return characters;
        } catch (Exception e) {
            log.error("Error fetching Demon Slayer characters", e);
            return new ArrayList<>();
        }
    }

    /**
     * Stats de Demon Slayer baseados na afiliação (proxy de poder)
     */
    private Map<String, String> generateDemonSlayerStats(String affiliation, int index) {
        int base = switch (affiliation.toLowerCase()) {
            case "demon slayer corps" -> 60;
            case "hashira"            -> 100;
            case "twelve kizuki"      -> 90;
            case "demon"              -> 70;
            default                   -> 40;
        };
        int seed = index % 20;
        Map<String, String> stats = new HashMap<>();
        stats.put("attack",  String.valueOf(base + seed));
        stats.put("defense", String.valueOf(base + (seed * 2 % 20)));
        stats.put("speed",   String.valueOf(base + (seed * 3 % 20)));
        return stats;
    }

    // =========================================================
    // JIKAN (MyAnimeList)
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
                int count = 0;
                for (int i = offset; i < data.size() && count < limit; i++, count++) {
                    JsonNode node = data.get(i);
                    JsonNode charNode = node.get("character");

                    Map<String, String> stats = new HashMap<>();
                    if (charNode.has("url"))
                        stats.put("mal_url", charNode.get("url").asText());

                    // Favorites como proxy de poder (personagem popular = mais forte canonicamente)
                    if (node.has("favorites"))
                        stats.put("favorites", node.get("favorites").asText());

                    characters.add(Character.builder()
                            .id(charNode.get("mal_id").asText())
                            .name(charNode.get("name").asText())
                            .imageUrl(charNode.get("images").get("jpg").get("image_url").asText())
                            .type(node.get("role").asText())
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
