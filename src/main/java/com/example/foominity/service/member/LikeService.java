package com.example.foominity.service.member;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.board.Review;
import com.example.foominity.domain.member.Like;
import com.example.foominity.domain.member.Member;
import com.example.foominity.dto.member.LikeRequest;
import com.example.foominity.exception.ForbiddenActionException;
import com.example.foominity.exception.NotFoundBoardException;
import com.example.foominity.exception.NotFoundLikeException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.UnauthorizedException;
import com.example.foominity.repository.board.ReviewRepository;
import com.example.foominity.repository.member.LikeRepository;
import com.example.foominity.repository.member.MemberRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RequiredArgsConstructor
@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final ReviewRepository reviewRepository;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public void like(Long boardId, HttpServletRequest tokenRequest, LikeRequest req) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);
        // 유효성검증
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        Review review = reviewRepository.findById(boardId).orElseThrow(NotFoundBoardException::new);

        Optional<Like> like = likeRepository.findByMemberAndReview(member, review);

        if (like.isPresent()) {
            likeRepository.delete(like.get());
        } else {
            likeRepository.save(req.toEntity(review, member));
        }

    }

    public Like validateLikeOwnership(Long likeId, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        // 유효성 검증
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        Like like = likeRepository.findById(likeId).orElseThrow(NotFoundLikeException::new);

        if (!like.getMember().getId().equals(member.getId())) {
            throw new ForbiddenActionException();
        }

        return like;
    }

}
