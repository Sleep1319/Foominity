package com.example.foominity.dto.chatbot;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    /**
     * 사용자가 입력한 텍스트
     */
    private String message;

    /**
     * 호출 모드 ("freechat", "recommend", "diagnosis", "translate" 중 하나)
     */
    private String mode;
}
