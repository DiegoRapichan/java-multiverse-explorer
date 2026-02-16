package com.multiverse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

/**
 * Multiverse Data Explorer - Spring Boot Application
 * 
 * Plataforma unificada para explorar dados de múltiplos universos:
 * - Pokémon (PokeAPI)
 * - Digimon (Digimon API)
 * - E muito mais!
 * 
 * Features:
 * - Integração com APIs públicas
 * - Cache inteligente para performance
 * - Comparação de personagens
 * - Filtros avançados
 * - Rankings e estatísticas
 * 
 * @author Diego Rapichan
 * @version 1.0.0
 */
@SpringBootApplication
@EnableCaching
public class MultiverseExplorerApplication {

    public static void main(String[] args) {
        SpringApplication.run(MultiverseExplorerApplication.class, args);
    }
}
