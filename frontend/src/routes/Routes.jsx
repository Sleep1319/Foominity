import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../view/Home.jsx";
import Report from "../view/Report.jsx";
import Notice from "../view/Notice.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/report" element={<Report />} />
      <Route path="/notice" element={<Notice />} />
    </Routes>
  );
}

export default AppRoutes;
