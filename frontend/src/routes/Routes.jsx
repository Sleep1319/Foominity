import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../view/home/Home.jsx";
import Report from "../view/report/Report.jsx";
import Login from "../view/Sign/Login.jsx";
import Register from "../view/Sign/Register.jsx";
import Notice from "@/view/notice/Notice.jsx";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../view/member/Profile.jsx";
import EditProfile from "../view/member/EditProfile.jsx";
import MyPage from "../view/member/MyPage.jsx";
import ReportDetails from "../view/report/ReportDetails.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/report" element={<Report />} />
      <Route path="/report/report-details" element={<ReportDetails />} />
      <Route path="/notice" element={<Notice />} />
      <Route element={<ProtectedRoute requireAuth={false} />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<ProtectedRoute requireAuth={true} />}>
        {/* 로그인 필수 페이지 */}
        <Route path="/mypage/*" element={<MyPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
