import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUser = createAsyncThunk(
    "user/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
            console.log("[fetchUser] GET /api/user");
            const res = await axios.get("/api/user", { withCredentials: true });
            console.log("[fetchUser] success:", res.data);
            return res.data; // UserInfoResponse
        } catch (err) {
            const msg = err?.response?.data || err?.message || "유저 정보 로딩 실패";
            console.warn("[fetchUser] fail:", msg);
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
    id: null,             // ← memberId 매핑
    email: "",
    username: "",
    nickname: "",
    role: "",             // ← roleName 매핑
    avatar: null,
    socialType: "",

    isLoading: true,
    hydrated: false,
    isLoggingOut: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser: (state, action) => {
            Object.assign(state, action.payload || {});
        },
        clearUser: () => ({
            ...initialState,
            isLoading: false,
            hydrated: true,
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
                const u = action.payload || {};

                // ✅ 백엔드 DTO(UserInfoResponse) 정확 매핑
                state.id        = u.memberId ?? null;
                state.email     = u.email ?? "";
                state.username  = u.username ?? "";
                state.nickname  = u.nickname ?? "";
                state.role      = u.roleName ?? "";     // ADMIN, ROLE_ADMIN 등
                state.avatar    = u.avatar ?? null;
                state.socialType= u.socialType ?? "";

                state.isLoading = false;
                state.hydrated  = true;

                console.log("[userSlice fulfilled] mapped:", {
                    id: state.id, role: state.role, nickname: state.nickname
                });
            })
            .addCase(fetchUser.rejected, (state) => {
                state.id = null;
                state.email = "";
                state.username = "";
                state.nickname = "";
                state.role = "";
                state.avatar = null;
                state.socialType = "";

                state.isLoading = false;
                state.hydrated = true;
            });
    },
});

export const { updateUser, clearUser, setIsLoading, setIsLoggingOut } =
    userSlice.actions;

export default userSlice.reducer;
