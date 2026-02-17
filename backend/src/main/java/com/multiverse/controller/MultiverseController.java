package com.multiverse.controller;

import com.multiverse.model.Character;
import com.multiverse.model.ComparisonResult;
import com.multiverse.model.Universe;
import com.multiverse.service.MultiverseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/multiverse")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class MultiverseController {

    private final MultiverseService multiverseService;

    /**
     * GET /api/multiverse/{universe}/characters?limit=50&offset=0
     * Retorna lista de personagens com paginação (SCROLL INFINITO)
     */
    @GetMapping("/{universe}/characters")
    public ResponseEntity<List<Character>> getCharacters(
            @PathVariable Universe universe,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(defaultValue = "0") int offset  // ← OFFSET PARA SCROLL INFINITO
    ) {
        List<Character> characters = multiverseService.getCharacters(universe, limit, offset);
        return ResponseEntity.ok(characters);
    }

    /**
     * GET /api/multiverse/{universe}/characters/{name}
     * Busca personagem específico por nome
     */
    @GetMapping("/{universe}/characters/{name}")
    public ResponseEntity<Character> getCharacterByName(
            @PathVariable Universe universe,
            @PathVariable String name
    ) {
        Character character = multiverseService.getCharacterByName(universe, name);
        return ResponseEntity.ok(character);
    }

    /**
     * POST /api/multiverse/compare
     * Compara múltiplos personagens (2-8)
     */
    @PostMapping("/compare")
    public ResponseEntity<ComparisonResult> compareCharacters(
            @RequestBody ComparisonRequest request
    ) {
        if (request.getCharacters() == null || request.getCharacters().size() < 2) {
            return ResponseEntity.badRequest().build();
        }
        
        if (request.getCharacters().size() > 8) {
            return ResponseEntity.badRequest().build();
        }

        ComparisonResult result = multiverseService.compareCharacters(request.getCharacters());
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/multiverse/universes
     * Lista todos os universos disponíveis
     */
    @GetMapping("/universes")
    public ResponseEntity<Universe[]> getUniverses() {
        return ResponseEntity.ok(Universe.values());
    }

    /**
     * GET /api/multiverse/health
     * Health check
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Multiverse Explorer API is running - 22 Universes Available!");
    }

    // DTO para request de comparação (até 8 personagens)
    public static class ComparisonRequest {
        private List<Character> characters;

        public List<Character> getCharacters() {
            return characters;
        }

        public void setCharacters(List<Character> characters) {
            this.characters = characters;
        }
    }
}
