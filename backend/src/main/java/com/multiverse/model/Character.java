package com.multiverse.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * Modelo unificado para personagens de todos os universos
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Character {
    
    private String id;
    private String name;
    private Universe universe;
    
    // Atributos
    private List<String> types;
    private String level;
    
    // Stats (formato unificado)
    private Map<String, Integer> stats;
    
    // Habilidades
    private List<String> abilities;
    
    // Imagens
    private String imageUrl;
    private String thumbnailUrl;
    
    // Evolução
    private List<String> evolutionChain;
    
    // Metadados
    private String description;
    private Integer height;
    private Integer weight;
}
