import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Box, Flex, VStack, HStack, Button, Input, Text, Badge, Divider, Spinner,
} from "@chakra-ui/react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";

export default function AdminChatPage() {
    const [rooms, setRooms] = useState([]);              // [{roomId, memberId, lastMessage, lastAt}]
    const [activeRoomId, setActiveRoomId] = useState(null);
    const [msgInput, setMsgInput] = useState("");
    const [messages, setMessages] = useState([]);        // [{roomId, senderId, senderNickname, message, createdAt}]
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const bottomRef = useRef(null);

    // STOMP
    const clientRef = useRef(null);
    const inboxSubRef = useRef(null);
    const roomSubRef  = useRef(null);

    const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    // 1) 방 목록 로드
    const loadRooms = async () => {
        const { data } = await axios.get("/api/admin/chat/rooms", { withCredentials: true });
        setRooms(data || []);
    };

    // 2) 특정 방 메시지 로드
    const loadMessages = async (roomId) => {
        setLoadingMsgs(true);
        try {
            const { data } = await axios.get(`/api/admin/chat/rooms/${roomId}/messages`, { withCredentials: true });
            setMessages(data || []);
            setTimeout(scrollToBottom, 0);
        } finally {
            setLoadingMsgs(false);
        }
    };

    // 3) STOMP 연결
    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const { data } = await axios.get("/api/ws-token", { withCredentials: true });
                const wsToken = data.token;

                const socket = new SockJS("http://localhost:8084/ws");
                const client = new Client({
                    webSocketFactory: () => socket,
                    reconnectDelay: 5000,
                    connectHeaders: { Authorization: `Bearer ${wsToken}` },
                    debug: () => {},
                    onConnect: () => {
                        if (!mounted) return;

                        // a) 관리자 인박스 구독 → 새 문의/새 메시지 알림
                        if (inboxSubRef.current) {
                            try { inboxSubRef.current.unsubscribe(); } catch {}
                            inboxSubRef.current = null;
                        }
                        inboxSubRef.current = client.subscribe("/topic/admin/inbox", (frame) => {
                            const evt = JSON.parse(frame.body);  // { roomId, preview, from, createdAt }
                            // 목록 새로 고침 + UX
                            loadRooms();
                            // 선택된 방이 아니면 배지 표현을 위해 lastMessage만 업데이트
                            setRooms(prev => {
                                const idx = prev.findIndex(r => r.roomId === evt.roomId);
                                if (idx === -1) return prev;
                                const next = [...prev];
                                next[idx] = { ...next[idx], lastMessage: evt.preview, lastAt: evt.createdAt };
                                return next;
                            });
                        });

                        // 선택된 방 구독은 아래 별도 effect에서 처리 (activeRoomId 의존)
                    },
                });

                clientRef.current = client;
                client.activate();
            } catch (e) {
                console.error("[Admin STOMP] bootstrap failed:", e);
            }
        })();

        return () => {
            mounted = false;
            // 구독 해제
            if (inboxSubRef.current) {
                try { inboxSubRef.current.unsubscribe(); } catch {}
                inboxSubRef.current = null;
            }
            if (roomSubRef.current) {
                try { roomSubRef.current.unsubscribe(); } catch {}
                roomSubRef.current = null;
            }
            // 연결 해제
            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }
        };
    }, []);

    // 4) activeRoomId 변경 시: 메시지 로드 + 룸 토픽 재구독
    useEffect(() => {
        if (!activeRoomId || !clientRef.current || !clientRef.current.connected) {
            return;
        }

        loadMessages(activeRoomId);

        // 이전 방 구독 해제
        if (roomSubRef.current) {
            try { roomSubRef.current.unsubscribe(); } catch {}
            roomSubRef.current = null;
        }
        // 새 방 구독
        roomSubRef.current = clientRef.current.subscribe(`/topic/chat/${activeRoomId}`, (frame) => {
            const msg = JSON.parse(frame.body);
            setMessages(prev => [...prev, msg]);
            setTimeout(scrollToBottom, 0);
        });

        // cleanup은 다음 activeRoomId 변경 때 수행
    }, [activeRoomId, clientRef.current?.connected]);

    // 최초 방 목록 로드
    useEffect(() => { loadRooms(); }, []);

    const send = () => {
        const text = msgInput.trim();
        if (!text || !activeRoomId || !clientRef.current?.connected) return;
        clientRef.current.publish({
            destination: "/app/chat.sendMessage",
            body: JSON.stringify({ roomId: activeRoomId, message: text }),
        });
        setMsgInput("");
    };

    return (
        <Flex gap={4} p={4}>
            {/* 좌측: 방 목록 */}
            <VStack align="stretch" w="340px" border="1px solid #e2e8f0" p={3} rounded="md" spacing={2}>
                <HStack justify="space-between">
                    <Text fontWeight="bold">문의 목록</Text>
                    <Button size="xs" onClick={loadRooms}>새로고침</Button>
                </HStack>
                <Divider />
                <VStack align="stretch" spacing={1} maxH="75vh" overflowY="auto">
                    {rooms.length === 0 && <Text color="gray.500">아직 방이 없습니다.</Text>}
                    {rooms.map(r => (
                        <HStack
                            key={r.roomId}
                            p={2}
                            rounded="md"
                            border={activeRoomId === r.roomId ? "2px solid #319795" : "1px solid #e2e8f0"}
                            cursor="pointer"
                            _hover={{ bg: "gray.50" }}
                            onClick={() => setActiveRoomId(r.roomId)}
                        >
                            <Box flex="1">
                                <Text fontSize="sm" noOfLines={1}>
                                    #{r.roomId} • member:{r.memberId}
                                </Text>
                                <Text fontSize="xs" color="gray.600" noOfLines={1}>
                                    {r.lastMessage || "(메시지 없음)"}
                                </Text>
                            </Box>
                            {/* 간단 배지: 최근 메시지 유무 등 표시 */}
                            <Badge colorScheme={activeRoomId === r.roomId ? "teal" : "gray"}>OPEN</Badge>
                        </HStack>
                    ))}
                </VStack>
            </VStack>

            {/* 우측: 대화창 */}
            <VStack flex="1" align="stretch" border="1px solid #e2e8f0" p={3} rounded="md" spacing={3}>
                <HStack justify="space-between">
                    <Text fontWeight="bold">방 #{activeRoomId ?? "-"}</Text>
                </HStack>
                <Divider />
                <Box flex="1" minH="60vh" maxH="75vh" overflowY="auto" p={2} bg="gray.50" rounded="md">
                    {loadingMsgs ? (
                        <Spinner />
                    ) : messages.length === 0 ? (
                        <Text color="gray.500">메시지가 없습니다.</Text>
                    ) : (
                        messages.map((m, idx) => (
                            <Box
                                key={idx}
                                maxW="75%"
                                p={2}
                                mb={2}
                                bg="white"
                                rounded="md"
                                border="1px solid #e2e8f0"
                            >
                                <Text fontSize="xs" color="gray.600" mb={1}>
                                    {m.senderNickname ?? `member:${m.senderId}`} • {m.createdAt?.replace("T"," ").slice(0,16)}
                                </Text>
                                <Text fontSize="sm">{m.message}</Text>
                            </Box>
                        ))
                    )}
                    <div ref={bottomRef} />
                </Box>
                <HStack>
                    <Input
                        placeholder={activeRoomId ? "메시지 입력..." : "먼저 방을 선택하세요"}
                        value={msgInput}
                        onChange={(e) => setMsgInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && send()}
                        isDisabled={!activeRoomId}
                    />
                    <Button colorScheme="teal" onClick={send} isDisabled={!activeRoomId}>
                        전송
                    </Button>
                </HStack>
            </VStack>
        </Flex>
    );
}
