package com.example.foominity.service.magazine;

import java.util.List;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.image.ImageFile;
import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.notice.Magazine;
import com.example.foominity.exception.UnauthorizedException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.dto.magazine.MagazineRequest;
import com.example.foominity.dto.magazine.MagazineResponse;
import com.example.foominity.exception.ForbiddenActionException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.NotFoundNoticeException;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.repository.notice.MagazineRepository;
import com.example.foominity.service.image.ImageService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class MagazineService {

    private final MagazineRepository magazineRepository;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final ImageService imageService;

    public Page<MagazineResponse> findAll(int page) {
        PageRequest pageable = PageRequest.of(page, 4, Sort.by(Sort.Direction.DESC, "id"));
        Page<Magazine> notices = magazineRepository.findAll(pageable);

        List<MagazineResponse> magazineResponseList = notices.stream()
                .map(notice -> new MagazineResponse(notice.getId(), notice.getTitle(), notice.getContent(),
                        notice.getCreatedDate(),
                        notice.getImageFile().getSavePath()))

                .toList();
        return new PageImpl<>(magazineResponseList, pageable, notices.getTotalElements());
    }

    public MagazineResponse findByID(Long id) {
        Magazine notice = magazineRepository.findById(id).orElseThrow(NotFoundNoticeException::new);
        return new MagazineResponse(
                notice.getId(),
                notice.getTitle(),
                notice.getContent(),
                notice.getCreatedDate(),
                notice.getImageFile().getSavePath());
    }

    @Transactional
    public void createNotice(MagazineRequest req, HttpServletRequest Request) {
        String token = jwtTokenProvider.resolveTokenFromCookie(Request);
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        if (!"ADMIN".equals(member.getRole().getName())) {
            throw new ForbiddenActionException();
        }

        // 이미지파일 생성 (image or imagePath 둘 다 지원!)
        ImageFile imageFile = null;
        if (req.getImage() != null && !req.getImage().isEmpty()) {
            imageFile = imageService.imageUpload(req.getImage());
        } else if (req.getImagePath() != null && !req.getImagePath().isBlank()) {
            imageFile = imageService.getImageByPath(req.getImagePath());
        } else {
            throw new IllegalArgumentException("이미지 정보가 없습니다.");
        }

        Magazine notice = req.toEntity();

        notice.setImageFile(imageFile);

        magazineRepository.save(notice);
    }

    @Transactional
    public void deleteNotice(Long id, HttpServletRequest Request) {
        String token = jwtTokenProvider.resolveTokenFromCookie(Request);
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        if (!"ADMIN".equals(member.getRole().getName())) {
            throw new ForbiddenActionException();
        }

        Magazine notice = magazineRepository.findById(id).orElseThrow(NotFoundNoticeException::new);
        magazineRepository.delete(notice);

    }

    @Transactional
    public void changeMainNotice(Long newMainNoticeId, HttpServletRequest Request) {
        String token = jwtTokenProvider.resolveTokenFromCookie(Request);
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        if (!"ADMIN".equals(member.getRole().getName())) {
            throw new ForbiddenActionException();
        }

        magazineRepository.findByMainNoticeTrue().ifPresent(mainNotice -> {
            mainNotice.cancelNotice();
            magazineRepository.save(mainNotice);
        });
        magazineRepository.findById(newMainNoticeId)
                .map(newMain -> {
                    newMain.changeNotice();
                    return magazineRepository.save(newMain);
                })
                .orElseThrow(NotFoundNoticeException::new);
    }

    public List<MagazineResponse> findAllNotices() {
        List<Magazine> notices = magazineRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        return notices.stream()
                .map(notice -> new MagazineResponse(
                        notice.getId(),
                        notice.getTitle(),
                        notice.getContent(),
                        notice.getCreatedDate(),
                        notice.getImageFile().getSavePath()))
                .toList();
    }

    public List<MagazineResponse> getLatest() {
        List<Magazine> noticeList = magazineRepository.findTop4ByOrderByIdDesc().orElseThrow(NotFoundNoticeException::new);

        return noticeList.stream()
                .map(notice -> new MagazineResponse(
                        notice.getId(),
                        notice.getTitle(),
                        notice.getContent(),
                        notice.getCreatedDate(),
                        notice.getImageFile().getSavePath()))
                .toList();

    }

}
