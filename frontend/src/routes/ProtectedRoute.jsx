import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../redux/useUser.js";

function ProtectedRoute({ requireAuth }) {
  const { state, isLoading, isLoggingOut } = useUser();
  const location = useLocation();

  const isLoggedIn = !!state?.id;

  if (isLoading) return null; // 로딩 중이면 아무것도 렌더 안함

  // 로그인한 상태에서 비회원용 페이지 접근 차단
  if (!requireAuth && isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // 로그인이 필요한 페이지인데 비로그인 상태
  if (requireAuth && !isLoggedIn) {
    const isComingFromLogout = location.state?.from === "logout" || isLoggingOut;
    if (!isComingFromLogout) {
      alert("로그인 후 이용해주세요");
    }
    return <Navigate to="/loginpage" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;