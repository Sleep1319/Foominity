package com.example.foominity.service.quiz;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class SpotifyUserService {
    @Qualifier("spotifyWebClient")
    private final WebClient spotifyWebClient;

    public JsonNode fetchMe(String accessToken) {
        return spotifyWebClient.get()
                .uri("/v1/me")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block(java.time.Duration.ofSeconds(7));
    }
}
