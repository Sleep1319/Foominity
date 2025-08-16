import { Box, Text } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";

const fmt = (iso) => (iso ? iso.replace("T", " ").slice(0, 16) : "");

export default function ChatMessageList({
                                            messages = [],
                                            me = { id: null, nickname: "" },   // ✅ admin에선 관리자 id/닉네임, user에선 사용자 id/닉네임
                                            emptyText = "메시지가 없습니다.",
                                            maxBubbleWidth = "80%",
                                            containerProps = {},
                                        }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        const id = requestAnimationFrame(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        });
        return () => cancelAnimationFrame(id);
    }, [messages]);

    return (
        <Box
            h="300px"
            overflowY="auto"
            p={2}
            bg="gray.50"
            rounded="md"
            display="flex"             // ✅ 세로 스택
            flexDirection="column"
            gap={2}
            {...containerProps}
        >
            {messages.length === 0 ? (
                <Text color="gray.500">{emptyText}</Text>
            ) : (
                messages.map((m, i) => {
                    // ✅ “내 메시지” 판정 (숫자 비교 안전)
                    const mine =
                        me?.id != null && Number(m.senderId) === Number(me.id);

                    const name =
                        m.senderNickname ?? (mine ? (me.nickname || "나") : `member:${m.senderId}`);

                    return (
                        <ChatBubble
                            key={i}
                            mine={mine}
                            name={name}
                            time={fmt(m.createdAt)}
                            maxW={maxBubbleWidth}
                        >
                            {m.message}
                        </ChatBubble>
                    );
                })
            )}
            <div ref={bottomRef} />
        </Box>
    );
}