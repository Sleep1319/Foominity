package com.example.foominity.controller.quiz;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.web.bind.annotation.*;

import com.example.foominity.dto.quiz.PlaybackTokenResponse;
import com.example.foominity.dto.quiz.SpotifyMeResponse;
import com.example.foominity.service.quiz.SpotifyUserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/spotify")
public class SpotifyPlaybackController {

        private final SpotifyUserService spotifyUserService;

        @GetMapping("/login-url")
        public ResponseEntity<?> loginUrl() {
                return ResponseEntity.ok().body("/oauth2/authorization/spotify");
        }

        @GetMapping("/token")
        public ResponseEntity<?> playbackToken(
                        @RegisteredOAuth2AuthorizedClient("spotify") OAuth2AuthorizedClient client) {

                if (client == null || client.getAccessToken() == null) {
                        return ResponseEntity.status(401).body(
                                        java.util.Map.of(
                                                        "error", "unauthenticated",
                                                        "loginUrl", "/oauth2/authorization/spotify"));
                }

                var at = client.getAccessToken();
                java.time.Instant expiresAt = (at.getExpiresAt() != null) ? at.getExpiresAt()
                                : java.time.Instant.now().plusSeconds(300);

                return ResponseEntity.ok().body(
                                new com.example.foominity.dto.quiz.PlaybackTokenResponse(
                                                at.getTokenValue(),
                                                expiresAt,
                                                at.getScopes()));
        }

        @GetMapping("/me")
        public ResponseEntity<?> me(
                        @RegisteredOAuth2AuthorizedClient("spotify") OAuth2AuthorizedClient client) {

                if (client == null || client.getAccessToken() == null) {
                        return ResponseEntity.status(401).body(
                                        java.util.Map.of(
                                                        "error", "unauthenticated",
                                                        "loginUrl", "/oauth2/authorization/spotify"));
                }

                var me = spotifyUserService.fetchMe(client.getAccessToken().getTokenValue());
                return ResponseEntity.ok().body(me);
        }

}