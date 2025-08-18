package com.example.foominity.service.quiz;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class SpotifyUserTokenService {

    private final OAuth2AuthorizedClientService authorizedClientService;

    public Map<String, String> issueAccessTokenForCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!(auth instanceof OAuth2AuthenticationToken oauth)) {
            throw new IllegalStateException("Spotify 로그인 필요");
        }

        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                oauth.getAuthorizedClientRegistrationId(), oauth.getName());

        if (client == null || client.getAccessToken() == null) {
            throw new IllegalStateException("Spotify 사용자 액세스 토큰이 없습니다. 다시 로그인 해주세요.");
        }

        return Map.of("access_token", client.getAccessToken().getTokenValue());
    }
}
