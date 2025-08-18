package com.example.foominity.service.quiz;

import com.example.foominity.config.quiz.SpotifyProperties;
import com.example.foominity.dto.quiz.SpotifyTokenResponse;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.time.Instant;

@Slf4j
@Service
public class SpotifyTokenService {

    private final WebClient spotifyAuthWebClient; // baseUrl 무관
    private final SpotifyProperties props;

    private volatile String accessToken;
    private volatile Instant expiresAt = Instant.EPOCH;

    public SpotifyTokenService(
            @Qualifier("spotifyAuthWebClient") WebClient spotifyAuthWebClient,
            SpotifyProperties props) {
        this.spotifyAuthWebClient = spotifyAuthWebClient;
        this.props = props;
    }

    public String getAccessToken() {
        if (accessToken == null || Instant.now().isAfter(expiresAt.minusSeconds(30))) {
            synchronized (this) {
                if (accessToken == null || Instant.now().isAfter(expiresAt.minusSeconds(30))) {
                    fetchAndCacheToken();
                }
            }
        }
        return accessToken;
    }

    private void fetchAndCacheToken() {
        try {
            SpotifyTokenResponse res = spotifyAuthWebClient
                    .post()
                    .uri("https://accounts.spotify.com/api/token")
                    .contentType(org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED)
                    .headers(h -> h.setBasicAuth(props.clientId(), props.clientSecret()))
                    .body(org.springframework.web.reactive.function.BodyInserters
                            .fromFormData("grant_type", "client_credentials"))
                    .retrieve()
                    .bodyToMono(SpotifyTokenResponse.class)
                    .block(Duration.ofSeconds(5));

            if (res == null || res.getAccessToken() == null) {
                throw new IllegalStateException("Spotify 토큰 응답이 비었습니다.");
            }

            this.accessToken = res.getAccessToken();
            long margin = Math.max(0, res.getExpiresIn() - 30);
            this.expiresAt = Instant.now().plusSeconds(margin);

            log.debug("Spotify access token 갱신 완료, 유효기간(초): {}", res.getExpiresIn());
        } catch (WebClientResponseException e) {
            log.error("Spotify 토큰 발급 실패: status={}, body={}", e.getRawStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Spotify 토큰 발급 실패", e);
        } catch (Exception e) {
            log.error("Spotify 토큰 발급 중 오류", e);
            throw new RuntimeException("Spotify 토큰 발급 중 오류", e);
        }
    }
}
