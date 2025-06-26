package com.example.foominity.controller.artist;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.dto.artist.ArtistResponse;
import com.example.foominity.dto.board.ReviewSimpleResponse;
import com.example.foominity.dto.category.CategoryResponse;
import com.example.foominity.service.artist.ArtistService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

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

}
