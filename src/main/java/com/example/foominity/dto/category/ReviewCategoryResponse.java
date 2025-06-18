package com.example.foominity.dto.category;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCategoryResponse {

    private Long categoryId;
    private String categoryName;

}
