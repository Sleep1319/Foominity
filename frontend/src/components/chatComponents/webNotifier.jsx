import React, { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { increaseUnread } from "@/redux/chatSlice";

export default function WsNotifier() {
    const clientRef = useRef(null);
    const loggedIn = useSelector(s => !!s.user.id);
    const dispatch = useDispatch(); // ✅ 추가

    useEffect(() => {
        if (!loggedIn) return;

        (async () => {
            const { data } = await axios.get("/api/ws-token", { withCredentials: true });
            const wsToken = data.token;

            const socket = new SockJS("http://localhost:8084/ws");
            const client = new Client({
                webSocketFactory: () => socket,
                connectHeaders: { Authorization: `Bearer ${wsToken}` },
                reconnectDelay: 5000,
                debug: () => {}
            });

            client.onConnect = () => {
                // ✅ 내 개인 큐 구독
                client.subscribe("/user/queue/inbox", (frame) => {
                    const evt = JSON.parse(frame.body);
                    dispatch(increaseUnread(evt.roomId)); // ✅ 뱃지 ++
                    console.log("USER INBOX EVENT:", evt);
                });
            };

            clientRef.current = client;
            client.activate();
        })();

        // ✅ 재연결/로그아웃 대비 정리
        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }
        };
    }, [loggedIn, dispatch]);

    return null;
}
