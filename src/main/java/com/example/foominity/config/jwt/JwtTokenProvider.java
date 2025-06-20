package com.example.foominity.config.jwt;

import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.member.Role;
import com.example.foominity.dto.member.UserInfoResponse;
import com.example.foominity.exception.NotFoundRoleIdException;
<<<<<<< HEAD
// import com.example.foominity.repository.member.MemberRoleRepository;
=======
>>>>>>> 9d1ac4bc96d2eb214d0eba49d90f401340a1de47
import com.example.foominity.repository.member.RoleRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.access-token-validity}")
    private long accessTokenValidity;

    @Value("${jwt.refresh-token-validity}")
    private long refreshTokenValidity;

    private SecretKey key;

    @PostConstruct
    public void initialize() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    // Assess토큰 생성
    public String createAccessToken(Long memberId, String email, String username, String nickname, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + accessTokenValidity);

        return Jwts.builder()
                .claims()
                .subject(String.valueOf(memberId))// 이메일로 변경시 커스텀 유저 핸들러 필요
                .add("id", memberId)
                .add("email", email)
                .add("username", username)
                .add("nickname", nickname)
                .add("role", role)
                .and()
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    // 리프레쉬 토큰 생성
    public String createRefreshToken(Long memberId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + refreshTokenValidity);

        return Jwts.builder()
                .subject(String.valueOf(memberId))
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Long getUserIdFromToken(String token) {
        return getClaims(token).get("id", Long.class);
    }

    public String getRole(String token) {
        return (String) getClaims(token).get("role");
    }

    public boolean validateToken(@Nullable String token) {
        try {
            if (token == null || token.trim().isEmpty()) {
                return false;
            }

            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public ResponseCookie createHttpOnlyCookie(String token) {
        return ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(false) // 배포 시 true + https
                .path("/")
                .maxAge(60 * 30) // 30분
                .sameSite("Strict")
                .build();
    }

    public ResponseCookie deleteCookie() {
        return ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(false) // 배포 시 true + https
                .path("/")
                .maxAge(0) // 즉시 만료
                .sameSite("Strict")
                .build();
    }

    public UserInfoResponse getUserInfoFromToken(String token) {
        Claims claims = getClaims(token);

        Long id = claims.get("id", Long.class);
        String email = claims.getSubject();
        String username = claims.get("username", String.class);
        String nickname = claims.get("nickname", String.class);
        String role = claims.get("role", String.class);

        return new UserInfoResponse(id, email, username, nickname, role);
    }

    // 인증용

    public String resolveTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null)
            return null;

        for (Cookie cookie : request.getCookies()) {
            if ("token".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

}
