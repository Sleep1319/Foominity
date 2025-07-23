package com.example.foominity.dto.artist;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArtistSimpleResponse {

    private Long id;
    private String name;
    private String imagePath;

    public ArtistSimpleResponse(Long id, String name) {
        this.id = id;
        this.name = name;
    }

}
