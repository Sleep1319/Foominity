package com.example.foominity.dto.board;

import java.time.LocalDate;
import java.util.List;

import org.springframework.lang.Nullable;
import org.springframework.web.multipart.MultipartFile;

import com.example.foominity.domain.board.Review;
import com.example.foominity.domain.member.Member;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {

    @NotBlank
    private String title;
    private LocalDate released;

    private List<String> tracklist;
    private List<Long> artistIds;
    private List<Long> categoryIds;

    private MultipartFile image;
}