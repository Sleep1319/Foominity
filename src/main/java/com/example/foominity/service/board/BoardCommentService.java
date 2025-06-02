package com.example.foominity.service.board;

import org.springframework.stereotype.Service;

import com.example.foominity.repository.board.BoardCommentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RequiredArgsConstructor
@Log4j2
@Service
public class BoardCommentService {

    private final BoardCommentRepository boardCommentRepository;
}
