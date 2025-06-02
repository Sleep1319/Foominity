package com.example.foominity.service.board;

import org.springframework.stereotype.Service;

import com.example.foominity.repository.board.ReviewCommentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RequiredArgsConstructor
@Service
public class ReviewCommentService {

    private final ReviewCommentRepository reviewCommentRepository;
}
