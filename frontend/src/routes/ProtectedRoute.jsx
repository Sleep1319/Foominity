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
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

// import React from "react";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useUser } from "../context/UserContext";

// function ProtectedRoute({ requireAuth }) {
//   const { state, isLoading } = useUser();
//   const location = useLocation();
//   const isLoggedIn = !!(state && state.memberId);

//   // 로그인 정보 로딩 중이면 아무것도 렌더링하지 않음
//   if (isLoading) return null;

//   // 로그인 안 필요한 페이지인데 로그인돼있으면 홈으로
//   if (!requireAuth && isLoggedIn) {
//     return <Navigate to="/" replace />;
//   }

//   // 로그인 필요한 페이지인데 로그인 안 돼있고 수동 접근이면 알림
//   if (requireAuth && !isLoggedIn) {
//     const isManualAccess = location.state?.from !== "logout";
//     if (isManualAccess) {
//       alert("로그인 후 이용해주세요");
//     }
//     return <Navigate to="/login" replace />;
//   }

//   return <Outlet />;
// }

// export default ProtectedRoute;

// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useUser } from "../context/UserContext";

// function ProtectedRoute({ requireAuth }) {
//   const { state } = useUser();
//   const login = state && state.memberId;

//   if (!requireAuth && login) {
//     return <Navigate to="/" replace />;
//   }
//   if (requireAuth && !login) {
//     alert("로그인 후 이용해주세요");
//     return <Navigate to="/login" replace />;
//   }
//   return <Outlet />;
// }

// export default ProtectedRoute;
