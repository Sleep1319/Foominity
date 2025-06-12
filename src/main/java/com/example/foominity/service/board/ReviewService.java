package com.example.foominity.service.board;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.board.Review;
import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.member.Point;
import com.example.foominity.dto.board.ReviewCreateRequest;
import com.example.foominity.dto.board.ReviewUpdateRequest;
import com.example.foominity.exception.ForbiddenActionException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.UnauthorizedException;
import com.example.foominity.repository.board.ReviewRepository;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.repository.member.PointRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PointRepository pointRepository;

    @Transactional
    public void createReview(ReviewCreateRequest req, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        // 리뷰카운트 증가
        Point point = pointRepository.findByMemberId(memberId).orElseThrow();
        point.increaseReviewCount();

        reviewRepository.save(req.toEntity(req, member));
    }

    @Transactional
    public void updateReview(Long id, ReviewUpdateRequest req, HttpServletRequest tokenRequest) {
        Review review = validateReviewOwnership(id, tokenRequest);
        review.update(req.getTitle(), req.getContent());
    }

    @Transactional
    public void deleteReview(Long id, HttpServletRequest tokenRequest) {
        Review review = validateReviewOwnership(id, tokenRequest);
        reviewRepository.delete(review);
    }

    @Transactional
    public Review validateReviewOwnership(Long id, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        // Board와 Review를 따로 해야하나?
        // Board와 review의 차이점 => 카테고리 상속 유무, 추천 유무
        Review review = reviewRepository.findById(id).orElseThrow();

        if (!review.getMember().getId().equals(member.getId())) {
            throw new ForbiddenActionException();
        }
        return review;
    }

}
