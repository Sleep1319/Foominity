package com.example.foominity.dto.notice;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoticeResponse {

    @NotNull
    private Long id;

    @NotNull
    private String title;

    @NotNull
    private String content;
}
