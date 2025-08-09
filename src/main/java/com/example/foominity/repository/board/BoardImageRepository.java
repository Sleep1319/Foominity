package com.example.foominity.repository.board;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.board.Board;
import com.example.foominity.domain.board.BoardImage;

public interface BoardImageRepository extends JpaRepository<BoardImage, Long> {
    List<BoardImage> findByBoard(Board board);
}
