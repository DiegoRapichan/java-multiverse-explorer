package com.multiverse.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Resultado da comparação entre múltiplos personagens (2-8)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComparisonResult {
    
    /**
     * Personagem vencedor (maior poder total)
     */
    private Character winner;
    
    /**
     * Análise textual da comparação
     */
    private String analysis;
    
    /**
     * Ranking de todos os personagens (do mais forte ao mais fraco)
     */
    private List<RankedCharacter> ranking;
    
    /**
     * Classe interna para personagem com ranking
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RankedCharacter {
        private String id;
        private String name;
        private String imageUrl;
        private String type;
        private int totalPower;
        private int position; // 1º, 2º, 3º, etc
    }
}
