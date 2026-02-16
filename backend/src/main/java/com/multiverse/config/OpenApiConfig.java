package com.multiverse.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Multiverse Data Explorer API")
                        .version("1.0.0")
                        .description("API unificada para explorar dados de múltiplos universos (Pokémon, Digimon e mais)")
                        .contact(new Contact()
                                .name("Diego Rapichan")
                                .email("direrapichan@gmail.com")
                                .url("https://github.com/DiegoRapichan"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }
}
