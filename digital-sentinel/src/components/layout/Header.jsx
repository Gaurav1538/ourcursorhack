import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="flex justify-between items-center px-6 h-16 w-full max-w-[1400px] mx-auto">
        <Link 
            to="/"
            className="text-xl font-bold tracking-tighter text-[#0e1c2b] font-headline hover:opacity-80 transition-opacity"
        >
            Digital Sentinel
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/dashboard"
            className={`pb-1 font-headline font-semibold tracking-tight text-sm active:scale-95 duration-200 transition-colors ${currentPath === '/dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-blue-900'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/map"
            className={`pb-1 font-headline font-semibold tracking-tight text-sm active:scale-95 duration-200 transition-colors ${currentPath === '/map' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-blue-900'}`}
          >
            Map View
          </Link>
        </nav>

        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors active:scale-95 duration-200">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors active:scale-95 duration-200">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
          
          <Link 
            to="/emergency"
            className={`px-5 py-2 rounded-full text-white font-headline font-bold text-sm active:scale-95 duration-200 shadow-lg flex items-center gap-2 transition-all ${currentPath === '/emergency' ? 'bg-[#ba1a1a] shadow-red-500/30' : 'bg-rose-600 hover:bg-rose-700 hover:shadow-rose-600/30'}`}
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
            Emergency
          </Link>
        </div>
      </div>
    </header>
  );
}