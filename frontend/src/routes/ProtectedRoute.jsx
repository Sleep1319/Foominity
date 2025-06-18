import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

function ProtectedRoute({ requireAuth }) {
    const { state } = useUser();
    const login = state && state.memberId;

    if (!requireAuth && login) {
        return <Navigate to="/" replace />
    }
    if (requireAuth && !login) {
        alert("로그인 후 이용해주세요")
        return <Navigate to="/login" replace />
    }
    return <Outlet />
}

export default ProtectedRoute;