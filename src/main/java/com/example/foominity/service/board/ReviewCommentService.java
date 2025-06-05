package com.example.foominity.service.board;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.repository.board.ReviewCommentRepository;
import com.example.foominity.repository.member.MemberRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Transactional(readOnly = true)
@Log4j2
@RequiredArgsConstructor
@Service
public class ReviewCommentService {

    private final ReviewCommentRepository reviewCommentRepository;
    // private final BoardRepository BoardRepository;
    private final MemberRepository memberRepository;

    // public List<>

}
