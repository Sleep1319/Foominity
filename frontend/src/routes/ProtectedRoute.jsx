import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

function ProtectedRoute({ requireAuth }) {
  const { state, isLoading, isLoggingOut } = useUser();
  const location = useLocation();
  const isLoggedIn = !!(state && state.memberId);

  if (isLoading) return null;

  if (!requireAuth && isLoggedIn) {
    return <Navigate to="/" replace />;
  }

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
