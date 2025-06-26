package com.example.foominity.dto.board;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.foominity.dto.category.ReviewCategoryResponse;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewUpdateRequest {

    @NotBlank
    private String title;
    private LocalDate released;

    private List<String> tracklist;
    private List<Long> artistIds;
    private List<Long> categoryIds;

    private MultipartFile image;
}
