import React, { useMemo, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ requireAuth = true }) {
    const location = useLocation();
    const { id, isLoading, hydrated, isLoggingOut } = useSelector((s) => s.user);
    console.log("[ProtectedRoute]", { id, isLoading, hydrated, isLoggingOut, path: location.pathname });
    const isLoggedIn = useMemo(() => !!id, [id]);

    const alertedRef = useRef(false);
    const safeAlert = (msg) => {
        if (alertedRef.current) return;
        alertedRef.current = true;
        alert(msg);
    };

    // 최소 1회 /api/user 시도 끝나기 전엔 판단 보류
    if (isLoading || !hydrated) return null;

    // 로그인 상태에서 비회원 전용 페이지 접근 시 홈으로
    if (!requireAuth && isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    // 인증 필요한데 비로그인
    if (requireAuth && !isLoggedIn) {
        const isComingFromLogout = location.state?.from === "logout" || isLoggingOut;
        if (!isComingFromLogout) {
            safeAlert("왜 로그인을 못읽냐고 여기가 왜 걸리냐고 로그인 후 이용해주세요");
        }
        const back = location.pathname + (location.search || "");
        return <Navigate to="/loginpage" replace state={{ from: back }} />;
    }

    return <Outlet />;
}
