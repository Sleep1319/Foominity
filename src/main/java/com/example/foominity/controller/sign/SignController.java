package com.example.foominity.controller.sign;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.service.sign.SignService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
public class SignController {

    private final SignService signService;
    private final JwtTokenProvider jwtTokenProvider;

}
