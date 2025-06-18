import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../view/Home.jsx";
import Report from "../view/Report.jsx";
import Login from "./../view/Login";
import Register from "./../view/Register";
import Notice from "@/view/Notice.jsx";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="/notie" element={<Notice/>} />
        <Route element={<ProtectedRoute requireAuth={false}/> }>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute requireAuth={true}/> }>
        {/* 로그인 필수 페이지 */}
        </Route>
    </Routes>
    );
}

export default AppRoutes;
