package com.example.foominity.controller.member;

import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
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
import org.springframework.web.server.ResponseStatusException;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.image.ImageFile;
import com.example.foominity.domain.member.Member;
import com.example.foominity.dto.member.GenreCountDto;
import com.example.foominity.dto.member.MemberRequest;
import com.example.foominity.dto.member.MemberReviewResponse;
import com.example.foominity.dto.member.NicknameChangeRequest;
import com.example.foominity.dto.member.OtherUserProfileResponse;
import com.example.foominity.dto.member.PasswordChangeRequest;
import com.example.foominity.dto.member.ProfileImageResponse;
import com.example.foominity.dto.member.UserInfoResponse;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.repository.member.ReviewLikeRepository;
import com.example.foominity.service.board.ReviewCommentService;
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
    private final ReviewCommentService reviewCommentService;

    // 멤버 아이디 추출 메서드
    private Member getAuthenticatedMember(HttpServletRequest req) {
        String token = jwtTokenProvider.resolveTokenFromCookie(req);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        return memberRepository.findById(memberId)
                .orElseThrow(NotFoundMemberException::new);
    }

    // --- 인증 필요 없는 공개 API ---
    // 특정 유저 정보 조회
    @GetMapping("/users/{id}/profile")
    public ResponseEntity<OtherUserProfileResponse> getOtherUserProfile(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.getOtherUserProfile(id));
    }

    // 특정 멤버의 좋아요 누른 앨범들 조회
    @GetMapping("/users/{id}/liked-albums")
    public ResponseEntity<List<MemberReviewResponse>> getLikedReviewsByMember(@PathVariable Long id) {
        List<MemberReviewResponse> liked = reviewService.getLikedReviews(id);
        return ResponseEntity.ok(liked);
    }
    // -----------------------------------

    // 유저 정보 불러오기
    @GetMapping("/user")
    public ResponseEntity<UserInfoResponse> getUserInfo(HttpServletRequest req) {
        Member member = getAuthenticatedMember(req);

        return ResponseEntity.ok()
                .header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
                .header("Pragma", "no-cache")
                .header("Expires", "0")
                .body(new UserInfoResponse(member));
    }

    // // 회원탈퇴
    // @DeleteMapping("/delete-member")
    // public ResponseEntity<Void> deleteMember(HttpServletRequest request,
    // @RequestBody @Valid MemberRequest req) {
    // memberService.deleteMember(request, req);
    // return ResponseEntity.noContent().build(); // noContent = 상태 코드 204를 응답
    // // 클라이언트에게 "요청은 성공했지만 응답 본문은 없음"을 의미하는 HTTP 204 응답을 보내기 위해
    // }
    // 회원탈퇴
    @DeleteMapping("/delete-member")
    public ResponseEntity<Void> deleteMember(
            HttpServletRequest req,
            @RequestBody @Valid MemberRequest dto) {

        Member member = getAuthenticatedMember(req);
        memberService.deleteMember(member.getId(), dto);
        return ResponseEntity.noContent().build();
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
            HttpServletRequest req) {

        Member member = getAuthenticatedMember(req);

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
    public ResponseEntity<Void> deleteProfileImage(HttpServletRequest req) {
        Member member = getAuthenticatedMember(req);

        ImageFile image = member.getProfileImage();
        if (image != null) {
            imageService.deleteImageFile(image);
            member.setProfileImage(null);
            memberRepository.save(member);
        }

        // 본문 없이 204만 반환
        return ResponseEntity.noContent().build();
    }

    // 비밀번호 확인
    @PostMapping("/check-password")
    public ResponseEntity<?> checkPassword(
            HttpServletRequest req,
            @RequestBody Map<String, String> body) {
        String currentPassword = body.get("currentPassword");

        Member member = getAuthenticatedMember(req);

        // 비밀번호 비교
        if (!passwordEncoder.matches(currentPassword, member.getPassword())) {
            return ResponseEntity.status(400).body(Map.of("message", "비밀번호가 일치하지 않습니다."));
        }

        // 성공
        return ResponseEntity.ok(Map.of("success", true));
    }

    // 비밀번호 변경
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            HttpServletRequest request,
            @RequestBody PasswordChangeRequest req) {

        Member member = getAuthenticatedMember(request);

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

    // 내가 좋아요 누른 앨범들 조회
    @GetMapping("/member/liked-albums")
    public ResponseEntity<List<MemberReviewResponse>> getMyLikedReviews(HttpServletRequest req) {
        Member member = getAuthenticatedMember(req);
        List<MemberReviewResponse> list = reviewService.getLikedReviews(member.getId());
        return ResponseEntity.ok(list);
    }

    // 평가에 참여한 앨범들 불러오기
    @GetMapping("/member/participated-albums")
    public ResponseEntity<List<MemberReviewResponse>> getMyParticipatedReviews(
            HttpServletRequest req) {
        Member member = getAuthenticatedMember(req);
        List<MemberReviewResponse> list = reviewService.getParticipatedReviews(member.getId());
        return ResponseEntity.ok(list);
    }

    // 내가 쓴 리뷰 수 조회
    @GetMapping("/member/review-count")
    public ResponseEntity<Long> getMyReviewCount(HttpServletRequest req) {
        Member member = getAuthenticatedMember(req);
        long count = reviewCommentService.getReviewCount(member.getId());
        return ResponseEntity.ok(count);
    }

    // 내가 앨범에 준 평점 평균
    @GetMapping("/member/average-rating")
    public ResponseEntity<Double> getMyAverageRating(HttpServletRequest req) {
        Member member = getAuthenticatedMember(req);
        double avg = reviewCommentService.getAverageRatingByMemberId(member.getId());
        return ResponseEntity.ok(avg);
    }

    // 장르별 좋아요 수 추출
    @GetMapping("/member/{memberId}/genre-stats")
    public ResponseEntity<List<GenreCountDto>> getGenreStats(
            @PathVariable Long memberId) {
        List<ReviewLikeRepository.GenreCount> stats = memberService.getGenreCounts(memberId);

        // 프로젝션을 DTO로 변환
        List<GenreCountDto> dtoList = stats.stream()
                .map(gc -> new GenreCountDto(gc.getGenre(), gc.getCnt()))
                .toList();

        return ResponseEntity.ok(dtoList);
    }

}
