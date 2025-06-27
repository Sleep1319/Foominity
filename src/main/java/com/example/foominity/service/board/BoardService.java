package com.example.foominity.service.board;

import java.util.List;
import java.util.stream.Collectors;

import com.example.foominity.domain.board.Review;
import com.example.foominity.dto.board.ReviewResponse;
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
                "createdDate"));
        Page<Board> boards = boardRepository.findAll(pageable);

        List<BoardResponse> boardResponseList = boards.stream()
                .map(board -> new BoardResponse(
                        board.getId(),
                        board.getTitle(),
                        board.getContent(),
                        board.getMember().getId(),
                        board.getMember().getNickname(),
                        board.getViews(),
                        board.getCreatedDate(),
                        board.getUpdatedDate()))
                .toList();
        return new PageImpl<>(boardResponseList, pageable,
                boards.getTotalElements());
    }

    public List<BoardResponse> findByTitle(String keyword) {
        List<Board> boards;

        if (keyword == null || keyword.trim().isEmpty()) {
            boards = boardRepository.findAllByOrderByCreatedDateDesc();
        } else {
            boards = boardRepository.findByTitleContainingIgnoreCaseOrderByCreatedDateDesc(keyword);
        }

        return boards.stream()
                .map(board -> new BoardResponse(
                        board.getId(),
                        board.getTitle(),
                        board.getContent(),
                        board.getMember().getId(),
                        board.getMember().getNickname(),
                        board.getViews(),
                        board.getCreatedDate(),
                        board.getUpdatedDate()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = false) // 조회수 증가를 위해 추가
    public BoardResponse findByid(Long id) {
        Board board = boardRepository.findById(id).orElseThrow(NotFoundBoardException::new);
        // 조회수 증가 : 지금 2씩 증가하는데 main.jsx에서 StrictMode 를 제거하거나 실전으로 가면 1씩 증가한다고 함.
        // 지금은 임시로 {view / 2} 로 처리함
        board.increaseViews();
        return new BoardResponse(
                board.getId(),
                board.getTitle(),
                board.getContent(),
                board.getMember().getId(),
                board.getMember().getNickname(),
                board.getViews(),
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

    public List<BoardResponse> findByMemberId(Long memberId) {
        return boardRepository.findByMemberId(memberId)
                .stream()
                .map(BoardResponse::from)
                .collect(Collectors.toList());
    }

    public Board validateBoardOwnership(Long id, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        Board board = boardRepository.findById(id).orElseThrow(NotFoundBoardException::new);

        // 관리자 통과시키기
        // if (member.getRole().getId() == 4L) {
        // return board;
        // }

        if (!board.getMember().getId().equals(member.getId())) {
            throw new ForbiddenActionException();
        }
        return board;
    }

    public List<BoardResponse> getLatest() {
        List<Board> boardList = boardRepository.findTop4ByOrderByCreatedDateDesc()
                .orElseThrow(NotFoundBoardException::new);

        return boardList.stream()
                .map(board -> new BoardResponse(
                        board.getId(),
                        board.getTitle(),
                        board.getMember().getNickname(),
                        board.getViews(),
                        board.getCreatedDate(),
                        board.getUpdatedDate()))
                .toList();
    }
}
