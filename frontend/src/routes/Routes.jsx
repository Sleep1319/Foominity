import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../view/home/Home.jsx";

import Register from "../view/Sign/Register.jsx";

import ProtectedRoute from "./ProtectedRoute";
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
import NoticeLists from "../view/notice/NoticeLists.jsx";
import NoticeCreateRun from "../view/notice/NoticeCreateRun.jsx";

import ReportCreateRun from "../view/report/ReportCreateRun.jsx";
import ReportLists from "../view/report/ReportLists.jsx";
import DeleteComplete from "../view/member/DeleteComplete.jsx";
import MyMusic from "../view/member/MyMusic.jsx";
import ParticipatedAlbumsList from "../components/memberComponents/ParticipatedAlbumsList.jsx";

import FindPassword from "../view/Sign/FindPassword.jsx";
import LoginPage from "../view/Sign/LoginPage.jsx";
import ChangePassword from "../view/Sign/ChangePassword.jsx";

import ArtistDetails from "../view/artist/ArtistDetails.jsx";
import ArtistEdits from "../view/artist/ArtistEdits.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/changepassword" element={<ChangePassword />} />
      <Route path="/findpassword" element={<FindPassword />} />
      <Route path="/report" element={<ReportLists />} />
      <Route path="/report/:id" element={<ReportDetails />} />
      <Route path="/notice" element={<NoticeLists />} />
      <Route path="/notice/:id" element={<NoticeDetails />} />
      <Route path="/review" element={<Review />} />
      <Route path="/review/:id" element={<ReviewDetails />} />
      <Route path="/deletecomplete" element={<DeleteComplete />} />
      <Route path="/artist/:id" element={<ArtistDetails />} />
      <Route element={<ProtectedRoute requireAuth={false} />}>
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/social-sign-up" element={<SocialRegister />} />
      </Route>
      <Route element={<ProtectedRoute requireAuth={true} />}>
        {/* 로그인 필수 페이지 */}
        <Route path="/mypage/*" element={<MyPage />} />
        <Route path="/mymusic/" element={<MyMusic />} />
        <Route path="/review/create" element={<CreateReview />} />
        <Route path="/artist/update/:id" element={<ArtistEdits />} />
      </Route>
      <Route path="/mymusic/participatedalbumslist" element={<ParticipatedAlbumsList />} />

      {/* 자유게시판 */}
      <Route path="/board" element={<BoardLists />} />
      <Route path="/board/create" element={<BoardCreateRun />} />
      <Route path="/board/:id" element={<BoardDetails />} />
      <Route path="/board/update/:id" element={<BoardUpdateRun />} />

      {/* Notice */}
      <Route path="/notice/create" element={<NoticeCreateRun />} />

      {/* Report */}
      <Route path="/report/create" element={<ReportCreateRun />} />
    </Routes>
  );
}

export default AppRoutes;
