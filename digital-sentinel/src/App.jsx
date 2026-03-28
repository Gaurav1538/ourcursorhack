import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MapDetail from './pages/MapDetail.jsx';
import Emergency from './pages/Emergency.jsx';

export default function App() {
  return (
    <Router>
      <div className="bg-background min-h-screen flex flex-col antialiased font-body">
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<MapDetail />} />
          <Route path="/emergency" element={<Emergency />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
