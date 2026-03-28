import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import EnvironmentInjector from "./components/layout/EnvironmentInjector";
import Home from "./pages/Home";
import Assess from "./pages/Assess";
import Dashboard from "./pages/Dashboard";
import MapDetail from "./pages/MapDetail";
import Emergency from "./pages/Emergency";
import HowItWorks from "./pages/HowItWorks";

/**
 * App shell: one <header>, route-level <main> inside each page (via PageMain or map main).
 * Journey: Home → Plan trip (/assess) → Safety report (/insights) → Map → Emergency.
 */
export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-[#f8f9fa] antialiased selection:bg-blue-200">
        <EnvironmentInjector />
        <Header />
        <div className="flex flex-1 flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assess" element={<Assess />} />
            <Route path="/insights" element={<Dashboard />} />
            <Route
              path="/dashboard"
              element={<Navigate to="/insights" replace />}
            />
            <Route path="/map" element={<MapDetail />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
