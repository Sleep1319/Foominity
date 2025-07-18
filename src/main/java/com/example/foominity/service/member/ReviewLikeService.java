package com.example.foominity.service.member;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.board.Review;
import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.member.ReviewLike;
import com.example.foominity.dto.board.ReviewSimpleResponse;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.NotFoundReviewException;
import com.example.foominity.repository.board.ReviewRepository;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.repository.member.ReviewLikeRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewLikeService {

    private final ReviewLikeRepository reviewLikeRepository;
    private final MemberRepository memberRepository;
    private final ReviewRepository reviewRepository;
    private final JwtTokenProvider jwtTokenProvider;

    /** 좋아요 개수 조회 */
    public long countLikes(Long reviewId) {
        return reviewLikeRepository.countByReviewId(reviewId);
    }

    /** 좋아요 토글. true=추가됨, false=삭제됨 */
    @Transactional
    public boolean toggleLike(Long reviewId, HttpServletRequest req) {
        String token = jwtTokenProvider.resolveTokenFromCookie(req);
        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId)
                .orElseThrow(NotFoundMemberException::new);

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(NotFoundReviewException::new);

        // 이미 눌렀던 좋아요면 삭제
        return reviewLikeRepository.findByMemberAndReview(member, review)
                .map(existing -> {
                    reviewLikeRepository.delete(existing);
                    return false;
                })
                .orElseGet(() -> {
                    reviewLikeRepository.save(new ReviewLike(member, review));
                    return true;
                });
    }

    /** 내가 좋아요 누른 리뷰 목록 조회 */
    public List<ReviewSimpleResponse> getMyLikedReviews(HttpServletRequest req) {
        String token = jwtTokenProvider.resolveTokenFromCookie(req);
        Long memberId = jwtTokenProvider.getUserIdFromToken(token);

        return reviewLikeRepository.findByMemberId(memberId)
                .stream()
                .map(rl -> {
                    Review r = rl.getReview();
                    return new ReviewSimpleResponse(
                            r.getId(),
                            r.getTitle(),
                            0f,
                            List.of(),
                            List.of(),
                            r.getImageFile() != null ? r.getImageFile().getSavePath() : null);
                })
                .collect(Collectors.toList());
    }

    /** 내가 이 리뷰에 좋아요 눌렀는지 */
    public boolean isLikedByMember(Long reviewId, Long memberId) {
        return reviewLikeRepository.findByMemberIdAndReviewId(memberId, reviewId).isPresent();
    }
}
