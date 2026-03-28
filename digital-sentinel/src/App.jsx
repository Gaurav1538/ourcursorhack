import React, { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import MapDetail from './pages/MapDetail';
import Emergency from './pages/Emergency';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const renderPage = () => {
    switch(currentPage) {
      case 'landing': return <Landing setCurrentPage={setCurrentPage} />;
      case 'dashboard': return <Dashboard setCurrentPage={setCurrentPage} />;
      case 'map': return <MapDetail setCurrentPage={setCurrentPage} />;
      case 'emergency': return <Emergency />;
      default: return <Landing setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col antialiased font-body">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
      <Footer />
    </div>
  );
}