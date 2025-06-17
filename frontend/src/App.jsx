import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppNavbar from './components/AppNavbar'
import AppRoutes from "@/routes/Routes.jsx";
import Home from './view/Home.jsx'

function App() {
    return (
        <BrowserRouter>
            <AppNavbar />
            <AppRoutes/>
        </BrowserRouter>
    )
}
export default App;
