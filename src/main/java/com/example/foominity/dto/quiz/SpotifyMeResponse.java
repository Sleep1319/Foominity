package com.example.foominity.dto.quiz;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SpotifyMeResponse {
    private String id;
    private String displayName;
    private String product; // premium / free / open 等
    private String country;
}