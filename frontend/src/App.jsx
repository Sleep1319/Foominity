import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppNavBar from "./components/AppNavBar";
import AppRoutes from "@/routes/Routes.jsx";
import { UserProvider } from "@/context/UserContext.jsx";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppNavBar />
        <AppRoutes />
      </UserProvider>
    </BrowserRouter>
  );
}
export default App;
