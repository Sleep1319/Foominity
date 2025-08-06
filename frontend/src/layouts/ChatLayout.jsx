import ChatWidget from "../components/chatComponents/ChatWidget.jsx";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleChat } from "../redux/chatSlice";

function ChatLayout() {
    const dispatch = useDispatch();

    const chatOpen = useSelector((state) => state.chat.chatOpen);
    const chatRoomId = useSelector((state) => state.chat.chatRoomId);
    const senderId = useSelector((state) => state.user.id);

    return (
        <>
            <main style={{ minHeight: "calc(100vh - 120px)" }}>
                <Outlet />
            </main>

            {chatOpen && chatRoomId !== null && (
                <ChatWidget
                    roomId={chatRoomId}
                    senderId={senderId}
                    isOpen={chatOpen}
                    onToggle={() => dispatch(toggleChat())}
                />
            )}
        </>
    );
}

export default ChatLayout;
