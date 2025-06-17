import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import Report from "./view/Report";
// import Home from "./view/Home.jsx";

function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      {/* <Home /> */}
      <Report />
    </BrowserRouter>
  );
}
export default App;
