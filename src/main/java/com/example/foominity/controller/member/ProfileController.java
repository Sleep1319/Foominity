package com.example.foominity.controller.member;

import java.nio.file.Paths;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.image.ImageFile;
import com.example.foominity.domain.member.Member;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.service.image.ImageService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
public class ProfileController {
    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;
    private final ImageService imageService;

    @Transactional
    @PostMapping("/api/member/profile-image")
    public ResponseEntity<Map<String, String>> updateProfileImage(@RequestParam("file") MultipartFile file,
            HttpServletRequest request) {

        String token = jwtTokenProvider.resolveTokenFromCookie(request);
        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        // 기존 이미지 삭제
        if (member.getProfileImage() != null) {
            imageService.deleteImageFile(member.getProfileImage());
        }

        // 새 이미지 저장 + 연결
        ImageFile newImage = imageService.imageUpload(file);
        member.setProfileImage(newImage);
        memberRepository.save(member); // ✅ 꼭 저장!

        String imageUrl = "/uploads/" + Paths.get(newImage.getSavePath()).getFileName().toString();
        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    }

}
