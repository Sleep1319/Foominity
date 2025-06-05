package com.example.foominity.service.board;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.repository.board.BoardCommentRepository;
import com.example.foominity.repository.member.MemberRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Log4j2
@Service
public class BoardCommentService {

    private final BoardCommentRepository boardCommentRepository;
    private final MemberRepository memberRepository;
}
