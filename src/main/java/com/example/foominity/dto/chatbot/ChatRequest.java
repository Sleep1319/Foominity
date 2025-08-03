package com.example.foominity.dto.chatbot;


import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ChatRequest {
    /** freechat, diagnosis, translate 모드에서 쓸 일반 메시지 */
    private String message;
    /** "recommend", "diagnosis", "translate", "freechat" 중 하나 */
    private String mode;
    /** → 이 필드를 추가하세요! recommend 모드 전용: ["Hip-Hop","R&B"] 등 */
    private List<String> preferredGenres;
    /** → 이 필드를 추가하세요! recommend 모드 전용: ["A","B","A","B","A","B"] 등 */
    private List<String> mbtiAnswers;
}
