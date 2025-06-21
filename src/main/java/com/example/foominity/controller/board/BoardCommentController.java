package com.example.foominity.controller.board;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.dto.comment.BoardCommentRequest;
import com.example.foominity.dto.comment.BoardCommentResponse;
import com.example.foominity.dto.comment.BoardCommentUpdateRequest;
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

    @GetMapping("/api/boards/{boardId}/comments")
    public ResponseEntity<List<BoardCommentResponse>> findAll(@PathVariable Long boardId) {
        List<BoardCommentResponse> res = boardCommentService.getList(boardId);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/api/boards/{boardId}/comments")
    public ResponseEntity<String> createBoardComment(@PathVariable Long boardId, HttpServletRequest tokenRequest,
            @Valid @RequestBody BoardCommentRequest req) {
        boardCommentService.createBoardComment(boardId, tokenRequest, req);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/api/boards/{boardId}/comments/{id}")
    public ResponseEntity<String> updateBoardComment(@PathVariable Long commentId, HttpServletRequest tokenRequest,
            @Valid @RequestBody BoardCommentUpdateRequest req) {
        boardCommentService.updateBoardComment(commentId, tokenRequest, req);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/api/boards/{boardId}/comments/{id}")
    public ResponseEntity<String> deleteBoardComment(@PathVariable Long commentId,
            HttpServletRequest tokenRequest) {
        boardCommentService.deleteBoardComment(commentId, tokenRequest);
        return ResponseEntity.ok().build();
    }

}
