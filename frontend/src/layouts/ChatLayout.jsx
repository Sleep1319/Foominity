import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { toggleChat } from "../redux/chatSlice";
import ChatWidget from "../components/chatComponents/ChatWidget.jsx";
import ChatSocket from "../components/chatComponents/ChatSocket.jsx"; // 아래 “수정본” 사용
import WsNotifier from "@/components/chatComponents/webNotifier.jsx";

export default function ChatLayout() {
    const dispatch = useDispatch();
    const chatOpen = useSelector((s) => s.chat.chatOpen);
    const chatRoomId = useSelector((s) => s.chat.chatRoomId);
    const senderId = useSelector((s) => s.user.id);

    // ▼ 메시지 상태를 레이아웃에서 관리
    const [messages, setMessages] = useState([]);

    // 방 바뀌면 히스토리 로드 (엔드포인트는 프로젝트에 맞게)
    useEffect(() => {
        if (!chatRoomId) return;
        (async () => {
            try {
                const r = await fetch(`/api/admin/chat/rooms/${chatRoomId}/messages`);
                const data = await r.json();
                setMessages(Array.isArray(data) ? data : []);
            } catch (e) {
                console.warn("history load fail", e);
                setMessages([]);
            }
        })();
    }, [chatRoomId]);

    // 서버에서 온 메시지만 추가 (낙관적 렌더 X)
    const handleReceive = (msg) => {
        setMessages((prev) => [...prev, msg]);
    };

    return (
        <>
            <WsNotifier />
            <main style={{ minHeight: "calc(100vh - 120px)" }}>
                <Outlet />
            </main>

            {/* ✅ 소켓은 레이아웃에 배치 (Collapse 영향 없음) */}
            {chatRoomId != null && (
                <ChatSocket roomId={chatRoomId} onMessageReceive={handleReceive} />
            )}

            {chatOpen && chatRoomId != null && (
                <ChatWidget
                    roomId={chatRoomId}
                    senderId={senderId}
                    isOpen={chatOpen}
                    onToggle={() => dispatch(toggleChat())}
                    messages={messages}              // ▼ 부모 상태 내려줌
                />
            )}
        </>
    );
}
