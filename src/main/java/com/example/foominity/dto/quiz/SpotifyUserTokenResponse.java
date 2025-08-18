package com.example.foominity.dto.quiz;

import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpotifyUserTokenResponse {
    private String accessToken;
    private long expiresAt; // epoch seconds (0이면 미지정)
    private String scope; // 공백으로 join
}
