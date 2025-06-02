package com.example.foominity.service.member;

import org.springframework.stereotype.Service;

import com.example.foominity.repository.member.LikeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RequiredArgsConstructor
@Service
public class LikeService {

    private final LikeRepository likeRepository;
}
