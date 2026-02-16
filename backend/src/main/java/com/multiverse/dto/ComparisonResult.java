package com.multiverse.dto;

import com.multiverse.model.Character;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO para comparação entre dois personagens
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComparisonResult {
    
    private Character character1;
    private Character character2;
    
    // Diferenças de stats
    private Map<String, StatComparison> statsDifference;
    
    // Análise
    private String winner; // Baseado na soma total de stats
    private Integer totalDifference;
    private String recommendation;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatComparison {
        private Integer value1;
        private Integer value2;
        private Integer difference;
        private String advantage; // "character1", "character2", or "tie"
    }
}
