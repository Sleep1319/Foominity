package com.example.foominity.domain.chat;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chat_room")
@NoArgsConstructor
@Getter
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id", nullable = false, unique = true)
    private Long memberId;

    public ChatRoom(Long memberId) {
        this.memberId = memberId;
    }

    public static ChatRoom of(Long memberId) {
        return new ChatRoom(memberId);
    }
}
