package com.example.foominity.dto.chatbot;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    /**
     * AI가 생성한 답변 메시지
     */
    private String reply;
}
