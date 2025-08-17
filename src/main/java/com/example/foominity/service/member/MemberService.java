package com.example.foominity.service.member;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.config.jwt.JwtTokenProvider;

import com.example.foominity.domain.member.Member;
import com.example.foominity.dto.member.MemberRequest;
import com.example.foominity.dto.member.NicknameChangeRequest;
import com.example.foominity.dto.member.OtherUserProfileResponse;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.UnauthorizedException;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.repository.member.ReviewLikeRepository;

import com.example.foominity.service.image.ImageService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MemberService {

    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final ImageService imageService;
    private final ReviewLikeRepository reviewLikeRepository;
    
     /** 회원 탈퇴 */
   @Transactional
public void deleteMember(Long memberId, MemberRequest req) {
    Member member = memberRepository.findById(memberId)
            .orElseThrow(NotFoundMemberException::new);

    String raw = req.getPassword();
    String enc = member.getPassword();
    if (enc == null || raw == null || !passwordEncoder.matches(raw, enc)) {
        throw new IllegalStateException("비밀번호가 일치하지 않습니다.");
    }

    // 프로필 이미지: 물리 파일은 직접 지우되, 엔티티는 cascade로 지워도 되지만
    // 파일 삭제가 필요하므로 FK를 끊고 파일 삭제 후 진행
    if (member.getProfileImage() != null) {
        var img = member.getProfileImage();
        member.setProfileImage(null);     // FK 해제
        memberRepository.save(member);    // flush 보장
        imageService.deleteImageFile(img);// 물리 파일 + image_file 레코드 삭제
    }

    memberRepository.delete(member);
}


    // 닉네임 변경
    @Transactional
    public void changeNickname(HttpServletRequest tokenRequest, NicknameChangeRequest req) {

        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        // 유효성검증
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }
        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId)
                .orElseThrow(NotFoundMemberException::new);

        if (memberRepository.existsByNickname(req.getNickname())) {
            throw new IllegalStateException("이미 사용 중인 닉네임입니다.");
        }
        member.changeNickname(req.getNickname());
    }

    // 다른 유저 프로필 조회
    public OtherUserProfileResponse getOtherUserProfile(Long id) {
        Member member = memberRepository.findById(id).orElseThrow(NotFoundMemberException::new);

        return new OtherUserProfileResponse(member);
    }

    // 장르 좋아요 수 리스트로 추출
    public List<ReviewLikeRepository.GenreCount> getGenreCounts(Long memberId) {
        return reviewLikeRepository.countGenresByMember(memberId);
    }

}
