package com.example.foominity.dto.artist;

import java.util.List;

import com.example.foominity.dto.category.ArtistCategoryResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArtistSimpleResponse {

    private Long id;
    private String name;
    private List<ArtistCategoryResponse> categories;
    private String imagePath;

    public ArtistSimpleResponse(Long id, String name) {
        this.id = id;
        this.name = name;
        // this.imagePath = imagePath;
    }

    public ArtistSimpleResponse(Long id, String name, String imagePath) {
        this.id = id;
        this.name = name;
        this.imagePath = imagePath;
    }
}
