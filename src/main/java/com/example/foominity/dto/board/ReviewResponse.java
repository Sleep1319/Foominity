package com.example.foominity.dto.board;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.example.foominity.dto.artist.ArtistResponse;
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
    private LocalDate released;

    private List<String> tracklist;
    private List<ArtistResponse> artists;
    private List<ReviewCategoryResponse> categories;

    private float averageStarPoint;

    private String imagePath;

    public ReviewResponse(Long id, String title, LocalDate released, List<String> tracklist, float averageStarPoint,
            String imagePath) {
        this.id = id;
        this.title = title;
        this.released = released;
        this.tracklist = tracklist;
        this.averageStarPoint = averageStarPoint;
        this.imagePath = imagePath;
    }


}
