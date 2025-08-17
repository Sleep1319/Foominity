import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatOpen: false,
    chatRoomId: null,
    // { [roomId: string]: number }
    unreadCount: {},
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

        // ---------- Unread ----------
        increaseUnread(state, action) {
            const rid = String(action.payload);
            state.unreadCount[rid] = (state.unreadCount[rid] || 0) + 1;
        },
        resetUnread(state, action) {
            const rid = String(action.payload);
            state.unreadCount[rid] = 0;
        },
        clearUnread(state) {
            Object.keys(state.unreadCount).forEach((rid) => {
                state.unreadCount[rid] = 0;
            });
        },
        setUnread(state, action) {
            const { roomId, count } = action.payload || {};
            state.unreadCount[String(roomId)] = count ?? 0;
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
    clearUnread,
    setUnread,
} = chatSlice.actions;

export default chatSlice.reducer;
/* ------------- SELECTORS ------------- */
export const selectUnreadMap = (state) => state.chat.unreadCount || {};
export const selectUnreadForRoom = (roomId) => (state) =>
    (state.chat.unreadCount && state.chat.unreadCount[String(roomId)]) || 0;
export const selectUnreadTotal = (state) =>
    Object.values(state.chat.unreadCount || {}).reduce((a,b)=>a+(b||0),0);