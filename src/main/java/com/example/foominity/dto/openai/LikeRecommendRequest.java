package com.example.foominity.dto.openai;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikeRecommendRequest {

    private List<String> reviewAlbum;

    private List<String> likeAlbum;

    private String tone;

    private String focus;

    private List<String> category;
}
