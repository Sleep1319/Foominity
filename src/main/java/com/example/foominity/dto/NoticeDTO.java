package com.example.foominity.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class NoticeDTO {

    private Long id;

    private String title;

    private String content;

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;
}
