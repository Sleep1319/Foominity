import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";

let sendMessage = () => {};

const ChatSocket = ({ roomId, onMessageReceive }) => {
    const clientRef = useRef(null);

    useEffect(() => {
        if (!roomId) return;

        let mounted = true;

        (async () => {
            try {
                // 1) WS 토큰 발급
                const { data } = await axios.get("/api/ws-token");
                const wsToken = data.token;

                // 2) STOMP 클라이언트 생성
                const socket = new SockJS("/ws");
                const client = new Client({
                    webSocketFactory: () => socket,
                    reconnectDelay: 5000,
                    connectHeaders: { Authorization: `Bearer ${wsToken}` },
                    debug: () => {}, // 콘솔 지저분하면 끄기
                    onConnect: () => {
                        if (!mounted) return;
                        console.log("WebSocket 연결됨");

                        // 구독
                        client.subscribe(`/topic/chat/${roomId}`, (message) => {
                            const body = JSON.parse(message.body);
                            onMessageReceive?.(body);
                        });

                        // 전송 함수 바인딩
                        sendMessage = (text) => {
                            if (!client.connected) return;
                            client.publish({
                                destination: "/app/chat.sendMessage",
                                body: JSON.stringify({ roomId, message: text }), //
                            });
                        };
                    },
                    onStompError: (frame) => {
                        console.error("STOMP error:", frame.headers["message"], frame.body);
                    },
                    onWebSocketClose: (evt) => {
                        console.warn("WS closed:", evt?.reason);
                    },
                });

                clientRef.current = client;
                client.activate();
            } catch (e) {
                console.error("WS bootstrap failed:", e);
            }
        })();

        return () => {
            mounted = false;
            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
                console.log("WebSocket 연결 해제됨");
            }
        };
    }, [roomId]);

    return null;
};

export default ChatSocket;
export { sendMessage };