import { useDispatch, useSelector } from "react-redux";
import { updateUser, logout } from "./userSlice";

export function useUser() {
    const dispatch = useDispatch();
    // Redux의 user slice를 가져와서
    const u = useSelector((s) => s.user);

    // 예전 UserContext와 동일한 형태로 맞춰서 반환
    const state = {
        id: u.id,
        email: u.email,
        username: u.username,
        nickname: u.nickname,
        roleName: u.role,
        avatar: u.avatar,
        socialType: u.socialType,
        createdAt: u.createdAt,
    };

    return {
        state,                    // ✅ 예전처럼 state.id 로 접근 가능
        isLoading: u.isLoading,
        isLoggingOut: u.isLoggingOut,
        updateUser: (patch) => dispatch(updateUser(patch)),
        logout: () => dispatch(logout()),
    };
}
