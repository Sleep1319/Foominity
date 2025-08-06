package com.example.foominity.dto.openai;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArtistRecommendRequest {

    @NotBlank
    private String artist;

    private List<String> category;
    private String tone;
    private String focus;

}
