package com.example.foominity.dto.comment;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCommentResponse {

    private Long id;

    private String nickname;

    private String comment;

    private LocalDateTime createDate;
    private LocalDateTime updateDate;
}
