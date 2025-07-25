package com.example.foominity.controller.member;

import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.image.ImageFile;
import com.example.foominity.domain.member.Member;
import com.example.foominity.dto.member.MemberRequest;
import com.example.foominity.dto.member.MemberReviewResponse;
import com.example.foominity.dto.member.NicknameChangeRequest;
import com.example.foominity.dto.member.OtherUserProfileResponse;
import com.example.foominity.dto.member.PasswordChangeRequest;
import com.example.foominity.dto.member.ProfileImageResponse;
import com.example.foominity.dto.member.UserInfoResponse;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.service.board.ReviewService;
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
    private final ReviewService reviewService;
    private final PasswordEncoder passwordEncoder;

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

    // 프로필 이미지 등록/수정
    @Transactional
    @PostMapping("/member/profile-image")
    public ResponseEntity<ProfileImageResponse> updateProfileImage(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) {

        // 토큰 검증 (삭제 메서드와 동일하게)
        String token = jwtTokenProvider.resolveTokenFromCookie(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(401).build();
        }

        // 멤버 조회
        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId)
                .orElseThrow(NotFoundMemberException::new);

        // 기존 이미지 삭제
        if (member.getProfileImage() != null) {
            imageService.deleteImageFile(member.getProfileImage());
        }

        // 새 이미지 저장 + 연결
        ImageFile newImage = imageService.imageUpload(file);
        member.setProfileImage(newImage);
        memberRepository.save(member);

        String imageUrl = "/uploads/" +
                Paths.get(newImage.getSavePath()).getFileName().toString();

        // DTO에 imageUrl만 채워서 반환
        return ResponseEntity.ok(new ProfileImageResponse(imageUrl));
    }

    // 프로필 이미지 삭제
    @DeleteMapping("/member/profile-image")
    public ResponseEntity<Void> deleteProfileImage(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveTokenFromCookie(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(401).build();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId)
                .orElseThrow(NotFoundMemberException::new);

        ImageFile image = member.getProfileImage();
        if (image != null) {
            imageService.deleteImageFile(image);
            member.setProfileImage(null);
            memberRepository.save(member);
        }

        // 본문 없이 204만 반환
        return ResponseEntity.noContent().build();
    }

    // 평가에 참여한 앨범들 불러오기
    @GetMapping("/me/participated-albums")
    public ResponseEntity<List<MemberReviewResponse>> getMyParticipatedReviews(
            HttpServletRequest req) {
        String token = jwtTokenProvider.resolveTokenFromCookie(req);
        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        List<MemberReviewResponse> list = reviewService.getParticipatedReviews(memberId);
        return ResponseEntity.ok(list);
    }

    // 좋아요 누른 앨범들 불러오기
    @GetMapping("/me/liked-albums")
    public ResponseEntity<List<MemberReviewResponse>> getMyLikedReviews(HttpServletRequest req) {
        String token = jwtTokenProvider.resolveTokenFromCookie(req);
        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        List<MemberReviewResponse> list = reviewService.getLikedReviews(memberId);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/check-password")
    public ResponseEntity<?> checkPassword(
            HttpServletRequest request,
            @RequestBody Map<String, String> body) {
        String currentPassword = body.get("currentPassword");

        // JWT 토큰에서 사용자 추출 (이미 구현된 코드 참고)
        String token = jwtTokenProvider.resolveTokenFromCookie(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(401).build();
        }
        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        // 비밀번호 비교
        if (!passwordEncoder.matches(currentPassword, member.getPassword())) {
            return ResponseEntity.status(400).body(Map.of("message", "비밀번호가 일치하지 않습니다."));
        }

        // 성공
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            HttpServletRequest request,
            @RequestBody PasswordChangeRequest req) {
        String token = jwtTokenProvider.resolveTokenFromCookie(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(401).build();
        }
        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 현재 비밀번호 검증
        if (!passwordEncoder.matches(req.getCurrentPassword(), member.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "현재 비밀번호가 틀렸습니다."));
        }
        // 새 비밀번호가 기존 비번과 같은지 체크
        if (passwordEncoder.matches(req.getNewPassword(), member.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "기존 비밀번호와 동일한 비밀번호는 사용할 수 없습니다."));
        }
        // 새 비번 저장
        member.setPassword(passwordEncoder.encode(req.getNewPassword()));
        memberRepository.save(member);
        return ResponseEntity.ok(Map.of("message", "비밀번호가 성공적으로 변경되었습니다."));
    }

    @GetMapping("/users/{id}/profile")
    public ResponseEntity<OtherUserProfileResponse> getOtherUserProfile(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.getOtherUserProfile(id));
    }

}
