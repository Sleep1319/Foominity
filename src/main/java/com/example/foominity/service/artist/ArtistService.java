package com.example.foominity.service.artist;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.artist.Artist;
import com.example.foominity.domain.category.ArtistCategory;
import com.example.foominity.domain.category.Category;
import com.example.foominity.domain.image.ImageFile;
import com.example.foominity.domain.member.Member;
import com.example.foominity.dto.artist.ArtistRequest;
import com.example.foominity.dto.artist.ArtistResponse;
import com.example.foominity.dto.artist.ArtistSimpleResponse;
import com.example.foominity.dto.artist.ArtistUpdateRequest;
import com.example.foominity.dto.category.ArtistCategoryResponse;
import com.example.foominity.exception.NotFoundArtistException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.UnauthorizedException;
import com.example.foominity.repository.artist.ArtistRepository;
import com.example.foominity.repository.category.ArtistCategoryRepository;
import com.example.foominity.repository.category.CategoryRepository;
import com.example.foominity.repository.image.ImageRepository;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.service.image.ImageService;
import com.example.foominity.util.AuthUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ArtistService {

    private final ArtistRepository artistRepository;
    private final CategoryRepository categoryRepository;
    private final ArtistCategoryRepository artistCategoryRepository;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    private final ImageRepository imageRepository;
    private final ImageService imageService;

    // 아티스트 전체 조회
    public Page<ArtistSimpleResponse> getArtistList(int page) {
        PageRequest pageable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "id"));
        Page<Artist> artists = artistRepository.findAll(pageable);

        List<ArtistSimpleResponse> artistSimpleResponsesList = artists.stream()
                .map(artist -> {
                    List<ArtistCategory> artistCategories = artistCategoryRepository
                            .findByArtistId(artist.getId());

                    List<ArtistCategoryResponse> categoryResponses = artistCategories.stream()
                            .map(ar -> new ArtistCategoryResponse(
                                    ar.getCategory().getId(),
                                    ar.getCategory().getCategoryName()))
                            .toList();

                    ImageFile imageFile = artist.getImageFile();
                    String imagePath = (imageFile != null) ? imageFile.getSavePath() : null;

                    return new ArtistSimpleResponse(
                            artist.getId(),
                            artist.getName(),
                            imagePath);
                })
                .toList();

        return new PageImpl<>(artistSimpleResponsesList, pageable, artists.getTotalElements());

    }

    // 아티스트 조회
    public ArtistResponse readArtist(Long id) {
        Artist artist = artistRepository.findById(id).orElseThrow(NotFoundArtistException::new);

        List<ArtistCategory> artistCategory = artistCategoryRepository.findByArtistId(artist.getId());

        List<ArtistCategoryResponse> categoryResponses = artistCategory.stream()
                .map(ac -> new ArtistCategoryResponse(
                        ac.getCategory().getId(),
                        ac.getCategory().getCategoryName()))
                .toList();

        ImageFile imageFile = artist.getImageFile();
        String imagePath = (imageFile != null) ? imageFile.getSavePath() : null;

        return new ArtistResponse(
                artist.getId(),
                artist.getName(),
                artist.getBorn(),
                artist.getNationality(),
                categoryResponses,
                imagePath);

    }

    // 아티스트 생성
    @Transactional
    public void createArtist(ArtistRequest req, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        AuthUtil.validateAdmin(member);

        ImageFile imageFile = null;
        if (req.getImage() != null && !req.getImage().isEmpty()) {
            imageFile = imageService.imageUpload(req.getImage());
        } else {
            throw new IllegalArgumentException();
        }

        // 아티스트 생성
        Artist artist = new Artist(
                req.getName(),
                req.getBorn(),
                req.getNationality(),
                imageFile);

        // 아티스트 저장
        artist = artistRepository.save(artist);

        // 카테고리 저장
        List<Category> categories = categoryRepository.findAllById(req.getCategoryIds());
        for (Category category : categories) {
            artistCategoryRepository.save(new ArtistCategory(artist, category));
        }

    }

    // 아티스트 수정
    @Transactional
    public void updateArtist(Long artistId, ArtistUpdateRequest req, HttpServletRequest tokenRequest) {
        Member member = getAdminMember(tokenRequest);
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(NotFoundArtistException::new);

        ImageFile imageFile = artist.getImageFile();

        // 이미지 변경 시에만 처리
        if (req.getImage() != null && !req.getImage().isEmpty()) {
            if (imageFile != null) {
                imageService.deleteImageFile(imageFile);
            }
            imageFile = imageService.imageUpload(req.getImage());
        }

        // 이름과 이미지 업데이트
        artist.update(req.getName(), req.getBorn(), req.getNationality(), imageFile);

        // 카테고리 재설정
        artistCategoryRepository.deleteByArtistId(artistId);
        List<Category> categories = categoryRepository.findAllById(req.getCategoryIds());
        for (Category category : categories) {
            artistCategoryRepository.save(new ArtistCategory(artist, category));
        }

        // 추가 필드가 있다면 여기에 적용
        // artist.setBorn(req.getBorn());
        // artist.setNationality(req.getNationality());
    }

    // 아티스트 삭제
    @Transactional
    public void deleteArtist(Long artistId, HttpServletRequest tokenRequest) {
        Member member = getAdminMember(tokenRequest);

        Artist artist = artistRepository.findById(artistId).orElseThrow(NotFoundArtistException::new);

        ImageFile imageFile = artist.getImageFile();

        imageService.deleteImageFile(imageFile);
        artistCategoryRepository.deleteByArtistId(artistId);
        artistRepository.delete(artist);
    }

    // 관리자 검증 메서드
    private Member getAdminMember(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveTokenFromCookie(request);
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId)
                .orElseThrow(NotFoundMemberException::new);

        AuthUtil.validateAdmin(member);
        return member;
    }
}
