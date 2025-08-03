package com.example.foominity.controller.member;

import com.example.foominity.dto.chatbot.ChatRequest;
import com.example.foominity.dto.chatbot.ChatResponse;
import com.example.foominity.service.member.ChatService;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;
import java.util.stream.IntStream;

@RestController
@RequestMapping("/api/chat")
public class ChatbotController {

    private final ChatService chatService;

    public ChatbotController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest req) {
        String aiReply;

        if ("recommend".equals(req.getMode())) {
            // 1) 장르 리스트 문자열화
            String genres = String.join(", ", req.getPreferredGenres());
            // 2) MBTI 답변을 "1:A,2:B,…" 형태로 변환
            String answers = IntStream.range(0, req.getMbtiAnswers().size())
                .mapToObj(i -> (i + 1) + ":" + req.getMbtiAnswers().get(i))
                .collect(Collectors.joining(", "));
            // 3) 시스템 프롬프트 조합
            String systemPrompt = ""
                + "당신은 음악 추천 전문가입니다.\n"
                + "사용자가 좋아하는 장르는 [" + genres + "]이고, "
                + "설문 응답은 [" + answers + "] 입니다.\n"
                + "이 정보를 바탕으로 10곡으로 구성된 플레이리스트를 추천해주세요.";

            // 4) AI 호출 (mode는 "recommend" 유지)
            aiReply = chatService.chat(systemPrompt, "recommend");

        } else {
            // diagnosis, translate, freechat 등 기존 모드 처리
            aiReply = chatService.chat(req.getMessage(), req.getMode());
        }

        return new ChatResponse(aiReply);
    }
}
