package com.multiverse.service;

import com.multiverse.dto.ComparisonResult;
import com.multiverse.model.Character;
import com.multiverse.model.Universe;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MultiverseService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Lista personagens de um universo
     */
    @Cacheable(value = "characters", key = "#universe + '-' + #limit")
    public List<Character> getCharacters(Universe universe, int limit) {
        try {
            if (universe == Universe.POKEMON) {
                return getPokemonCharacters(limit);
            } else if (universe == Universe.DIGIMON) {
                return getDigimonCharacters(limit);
            }
            return Collections.emptyList();
        } catch (Exception e) {
            log.error("Error fetching characters from {}", universe, e);
            return Collections.emptyList();
        }
    }

    /**
     * Busca personagem por nome
     */
    @Cacheable(value = "character", key = "#universe + '-' + #name")
    public Character getCharacterByName(Universe universe, String name) {
        try {
            if (universe == Universe.POKEMON) {
                return getPokemonByName(name.toLowerCase());
            } else if (universe == Universe.DIGIMON) {
                return getDigimonByName(name);
            }
            return null;
        } catch (Exception e) {
            log.error("Error fetching character {} from {}", name, universe, e);
            return null;
        }
    }

    /**
     * Compara dois personagens
     */
    public ComparisonResult compareCharacters(String universe1, String name1, String universe2, String name2) {
        Character char1 = getCharacterByName(Universe.valueOf(universe1.toUpperCase()), name1);
        Character char2 = getCharacterByName(Universe.valueOf(universe2.toUpperCase()), name2);

        if (char1 == null || char2 == null) {
            return null;
        }

        Map<String, ComparisonResult.StatComparison> statsDiff = new HashMap<>();
        int total1 = 0, total2 = 0;

        // Compara stats
        Set<String> allStats = new HashSet<>();
        if (char1.getStats() != null) allStats.addAll(char1.getStats().keySet());
        if (char2.getStats() != null) allStats.addAll(char2.getStats().keySet());

        for (String stat : allStats) {
            Integer val1 = char1.getStats() != null ? char1.getStats().getOrDefault(stat, 0) : 0;
            Integer val2 = char2.getStats() != null ? char2.getStats().getOrDefault(stat, 0) : 0;
            
            total1 += val1;
            total2 += val2;
            
            String advantage = val1 > val2 ? "character1" : (val2 > val1 ? "character2" : "tie");
            
            statsDiff.put(stat, ComparisonResult.StatComparison.builder()
                    .value1(val1)
                    .value2(val2)
                    .difference(Math.abs(val1 - val2))
                    .advantage(advantage)
                    .build());
        }

        String winner = total1 > total2 ? char1.getName() : char2.getName();
        String recommendation = total1 > total2 
                ? char1.getName() + " é mais forte no geral!"
                : char2.getName() + " leva vantagem!";

        return ComparisonResult.builder()
                .character1(char1)
                .character2(char2)
                .statsDifference(statsDiff)
                .winner(winner)
                .totalDifference(Math.abs(total1 - total2))
                .recommendation(recommendation)
                .build();
    }

    // === POKEMON API ===
    private List<Character> getPokemonCharacters(int limit) throws Exception {
        String url = "https://pokeapi.co/api/v2/pokemon?limit=" + limit;
        JsonNode response = objectMapper.readTree(restTemplate.getForObject(url, String.class));
        
        List<Character> characters = new ArrayList<>();
        for (JsonNode result : response.get("results")) {
            String name = result.get("name").asText();
            characters.add(getPokemonByName(name));
        }
        return characters;
    }

    private Character getPokemonByName(String name) throws Exception {
        String url = "https://pokeapi.co/api/v2/pokemon/" + name;
        JsonNode pokemon = objectMapper.readTree(restTemplate.getForObject(url, String.class));

        Map<String, Integer> stats = new HashMap<>();
        for (JsonNode stat : pokemon.get("stats")) {
            String statName = stat.get("stat").get("name").asText();
            int value = stat.get("base_stat").asInt();
            stats.put(statName, value);
        }

        List<String> types = new ArrayList<>();
        for (JsonNode type : pokemon.get("types")) {
            types.add(type.get("type").get("name").asText());
        }

        List<String> abilities = new ArrayList<>();
        for (JsonNode ability : pokemon.get("abilities")) {
            abilities.add(ability.get("ability").get("name").asText());
        }

        return Character.builder()
                .id(String.valueOf(pokemon.get("id").asInt()))
                .name(pokemon.get("name").asText())
                .universe(Universe.POKEMON)
                .types(types)
                .stats(stats)
                .abilities(abilities)
                .imageUrl(pokemon.get("sprites").get("front_default").asText())
                .height(pokemon.get("height").asInt())
                .weight(pokemon.get("weight").asInt())
                .build();
    }

    // === DIGIMON API ===
    private List<Character> getDigimonCharacters(int limit) throws Exception {
        String url = "https://digimon-api.vercel.app/api/digimon";
        JsonNode response = objectMapper.readTree(restTemplate.getForObject(url, String.class));
        
        List<Character> characters = new ArrayList<>();
        int count = 0;
        for (JsonNode digi : response) {
            if (count++ >= limit) break;
            characters.add(parseDigimon(digi));
        }
        return characters;
    }

    private Character getDigimonByName(String name) throws Exception {
        String url = "https://digimon-api.vercel.app/api/digimon/name/" + name;
        JsonNode response = objectMapper.readTree(restTemplate.getForObject(url, String.class));
        
        if (response.isArray() && response.size() > 0) {
            return parseDigimon(response.get(0));
        }
        return null;
    }

    private Character parseDigimon(JsonNode digi) {
        // Digimon API não tem stats detalhados, vamos gerar valores baseados no level
        String level = digi.get("level").asText();
        Map<String, Integer> stats = generateDigimonStats(level);

        return Character.builder()
                .id(digi.get("name").asText())
                .name(digi.get("name").asText())
                .universe(Universe.DIGIMON)
                .types(List.of(level))
                .level(level)
                .stats(stats)
                .imageUrl(digi.get("img").asText())
                .build();
    }

    private Map<String, Integer> generateDigimonStats(String level) {
        Map<String, Integer> stats = new HashMap<>();
        int baseValue = switch (level.toLowerCase()) {
            case "rookie" -> 40;
            case "champion" -> 60;
            case "ultimate" -> 80;
            case "mega" -> 100;
            default -> 50;
        };
        
        stats.put("attack", baseValue + new Random().nextInt(20));
        stats.put("defense", baseValue + new Random().nextInt(20));
        stats.put("speed", baseValue + new Random().nextInt(20));
        
        return stats;
    }
}
