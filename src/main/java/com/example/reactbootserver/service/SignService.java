package com.example.reactbootserver.service;

import com.example.reactbootserver.config.jwt.JwtTokenProvider;
import com.example.reactbootserver.domain.Member;
import com.example.reactbootserver.dto.sign.SignInRequest;
import com.example.reactbootserver.dto.sign.SignInResponse;
import com.example.reactbootserver.dto.sign.SignUpRequest;
import com.example.reactbootserver.exception.MemberEmailAlreadyExistsException;
import com.example.reactbootserver.exception.MemberNicknameAlreadyExistsException;
import com.example.reactbootserver.exception.SignInFailureException;
import com.example.reactbootserver.repository.SignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SignService {

    private final SignRepository signRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public void signUp(SignUpRequest req) {
        validateSignUp(req.getEmail(), req.getNickname());
        req.setPassword(passwordEncoder.encode(req.getPassword()));
        signRepository.save(req.toEntity(req.getEmail(), req.getPassword(), req.getUsername(), req.getNickname()));
    }

    public boolean existsNickname(String nickname) {
        return signRepository.existsByNickname(nickname);
    }

    public SignInResponse signIn(SignInRequest req) {
        Member member = signRepository.findByEmail(req.getEmail()).orElseThrow(() -> new SignInFailureException(""));

        //직접 박은 비 인코더 패스워드 변환용
//        if(!member.getPassword().startsWith("$2a$")) {
//             member.changePassword(passwordEncoder.encode(member.getPassword()));
//        }
        validateSignInPassword(req.getPassword(), member.getPassword());
        String accessToken = jwtTokenProvider.createAccessToken(member.getId(), member.getEmail(), member.getUsername(), member.getNickname(), member.getRole().name());
        String refreshToken = jwtTokenProvider.createRefreshToken(member.getId());

        return new SignInResponse(accessToken, refreshToken);
    }

    private void validateSignUp(String email, String nickname) {
        if(signRepository.existsByEmail(email)) {
            throw new MemberEmailAlreadyExistsException();
        }
        if(signRepository.existsByNickname(nickname)) {
            throw new MemberNicknameAlreadyExistsException();
        }
    }

    private void validateSignInPassword(String reqPassword, String password) {
        if(!passwordEncoder.matches(reqPassword, password)) {
            throw new SignInFailureException("비밀번호 틀림");
        }
    }
}
