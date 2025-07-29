package com.example.foominity.dto.artist;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.example.foominity.dto.category.ArtistCategoryResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArtistResponse {
    private Long id;
    private String name;
    private LocalDate born;
    private String nationality;
    private List<ArtistCategoryResponse> categories;
    private String imagePath;

    public ArtistResponse(Long id, String name, LocalDate born, String nationality, String imagePath) {
        this.id = id;
        this.name = name;
        this.born = born;
        this.nationality = nationality;
        this.imagePath = imagePath;
    }

}
