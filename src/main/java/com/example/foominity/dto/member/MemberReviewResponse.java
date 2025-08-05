package com.example.foominity.dto.member;

import java.time.LocalDateTime;
import java.util.List;

import com.example.foominity.dto.artist.ArtistSimpleResponse;
import com.example.foominity.dto.category.ReviewCategoryResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberReviewResponse {
    private Long id;
    private String title;
    private String imagePath;
    private float averageStarPoint;
    private float userStarPoint;
    private List<ArtistSimpleResponse> artists;
    private List<ReviewCategoryResponse> categories;
    private LocalDateTime createdDate;

    // createdDate 없는 생성자 추가 (좋아요 앨범 전용)
    public MemberReviewResponse(
            Long id,
            String title,
            String imagePath,
            float averageStarPoint,
            float userStarPoint,
            List<ArtistSimpleResponse> artists,
            List<ReviewCategoryResponse> categories) {
        this.id = id;
        this.title = title;
        this.imagePath = imagePath;
        this.averageStarPoint = averageStarPoint;
        this.userStarPoint = userStarPoint;
        this.artists = artists;
        this.categories = categories;
        this.createdDate = null; // 좋아요는 참여일 없음
    }
}
