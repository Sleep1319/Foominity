package com.example.foominity.controller.chat;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.dto.chat.ChatRoomRequest;
import com.example.foominity.service.chat.ChatRoomService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ChatRoomController {

    private final JwtTokenProvider jwtTokenProvider;
    private final ChatRoomService chatRoomService;

    @PostMapping("/api/chat-room")
    public ResponseEntity<Map<String, Long>> createRoom(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveTokenFromCookie(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Long roomId = chatRoomService.createOrFindRoom(memberId);

        Map<String, Long> response = new HashMap<>();
        response.put("roomId", roomId);
        return ResponseEntity.ok(response);
    }
}
