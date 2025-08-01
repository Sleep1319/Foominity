package com.example.foominity.controller.member;

import com.example.foominity.dto.chatbot.ChatRequest;
import com.example.foominity.dto.chatbot.ChatResponse;
import com.example.foominity.service.member.ChatService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatbotController {

    private final ChatService chatService;

    public ChatbotController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest req) {
        String reply = chatService.chat(req.getMessage(), req.getMode());
        return new ChatResponse(reply);
    }
}
