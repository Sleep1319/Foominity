import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";

const ChatSocket = ({ roomId, senderId, onMessageReceive }) => {
    const stompClientRef = useRef(null);

    useEffect(() => {
        const socket = new SockJS("http://localhost:8084/ws");
        const stompClient = Stomp.over(socket);
        stompClientRef.current = stompClient;

        stompClient.connect({}, () => {
            // ✅ 구독 (브로드캐스트 수신용)
            stompClient.subscribe(`/topic/chat/${roomId}`, (message) => {
                const received = JSON.parse(message.body);
                onMessageReceive(received);
            });
        });

        return () => {
            if (stompClientRef.current?.connected) {
                stompClientRef.current.disconnect();
            }
        };
    }, [roomId, onMessageReceive]);

    const sendMessage = (text) => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.send(
                "/app/chat.sendMessage",
                {},
                JSON.stringify({
                    roomId,
                    senderId,
                    message: text,
                    createdAt: new Date().toISOString(),
                })
            );
        }
    };

    return { sendMessage };
};

export default ChatSocket;