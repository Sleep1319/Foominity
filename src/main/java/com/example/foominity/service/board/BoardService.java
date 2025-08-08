package com.example.foominity.service.board;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.board.Board;
import com.example.foominity.domain.board.BoardImage;
import com.example.foominity.domain.board.BoardLike;
import com.example.foominity.domain.member.Member;
import com.example.foominity.dto.board.BoardResponse;
import com.example.foominity.dto.board.BoardUpdateRequest;
import com.example.foominity.repository.board.BoardImageRepository;
import com.example.foominity.repository.board.BoardLikeRepository;
import com.example.foominity.repository.board.BoardRepository;
import com.example.foominity.repository.member.MemberRepository;

import jakarta.servlet.http.HttpServletRequest;

import com.example.foominity.dto.board.BoardRequest;
import com.example.foominity.exception.ForbiddenActionException;
import com.example.foominity.exception.NotFoundBoardException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.UnauthorizedException;
import com.example.foominity.exception.AlreadyLikedException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardService {
    private final BoardRepository boardRepository;

    private final MemberRepository memberRepository;

    private final BoardImageRepository boardImageRepository;

    private final BoardLikeRepository boardLikeRepository;

    private final JwtTokenProvider jwtTokenProvider;

    private final String uploadDir = "uploads/board_images"; // 이미지 업로드 경로 설정

    public Page<BoardResponse> getBoards(int page, String subject, String keyword) {
        if ((subject == null || subject.equals("전체")) && (keyword == null || keyword.isBlank())) {
            return findAll(page);
        } else if (subject != null && !subject.equals("전체") && (keyword == null || keyword.isBlank())) {
            return findBySubject(subject, page);
        } else if ((subject == null || subject.equals("전체")) && keyword != null && !keyword.isBlank()) {
            return findByKeyword(keyword, page);
        } else {
            return findBySubjectAndKeyword(subject, keyword, page);
        }
    }

    public Page<BoardResponse> findAll(int page) {
        PageRequest pageable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC,
                "createdDate"));
        Page<Board> boards = boardRepository.findAll(pageable);

        List<BoardResponse> boardResponseList = boards.stream()
                .map(BoardResponse::from)
                .toList();
        return new PageImpl<>(boardResponseList, pageable,
                boards.getTotalElements());
    }

    // 검색
    public Page<BoardResponse> findBySubject(String subject, int page) {
        PageRequest pageable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "createdDate"));
        Page<Board> boards = boardRepository.findBySubject(subject, pageable);
        Page<BoardResponse> boardResponses = boards.map(BoardResponse::from);
        return boardResponses;
    }

    public Page<BoardResponse> findByKeyword(String keyword, int page) {
        PageRequest pageable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "createdDate"));
        Page<Board> boards = boardRepository.findByTitleContainingIgnoreCase(keyword, pageable);
        return boards.map(BoardResponse::from);
    }

    public Page<BoardResponse> findBySubjectAndKeyword(String subject, String keyword, int page) {
        PageRequest pageable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "createdDate"));
        Page<Board> boards = boardRepository.findBySubjectAndTitleContainingIgnoreCase(subject, keyword, pageable);
        return boards.map(BoardResponse::from);
    }

    @Transactional(readOnly = false) // 조회수 증가를 위해 추가
    public BoardResponse findByid(Long id) {
        Board board = boardRepository.findById(id).orElseThrow(NotFoundBoardException::new);
        // 조회수 증가 : 지금 2씩 증가하는데 main.jsx에서 StrictMode 를 제거하거나 실전으로 가면 1씩 증가한다고 함.
        // 지금은 임시로 {view / 2} 로 처리함
        board.increaseViews();
        return BoardResponse.from(board);
    }

    @Transactional
    public void createBoard(BoardRequest req, List<MultipartFile> images, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        Board board = req.toEntity(req, member);
        boardRepository.save(board);

        // 이미지 저장
        if (images != null) {
            for (MultipartFile imageFile : images) {
                saveImage(imageFile, board);
            }
        }
    }

    @Transactional
    public void updateBoard(Long id, BoardUpdateRequest req, List<Long> deleteImageIds, List<MultipartFile> newImages,
            HttpServletRequest tokenRequest) {
        Board board = validateBoardOwnership(id, tokenRequest);
        board.update(req.getTitle(), req.getContent(), req.getSubject());

        // 1. 삭제 요청 이미지 삭제
        if (deleteImageIds != null) {
            for (Long imgId : deleteImageIds) {
                deleteImage(imgId);
            }
        }
        // 2. 새 이미지 추가
        if (newImages != null) {
            for (MultipartFile file : newImages) {
                saveImage(file, board);
            }
        }
    }

    @Transactional
    public void deleteBoard(Long id, HttpServletRequest tokenRequest) {
        Board board = validateBoardOwnership(id, tokenRequest);
        // 연관된 이미지 모두 삭제
        if (board.getImages() != null) {
            for (BoardImage image : board.getImages()) {
                deleteImage(image.getId());
            }
        }
        boardRepository.delete(board);
    }

    public List<BoardResponse> findByMemberId(Long memberId) {
        return boardRepository.findByMemberId(memberId)
                .stream()
                .map(BoardResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void likeBoard(Long id, Long memberId) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 게시글을 찾을 수 없습니다."));

        if (boardLikeRepository.existsByBoardAndMemberId(board, memberId)) {
            throw new AlreadyLikedException("이미 추천한 게시글입니다.");
        }
        boardLikeRepository.save(new BoardLike(board, memberId));
    }

    public long getLikeCount(Long id) {
        Board board = boardRepository.findById(id).orElseThrow();
        return boardLikeRepository.countByBoard(board);
    }

    @Transactional
    public List<BoardResponse> getPopularBoards() {
        LocalDateTime from = LocalDateTime.now().minusDays(2); // 최신 2일
        List<Board> boards = boardRepository.findPopularBoards(from);
        return boards.stream().map(BoardResponse::from).collect(Collectors.toList());
    }

    @Transactional
    public BoardImage saveImage(MultipartFile imageFile, Board board) {
        if (imageFile == null || imageFile.isEmpty())
            return null;
        try {
            String originalName = imageFile.getOriginalFilename();
            String ext = originalName.substring(originalName.lastIndexOf("."));
            String uuid = UUID.randomUUID().toString();
            String fileName = uuid + ext;
            Path filePath = Paths.get(uploadDir, fileName);
            Files.createDirectories(filePath.getParent());
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            BoardImage boardImage = new BoardImage("/uploads/" + fileName, board); // 경로는 상황에 맞게
            return boardImageRepository.save(boardImage);
        } catch (Exception e) {
            throw new RuntimeException("이미지 저장 실패", e);
        }
    }

    @Transactional
    public void deleteImage(Long imageId) {
        BoardImage image = boardImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("이미지 없음"));
        // 실제 파일 삭제
        String filePath = "uploads/" + Paths.get(image.getImageUrl()).getFileName();
        try {
            Files.deleteIfExists(Paths.get(filePath));
        } catch (IOException e) {
            // log, ignore, etc.
        }
        boardImageRepository.delete(image);
    }

    // 토큰 검증
    public Board validateBoardOwnership(Long id, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        Board board = boardRepository.findById(id).orElseThrow(NotFoundBoardException::new);

        // 관리자 통과시키기
        if (member.getRole().getId() == 4L) {
            return board;
        }

        if (!board.getMemberId().equals(member.getId())) {
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
                        board.getNickname(),
                        board.getViews(),
                        board.getCreatedDate(),
                        board.getUpdatedDate()))
                .toList();
    }
}
