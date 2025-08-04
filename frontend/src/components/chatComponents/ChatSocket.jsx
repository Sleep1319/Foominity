import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const ChatSocket = ({ roomId, senderId, onMessageReceive }) => {
    const stompClientRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("socketToken"); // 또는 쿠키에서 가져와도 됨
        const socket = new SockJS(`http://localhost:8084/ws?token=${token}`);
        const stompClient = Stomp.over(socket);
        stompClientRef.current = stompClient;

        stompClient.connect({}, () => {
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