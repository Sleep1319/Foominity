import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";

function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
    </BrowserRouter>
  );
}
export default App;
