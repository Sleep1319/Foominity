import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatOpen: false,
    chatRoomId: null,
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
        },
    },
});

export const {
    setChatOpen,
    toggleChat,
    setChatRoomId,
    resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;