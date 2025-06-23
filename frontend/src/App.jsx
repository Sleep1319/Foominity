import React from "react";
import AppNavBar from "./layouts/AppNavBar.jsx";
import AppRoutes from "@/routes/Routes.jsx";
import AppFooter from "@/layouts/AppFooter.jsx";
import { UserProvider } from "@/context/UserContext.jsx";
import BoardCreateRun from "./view/board/BoardCreateRun";

function App() {
  return (
    <UserProvider>
      <AppNavBar />
      {/* <BoardCreateRun /> */}
      <AppRoutes />
      <AppFooter />
    </UserProvider>
  );
}
export default App;
