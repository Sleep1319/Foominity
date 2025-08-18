package com.example.foominity.dto.quiz;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class QuizHintResponse {
    private String artist; // 힌트로 전달할 아티스트명
}
