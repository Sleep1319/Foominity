package com.example.foominity.config.socket;

import com.example.foominity.config.jwt.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor acc = StompHeaderAccessor.wrap(message);

        // CONNECT 시점에만 인증 처리
        if (StompCommand.CONNECT.equals(acc.getCommand())) {
            String auth = acc.getFirstNativeHeader("Authorization");
            if (auth == null || !auth.startsWith("Bearer ")) {
                throw new IllegalArgumentException("Missing Authorization header");
            }
            String wsToken = auth.substring("Bearer ".length()).trim();

            if (!jwtTokenProvider.validateSocketToken(wsToken)) {
                throw new IllegalArgumentException("Invalid WebSocket token");
            }

            // 토큰에서 정보 추출
            Long memberId = jwtTokenProvider.getUserIdFromToken(wsToken);
            String nickname = jwtTokenProvider.getNickname(wsToken);
            if (memberId == null) {
                throw new IllegalArgumentException("memberId not found in token");
            }

            // 세션 속성 → @Header("simpSessionAttributes")로 읽힘
            acc.getSessionAttributes().put("memberId", memberId);
            acc.getSessionAttributes().put("nickname", nickname);

            // ✅ 개인 큐(/user/queue/...) 라우팅용 Principal 설정
            acc.setUser(() -> String.valueOf(memberId));
        }

        return message;
    }
}
