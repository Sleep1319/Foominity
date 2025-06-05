package com.example.reactbootserver.controller;

import com.example.reactbootserver.config.jwt.JwtTokenProvider;
import com.example.reactbootserver.dto.sign.*;
import com.example.reactbootserver.service.SignService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
public class SignController {

    private final SignService signService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/api/sign-up")
    public ResponseEntity<String> signUp(@Valid @RequestBody SignUpRequest req) {
        signService.signUp(req);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/check-nickname")
    public ResponseEntity<Boolean> checkNickname(@RequestParam String nickname) {
        boolean exists = signService.existsNickname(nickname);
        return ResponseEntity.ok(exists);
    }

    @PostMapping("/api/sign-in")
    public ResponseEntity<SignInResponse> signIn(@Valid @RequestBody SignInRequest req, HttpServletResponse response) {
        SignInResponse res = signService.signIn(req);
        ResponseCookie cookie = jwtTokenProvider.createHttpOnlyCookie(res.getAccessToken());
        // 쿠키 응답에 추가
        response.addHeader("Set-Cookie", cookie.toString());
        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/api/user")
    public ResponseEntity<UserInfoResponse> getUserInfo(HttpServletRequest request) {
        String token = null;
        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                if (cookie.getName().equals("token")) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token == null || !jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(401).build(); // 인증 실패
        }

        UserInfoResponse userInfo = jwtTokenProvider.getUserInfoFromToken(token);
        return ResponseEntity.ok(userInfo);
    }

    //로그아웃
    @PostMapping("/api/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        // 만료된 토큰으로 덮어쓰기 → 쿠키 삭제처럼 동작
        ResponseCookie expiredCookie = jwtTokenProvider.deleteCookie();
        response.addHeader("Set-Cookie", expiredCookie.toString());

        return ResponseEntity.ok().build();
    }
}
