package com.example.foominity.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

}
