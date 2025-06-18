import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../view/Home.jsx";
import Report from "../view/Report.jsx";
import Login from "./../view/Login";
import Register from "./../view/Register";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/report" element={<Report />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default AppRoutes;
