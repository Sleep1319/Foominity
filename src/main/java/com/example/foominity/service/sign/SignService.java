package com.example.foominity.service.sign;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.foominity.dto.sign.SignUpRequest;
import com.example.foominity.repository.sign.SignRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SignService {

    private final SignRepository signRepository;
    private final PasswordEncoder passwordEncoder;

    // public void signUp(SignUpRequestDTO req){
    // validateSignUp(req.getEmail(), req.getNickname());
    // req.setPassword(passwordEncoder.encode(req.getPassword()));
    // Role
    // signRepository.save(req.toEntity(req.getEmail(), req.getPassword(),
    // req.getUsername(), req.getNickname(), Role ))
    // }

}
