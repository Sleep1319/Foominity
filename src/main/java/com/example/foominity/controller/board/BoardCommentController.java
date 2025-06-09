package com.example.foominity.controller.board;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.dto.comment.BoardCommentRequest;
import com.example.foominity.dto.comment.BoardCommentResponse;
import com.example.foominity.service.board.BoardCommentService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@Slf4j
@RequiredArgsConstructor
public class BoardCommentController {

    private final BoardCommentService boardCommentService;

    @GetMapping("/api/boards/{id}/comments")
    public ResponseEntity<List<BoardCommentResponse>> findAll(@PathVariable Long id) {
        List<BoardCommentResponse> res = boardCommentService.getList(id);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/api/comments")
    public ResponseEntity<String> createBoardComment(@Valid @RequestBody BoardCommentRequest req) {
        boardCommentService.createBoardComment(req);
        return ResponseEntity.ok().build();
    }

    // id 토큰 필요

    // @PutMapping("/api/comments/{id}")
    // public ResponseEntity<String> updateBoardComment(@PathVariable Long id,
    // @Valid @RequestBody BoardCommentRequest req, HttpServletRequest tokenRequest)
    // {
    // boardCommentService.updateBoardComment(id, req, tokenRequest);
    // return ResponseEntity.ok().build();
    // }

    // @DeleteMapping("/api/comments/{id}")
    // public ResponseEntity<String> deleteBoardComment(@PathVariable Long id,
    // HttpServletRequest tokenRequest) {
    // boardCommentService.deleteBoardComment(id, tokenRequest);
    // return ResponseEntity.ok().build();
    // }

}
