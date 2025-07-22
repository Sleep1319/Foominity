package com.example.foominity.dto.member;

import java.util.List;

import com.example.foominity.dto.artist.ArtistResponse;
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
    private List<ArtistResponse> artists;
    private List<ReviewCategoryResponse> categories;
}
