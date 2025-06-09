package com.example.foominity.controller.board;

import org.springframework.web.bind.annotation.RestController;

import com.example.reactbootserver.service.BoardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

}
