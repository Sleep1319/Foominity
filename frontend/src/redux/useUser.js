import { useSelector, useDispatch } from "react-redux";
import { logout, updateUser as updateUserAction } from "./userSlice.js";

export function useUser() {
    const state = useSelector((state) => ({
        id: state.user.id,
        nickname: state.user.nickname,
        email: state.user.email,
        role: state.user.role,
        createdAt: state.user.createdAt,
    }));

    const isLoading = useSelector((state) => state.user.isLoading);
    const isLoggingOut = useSelector((state) => state.user.isLoggingOut);

    const dispatch = useDispatch();

    return {
        state,
        isLoading,
        isLoggingOut,
        logout: () => dispatch(logout()),
        updateUser: (updates) => dispatch(updateUserAction(updates)),
    };
}
