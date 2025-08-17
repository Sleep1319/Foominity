import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { toggleChat, resetUnread } from "@/redux/chatSlice";
import ChatWidget from "@/components/chatComponents/ChatWidget.jsx";
import ChatSocket from "@/components/chatComponents/ChatSocket.jsx";
import WsNotifier from "@/components/chatComponents/WsNotifier.jsx";

const lastSeenKey = (rid) => `chat:lastSeen:${rid}`;

export default function ChatLayout() {
    const dispatch = useDispatch();
    const chatOpen = useSelector((s) => s.chat.chatOpen);
    const chatRoomId = useSelector((s) => s.chat.chatRoomId);
    const senderId = useSelector((s) => s.user.id);

    const [messages, setMessages] = useState([]);

    // 히스토리 로드
    useEffect(() => {
        if (!chatRoomId) return;
        (async () => {
            try {
                const r = await fetch(`/api/admin/chat/rooms/${chatRoomId}/messages`, { credentials: "include" });
                const data = await r.json();
                setMessages(Array.isArray(data) ? data : []);
            } catch {
                setMessages([]);
            }
        })();
    }, [chatRoomId]);

    // 소켓 수신
    const handleReceive = (msg) => {
        setMessages((prev) => [...prev, msg]);
    };

    // ★ 위젯 열려 있고 해당 방을 보는 중이면: 새 메시지 들어올 때마다 읽음 처리 + lastSeen 저장
    useEffect(() => {
        if (!chatOpen || !chatRoomId) return;
        try {
            localStorage.setItem(lastSeenKey(chatRoomId), new Date().toISOString());
        } catch {}
        dispatch(resetUnread(String(chatRoomId)));
    }, [chatOpen, chatRoomId, messages.length, dispatch]);

    return (
        <>
            <WsNotifier />

            <main style={{ minHeight: "calc(100vh - 120px)" }}>
                <Outlet />
            </main>

            {chatRoomId != null && (
                <ChatSocket roomId={chatRoomId} onMessageReceive={handleReceive} />
            )}

            {chatOpen && chatRoomId != null && (
                <ChatWidget
                    roomId={chatRoomId}
                    senderId={senderId}
                    isOpen={chatOpen}
                    onToggle={() => dispatch(toggleChat())}
                    messages={messages}
                />
            )}
        </>
    );
}