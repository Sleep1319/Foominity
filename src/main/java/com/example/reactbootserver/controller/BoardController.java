package com.example.reactbootserver.controller;

import com.example.reactbootserver.dto.board.BoardCreateRequest;
import com.example.reactbootserver.dto.board.BoardResponse;
import com.example.reactbootserver.dto.board.BoardUpdateRequest;
import com.example.reactbootserver.service.BoardService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
public class BoardController {
    private final BoardService boardService;

    @GetMapping("/api/boards/page")
    public ResponseEntity<?> findAll(@RequestParam(defaultValue = "0") int page) {
        Page<BoardResponse> res = boardService.findAll(page);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/api/boards/{id}")
    public ResponseEntity<BoardResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(boardService.findById(id));
    }

    @PostMapping("/api/boards")
    public ResponseEntity<String> createBoard(@Valid @RequestBody BoardCreateRequest req) {
        boardService.createBoard(req);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/api/boards{id}")
    public ResponseEntity<String> createBoard(@PathVariable Long id, @Valid @RequestBody BoardUpdateRequest req, HttpServletRequest tokenRequest) {
        boardService.updateBoard(id, req,tokenRequest);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/api/boards/{id}")
    public ResponseEntity<String> deleteBoard(@PathVariable Long id, HttpServletRequest tokenRequest) {
        boardService.deleteBoard(id, tokenRequest);
        return ResponseEntity.ok().build();
    }
}
