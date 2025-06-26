package com.example.foominity.dto.board;

import java.util.List;

import com.example.foominity.dto.artist.ArtistResponse;
import com.example.foominity.dto.category.ReviewCategoryResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewSimpleResponse {

    private Long id;
    private String title;
    private float averageStarPoint;
    private List<ArtistResponse> artists;
    private List<ReviewCategoryResponse> categories;

    private String imagePath;

    public ReviewSimpleResponse(Long id, String title, float averageStarPoint, String imagePath) {
        this.id = id;
        this.title = title;
        this.averageStarPoint = averageStarPoint;
        this.imagePath = imagePath;
    }

}
