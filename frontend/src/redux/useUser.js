import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { updateUser, logout } from "./userSlice";

export function useUser() {
    const dispatch = useDispatch();

    // 필요한 필드만 뽑아서 shallowEqual로 리렌더 최소화
    const u = useSelector(
        (s) => ({
            id: s.user.id,
            email: s.user.email,
            username: s.user.username,
            nickname: s.user.nickname,
            role: s.user.role,
            avatar: s.user.avatar,
            socialType: s.user.socialType,
            createdAt: s.user.createdAt,
            isLoading: s.user.isLoading,
            hydrated: s.user.hydrated,
            isLoggingOut: s.user.isLoggingOut,
        }),
        shallowEqual
    );

    // 예전 UserContext 형태로 어댑팅
    const state = {
        id: u.id,
        memberId: u.id,
        email: u.email,
        username: u.username,
        nickname: u.nickname,
        roleName: u.role,
        avatar: u.avatar,
        socialType: u.socialType,
        createdAt: u.createdAt,
    };

    return {
        state,                                 // state.id / state.roleName 그대로 사용
        isLoading: !u.hydrated && u.isLoading, // 첫 수화 전에만 로딩 표시
        isLoggingOut: u.isLoggingOut,
        updateUser: (patch) => dispatch(updateUser(patch)), // 미리보기 즉시 반영
        logout: () => dispatch(logout()),
    };
}
