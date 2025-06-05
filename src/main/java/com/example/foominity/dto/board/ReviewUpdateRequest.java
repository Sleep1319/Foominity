package com.example.foominity.dto.board;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewUpdateRequest {

    @NotNull
    private String title;

    @NotNull
    private String content;

    private float starPoint;
}
