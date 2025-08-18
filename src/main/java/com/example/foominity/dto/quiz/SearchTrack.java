package com.example.foominity.dto.quiz;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchTrack {
    private String id; // "6rqhFgbbKwnb9MLmUQDhG6"
    private String title; // track name
    private List<String> artists; // ["Artist A", "Artist B"]
    private String uri; // "spotify:track:6rqhFgbbKwnb9MLmUQDhG6"
    private String imageUrl; // (선택) 앨범아트
}
