package com.example.foominity.controller.rapidapi;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.foominity.service.rapidapi.LyricsService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class LyricsController {

    private final LyricsService lyricsService;

    @GetMapping("/lyrics")
    public ResponseEntity<String> lyrics(@RequestParam("t") String title,
                                         @RequestParam("a") String artist) {
        // 서비스가 반환한 상태/본문 그대로 리턴
        return lyricsService.getLyrics(title, artist);
    }
}
