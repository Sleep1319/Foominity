package com.example.foominity.controller.artist;

import com.example.foominity.dto.artist.ArtistRequest;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.foominity.dto.artist.ArtistResponse;
import com.example.foominity.dto.board.ReviewSimpleResponse;
import com.example.foominity.dto.category.CategoryResponse;
import com.example.foominity.service.artist.ArtistService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@Slf4j
@RequiredArgsConstructor
public class ArtistController {

    private final ArtistService artistService;

    @GetMapping("/api/artists")
    public ResponseEntity<?> getArtistList(@RequestParam(defaultValue = "0") int page) {
        Page<ArtistResponse> res = artistService.getArtistList(page);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/api/artists/{id}")
    public ResponseEntity<ArtistResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(artistService.readArtist(id));
    }

    @PostMapping("/api/artists")
    public ResponseEntity<Void> createArtist(@Valid @RequestBody ArtistRequest req, HttpServletRequest tokenRequest) {
        artistService.createArtist(req, tokenRequest);
        return ResponseEntity.ok().build();
    }

}
