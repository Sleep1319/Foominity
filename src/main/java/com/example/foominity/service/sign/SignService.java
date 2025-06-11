package com.example.foominity.service.sign;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.member.Member;
import com.example.foominity.dto.sign.MemberResponse;
import com.example.foominity.dto.sign.SignInRequest;
import com.example.foominity.dto.sign.SignInResponse;
import com.example.foominity.dto.sign.SignUpRequest;
import com.example.foominity.exception.MemberEmailAlreadyExistsException;
import com.example.foominity.exception.MemberNicknameAlreadyExistsException;
import com.example.foominity.exception.SignInFailureException;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.repository.sign.SignRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SignService {

    private final SignRepository signRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;

    // 회원 탈퇴
    @Transactional
    public void deleteMember(MemberResponse memberResponse) {

        Member member = signRepository.findByEmail(memberResponse.getEmail())
                .orElseThrow(() -> new IllegalStateException("회원이 존재하지 않습니다"));

        // 비밀번호 일치 확인
        if (!passwordEncoder.matches(memberResponse.getPassword(), member.getPassword())) {
            throw new IllegalStateException("비밀번호가 일치하지 않습니다.");
        } else {
            memberRepository.delete(member);
        }
    }

    // 닉네임 변경
    @Transactional
    public void updateNickname(MemberResponse memberResponse) {
        signRepository.updateNickname(memberResponse.getNickname(), memberResponse.getEmail());
    }

    // 회원가입
    @Transactional
    public void signUp(SignUpRequest req) {
        validateSignUp(req.getEmail(), req.getNickname());

        req.setPassword(passwordEncoder.encode(req.getPassword()));
        signRepository
                .save(req.toEntity(req.getEmail(), req.getPassword(), req.getUsername(),
                        req.getNickname()));
    }

    public boolean existsNickname(String nickname) {
        return signRepository.existsByNickname(nickname);
    }

    // 로그인
    public SignInResponse signIn(SignInRequest req) {
        Member member = signRepository.findByEmail(req.getEmail()).orElseThrow(
                () -> new SignInFailureException("이메일을 다시 확인해주세요."));

        validateSignInPassword(req.getPassword(), member.getPassword());
        String accessToken = jwtTokenProvider.createAccessToken(member.getId(), member.getEmail(), member.getUserName(),
                member.getNickname(), null);
        String refreshToken = jwtTokenProvider.createRefreshToken(member.getId());

        return new SignInResponse(accessToken, refreshToken);
    }

    private void validateSignUp(String email, String nickname) {
        if (signRepository.existsByEmail(email)) {
            throw new MemberEmailAlreadyExistsException();
        }
        if (signRepository.existsByNickname(nickname)) {
            throw new MemberNicknameAlreadyExistsException();
        }
    }

    private void validateSignInPassword(String reqPassword, String password) {
        if (!passwordEncoder.matches(reqPassword, password)) {
            throw new SignInFailureException("비밀번호 틀림");
        }
    }

}
