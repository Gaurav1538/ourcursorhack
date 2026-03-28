package com.RiskAnalyse.project.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        Server prodServer = new Server();
        prodServer.setUrl("https://ourcursorhack-production.up.railway.app");
        prodServer.setDescription("Production Server");

        return new OpenAPI()
                .servers(List.of(prodServer)) // ✅ IMPORTANT
                .info(new Info()
                        .title("Guardian Safety API")
                        .version("1.0")
                        .description("AI-powered safety intelligence backend"));
    }
}