package com.example.reactbootserver.service;

import com.example.reactbootserver.config.jwt.JwtTokenProvider;
import com.example.reactbootserver.domain.Member;
import com.example.reactbootserver.domain.board.Board;
import com.example.reactbootserver.dto.board.BoardCreateRequest;
import com.example.reactbootserver.dto.board.BoardResponse;
import com.example.reactbootserver.dto.board.BoardUpdateRequest;
import com.example.reactbootserver.exception.ForbiddenActionException;
import com.example.reactbootserver.exception.NotFoundBoardException;
import com.example.reactbootserver.exception.NotFoundMemberException;
import com.example.reactbootserver.exception.UnauthorizedException;
import com.example.reactbootserver.repository.BoardRepository;
import com.example.reactbootserver.repository.MemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public Page<BoardResponse> findAll(int page) {
        PageRequest pageable = PageRequest.of(page, 4, Sort.by(Sort.Direction.DESC, "id"));
        Page<Board> boards = boardRepository.findAll(pageable);

        List<BoardResponse> boardResponseList = boards.stream()
                .map(board -> new BoardResponse(
                        board.getId(),
                        board.getTitle(),
                        board.getContent(),
                        board.getMember().getId(),
                        board.getMember().getNickname()
                ))
                .toList();
        return new PageImpl<>(boardResponseList, pageable, boards.getTotalElements());
    }

    public BoardResponse findById(Long id) {
        Board board = boardRepository.findById(id).orElseThrow(NotFoundBoardException::new);
        return new BoardResponse(
                board.getId(),
                board.getTitle(),
                board.getContent(),
                board.getMember().getId(),
                board.getMember().getNickname()
        );
    }
    @Transactional
    public void createBoard(BoardCreateRequest req) {
        Member member = memberRepository.findById(req.getMemberId()).orElseThrow(NotFoundMemberException::new);
        boardRepository.save(req.toEntity(req, member));
    }


    @Transactional
    public void updateBoard(Long id, BoardUpdateRequest req, HttpServletRequest tokenRequest) {
        Board board = validateBoardOwnership(id, tokenRequest);
        board.update(req.getTitle(), req.getContent());
    }

    @Transactional
    public void deleteBoard(Long id, HttpServletRequest tokenRequest) {
        Board board = validateBoardOwnership(id, tokenRequest);
        boardRepository.delete(board);

    }

    //권한 검증용
    public Board validateBoardOwnership(Long id, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        Board board = boardRepository.findById(id).orElseThrow(NotFoundBoardException::new);

        if(!board.getMember().getId().equals(member.getId())) {
            throw new ForbiddenActionException();
        }
        return board;
    }
}
