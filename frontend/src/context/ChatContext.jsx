import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chatOpen, setChatOpen] = useState(false);
    const [chatRoomId, setChatRoomId] = useState(null);

    return (
        <ChatContext.Provider value={{ chatOpen, setChatOpen, chatRoomId, setChatRoomId }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);