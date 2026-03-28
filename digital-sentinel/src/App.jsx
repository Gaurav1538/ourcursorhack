import React from 'react';
<<<<<<< HEAD
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
=======
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
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
  );
}
