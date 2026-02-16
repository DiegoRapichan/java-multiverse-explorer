package com.multiverse.controller;

import com.multiverse.dto.ComparisonResult;
import com.multiverse.model.Character;
import com.multiverse.model.Universe;
import com.multiverse.service.MultiverseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/multiverse")
@RequiredArgsConstructor
@Tag(name = "Multiverse Explorer", description = "Explore dados de múltiplos universos")
public class MultiverseController {

    private final MultiverseService multiverseService;

    // === ADICIONE ESTE MÉTODO ===
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
    // === FIM DO MÉTODO NOVO ===

    @GetMapping("/universes")
    @Operation(summary = "Listar universos disponíveis", description = "Retorna todos os universos que podem ser explorados")
    public ResponseEntity<List<UniverseInfo>> getUniverses() {
        List<UniverseInfo> universes = Arrays.stream(Universe.values())
                .map(u -> new UniverseInfo(u.name(), u.getDisplayName(), u.getApiBaseUrl()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(universes);
    }


    @GetMapping("/{universe}/characters")
    @Operation(summary = "Listar personagens", description = "Retorna personagens de um universo específico")
    public ResponseEntity<List<Character>> getCharacters(
            @Parameter(description = "Universo (POKEMON, DIGIMON)", required = true)
            @PathVariable String universe,
            
            @Parameter(description = "Limite de resultados", example = "20")
            @RequestParam(defaultValue = "20") int limit
    ) {
        try {
            Universe uni = Universe.valueOf(universe.toUpperCase());
            List<Character> characters = multiverseService.getCharacters(uni, limit);
            return ResponseEntity.ok(characters);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{universe}/characters/{name}")
    @Operation(summary = "Buscar personagem por nome", description = "Retorna detalhes de um personagem específico")
    public ResponseEntity<Character> getCharacter(
            @Parameter(description = "Universo", required = true)
            @PathVariable String universe,
            
            @Parameter(description = "Nome do personagem", required = true)
            @PathVariable String name
    ) {
        try {
            Universe uni = Universe.valueOf(universe.toUpperCase());
            Character character = multiverseService.getCharacterByName(uni, name);
            
            if (character == null) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(character);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/compare")
    @Operation(summary = "Comparar personagens", description = "Compara stats de dois personagens (mesmo universo ou universos diferentes)")
    public ResponseEntity<ComparisonResult> compareCharacters(
            @Parameter(description = "Universo do personagem 1", required = true)
            @RequestParam String universe1,
            
            @Parameter(description = "Nome do personagem 1", required = true)
            @RequestParam String name1,
            
            @Parameter(description = "Universo do personagem 2", required = true)
            @RequestParam String universe2,
            
            @Parameter(description = "Nome do personagem 2", required = true)
            @RequestParam String name2
    ) {
        ComparisonResult result = multiverseService.compareCharacters(universe1, name1, universe2, name2);
        
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Verifica se a API está funcionando")
    public ResponseEntity<HealthResponse> healthCheck() {
        return ResponseEntity.ok(new HealthResponse(
                "Multiverse Data Explorer API is running",
                "1.0.0",
                Arrays.stream(Universe.values()).map(Universe::getDisplayName).collect(Collectors.toList())
        ));
    }

    // DTOs internos
    public record UniverseInfo(String id, String name, String apiUrl) {}
    public record HealthResponse(String status, String version, List<String> availableUniverses) {}
}
