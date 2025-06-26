package com.example.foominity.config.social;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.member.Member;
import com.example.foominity.repository.sign.SignRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final SignRepository signRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        //로그인 시도/ 회원가입 시도 구분
        String mode = request.getParameter("mode");

        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauthUser = oauthToken.getPrincipal();

        String socialType  = oauthToken.getAuthorizedClientRegistrationId(); // 예: "google"
        String providerId = oauthUser.getName(); // 구글/고유 ID

        String email = null;
        String name = null;

        if ("kakao".equals(socialType)) {
            Map<String, Object> kakaoAccount = oauthUser.getAttribute("kakao_account");
            if (kakaoAccount != null) {
                email = (String) kakaoAccount.get("email");
                Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
                if (profile != null) {
                    name = (String) profile.get("nickname");
                }
            }
        } else {
            email = oauthUser.getAttribute("email");
            name = oauthUser.getAttribute("name");
        }

        // 회원 존재 여부 확인
        Optional<Member> existing = signRepository.findWithRoleByEmail(email);

        if (existing.isPresent()) {
            Member member = existing.get();

            if (member.getSocialType() == null) {
                // 일반 회원이 같은 이메일로 이미 존재하는 경우 → 로그인 차단
                response.sendRedirect("http://localhost:5173/sign-in?reason=email-already-registered");
                return;
            }

            if (!member.getSocialType().equals(socialType)) {
                // 다른 소셜 로그인으로 가입된 경우
                response.sendRedirect("http://localhost:5173/sign-in?reason=provider-mismatch");
                return;
            }

            // 같은 소셜 로그인 사용자 → 로그인 처리
            String accessToken = jwtTokenProvider.createAccessToken(
                    member.getId(),
                    member.getEmail(),
                    member.getUserName(),
                    member.getNickname(),
                    member.getRole().getName()
            );

            ResponseCookie cookie = jwtTokenProvider.createHttpOnlyCookie(accessToken);
            response.addHeader("Set-Cookie", cookie.toString());

            response.sendRedirect("http://localhost:5173/");
        } else {
            // 소셜 신규 가입 → 닉네임 입력 페이지로 이동
            String encodedEmail = URLEncoder.encode(email, StandardCharsets.UTF_8);
            String encodedName = URLEncoder.encode(name, StandardCharsets.UTF_8);
            String encodedSocialType = URLEncoder.encode(socialType, StandardCharsets.UTF_8);
            String encodedProviderId = URLEncoder.encode(providerId, StandardCharsets.UTF_8);

            String message = "signup".equals(mode) ? "new-user" : "not-registered";//모드 구분후 메시지 변경

            response.sendRedirect("http://localhost:5173/social-sign-up?email=" + encodedEmail
                    + "&name=" + encodedName
                    + "&socialType=" + encodedSocialType
                    + "&providerId=" + encodedProviderId
                    + "&reason=" + message);
        }
    }
}
