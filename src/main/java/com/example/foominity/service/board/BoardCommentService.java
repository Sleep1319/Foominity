package com.example.foominity.service.board;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.board.Board;
import com.example.foominity.domain.board.BoardComment;
import com.example.foominity.domain.member.Member;
import com.example.foominity.dto.comment.BoardCommentRequest;
import com.example.foominity.dto.comment.BoardCommentResponse;
import com.example.foominity.dto.comment.BoardCommentUpdateRequest;
import com.example.foominity.dto.comment.ReviewCommentResponse;
import com.example.foominity.exception.ForbiddenActionException;
import com.example.foominity.exception.NotFoundBoardCommentException;
import com.example.foominity.exception.NotFoundBoardException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.UnauthorizedException;
import com.example.foominity.repository.board.BoardCommentRepository;
import com.example.foominity.repository.board.BoardRepository;
import com.example.foominity.repository.member.MemberRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.Null;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Log4j2
@Service
public class BoardCommentService {

    private final BoardRepository boardRepository;
    private final BoardCommentRepository boardCommentRepository;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    // 댓글 전체 출력
    public List<BoardCommentResponse> getList(Long boardId) {
        List<BoardComment> comments = boardCommentRepository.findByBoardId(boardId);

        return comments.stream()
                .map(BoardCommentResponse::fromEntity)
                .toList();
    }

    // 댓글 작성
    @Transactional
    public void createBoardComment(Long boardId, HttpServletRequest tokenRequest, BoardCommentRequest req) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);
        // 유효성검증
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        Board board = boardRepository.findById(boardId).orElseThrow(NotFoundBoardException::new);
        boardCommentRepository.save(req.toEntity(req, board, member));
    }

    // 댓글 수정
    @Transactional
    public void updateBoardComment(Long commentId, HttpServletRequest tokenRequest, BoardCommentUpdateRequest req) {
        BoardComment boardComment = validateBoardCommentOwnership(commentId, tokenRequest);
        boardComment.changeComment(req.getComment());
    }

    // 댓글 삭제
    @Transactional
    public void deleteBoardComment(Long commentId, HttpServletRequest tokenRequest) {
        BoardComment boardComment = validateBoardCommentOwnership(commentId, tokenRequest);
        boardCommentRepository.delete(boardComment);
    }

    // 댓글 작성자 검증 메서드
    public BoardComment validateBoardCommentOwnership(Long commentId, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        // 유효성검증
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        BoardComment boardComment = boardCommentRepository.findById(commentId)
                .orElseThrow(NotFoundBoardCommentException::new);

        if (!boardComment.getMember().getId().equals(member.getId())) {
            throw new ForbiddenActionException();
        }

        return boardComment;

    }
}
