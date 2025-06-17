import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import Report from "./view/Report";
import Notice from "./view/Notice";
// import Home from './view/Home.jsx'

function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      {/* <Home /> */}
      {/* <Report /> */}
      <Notice />
    </BrowserRouter>
  );
}
export default App;
