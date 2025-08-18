package com.example.foominity.dto.quiz;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PlaybackTokenResponse {
    private String accessToken;
    private Instant expiresAt; // SDK에서 만료 전 재요청 판단용
    private Set<String> scopes; // streaming, user-modify-playback-state 등
}