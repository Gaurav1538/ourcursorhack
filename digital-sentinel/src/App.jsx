import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import EnvironmentInjector from './components/layout/EnvironmentInjector';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import MapDetail from './pages/MapDetail';
import Emergency from './pages/Emergency';

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-[#f8f9fa] min-h-screen flex flex-col antialiased selection:bg-blue-200">
        <EnvironmentInjector />
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<MapDetail />} />
            <Route path="/emergency" element={<Emergency />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
