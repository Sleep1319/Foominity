package com.example.foominity.config.socket;

import com.example.foominity.config.jwt.JwtHandshakeInterceptor;
import com.example.foominity.config.jwt.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtTokenProvider jwtTokenProvider;
    private final WebSocketAuthInterceptor webSocketAuthInterceptor;

    public WebSocketConfig(JwtTokenProvider jwtTokenProvider, WebSocketAuthInterceptor webSocketAuthInterceptor) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.webSocketAuthInterceptor = webSocketAuthInterceptor;
    }
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // 소켓 연결 주소
                .addInterceptors(jwtHandshakeInterceptor())
                .setAllowedOriginPatterns("*") // CORS 허용
                .withSockJS(); // SockJS fallback 사용
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue"); // 메시지 수신 경로 prefix
        config.setApplicationDestinationPrefixes("/app"); // 메시지 송신 경로 prefix
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(webSocketAuthInterceptor);
    }

    @Bean
    public JwtHandshakeInterceptor jwtHandshakeInterceptor() {
        return new JwtHandshakeInterceptor(jwtTokenProvider);
    }
}
