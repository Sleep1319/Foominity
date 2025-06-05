package com.example.foominity.service.board;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.domain.board.Board;
import com.example.foominity.domain.board.BoardComment;
import com.example.foominity.domain.board.Review;
import com.example.foominity.domain.board.ReviewComment;
import com.example.foominity.domain.member.Member;
import com.example.foominity.dto.comment.BoardCommentRequest;
import com.example.foominity.dto.comment.BoardCommentResponse;
import com.example.foominity.dto.comment.ReviewCommentRequest;
import com.example.foominity.dto.comment.ReviewCommentResponse;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.repository.board.BoardRepository;
import com.example.foominity.repository.board.ReviewCommentRepository;
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
    private final MemberRepository memberRepository;

    public List<ReviewCommentResponse> getList(Long id) {
        // 멤버 아이디 토큰
        // Member member =
        // memberRepository.findById().orElseThrow(NotFoundMemberException::new);
        Board board = boardRepository.findById(id).orElseThrow(NotFoundMemberException::new);
        List<ReviewComment> comments = reviewCommentRepository.findByReviewId(id);

        return comments.stream()
                .map(ReviewCommentResponse::fromEntity)
                .toList();

    }

    @Transactional
    public void createReviewComment(BoardCommentRequest req) {
        // 멤버 아이디 토큰
        // Member member =
        // memberRepository.findById().orElseThrow(NotFoundMemberException::new);
        // reviewCommentRepository.save();
    }

    @Transactional
    public void updateReviewComment(Long id) {
        // 멤버 아이디 토큰

    }

    @Transactional
    public void deleteReviewComment(Long id) {
        // 멤버 아이디 토큰

    }

}
