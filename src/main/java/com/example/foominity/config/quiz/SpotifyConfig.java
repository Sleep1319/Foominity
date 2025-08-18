package com.example.foominity.config.quiz;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@EnableConfigurationProperties(SpotifyProperties.class)
public class SpotifyConfig {

    @Bean("spotifyWebClient")
    public WebClient spotifyWebClient() {
        return WebClient.builder()
                .baseUrl("https://api.spotify.com")
                .build();
    }

    @Bean("spotifyAuthWebClient")
    public WebClient spotifyAuthWebClient() {
        return WebClient.builder()
                .baseUrl("https://accounts.spotify.com")
                .build();
    }
}
