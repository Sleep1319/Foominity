import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppNavBar from "./components/AppNavBar";
import AppRoutes from "@/routes/Routes.jsx";
import Home from "./view/Home.jsx";

function App() {
  return (
    <BrowserRouter>
      <AppNavBar />
      <AppRoutes />
    </BrowserRouter>
  );
}
export default App;
