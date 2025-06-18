package com.example.foominity.dto.board;

import java.util.List;

import org.springframework.lang.Nullable;

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

    @NotBlank
    private String content;

    private List<Long> categoryIds;

    @NotNull
    private float starPoint;

}