package com.example.foominity.config;

import com.example.foominity.config.jwt.*;
import com.example.foominity.config.social.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

// ✅ 추가된 import
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtTokenProvider jwtTokenProvider;
        private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
        private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
        private final CustomOAuth2SuccessHandler customOAuth2SuccessHandler;
        private final CustomOAuth2UserService customOAuth2UserService;

        /** 1) apple-feed 전용: JWT/인증 전혀 적용 안 함 */
        @Bean
        @Order(1)
        public SecurityFilterChain appleFeedChain(HttpSecurity http) throws Exception {
                http
                                .securityMatcher("/apple-feed/**")
                                .csrf(AbstractHttpConfigurer::disable)
                                .cors(c -> c.configurationSource(corsConfigurationSource()))
                                .authorizeHttpRequests(a -> a.anyRequest().permitAll());
                // 👉 JWT 필터 추가하지 않음
                return http.build();
        }

        /** 2) 일반 앱 체인: 기존 정책 유지 (필요에 맞게 수정) */
        @Bean
        @Order(2)
        public SecurityFilterChain appChain(HttpSecurity http) throws Exception {
                http
                                .csrf(AbstractHttpConfigurer::disable)
                                .cors(c -> c.configurationSource(corsConfigurationSource()))
                                .authorizeHttpRequests(auth -> auth
                                                // 공개 경로들 추가
                                                .requestMatchers(
                                                                "/auth/**", "/oauth2/**", "/login/**",
                                                                "/ws/**", "/public/**", "/images/**", "/favicon.ico")
                                                .permitAll()
                                                .anyRequest().permitAll() // ← 지금은 임시로 모두 허용 중이면 유지
                                // .anyRequest().authenticated() // 배포에서 잠글 거면 이렇게
                                )
                                .exceptionHandling(ex -> ex
                                                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                                                .accessDeniedHandler(jwtAccessDeniedHandler))
                                .oauth2Login(oauth -> oauth
                                                .userInfoEndpoint(info -> info.userService(customOAuth2UserService))
                                                .successHandler(customOAuth2SuccessHandler));

                // JWT 필터는 이 체인에서만 작동
                http.addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        /** CORS: dev/배포 모두 허용할 도메인 등록 */
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration conf = new CorsConfiguration();
                conf.setAllowCredentials(true);
                conf.setAllowedOriginPatterns(List.of(
                                "http://localhost:5173",
                                "http://localhost:8084", // 필요시
                                "https://your-prod-domain.com" // 배포 도메인
                ));
                conf.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                conf.setAllowedHeaders(List.of("*"));
                conf.setExposedHeaders(List.of("Authorization"));

                UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
                src.registerCorsConfiguration("/**", conf);
                return src;
        }

        // ✅ 추가: PasswordEncoder 빈
        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder(); // 기본 strength=10
        }
}

// package com.example.foominity.config;

// import com.example.foominity.config.jwt.JwtAccessDeniedHandler;
// import com.example.foominity.config.jwt.JwtAuthenticationEntryPoint;
// import com.example.foominity.config.jwt.JwtAuthenticationFilter;
// import com.example.foominity.config.jwt.JwtTokenProvider;
// import com.example.foominity.config.social.CustomOAuth2SuccessHandler;
// import com.example.foominity.config.social.CustomOAuth2UserService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import
// org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
// import
// org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import
// org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import
// org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// @Configuration
// @EnableMethodSecurity
// @RequiredArgsConstructor
// public class SecurityConfig {
// private final JwtTokenProvider jwtTokenProvider;
// private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
// private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
// private final CustomOAuth2SuccessHandler customOAuth2SuccessHandler;
// private final CustomOAuth2UserService customOAuth2UserService;

// @Bean
// public SecurityFilterChain securityFilterChain(HttpSecurity http) throws
// Exception {
// http
// .csrf(AbstractHttpConfigurer::disable) //csrf해제
// .cors(cors -> cors.configurationSource(corsConfigurationSource()))
// .authorizeHttpRequests(auth -> auth
// .anyRequest().permitAll()// 임시 전부 해제
// )
// .exceptionHandling(ex -> ex
// .authenticationEntryPoint(jwtAuthenticationEntryPoint)
// .accessDeniedHandler(jwtAccessDeniedHandler)
// )
// .oauth2Login(oauth -> oauth
// .userInfoEndpoint(userInfo -> userInfo
// .userService(customOAuth2UserService)
// )
// .successHandler(customOAuth2SuccessHandler)
// )
// .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
// UsernamePasswordAuthenticationFilter.class);

// return http.build();
// }

// @Bean
// public CorsConfigurationSource corsConfigurationSource() {
// CorsConfiguration configuration = new CorsConfiguration();
// configuration.addAllowedOrigin("http://localhost:5173");
// configuration.addAllowedMethod("*");
// configuration.addAllowedHeader("*");
// configuration.setAllowCredentials(true);

// UrlBasedCorsConfigurationSource source = new
// UrlBasedCorsConfigurationSource();
// source.registerCorsConfiguration("/**", configuration);
// return source;
// }

// @Bean public PasswordEncoder passwordEncoder() {
// return new BCryptPasswordEncoder();
// }
// }
