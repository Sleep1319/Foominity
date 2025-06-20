package com.example.foominity.dto.board;

import java.time.LocalDateTime;
import java.util.List;

import com.example.foominity.dto.category.ReviewCategoryResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private String title;
    private String content;
    private Long memberId;
    private String nickname;
    private float starPoint;

    private List<ReviewCategoryResponse> categories;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public ReviewResponse(Long id, String title, String nickname, LocalDateTime createdDate, LocalDateTime updatedDate) {
        this.id = id;
        this.title = title;
        this.nickname = nickname;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }
}
