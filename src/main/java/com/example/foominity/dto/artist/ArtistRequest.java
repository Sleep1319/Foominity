package com.example.foominity.dto.artist;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArtistRequest {

    @NotBlank
    private String name;

    private List<Long> categoryIds;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate born;

    private String nationality;

    private MultipartFile image;

}
