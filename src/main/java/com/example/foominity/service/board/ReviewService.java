package com.example.foominity.service.board;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.board.Review;
import com.example.foominity.domain.member.Member;
import com.example.foominity.exception.ForbiddenActionException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.UnauthorizedException;
import com.example.foominity.repository.board.ReviewRepository;
import com.example.foominity.repository.member.MemberRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    // @Transactional
    // public void createReview(ReviewCreateRequest req, HttpServletRequest
    // tokenRequest) {
    // String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

    // if (!jwtTokenProvider.validateToken(token)) {
    // throw new UnauthorizedException();
    // }

    // Long memberId = jwtTokenProvider.getUserIdFromToken(token);
    // Member member =
    // memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

    // reviewRepository.save(req.toEntity(req, member));
    // }

    @Transactional
    public void updateReview(Long id, HttpServletRequest tokenRequest) {

    }

    @Transactional
    public void deleteReview(Long id, HttpServletRequest tokenRequest) {

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
