import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔁 유저 정보 비동기 요청 (기존 useEffect 역할)
export const fetchUser = createAsyncThunk("user/fetchUser", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get("/api/user", { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "유저 정보 로딩 실패");
    }
});

// 🔁 로그아웃 처리
export const logout = createAsyncThunk("user/logout", async (_, { dispatch }) => {
    dispatch(setIsLoggingOut(true));
    try {
        await axios.post("/api/logout", { withCredentials: true });
        dispatch(clearUser());
        window.location.href = "/";
    } catch (error) {
        alert("로그아웃 실패");
    } finally {
        dispatch(setIsLoggingOut(false));
    }
});

const initialState = {
    id: null,
    nickname: "",
    email: "",
    role: "",
    createdAt: null,
    isLoading: true,
    isLoggingOut: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser: (state, action) => {
            return { ...state, ...action.payload };
        },
        clearUser: () => ({
            ...initialState,
            isLoading: false,
        }),
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setIsLoggingOut: (state, action) => {
            state.isLoggingOut = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                return { ...state, ...action.payload, isLoading: false };
            })
            .addCase(fetchUser.rejected, (state) => {
                return { ...initialState, isLoading: false };
            });
    },
});

export const {
    updateUser,
    clearUser,
    setIsLoading,
    setIsLoggingOut,
} = userSlice.actions;

export default userSlice.reducer;
