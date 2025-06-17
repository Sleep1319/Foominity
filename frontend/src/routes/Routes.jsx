import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../view/Home.jsx"
import Report from "../view/Report.jsx"

function AppRoutes() {
    return (
        <Routes>
            <Route path="/home" element={<Home/>} />
            <Route path="report" element={<Report/>}/>
        </Routes>
    );
}

export default AppRoutes;