package com.example.foominity.controller.board;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.dto.board.BoardRequest;
import com.example.foominity.dto.board.BoardResponse;
import com.example.foominity.dto.board.BoardUpdateRequest;
import com.example.foominity.service.board.BoardService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
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
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/api/boards/page")
    public ResponseEntity<?> findAll(@RequestParam(defaultValue = "0") int page) {
        Page<BoardResponse> res = boardService.findAll(page);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/api/boards/{id}")
    public ResponseEntity<BoardResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(boardService.findByid(id));
    }

    @PostMapping("/api/boards")
    public ResponseEntity<String> createBoard(@Valid @RequestBody BoardRequest req,
            HttpServletRequest tokenRequest) {
        boardService.createBoard(req, tokenRequest);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/api/boards{id}")
    public ResponseEntity<String> updateBoard(@PathVariable Long id, @Valid @RequestBody BoardUpdateRequest req,
            HttpServletRequest tokenRequest) {
        boardService.updateBoard(id, null, tokenRequest);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/api/boards/{id}")
    public ResponseEntity<String> deleteBoard(@PathVariable Long id, HttpServletRequest tokenRequest) {
        boardService.deleteBoard(id, tokenRequest);
        return ResponseEntity.ok().build();
    }
}
