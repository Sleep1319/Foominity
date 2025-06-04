package com.example.foominity.service.sign;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.dto.sign.SignUpRequest;
import com.example.foominity.repository.sign.SignRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SignService {

    private final SignRepository signRepository;
    private final PasswordEncoder passwordEncoder;

    // public void signUp(SignUpRequest req){
    // validateSignUp(req.getEmail(), req.getNickname());
    // req.setPassword(passwordEncoder.encode(req.getPassword()));
    // Role
    // signRepository.save(req.toEntity(req.getEmail(), req.getPassword(),
    // req.getUsername(), req.getNickname(), Role ))
    // }

}
