package com.multiverse.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Character {
    private String id;
    private String name;
    private String imageUrl;
    private String type;  // ← IMPORTANTE: Campo type
    private Map<String, String> stats;  // ← IMPORTANTE: String, não Integer
}
