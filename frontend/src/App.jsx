import React from "react";
<<<<<<< HEAD
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
=======
import AppNavBar from "./layouts/AppNavBar.jsx";
import AppRoutes from "@/routes/Routes.jsx";
import AppFooter from "@/layouts/AppFooter.jsx";
import {UserProvider} from "@/context/UserContext.jsx";

function App() {
  return (
        <UserProvider>
            <AppNavBar />
            <AppRoutes />
            <AppFooter />
        </UserProvider>
>>>>>>> 9d1ac4bc96d2eb214d0eba49d90f401340a1de47
  );
}
export default App;
