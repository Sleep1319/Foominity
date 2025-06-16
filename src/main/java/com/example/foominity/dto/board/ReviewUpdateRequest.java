package com.example.foominity.dto.board;

import java.util.List;

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

    // List? String?
    private List<Long> category;

}
