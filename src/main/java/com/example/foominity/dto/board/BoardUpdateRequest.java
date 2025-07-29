package com.example.foominity.dto.board;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BoardUpdateRequest {

    @NotNull
    private String title;

    @NotNull
    private String content;

    @NotNull
    private String category;

    public class ReviewUpdateRequest {
        private String title;
        private String content;
        private String category;
        private Float starPoint;
        private List<Long> categoryIds;
    }
}
