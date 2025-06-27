package com.example.foominity.dto.board;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class ReviewLatestResponse {
    private Long id;

    private String title;
    
    private String nickname;


    public ReviewLatestResponse(Long id, String title) {
        this.id = id;
        this.title = title;
        this.nickname = "관리자";
    }
}
