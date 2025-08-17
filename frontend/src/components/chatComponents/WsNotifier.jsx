import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { increaseUnread, resetUnread, setUnread } from "@/redux/chatSlice";

// lastSeen localStorage helpers
const lastSeenKey = (rid) => `chat:lastSeen:${rid}`;
const saveLastSeen = (rid, iso = new Date().toISOString()) => {
    try { localStorage.setItem(lastSeenKey(rid), iso); } catch {}
};
const getLastSeen = (rid) => {
    try { const v = localStorage.getItem(lastSeenKey(rid)); return v ? new Date(v) : null; } catch { return null; }
};

export default function WsNotifier() {
    const dispatch = useDispatch();

    // 최신 전역상태를 ref로 보관
    const chatOpen = useSelector((s) => s.chat.chatOpen);
    const currentRoomId = useSelector((s) => s.chat.chatRoomId);
    const myId = useSelector((s) => s.user.id);

    const chatOpenRef = useRef(chatOpen);
    const currentRoomIdRef = useRef(currentRoomId);
    const myIdRef = useRef(myId);
    useEffect(() => { chatOpenRef.current = chatOpen; }, [chatOpen]);
    useEffect(() => { currentRoomIdRef.current = currentRoomId; }, [currentRoomId]);
    useEffect(() => { myIdRef.current = myId; }, [myId]);

    const clientRef = useRef(null);
    const subRef = useRef(null);
    const roomIdRef = useRef(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            // 1) 내 방 id만 조회(생성 X). 없으면 아무 것도 안 함
            let roomId = null;
            try {
                const r = await axios.get("/api/chat/my-room-id", { withCredentials: true });
                const raw = r?.data;
                roomId = raw?.roomId ?? raw ?? null;
            } catch {
                return; // 방 자체가 없으면 구독/점 처리 불필요
            }
            if (!mounted || !roomId) return;
            roomIdRef.current = roomId;

            // 2) 로그인 직후 초기 언리드 계산 (마지막 메시지 vs lastSeen)
            try {
                const hist = await axios.get(`/api/admin/chat/rooms/${roomId}/messages`, { withCredentials: true });
                const arr = Array.isArray(hist?.data) ? hist.data : [];
                const last = arr.length ? arr[arr.length - 1] : null;
                if (last) {
                    const seen = getLastSeen(roomId);
                    const lastAt = new Date(last.createdAt);
                    const isMine = myIdRef.current != null && Number(last.senderId) === Number(myIdRef.current);
                    if (!isMine && (!seen || lastAt > seen)) {
                        dispatch(setUnread({ roomId: String(roomId), count: 1 }));
                    }
                }
            } catch {}

            // 3) 소켓 연결
            const tok = await axios.get("/api/ws-token", { withCredentials: true });
            const wsToken = tok.data.token;

            const socket = new SockJS(`http://localhost:8084/ws?token=${wsToken}`);
            const client = new Client({
                webSocketFactory: () => socket,
                reconnectDelay: 4000,
                connectHeaders: { Authorization: `Bearer ${wsToken}` },
                debug: () => {},
                onConnect: () => {
                    if (!mounted) return;
                    try { subRef.current?.unsubscribe(); } catch {}
                    subRef.current = client.subscribe(`/topic/chat/${roomId}`, (frame) => {
                        try {
                            const msg = JSON.parse(frame.body);

                            // 내가 보낸 건 무시
                            if (myIdRef.current != null && Number(msg?.senderId) === Number(myIdRef.current)) return;

                            // ★ 보고 있으면(위젯 열림 + 같은 방) → 읽음 처리 & lastSeen 저장
                            const viewing =
                                chatOpenRef.current &&
                                Number(currentRoomIdRef.current) === Number(roomIdRef.current);

                            if (viewing) {
                                saveLastSeen(roomIdRef.current);
                                dispatch(resetUnread(String(roomIdRef.current)));
                                return;
                            }

                            // 그 외는 언리드 +1
                            dispatch(increaseUnread(String(roomIdRef.current)));
                        } catch {}
                    });
                },
            });

            clientRef.current = client;
            client.activate();
        })();

        return () => {
            mounted = false;
            try { subRef.current?.unsubscribe(); } catch {}
            subRef.current = null;
            clientRef.current?.deactivate();
            clientRef.current = null;
        };
    }, [dispatch]);

    // 위젯을 열어 현재 방을 보는 순간에도 읽음 처리 확실히
    useEffect(() => {
        const rid = roomIdRef.current;
        if (chatOpenRef.current && rid && Number(currentRoomIdRef.current) === Number(rid)) {
            saveLastSeen(rid);
            dispatch(resetUnread(String(rid)));
        }
    }, [chatOpen, currentRoomId, dispatch]);

    return null;
}