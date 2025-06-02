package com.example.foominity.repository.board;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.BoardComment;

public interface BoardCommentRepository extends JpaRepository<BoardComment, Long> {

}
