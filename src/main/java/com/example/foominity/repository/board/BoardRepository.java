package com.example.foominity.repository.board;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.board.Board;

public interface BoardRepository extends JpaRepository<Board, Long> {

    Page<Board> findAll(Pageable pageable);

    Optional<Board> findById(Long id);

    Optional<List<Board>> findTop4ByOrderByCreatedDateDesc();

    List<Board> findByTitleContainingIgnoreCaseOrderByCreatedDateDesc(String keyword);

    List<Board> findAllByOrderByCreatedDateDesc();
}
