package com.example.foominity.repository.board;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.board.Board;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BoardRepository extends JpaRepository<Board, Long> {

    Page<Board> findAll(Pageable pageable);

    Optional<Board> findById(Long id);

    Optional<List<Board>> findTop4ByOrderByCreatedDateDesc();

    List<Board> findByTitleContainingIgnoreCaseOrderByCreatedDateDesc(String keyword);

    List<Board> findAllByOrderByCreatedDateDesc();

    List<Board> findByMemberId(Long memberId);

    Page<Board> findBySubject(String subject, Pageable pageable);

    Page<Board> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);

    Page<Board> findBySubjectAndTitleContainingIgnoreCase(String subject, String keyword, Pageable pageable);

    @Query(value = """
              SELECT b.*
              FROM board b
              LEFT JOIN board_like bl ON b.id = bl.board_id
              WHERE b.created_date >= :from
              GROUP BY b.id
              HAVING ((b.views / 50.0) + COUNT(bl.id)) >= 5
              ORDER BY ((b.views / 50.0) + COUNT(bl.id)) DESC, b.created_date DESC
              LIMIT 10
            """, nativeQuery = true)
    List<Board> findPopularBoards(@Param("from") LocalDateTime from);

}
