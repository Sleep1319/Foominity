package com.example.foominity.dto.quiz;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAnswerResponse {
    private String roundId;
    private String correctTitle;
    private String correctArtist;
    private boolean correct;
    private boolean timeout;

}
