package com.example.foominity.dto.notice;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
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

    public NoticeResponse(Long id, String title) {
        this.id = id;
        this.title = title;
    }
}
