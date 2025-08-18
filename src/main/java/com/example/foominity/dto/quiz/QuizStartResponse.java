package com.example.foominity.dto.quiz;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizStartResponse {
    private String roundId; // 라운드 식별자
    private String trackUri; // "spotify:track:..." 형태
    private int durationSeconds; // 라운드 제한시간(초)
    private int hintAfterSeconds; // 힌트 가능 시점(초)
}
