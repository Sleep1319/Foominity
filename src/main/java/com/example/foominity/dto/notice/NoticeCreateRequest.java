package com.example.foominity.dto.notice;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoticeCreateRequest {

    @NotNull
    private String title;

    @NotNull
    private String content;
}
