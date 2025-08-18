package com.example.foominity.controller.quiz;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/quiz/auth")
public class QuizAuthController {

    private final OAuth2AuthorizedClientService authorizedClientService;
    private final ClientRegistrationRepository clientRegistrationRepository;

    @GetMapping("/token")
    public ResponseEntity<?> getPlaybackToken() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()
                || auth.getName() == null || "anonymousUser".equals(auth.getName())) {
            return needLogin();
        }

        // 세션에 이미 저장된 사용자-클라이언트 인가를 조회
        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient("spotify", auth.getName());

        if (client == null || client.getAccessToken() == null) {
            // 아직 스포티파이 인가를 받지 않은 상태
            return needLogin();
        }

        String accessToken = client.getAccessToken().getTokenValue();
        Instant expiresAt = client.getAccessToken().getExpiresAt(); // Instant

        // 프론트가 쓰기 쉽게 epoch millis도 같이 내려줌(선택)
        return ResponseEntity.ok(Map.of(
                "accessToken", accessToken,
                "expiresAtEpochMs", String.valueOf(expiresAt != null ? expiresAt.toEpochMilli() : 0L)));
    }

    private ResponseEntity<?> needLogin() {
        ClientRegistration reg = clientRegistrationRepository.findByRegistrationId("spotify");
        String loginUrl = "/oauth2/authorization/" + reg.getRegistrationId();
        return ResponseEntity.status(401).body(Map.of("loginUrl", loginUrl));
    }
}
