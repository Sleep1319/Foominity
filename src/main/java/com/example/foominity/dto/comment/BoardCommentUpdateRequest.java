package com.example.foominity.dto.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardCommentUpdateRequest {

    @NotNull
    private Long boardCommentId;

    @NotBlank
    private String comment;
}
