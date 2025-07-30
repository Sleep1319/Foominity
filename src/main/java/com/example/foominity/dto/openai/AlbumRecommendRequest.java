package com.example.foominity.dto.openai;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlbumRecommendRequest {

    @NotBlank
    private String album; // 앨범명

    private List<String> artist; // 아티스트

    private List<String> category; // 카테고리
    private String tone; // 톤앤매너
    private String focus; // 특징
}
