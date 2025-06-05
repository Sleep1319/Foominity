package com.example.reactbootserver.repository;

import com.example.reactbootserver.domain.board.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    Optional<Comment> getCommentByBoardId(Long id);
}
