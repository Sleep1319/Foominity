package com.example.foominity.service.board;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.board.Board;
import com.example.foominity.domain.board.BoardComment;
import com.example.foominity.domain.board.Review;
import com.example.foominity.domain.board.ReviewComment;
import com.example.foominity.domain.member.Member;
import com.example.foominity.dto.comment.BoardCommentRequest;
import com.example.foominity.dto.comment.BoardCommentResponse;
import com.example.foominity.dto.comment.ReviewCommentRequest;
import com.example.foominity.dto.comment.ReviewCommentResponse;
import com.example.foominity.dto.comment.ReviewCommentUpdateRequest;
import com.example.foominity.exception.ForbiddenActionException;
import com.example.foominity.exception.NotFoundBoardException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.NotFoundReviewCommentException;
import com.example.foominity.exception.NotFoundReviewException;
import com.example.foominity.exception.UnauthorizedException;
import com.example.foominity.repository.board.BoardRepository;
import com.example.foominity.repository.board.ReviewCommentRepository;
import com.example.foominity.repository.board.ReviewRepository;
import com.example.foominity.repository.member.MemberRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class ReviewCommentService {

    private final ReviewCommentRepository reviewCommentRepository;
    private final BoardRepository boardRepository;
    private final ReviewRepository reviewRepository;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public List<ReviewCommentResponse> getList(Long reviewId) {
        List<ReviewComment> comments = reviewCommentRepository.findByReviewId(reviewId);

        return comments.stream()
                .map(ReviewCommentResponse::fromEntity)
                .toList();

    }

    @Transactional
    public void createReviewComment(Long reviewId, HttpServletRequest tokenRequest, ReviewCommentRequest req) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        // 유효성검증
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        Review review = reviewRepository.findById(reviewId).orElseThrow(NotFoundReviewException::new);
        reviewCommentRepository.save(req.toEntity(req, review, member));

    }

    @Transactional
    public void updateReviewComment(Long commentId, HttpServletRequest tokenRequest, ReviewCommentUpdateRequest req) {
        ReviewComment reviewComment = validateReviewCommentOwnership(commentId, tokenRequest);
        reviewComment.changeComment(req.getComment());

    }

    @Transactional
    public void deleteReviewComment(Long commentId, HttpServletRequest tokenRequest) {
        ReviewComment reviewComment = validateReviewCommentOwnership(commentId, tokenRequest);
        reviewCommentRepository.delete(reviewComment);

    }

    public ReviewComment validateReviewCommentOwnership(Long commentId, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        // 유효성검증
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        ReviewComment reviewComment = reviewCommentRepository.findById(commentId)
                .orElseThrow(NotFoundReviewCommentException::new);

        if (!reviewComment.getMember().getId().equals(member.getId())) {
            throw new ForbiddenActionException();
        }

        return reviewComment;
    }

}
