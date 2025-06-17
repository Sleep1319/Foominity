package com.example.foominity.service.board;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.board.Board;
import com.example.foominity.domain.member.Member;
import com.example.foominity.dto.board.BoardResponse;
import com.example.foominity.dto.board.BoardUpdateRequest;
import com.example.foominity.repository.board.BoardRepository;
import com.example.foominity.repository.member.MemberRepository;

import jakarta.servlet.http.HttpServletRequest;

import com.example.foominity.dto.board.BoardRequest;
import com.example.foominity.exception.ForbiddenActionException;
import com.example.foominity.exception.NotFoundBoardException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.UnauthorizedException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public Page<BoardResponse> findAll(int page) {
        PageRequest pageable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC,
                "id"));
        Page<Board> boards = boardRepository.findAll(pageable);

        List<BoardResponse> boardResponseList = boards.stream()
                .map(board -> new BoardResponse(
                        board.getId(),
                        board.getTitle(),
                        board.getContent(),
                        board.getMember().getId(),
                        board.getMember().getNickname(),
                        board.getCreatedDate(),
                        board.getUpdatedDate()))
                .toList();
        return new PageImpl<>(boardResponseList, pageable,
                boards.getTotalElements());
    }

    public BoardResponse findByid(Long id) {
        Board board = boardRepository.findById(id).orElseThrow(NotFoundBoardException::new);
        return new BoardResponse(
                board.getId(),
                board.getTitle(),
                board.getContent(),
                board.getMember().getId(),
                board.getMember().getNickname(),
                board.getCreatedDate(),
                board.getUpdatedDate());
    }

    @Transactional
    public void createBoard(BoardRequest req, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

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

    public Board validateBoardOwnership(Long id, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        Board board = boardRepository.findById(id).orElseThrow(NotFoundBoardException::new);

        if (!board.getMember().getId().equals(member.getId())) {
            throw new ForbiddenActionException();
        }
        return board;
    }
}
