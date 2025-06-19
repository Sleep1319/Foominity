package com.example.foominity.controller.sign;

import com.example.foominity.dto.member.UserInfoResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.dto.member.MemberRequest;
import com.example.foominity.dto.member.NicknameChangeRequest;
import com.example.foominity.dto.sign.SignInRequest;
import com.example.foominity.dto.sign.SignInResponse;
import com.example.foominity.dto.sign.SignUpRequest;
import com.example.foominity.service.sign.SignService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
// @RequestMapping("/api")
public class SignController {

    private final SignService signService;
    private final JwtTokenProvider jwtTokenProvider;

    // 회원가입
    @PostMapping("/api/sign-up")
    public ResponseEntity<String> signUp(@Valid @RequestBody SignUpRequest req) {
        // ResponseEntity = java 클래스, 객체로 사용하는 것이고 일반 String return보다 다양한 기능 있음
        signService.signUp(req);
        return ResponseEntity.ok().build();
    }

    // 회원탈퇴
    @DeleteMapping("/api/delete-member")
    public ResponseEntity<Void> deleteMember(HttpServletRequest request, @RequestBody @Valid MemberRequest req) {
        signService.deleteMember(request, req);
        return ResponseEntity.noContent().build(); // noContent = 상태 코드 204를 응답
        // 클라이언트에게 "요청은 성공했지만 응답 본문은 없음"을 의미하는 HTTP 204 응답을 보내기 위해
    }

    // 닉네임 변경
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/api/change-nickname")
    public ResponseEntity<Void> changeNickname(HttpServletRequest request,
            @RequestBody @Valid NicknameChangeRequest req) {
        signService.changeNickname(request, req);
        return ResponseEntity.ok().build();
    }

    // 닉네임 중복 체크
    @GetMapping("/api/check-nickname")
    public ResponseEntity<Boolean> checkNickname(@RequestParam String nickname) {
        boolean exists = signService.existsNickname(nickname);
        return ResponseEntity.ok(exists);
    }

    // 로그인
    @PostMapping("/api/sign-in")
    public ResponseEntity<SignInResponse> signIn(@Valid @RequestBody SignInRequest req, HttpServletResponse response) {
        SignInResponse res = signService.signIn(req);
        ResponseCookie cookie = jwtTokenProvider.createHttpOnlyCookie(res.getAccessToken());
        // HttpOnly 옵션 있는 쿠키 생성 (HttpOnly = js에서 쿠키에 접근하지 못하도록(보안))
        response.addHeader("Set-Cookie", cookie.toString());
        // 위에서 만든 쿠키 응답의 헤더로 추가해서 클라이언트쪽에 쿠키 저장시킴
        return ResponseEntity.ok().body(res);
        // body에 res 넣어서 보냄
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

    // 로그아웃
    @PostMapping("/api/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        // 만료된 토큰으로 덮어쓰기 → 쿠키 삭제처럼 동작
        ResponseCookie expiredCookie = jwtTokenProvider.deleteCookie();
        response.addHeader("Set-Cookie", expiredCookie.toString());
        // Set-Cookie : 서버가 클라이언트한테 쿠키를 저장하도록 지시함
        // Set-Cookie로 우리가 지정한 만료된 쿠키인 expiredCookie를 지정해서 로그아웃 되게 하는 방식
        return ResponseEntity.ok().build();
    }

}