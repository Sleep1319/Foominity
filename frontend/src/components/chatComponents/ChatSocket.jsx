import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { increaseUnread, resetUnread } from "@/redux/chatSlice";

let sendMessage = () => {};
export { sendMessage };

export default function ChatSocket({ roomId, onMessageReceive }) {
    const clientRef = useRef(null);
    const subRef = useRef(null);
    const cbRef = useRef(null);

    const dispatch = useDispatch();
    const meId = useSelector((s) => s.user.id);
    const activeRoomId = useSelector((s) => s.chat.chatRoomId);
    const chatOpen = useSelector((s) => s.chat.chatOpen);

    // 최신값 refs (콜백 stale 방지)
    const meIdRef = useRef(meId);
    const activeRef = useRef(activeRoomId);
    const openRef = useRef(chatOpen);

    useEffect(() => { cbRef.current = onMessageReceive; }, [onMessageReceive]);
    useEffect(() => { meIdRef.current = meId; }, [meId]);
    useEffect(() => { activeRef.current = activeRoomId; }, [activeRoomId]);
    useEffect(() => { openRef.current = chatOpen; }, [chatOpen]);

    useEffect(() => {
        if (!roomId) return;
        let mounted = true;

        (async () => {
            try {
                const { data } = await axios.get("/api/ws-token");
                const wsToken = data.token;

                const socket = new SockJS(`http://localhost:8084/ws?token=${wsToken}`);
                const client = new Client({
                    webSocketFactory: () => socket,
                    reconnectDelay: 3000,
                    connectHeaders: { Authorization: `Bearer ${wsToken}` },
                    debug: () => {},
                    onConnect: () => {
                        if (!mounted) return;

                        try { subRef.current?.unsubscribe(); } catch {}
                        subRef.current = client.subscribe(`/topic/chat/${roomId}`, (message) => {
                            let body;
                            try { body = JSON.parse(message.body); } catch { return; }

                            // 1) 화면에 추가
                            cbRef.current?.(body);

                            // 2) 내가 보낸 건 카운트 X
                            const fromMe =
                                meIdRef.current != null &&
                                body?.senderId != null &&
                                Number(body.senderId) === Number(meIdRef.current);
                            if (fromMe) return;

                            // 3) 보고 있으면 읽음 처리, 아니면 언리드 증가
                            const isActive =
                                activeRef.current != null &&
                                Number(activeRef.current) === Number(roomId);
                            const isOpen = !!openRef.current;
                            const isWindowFocused = document.visibilityState === "visible";

                            if (isActive && isOpen && isWindowFocused) {
                                // 혹시 이전에 쌓인 값이 있으면 함께 제거
                                dispatch(resetUnread(roomId));
                            } else {
                                dispatch(increaseUnread(roomId));
                            }
                        });

                        // 전송 함수
                        sendMessage = (text) => {
                            if (!client.connected) return;
                            client.publish({
                                destination: "/app/chat.sendMessage",
                                body: JSON.stringify({ roomId, message: text }),
                            });
                        };
                    },
                    onWebSocketClose: () => {},
                    onStompError: (frame) => {
                        console.error("[STOMP error]", frame.headers?.message, frame.body);
                    },
                });

                clientRef.current = client;
                client.activate();
            } catch (e) {
                console.error("[WS bootstrap failed]", e);
            }
        })();

        return () => {
            mounted = false;
            try { subRef.current?.unsubscribe(); } catch {}
            subRef.current = null;
            clientRef.current?.deactivate();
            clientRef.current = null;
        };
    }, [roomId, dispatch]);

    return null;
}