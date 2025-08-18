package com.example.foominity.config.quiz;

import org.springframework.boot.context.properties.ConfigurationProperties;

// application.yml 의 `spotify.*` 바인딩
@ConfigurationProperties(prefix = "spotify")
public record SpotifyProperties(
        String clientId,
        String clientSecret,
        String apiBaseUrl,
        String authUrl,
        String market) {
}