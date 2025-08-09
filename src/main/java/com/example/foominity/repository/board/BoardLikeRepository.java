package com.example.foominity.repository.board;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.board.Board;
import com.example.foominity.domain.board.BoardLike;

public interface BoardLikeRepository extends JpaRepository<BoardLike, Long> {
    boolean existsByBoardAndMemberId(Board board, Long memberId);

    long countByBoard(Board board);

}
