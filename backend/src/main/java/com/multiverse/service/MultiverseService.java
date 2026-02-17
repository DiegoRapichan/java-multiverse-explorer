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
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MultiverseService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final Cache<String, List<Character>> cache;

    // Rate limit para Jikan API (3 req/segundo)
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

    /**
     * Busca um personagem específico pelo nome dentro de um universo.
     * Faz uma busca case-insensitive na lista paginada (até 200 itens do cache).
     */
    public Character getCharacterByName(Universe universe, String name) {
        List<Character> characters = getCharacters(universe, 200, 0);
        return characters.stream()
                .filter(c -> c.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseThrow(() -> new RuntimeException(
                        "Character '" + name + "' not found in universe " + universe.name()));
    }

    /**
     * Compara uma lista de 2 a 8 personagens.
     * O "poder total" de cada personagem é calculado somando os valores numéricos
     * dos seus stats. Personagens sem stats numéricos recebem um score baseado
     * no número de stats preenchidos (para universos sem dados numéricos).
     */
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

        RankedCharacter winnerRanked = ranking.get(0);

        Character winner = characters.stream()
                .filter(c -> c.getId().equals(winnerRanked.getId()))
                .findFirst()
                .orElse(characters.get(0));

        String analysis = buildAnalysis(ranking);

        return ComparisonResult.builder()
                .winner(winner)
                .analysis(analysis)
                .ranking(ranking)
                .build();
    }

    /**
     * Calcula o poder de um personagem somando valores numéricos dos stats.
     * Para universos sem stats numéricos, usa a contagem de stats * 10
     * como score simbólico para não zerar todos.
     */
    private int calculatePower(Character character) {
        if (character.getStats() == null || character.getStats().isEmpty()) {
            return 0;
        }

        int numericSum = character.getStats().values().stream()
                .mapToInt(val -> {
                    try {
                        return Integer.parseInt(val.toString().replaceAll("[^0-9]", ""));
                    } catch (NumberFormatException e) {
                        return 0;
                    }
                })
                .sum();

        // Se todos os stats forem texto (sem números), usa contagem * 10
        return numericSum > 0 ? numericSum : character.getStats().size() * 10;
    }

    /**
     * Gera uma análise textual do resultado da comparação.
     */
    private String buildAnalysis(List<RankedCharacter> ranking) {
        RankedCharacter winner = ranking.get(0);
        StringBuilder sb = new StringBuilder();

        sb.append(winner.getName())
          .append(" vence a comparação com ")
          .append(winner.getTotalPower())
          .append(" de poder total. ");

        if (ranking.size() > 1) {
            sb.append("Ranking completo: ");
            for (RankedCharacter rc : ranking) {
                sb.append(rc.getPosition())
                  .append("º ")
                  .append(rc.getName())
                  .append(" (")
                  .append(rc.getTotalPower())
                  .append(")");
                if (rc.getPosition() < ranking.size()) {
                    sb.append(", ");
                }
            }
            sb.append(".");
        }

        return sb.toString();
    }

    // POKEMON
    private List<Character> fetchPokemonCharacters(int limit, int offset) {
        try {
            String url = "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset;
            log.info("Fetching Pokemon from: {}", url);

            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode results = root.get("results");

            List<Character> characters = new ArrayList<>();
            if (results != null && results.isArray()) {
                for (JsonNode node : results) {
                    String name = node.get("name").asText();
                    String detailUrl = node.get("url").asText();

                    String detailResponse = restTemplate.getForObject(detailUrl, String.class);
                    JsonNode detail = objectMapper.readTree(detailResponse);

                    Character character = Character.builder()
                            .id(detail.get("id").asText())
                            .name(name)
                            .imageUrl(detail.get("sprites").get("front_default").asText())
                            .type(detail.get("types").get(0).get("type").get("name").asText())
                            .stats(new java.util.HashMap<>())
                            .build();

                    // Adiciona stats numéricos para comparação funcionar bem
                    JsonNode statsNode = detail.get("stats");
                    if (statsNode != null && statsNode.isArray()) {
                        for (JsonNode stat : statsNode) {
                            String statName = stat.get("stat").get("name").asText();
                            String statValue = stat.get("base_stat").asText();
                            character.getStats().put(statName, statValue);
                        }
                    }

                    characters.add(character);
                }
            }

            return characters;
        } catch (Exception e) {
            log.error("Error fetching Pokemon", e);
            return new ArrayList<>();
        }
    }

    // DIGIMON
    private List<Character> fetchDigimonCharacters(int limit, int offset) {
        try {
            String url = "https://digimon-api.vercel.app/api/digimon";
            log.info("Fetching Digimon from: {}", url);

            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);

            List<Character> characters = new ArrayList<>();
            if (root != null && root.isArray()) {
                int count = 0;
                for (int i = offset; i < root.size() && count < limit; i++, count++) {
                    JsonNode node = root.get(i);

                    Character character = Character.builder()
                            .id(String.valueOf(i))
                            .name(node.get("name").asText())
                            .imageUrl(node.get("img").asText())
                            .type(node.get("level").asText())
                            .stats(new java.util.HashMap<>())
                            .build();

                    characters.add(character);
                }
            }

            return characters;
        } catch (Exception e) {
            log.error("Error fetching Digimon", e);
            return new ArrayList<>();
        }
    }

    // DRAGON BALL
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

    // NARUTO
    private List<Character> fetchNarutoCharacters(int limit, int offset) {
        try {
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

    // DEMON SLAYER
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

    // JIKAN API (Universal)
    private List<Character> fetchJikanCharacters(Universe universe, int limit, int offset) {
        try {
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

    // Rate limit helper
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