import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppNavBar from "./components/AppNavBar";
import Home from "./view/Home.jsx";
import FreeBoardList from "./view/FreeBoardList.jsx";

function App() {
  return (
    <BrowserRouter>
      <AppNavBar />
      <FreeBoardList />
      {/* <Home /> */}
    </BrowserRouter>
  );
}
export default App;
