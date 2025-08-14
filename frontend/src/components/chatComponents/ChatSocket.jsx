import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";

let sendMessage = () => {};
export { sendMessage };

export default function ChatSocket({ roomId, onMessageReceive }) {
    const clientRef = useRef(null);
    const subRef = useRef(null);
    const cbRef = useRef(null);     // 최신 콜백 저장

    // 최신 콜백만 갱신 (연결 재시작 안 함)
    useEffect(() => {
        cbRef.current = onMessageReceive;
    }, [onMessageReceive]);

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
                    debug: (s) => console.log("[STOMP]", s),
                    onConnect: () => {
                        if (!mounted) return;
                        console.log("[WS] connected, room:", roomId);

                        // 이전 구독 해제 후 재구독
                        try { subRef.current?.unsubscribe(); } catch {}
                        subRef.current = client.subscribe(`/topic/chat/${roomId}`, (message) => {
                            try {
                                const body = JSON.parse(message.body);
                                cbRef.current?.(body); // 항상 최신 콜백
                            } catch (e) { console.warn("parse fail", e); }
                        });

                        // 전송 함수
                        sendMessage = (text) => {
                            if (!client.connected) return console.warn("[WS] not connected");
                            const receiptId = "send-" + Date.now();
                            client.watchForReceipt(receiptId, () => {
                                console.log("[WS] server received:", receiptId);
                            });
                            client.publish({
                                destination: "/app/chat.sendMessage",
                                headers: { receipt: receiptId },
                                body: JSON.stringify({ roomId, message: text }),
                            });
                        };
                    },
                    onStompError: (frame) => {
                        console.error("[STOMP error]", frame.headers["message"], frame.body);
                    },
                    onWebSocketClose: (evt) => {
                        console.warn("[WS] closed:", evt?.reason);
                    },
                });

                clientRef.current = client;
                client.activate();
            } catch (e) {
                console.error("[WS] bootstrap failed:", e);
            }
        })();

        return () => {
            mounted = false;
            try { subRef.current?.unsubscribe(); } catch {}
            subRef.current = null;
            clientRef.current?.deactivate();
            clientRef.current = null;
            console.log("[WS] disconnected");
        };
    }, [roomId]); // ✅ roomId만 의존

    return null;
}
