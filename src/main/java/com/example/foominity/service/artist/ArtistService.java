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
import com.example.foominity.domain.member.Member;
import com.example.foominity.dto.artist.AritstRequest;
import com.example.foominity.dto.artist.ArtistResponse;
import com.example.foominity.dto.artist.ArtistUpdateRequest;
import com.example.foominity.dto.category.ArtistCategoryResponse;
import com.example.foominity.exception.NotFoundArtistException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.UnauthorizedException;
import com.example.foominity.repository.artist.ArtistRepository;
import com.example.foominity.repository.category.ArtistCategoryRepository;
import com.example.foominity.repository.category.CategoryRepository;
import com.example.foominity.repository.member.MemberRepository;
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

    // 아티스트 전체 조회
    public Page<ArtistResponse> getArtistList(int page) {
        PageRequest pageable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "id"));
        Page<Artist> artists = artistRepository.findAll(pageable);

        List<ArtistResponse> artistResponsesList = artists.stream().map(artist -> {
            // List<ArtistCategory> artistCategories =
            // artistCategoryRepository.findByArtistId(artist.getId());

            // List<ArtistCategoryResponse> categoryResponses = artistCategories.stream()
            // .map(ar -> new ArtistCategoryResponse(
            // ar.getCategory().getId(),
            // ar.getCategory().getCategoryName()))
            // .toList();

            return new ArtistResponse(
                    artist.getId(),
                    artist.getName());

        })
                .toList();

        return new PageImpl<>(artistResponsesList, pageable, artists.getTotalElements());

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

        return new ArtistResponse(
                artist.getId(),
                artist.getName(),
                artist.getBorn(),
                artist.getNationality(),
                categoryResponses);

    }

    // 아티스트 생성
    @Transactional
    public void createArtist(AritstRequest req, HttpServletRequest tokenRequest) {
        String token = jwtTokenProvider.resolveTokenFromCookie(tokenRequest);

        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        AuthUtil.validateAdmin(member);

        Artist artist = new Artist(
                req.getName(),
                req.getBorn(),
                req.getNationality());

        artist = artistRepository.save(artist);

        List<Category> categories = categoryRepository.findAllById(req.getCategoryIds());
        for (Category category : categories) {
            artistCategoryRepository.save(new ArtistCategory(artist, category));
        }

    }

    // 아티스트 수정
    @Transactional
    public void updateArtist(Long artistId, ArtistUpdateRequest req, HttpServletRequest tokenRequest) {
        Member member = getAdminMember(tokenRequest);

        Artist artist = artistRepository.findById(artistId).orElseThrow(NotFoundArtistException::new);
        artist.update(req.getName());

        artistCategoryRepository.deleteByArtistId(artistId);

        List<Category> categories = categoryRepository.findAllById(req.getCategoryIds());
        for (Category category : categories) {
            artistCategoryRepository.save(new ArtistCategory(artist, category));
        }

    }

    // 아티스트 삭제
    @Transactional
    public void deleteArtist(Long artistId, HttpServletRequest tokenRequest) {
        Member member = getAdminMember(tokenRequest);

        Artist artist = artistRepository.findById(artistId).orElseThrow(NotFoundArtistException::new);

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
