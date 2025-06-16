import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppNavbar from './components/AppNavbar'
import Home from './view/Home.jsx'

function App() {
    return (
        <BrowserRouter>
            <AppNavbar />
            <Home />
        </BrowserRouter>
    )
}
export default App;
