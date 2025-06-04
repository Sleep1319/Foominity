package com.example.foominity.dto.comment;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardCommentRequest {

    @NotBlank
    private String comment;

    // 게시글 정보를 포함할 경우
    // @NotBlank
    // private Long boardId;

}
