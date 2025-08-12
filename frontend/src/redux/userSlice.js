import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUser = createAsyncThunk(
    "user/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get("/api/user", { withCredentials: true });
            return res.data; // UserInfoResponse
        } catch (err) {
            const msg = err?.response?.data || err?.message || "유저 정보 로딩 실패";
            return rejectWithValue(msg);
        }
    }
);

export const logout = createAsyncThunk("user/logout", async (_, { dispatch }) => {
    dispatch(setIsLoggingOut(true));
    try {
        await axios.post("/api/logout", null, { withCredentials: true });
        dispatch(clearUser());
    } finally {
        dispatch(setIsLoggingOut(false));
    }
});

const initialState = {
    id: null,        // ← memberId 매핑
    email: "",
    username: "",
    nickname: "",
    role: "",        // ← roleName 매핑
    avatar: null,
    socialType: "",
    createdAt: "",   // ← 추가

    isLoading: true,
    hydrated: false,
    isLoggingOut: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // id/memberId, role/roleName 혼용해도 안전하게 반영
        updateUser: (state, action) => {
            const p = action.payload || {};
            if ("memberId" in p) state.id = p.memberId;
            if ("id" in p)       state.id = p.id;

            if ("roleName" in p) state.role = p.roleName;
            if ("role" in p)     state.role = p.role;

            if ("email" in p)      state.email = p.email;
            if ("username" in p)   state.username = p.username;
            if ("nickname" in p)   state.nickname = p.nickname;
            if ("avatar" in p)     state.avatar = p.avatar;
            if ("socialType" in p) state.socialType = p.socialType;
            if ("createdAt" in p)  state.createdAt = p.createdAt;
        },
        clearUser: () => ({
            ...initialState,
            isLoading: false,
            hydrated: true, // 로그아웃 후 깜빡임 방지
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
                // 이미 한 번 수화되면 로딩 토글로 깜빡임 유발하지 않음
                if (!state.hydrated) state.isLoading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                const u = action.payload || {};
                // 서버 값 있을 때만 덮어씀(미리보기 값 보존)
                state.id         = u.memberId   ?? state.id;
                state.email      = u.email      ?? state.email;
                state.username   = u.username   ?? state.username;
                state.nickname   = u.nickname   ?? state.nickname;
                state.role       = u.roleName   ?? state.role;
                state.avatar     = u.avatar     ?? state.avatar;
                state.socialType = u.socialType ?? state.socialType;
                state.createdAt  = u.createdAt  ?? state.createdAt;

                state.isLoading = false;
                state.hydrated  = true;
            })
            .addCase(fetchUser.rejected, (state) => {
                state.isLoading = false;
                state.hydrated = true;
            });
    },
});

export const { updateUser, clearUser, setIsLoading, setIsLoggingOut } =
    userSlice.actions;

export default userSlice.reducer;
