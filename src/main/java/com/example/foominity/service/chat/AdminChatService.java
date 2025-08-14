package com.example.foominity.service.chat;

import com.example.foominity.domain.chat.ChatMessage;
import com.example.foominity.domain.chat.ChatRoom;
import com.example.foominity.domain.member.Member;
import com.example.foominity.dto.chat.ChatMessageDto;
import com.example.foominity.dto.chat.ChatRoomSummaryResponse;
import com.example.foominity.repository.chat.ChatMessageRepository;
import com.example.foominity.repository.chat.ChatRoomRepository;
import com.example.foominity.repository.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final MemberRepository memberRepository;

    public List<ChatRoomSummaryResponse> getRooms() {
        return chatRoomRepository.findAll().stream().map(r -> {
            ChatMessage last = chatMessageRepository
                    .findTopByRoomIdOrderByCreatedAtDesc(r.getId()).orElse(null);
            Member member = memberRepository.findById(r.getMemberId()).orElseThrow();
            return new ChatRoomSummaryResponse(
                    r.getId(),
                    r.getMemberId(),
                    member.getNickname(),
                    last != null ? last.getMessage() : "",
                    last != null ? last.getCreatedAt() : null
            );
        }).toList();
    }

    public List<ChatMessageDto> getMessages(Long roomId) {
        return chatMessageRepository.findByRoomIdOrderByCreatedAtAsc(roomId)
                .stream()
                .map(m -> new ChatMessageDto(
                        m.getRoomId(),
                        m.getMemberId(),     // senderId
                        memberRepository.findById(m.getMemberId()).orElseThrow().getNickname(),
                        m.getMessage(),
                        m.getCreatedAt()
                ))
                .toList();
    }
}
