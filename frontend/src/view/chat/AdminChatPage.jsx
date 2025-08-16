import React, { useEffect, useRef, useState } from "react";
import {
    Box, Flex, VStack, HStack, Button, Input, Text, Badge, Divider, Spinner,
} from "@chakra-ui/react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { useSelector } from "react-redux";
// ✅ 메시지/버블 공용 컴포넌트 사용
import ChatMessageList from "@/components/chatComponents/ChatMessageList.jsx";

export default function AdminChatPage() {
    const [rooms, setRooms] = useState([]);            // [{roomId, memberId, memberNickname, lastMessage, lastMessageAt}]
    const [activeRoomId, setActiveRoomId] = useState(null);

    const [messages, setMessages] = useState([]);      // [{roomId, senderId, senderNickname, senderRole?, message, createdAt}]
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const clientRef = useRef(null);
    const inboxSubRef = useRef(null);
    const roomSubRef = useRef(null);

    const [msgInput, setMsgInput] = useState("");

    // ✅ Redux의 로그인 사용자 정보만 사용
    const me = useSelector((s) => ({
        id: s.user.id,                         // number | null
        nickname: s.user.nickname || "관리자",
        role: (s.user.role || "ADMIN").toUpperCase(),
    }));

    // 방 목록
    const loadRooms = async () => {
        try {
            const { data } = await axios.get("/api/admin/chat/rooms", { withCredentials: true });
            setRooms(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("[rooms] fail", e?.response?.status, e?.response?.data);
            setRooms([]);
        }
    };

    // 히스토리
    const loadMessages = async (roomId) => {
        setLoadingMsgs(true);
        try {
            const { data } = await axios.get(`/api/admin/chat/rooms/${roomId}/messages`, { withCredentials: true });
            setMessages(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("[msgs] fail", e?.response?.status, e?.response?.data);
            setMessages([]);
        } finally {
            setLoadingMsgs(false);
        }
    };

    // STOMP 연결(1회)
    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const { data } = await axios.get("/api/ws-token", { withCredentials: true });
                const wsToken = data.token;

                const socket = new SockJS(`http://localhost:8084/ws?token=${wsToken}`);
                const client = new Client({
                    webSocketFactory: () => socket,
                    reconnectDelay: 4000,
                    connectHeaders: { Authorization: `Bearer ${wsToken}` },
                    debug: () => {},
                    onConnect: () => {
                        if (!mounted) return;
                        setIsConnected(true);

                        // 관리자 인박스 구독
                        try { inboxSubRef.current?.unsubscribe(); } catch {}
                        inboxSubRef.current = client.subscribe("/topic/admin/inbox", (frame) => {
                            const evt = JSON.parse(frame.body); // { roomId, preview, from, createdAt }
                            setRooms((prev) => {
                                const idx = prev.findIndex((r) => r.roomId === evt.roomId);
                                if (idx === -1) return prev;
                                const next = [...prev];
                                next[idx] = { ...next[idx], lastMessage: evt.preview, lastMessageAt: evt.createdAt };
                                return next;
                            });
                            if (!rooms?.length) loadRooms();
                        });

                        // 이미 방 선택돼 있으면 즉시 구독
                        if (activeRoomId) {
                            loadMessages(activeRoomId);
                            try { roomSubRef.current?.unsubscribe(); } catch {}
                            roomSubRef.current = client.subscribe(`/topic/chat/${activeRoomId}`, (f) => {
                                setMessages((prev) => [...prev, JSON.parse(f.body)]);
                            });
                        }
                    },
                    onWebSocketClose: () => setIsConnected(false),
                });

                clientRef.current = client;
                client.activate();
            } catch (e) {
                console.error("[Admin STOMP] bootstrap failed:", e);
            }
        })();

        return () => {
            mounted = false;
            try { inboxSubRef.current?.unsubscribe(); } catch {}
            try { roomSubRef.current?.unsubscribe(); } catch {}
            inboxSubRef.current = null;
            roomSubRef.current = null;
            clientRef.current?.deactivate();
            clientRef.current = null;
        };
    }, []); // once

    // 방 변경 시: 히스토리 로드 + 토픽 재구독
    useEffect(() => {
        if (!activeRoomId || !isConnected || !clientRef.current?.connected) return;

        loadMessages(activeRoomId);

        try { roomSubRef.current?.unsubscribe(); } catch {}
        roomSubRef.current = clientRef.current.subscribe(`/topic/chat/${activeRoomId}`, (frame) => {
            setMessages((prev) => [...prev, JSON.parse(frame.body)]);
        });
    }, [activeRoomId, isConnected]);

    // 최초 목록
    useEffect(() => {
        loadRooms();
    }, []);

    // 전송 (서버 echo만 화면 반영)
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
        <Flex gap={4} p={4} mt={100}>
            {/* 좌측: 방 목록 */}
            <VStack align="stretch" w="340px" border="1px solid #e2e8f0" p={3} rounded="md" spacing={2}>
                <HStack justify="space-between">
                    <Text fontWeight="bold">문의 목록</Text>
                    <Button size="xs" onClick={loadRooms}>새로고침</Button>
                </HStack>
                <Divider />
                <VStack align="stretch" spacing={1} maxH="75vh" overflowY="auto">
                    {rooms.length === 0 && <Text color="gray.500">아직 방이 없습니다.</Text>}
                    {rooms.map((r) => (
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
                                    #{r.roomId} • {r.memberNickname ?? `member:${r.memberId}`}
                                </Text>
                                <Text fontSize="xs" color="gray.600" noOfLines={1}>
                                    {r.lastMessage || "(메시지 없음)"}
                                </Text>
                            </Box>
                            <Badge colorScheme={activeRoomId === r.roomId ? "teal" : "gray"}>OPEN</Badge>
                        </HStack>
                    ))}
                </VStack>
            </VStack>

            {/* 우측: 대화창 */}
            <Box flex="1" display="flex" justifyContent="flex-end">
                <VStack
                    w="100%"
                    maxW="900px"              // ← 여기서 대화방 최대폭 제어 (예: 820~980px)
                    align="stretch"
                    border="1px solid #e2e8f0"
                    p={3}
                    rounded="md"
                    spacing={3}
                >
                    <HStack justify="space-between">
                        <Text fontWeight="bold">방 #{activeRoomId ?? "-"}</Text>
                        <Badge colorScheme={isConnected ? "teal" : "red"}>
                            {isConnected ? "CONNECTED" : "DISCONNECTED"}
                        </Badge>
                    </HStack>
                    <Divider />

                    <Box flex="1" minH="60vh" maxH="75vh" p={2} bg="gray.50" rounded="md">
                        {loadingMsgs ? (
                            <Spinner />
                        ) : (
                            <ChatMessageList
                                messages={messages}
                                me={{ id: me.id, nickname: me.nickname }}
                                emptyText="메시지가 없습니다."
                                maxBubbleWidth="45%"   // 기존 관리자 버블 폭 유지
                                containerProps={{ h: "100%", overflowY: "auto", p: 0, bg: "transparent" }}
                            />
                        )}
                    </Box>

                    <HStack>
                        <Input
                            placeholder={activeRoomId ? "메시지 입력..." : "먼저 방을 선택하세요"}
                            value={msgInput}
                            onChange={(e) => setMsgInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && send()}
                            isDisabled={!activeRoomId || !isConnected}
                            bg="white"
                            boxShadow="sm"
                            borderRadius="lg"
                        />
                        <Button
                            colorScheme="teal"
                            onClick={send}
                            isDisabled={!activeRoomId || !isConnected || !msgInput.trim()}
                            borderRadius="lg"
                        >
                            전송
                        </Button>
                    </HStack>
                </VStack>
            </Box>
        </Flex>
    );
}
