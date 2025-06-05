package com.example.reactbootserver.service;

import com.example.reactbootserver.config.jwt.JwtTokenProvider;
import com.example.reactbootserver.domain.Member;
import com.example.reactbootserver.domain.board.Board;
import com.example.reactbootserver.domain.board.Comment;
import com.example.reactbootserver.dto.comment.CommentRequest;
import com.example.reactbootserver.dto.comment.CommentResponse;
import com.example.reactbootserver.exception.NotFoundMemberException;
import com.example.reactbootserver.exception.UnauthorizedException;
import com.example.reactbootserver.repository.BoardRepository;
import com.example.reactbootserver.repository.CommentRepository;
import com.example.reactbootserver.repository.MemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public List<CommentResponse> getCommentByBoardId(Long id, CommentRequest req, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);
        Board board = boardRepository.findById(id).orElseThrow(NotFoundMemberException::new);
        List<Comment> commentList = commentRepository.findAll();

        return commentList.stream()
                .map(comment -> new CommentResponse(
                        comment.getId(),
                        comment.getMember().getNickname(),
                        comment.getContent()
                ))
                .toList();
    }
}
