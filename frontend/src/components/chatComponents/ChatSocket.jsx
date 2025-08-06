import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;
let sendMessage = () => {};

const ChatSocket = ({ roomId, senderId, onMessageReceive }) => {
    useEffect(() => {
        if (!roomId || !senderId) return;

        const socket = new SockJS("http://localhost:8084/ws");
        stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("WebSocket 연결됨");

                stompClient.subscribe(`/topic/chat/${roomId}`, (message) => {
                    const body = JSON.parse(message.body);
                    console.log("받은 메시지:", body);
                    onMessageReceive?.(body);
                });
            },
        });

        stompClient.activate();

        return () => {
            if (stompClient) {
                stompClient.deactivate();
                console.log("WebSocket 연결 해제됨");
            }
        };
    }, [roomId, senderId]);

    sendMessage = (message) => {
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: "/app/chat/send",
                body: JSON.stringify({ roomId, senderId, message }),
            });
        }
    };

    return null;
};

export default ChatSocket;
export { sendMessage };