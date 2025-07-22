package com.example.foominity.controller.member;

import java.nio.file.Paths;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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

}
