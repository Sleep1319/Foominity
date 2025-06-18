package com.example.foominity.dto.board;

import java.util.List;

import com.example.foominity.dto.category.ReviewCategoryResponse;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewUpdateRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    private List<Long> categoryIds;

    private float starPoint;

}
