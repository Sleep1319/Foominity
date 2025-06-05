package com.example.foominity.dto.notice;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoticeResponse {

    private Long id;

    private String title;

    private String content;
}
