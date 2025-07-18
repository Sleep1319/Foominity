package com.example.foominity.controller.sign;

import java.util.Collections;
import java.util.Map;

import com.example.foominity.dto.sign.SocialSignUpRequest;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.member.Member;
import com.example.foominity.dto.sign.PasswordResetRequest;
import com.example.foominity.dto.sign.SignInRequest;
import com.example.foominity.dto.sign.SignInResponse;
import com.example.foominity.dto.sign.SignUpRequest;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.service.sign.SignService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class SignController {

    private final SignService signService;
    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    // 회원가입
    @PostMapping("/sign-up")
    public ResponseEntity<String> signUp(@Valid @RequestBody SignUpRequest req) {
        // ResponseEntity = java 클래스, 객체로 사용하는 것이고 일반 String return보다 다양한 기능 있음
        signService.signUp(req);
        return ResponseEntity.ok().build();
    }

    // 이메일 중복 확인
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam(required = false) String email) {
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "이메일이 유효하지 않습니다."));
        }
        boolean exists = memberRepository.existsByEmail(email);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    // 닉네임 중복 확인
    @GetMapping("/check-nickname")
    public ResponseEntity<Map<String, Boolean>> checkNickname(@RequestParam String nickname) {
        boolean exists = signService.existsNickname(nickname);
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }

    // 로그인
    @PostMapping("/sign-in")
    public ResponseEntity<SignInResponse> signIn(@Valid @RequestBody SignInRequest req, HttpServletResponse response) {
        SignInResponse res = signService.signIn(req);
        ResponseCookie cookie = jwtTokenProvider.createHttpOnlyCookie(res.getAccessToken());
        // HttpOnly 옵션 있는 쿠키 생성 (HttpOnly = js에서 쿠키에 접근하지 못하도록(보안))
        response.addHeader("Set-Cookie", cookie.toString());
        // 위에서 만든 쿠키 응답의 헤더로 추가해서 클라이언트쪽에 쿠키 저장시킴
        return ResponseEntity.ok().body(res);
        // body에 res 넣어서 보냄
    }

    // 소셜 가입
    @PostMapping("/social-sign-up")
    public ResponseEntity<?> socialSignUp(@RequestBody SocialSignUpRequest req) {
        signService.socialSignUp(req);
        return ResponseEntity.ok().build();
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        // 만료된 토큰으로 덮어쓰기 → 쿠키 삭제처럼 동작
        ResponseCookie expiredCookie = jwtTokenProvider.deleteCookie();
        response.addHeader("Set-Cookie", expiredCookie.toString());
        // Set-Cookie : 서버가 클라이언트한테 쿠키를 저장하도록 지시함
        // Set-Cookie로 우리가 지정한 만료된 쿠키인 expiredCookie를 지정해서 로그아웃 되게 하는 방식
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest request) {
        try {
            signService.resetPassword(request.getEmail(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "비밀번호가 성공적으로 변경되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}