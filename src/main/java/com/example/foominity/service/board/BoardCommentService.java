package com.example.foominity.service.board;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.domain.board.Board;
import com.example.foominity.domain.board.BoardComment;
import com.example.foominity.dto.comment.BoardCommentRequest;
import com.example.foominity.dto.comment.BoardCommentResponse;
import com.example.foominity.dto.comment.ReviewCommentResponse;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.repository.board.BoardCommentRepository;
import com.example.foominity.repository.board.BoardRepository;
import com.example.foominity.repository.member.MemberRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RequiredArgsConstructor
@Log4j2
@Service
public class BoardCommentService {

    private final BoardCommentRepository boardCommentRepository;
    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;

    public List<BoardCommentResponse> getList(Long id) {
        // 멤버 아이디 토큰
        // Member member =
        // memberRepository.findById().orElseThrow(NotFoundMemberException::new);
        Board board = boardRepository.findById(id).orElseThrow(NotFoundMemberException::new);
        List<BoardComment> comments = boardCommentRepository.findByBoardId(id);

        return comments.stream()
                .map(BoardCommentResponse::fromEntity)
                .toList();
    }

    @Transactional
    public void createBoardComment(BoardCommentRequest req) {
        // 멤버 아이디 토큰
        // Member member =
        // memberRepository.findById().orElseThrow(NotFoundMemberException::new);
        // boardCommentRepository.save();

    }

    @Transactional
    public void updateBoardComment(Long id) {
        // 멤버 아이디 토큰

    }

    @Transactional
    public void deleteBoardComment(Long id) {
        // 멤버 아이디 토큰

    }
}
