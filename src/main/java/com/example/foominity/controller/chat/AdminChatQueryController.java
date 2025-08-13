package com.example.foominity.controller.chat;

import com.example.foominity.dto.chat.ChatMessageDto;
import com.example.foominity.dto.chat.ChatRoomSummaryResponse;
import com.example.foominity.service.chat.AdminChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/chat")
public class AdminChatQueryController {

    private final AdminChatService adminChatService;

    @GetMapping("/rooms")
    public List<ChatRoomSummaryResponse> getRooms() {
        return adminChatService.getRooms();
    }

    @GetMapping("/rooms/{roomId}/messages")
    public List<ChatMessageDto> getMessages(@PathVariable Long roomId) {
        return adminChatService.getMessages(roomId);
    }
}
