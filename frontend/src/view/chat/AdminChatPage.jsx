import React, { useEffect, useRef, useState } from "react";
import {
    Box, Flex, VStack, HStack, Button, Input, Text, Badge, Divider, Spinner,
} from "@chakra-ui/react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { useSelector } from "react-redux";

// 공용 메시지/버블 리스트
import ChatMessageList from "@/components/chatComponents/ChatMessageList.jsx";
// 좌측 방 목록 컴포넌트(검색/빨간점 표시 포함)
import RoomList from "@/components/chatComponents/RoomList.jsx";

export default function AdminChatPage() {
    const [rooms, setRooms] = useState([]);              // [{roomId, memberId, memberNickname, lastMessage, lastMessageAt}]
    const [activeRoomId, setActiveRoomId] = useState(null);

    const [messages, setMessages] = useState([]);        // [{roomId, senderId, senderNickname, senderRole?, message, createdAt}]
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const [msgInput, setMsgInput] = useState("");

    const [unread, setUnread] = useState(new Set());

    // 최신 값 보관용 ref (STOMP 콜백에서 stale 문제 방지)
    const activeRoomIdRef = useRef(null);
    const roomsRef        = useRef([]);
    const meRef           = useRef(null);

    const clientRef   = useRef(null);
    const inboxSubRef = useRef(null);
    const roomSubRef  = useRef(null);

    const me = useSelector((s) => ({
        id: s.user.id,
        nickname: s.user.nickname || "관리자",
        role: (s.user.role || "ADMIN").toUpperCase(),
    }));

    // ref 최신화
    useEffect(() => { activeRoomIdRef.current = activeRoomId; }, [activeRoomId]);
    useEffect(() => { roomsRef.current        = rooms;        }, [rooms]);
    useEffect(() => { meRef.current           = me?.id ?? null; }, [me?.id]);

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

                        // 관리자 인박스 구독 (모든 방의 새 메시지 프리뷰)
                        try { inboxSubRef.current?.unsubscribe(); } catch {}
                        inboxSubRef.current = client.subscribe("/topic/admin/inbox", (frame) => {
                            const evt = JSON.parse(frame.body); // { roomId, preview, from, createdAt }

                            // 방 목록 최신화 (미리보기/시간)
                            setRooms((prev) => {
                                const idx = prev.findIndex((r) => r.roomId === evt.roomId);
                                if (idx === -1) return prev;
                                const next = [...prev];
                                next[idx] = { ...next[idx], lastMessage: evt.preview, lastMessageAt: evt.createdAt };
                                return next;
                            });
                            if (!roomsRef.current?.length) loadRooms();

                            // 언리드 판정: 보고있는 방이면 추가 x
                            const currentActive = activeRoomIdRef.current;
                            const viewingThisRoom =
                                currentActive != null && Number(currentActive) === Number(evt.roomId);

                            if (!viewingThisRoom /* || windowHidden */) {
                                setUnread((prev) => {
                                    const next = new Set(prev);
                                    next.add(evt.roomId);
                                    return next;
                                });
                            }
                        });

                        // 이미 방 선택돼 있으면 즉시 구독
                        if (activeRoomIdRef.current) {
                            loadMessages(activeRoomIdRef.current);
                            try { roomSubRef.current?.unsubscribe(); } catch {}
                            roomSubRef.current = client.subscribe(`/topic/chat/${activeRoomIdRef.current}`, (f) => {
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

    // 방 선택 시: 히스토리 로드 + 토픽 재구독 + 언리드 제거
    const openRoom = (rid) => {
        setActiveRoomId(rid);
        setUnread((prev) => {
            const next = new Set(prev);
            next.delete(rid);
            return next;
        });
    };

    useEffect(() => {
        if (!activeRoomId || !isConnected || !clientRef.current?.connected) return;

        loadMessages(activeRoomId);
        try { roomSubRef.current?.unsubscribe(); } catch {}
        roomSubRef.current = clientRef.current.subscribe(`/topic/chat/${activeRoomId}`, (frame) => {
            setMessages((prev) => [...prev, JSON.parse(frame.body)]);
        });
    }, [activeRoomId, isConnected]);

    // 최초 목록
    useEffect(() => { loadRooms(); }, []);

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
        <Box p={4} mt={2} maxW="1000px" mx="auto">
            <Flex gap={4} p={4}>
                {/* 좌측: 방 목록 */}
                <RoomList
                    rooms={rooms}
                    activeRoomId={activeRoomId}
                    unreadSet={unread}
                    onSelectRoom={openRoom}
                    onRefresh={loadRooms}
                />

                {/* 우측: 대화창 */}
                <Box flex="1" display="flex" justifyContent="flex-end">
                    <VStack
                        w="100%"
                        maxW="860px"
                        align="stretch"
                        border="1px solid #e2e8f0"
                        p={3}
                        rounded="md"
                        spacing={3}
                        h="75vh"
                    >
                        {/* 헤더 */}
                        <HStack justify="space-between">
                            <Text fontWeight="bold">방 #{activeRoomId ?? "-"}</Text>
                            <Badge colorScheme={isConnected ? "teal" : "red"}>
                                {isConnected ? "CONNECTED" : "DISCONNECTED"}
                            </Badge>
                        </HStack>
                        <Divider />

                        {/* 메시지 영역: 내부 스크롤만 */}
                        <Box flex="1" minH={0} overflow="hidden" bg="gray.50" rounded="md" p={2}>
                            {loadingMsgs ? (
                                <Spinner />
                            ) : (
                                <ChatMessageList
                                    messages={messages}
                                    me={{ id: me.id, nickname: me.nickname }}
                                    emptyText="메시지가 없습니다."
                                    maxBubbleWidth="45%"
                                    containerProps={{ h: "100%", overflowY: "auto", p: 0, bg: "transparent" }}
                                />
                            )}
                        </Box>

                        {/* 입력바 */}
                        <HStack>
                            <Input
                                placeholder={activeRoomId ? "메시지 입력..." : "먼저 방을 선택하세요"}
                                value={msgInput}
                                onChange={(e) => setMsgInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        send();
                                    }
                                }}
                                isDisabled={!activeRoomId || !isConnected}
                                bg="white"
                                boxShadow="sm"
                                borderRadius="lg"
                            />
                            <Button
                                type="button"
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
        </Box>
    );
}
