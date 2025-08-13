import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatOpen: false,
    chatRoomId: null,
    unreadCount: {}, // ✅ { roomId: count } 형태로 저장
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setChatOpen(state, action) {
            state.chatOpen = action.payload;
        },
        toggleChat(state) {
            state.chatOpen = !state.chatOpen;
        },
        setChatRoomId(state, action) {
            state.chatRoomId = action.payload;
        },
        resetChat(state) {
            state.chatOpen = false;
            state.chatRoomId = null;
            state.unreadCount = {};
        },
        increaseUnread(state, action) {
            const roomId = action.payload;
            if (!state.unreadCount[roomId]) {
                state.unreadCount[roomId] = 0;
            }
            state.unreadCount[roomId] += 1;
        },
        resetUnread(state, action) {
            const roomId = action.payload;
            state.unreadCount[roomId] = 0;
        },
    },
});

export const {
    setChatOpen,
    toggleChat,
    setChatRoomId,
    resetChat,
    increaseUnread,
    resetUnread,
} = chatSlice.actions;

export default chatSlice.reducer;
