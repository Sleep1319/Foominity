package com.example.foominity.controller.artist;

import com.example.foominity.dto.artist.ArtistRequest;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.foominity.dto.artist.ArtistResponse;
import com.example.foominity.dto.artist.ArtistSimpleResponse;
import com.example.foominity.dto.artist.ArtistUpdateRequest;
import com.example.foominity.dto.board.ReviewSimpleResponse;
import com.example.foominity.dto.category.CategoryResponse;
import com.example.foominity.service.artist.ArtistService;
import com.example.foominity.service.board.ReviewService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@Slf4j
@RequiredArgsConstructor
public class ArtistController {

    private final ArtistService artistService;
    private final ReviewService reviewService;

    @GetMapping("/api/artists")
    public ResponseEntity<?> getArtistList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> categories) {
        Page<ArtistSimpleResponse> res = artistService.getArtistList(page, search, categories);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/api/artists/{id}")
    public ResponseEntity<ArtistResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(artistService.readArtist(id));
    }

    // 특정 아티스트의 앨범 리스트
    @GetMapping("/api/artists/{id}/reviews")
    public ResponseEntity<List<ReviewSimpleResponse>> getReviewsByArtist(@PathVariable Long id) {
        List<ReviewSimpleResponse> res = reviewService.getReviewsByArtist(id);
        return ResponseEntity.ok(res);
    }

    // 생성
    @PostMapping(value = "/api/artists", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createArtist(
            @Valid @ModelAttribute ArtistRequest req,
            HttpServletRequest tokenRequest) {
        artistService.createArtist(req, tokenRequest);
        return ResponseEntity.ok().build();
    }

    // 수정
    @PutMapping(value = "/api/artists/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> updateArtist(
            @PathVariable Long id,
            @Valid @ModelAttribute ArtistUpdateRequest req,
            HttpServletRequest tokenRequest) {
        artistService.updateArtist(id, req, tokenRequest);

        return ResponseEntity.ok().build();
    }

    // 삭제
    @DeleteMapping("/api/artists/{id}")
    public ResponseEntity<Void> deleteArtist(
            @PathVariable Long id,
            HttpServletRequest tokRequest) {
        artistService.deleteArtist(id, tokRequest);
        return ResponseEntity.ok().build();
    }

}
