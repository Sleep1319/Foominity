package com.example.foominity.config.jwt;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.net.URI;
import java.util.Arrays;
import java.util.Map;

@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtHandshakeInterceptor(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
        URI uri = request.getURI();
        String query = uri.getQuery();

        if (query == null || !query.contains("token=")) {
            return false;
        }

        String token = Arrays.stream(query.split("&"))
                .filter(param -> param.startsWith("token="))
                .findFirst()
                .map(param -> param.substring("token=".length()))
                .orElse(null);

        if (token == null || !jwtTokenProvider.validateToken(token)) {
            return false;
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        String nickname = jwtTokenProvider.getClaims(token).get("nickname", String.class);

        // WebSocket 세션 속성에 사용자 정보 저장
        attributes.put("memberId", memberId);
        attributes.put("nickname", nickname);

        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, @Nullable Exception ex) {
        System.out.println("🔗 WebSocket 연결 완료!");
    }
}
