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
import NoticeDetails from "../view/notice/NoticeDetails.jsx";
import SocialRegister from "@/view/Sign/SocialRegister.jsx";
import Review from "@/view/review/Review.jsx";
import ReviewDetails from "@/view/review/ReviewDetails.jsx";
import CreateReview from "../view/review/CreateReviews.jsx";

import BoardLists from "./../view/board/BoardLists";
import BoardCreateRun from "../view/board/BoardCreateRun.jsx";
import BoardDetails from "./../view/board/BoardDetails";
import BoardUpdateRun from "../view/board/BoardUpdateRun.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/report" element={<Report />} />
      <Route path="/report/report-details" element={<ReportDetails />} />
      <Route path="/notice" element={<Notice />} />
      <Route path="/notice/:id" element={<NoticeDetails />} />
      <Route path="/review" element={<Review />} />
      <Route path="/review/:id" element={<ReviewDetails />} />
      <Route element={<ProtectedRoute requireAuth={false} />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/social-sign-up" element={<SocialRegister />} />
      </Route>
      <Route element={<ProtectedRoute requireAuth={true} />}>
        {/* 로그인 필수 페이지 */}
        <Route path="/mypage/*" element={<MyPage />} />
        <Route path="/review/create" element={<CreateReview />} />
      </Route>

      {/* 자유게시판 */}
      <Route path="/board" element={<BoardLists />} />
      <Route path="/board/create" element={<BoardCreateRun />} />
      <Route path="/board/:id" element={<BoardDetails />} />
      <Route path="/board/update/:id" element={<BoardUpdateRun />} />
    </Routes>
  );
}

export default AppRoutes;
