package com.example.foominity.controller.member;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.image.ImageFile;
import com.example.foominity.domain.member.Member;
import com.example.foominity.dto.member.MemberRequest;
import com.example.foominity.dto.member.NicknameChangeRequest;
import com.example.foominity.dto.member.UserInfoResponse;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.service.image.ImageService;
import com.example.foominity.service.member.MemberService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class MemberController {

    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;
    private final ImageService imageService;
    private final MemberService memberService;

    // 유저 정보 불러오기
    @GetMapping("/user")
    public ResponseEntity<UserInfoResponse> getUserInfo(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveTokenFromCookie(request);

        if (token == null || !jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(401).build();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        return ResponseEntity.ok()
                .header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
                .header("Pragma", "no-cache")
                .header("Expires", "0")
                .body(new UserInfoResponse(member));
    }

    // 회원탈퇴
    @DeleteMapping("/delete-member")
    public ResponseEntity<Void> deleteMember(HttpServletRequest request, @RequestBody @Valid MemberRequest req) {
        memberService.deleteMember(request, req);
        return ResponseEntity.noContent().build(); // noContent = 상태 코드 204를 응답
        // 클라이언트에게 "요청은 성공했지만 응답 본문은 없음"을 의미하는 HTTP 204 응답을 보내기 위해
    }

    // 닉네임 변경
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/change-nickname")
    public ResponseEntity<Void> changeNickname(HttpServletRequest request,
            @RequestBody @Valid NicknameChangeRequest req) {
        memberService.changeNickname(request, req);
        return ResponseEntity.ok().build();
    }

    // 프로필 이미지
    @DeleteMapping("/member/profile-image")
    public ResponseEntity<?> deleteProfileImage(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveTokenFromCookie(request);

        if (token == null || !jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        // 기존에 등록된 이미지가 있는 경우
        ImageFile image = member.getProfileImage();
        if (image != null) {
            imageService.deleteImageFile(image); // 1. 실제 파일 삭제 + DB 레코드 삭제
            member.setProfileImage(null); // 2. member와의 연결도 제거
            memberRepository.save(member); // 3. member 업데이트
        }

        return ResponseEntity.ok(Map.of("message", "프로필 이미지 삭제 완료"));
    }
}
