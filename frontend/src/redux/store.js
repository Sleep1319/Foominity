import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import chatReducer from "./chatSlice.js";

export const store = configureStore({
    reducer: {
        user: userReducer,
        chat: chatReducer,
    },
});