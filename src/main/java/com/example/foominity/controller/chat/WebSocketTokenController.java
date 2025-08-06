package com.example.foominity.controller.chat;

import com.example.foominity.config.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class WebSocketTokenController {

    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/api/ws-token")
    public ResponseEntity<Map<String, String>> getWebSocketToken(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveTokenFromCookie(request);

        if (token == null || !jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(401).build();
        }
        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        String nickname = jwtTokenProvider.getClaims(token).get("nickname", String.class);
        String wsToken = jwtTokenProvider.createSocketToken(memberId, nickname);

        Map<String, String> response = new HashMap<>();
        response.put("token", wsToken);
        return ResponseEntity.ok(response);
    }
}
