import React from 'react';

export default function Header({ currentPage, setCurrentPage }) {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/20 dark:border-slate-800/20 shadow-sm">
      <div className="flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto">
        <div 
            className="text-xl font-bold tracking-tighter text-blue-900 dark:text-blue-50 font-headline cursor-pointer"
            onClick={() => setCurrentPage('landing')}
        >
            Digital Sentinel
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => setCurrentPage('dashboard')}
            className={`pb-1 font-headline font-semibold tracking-tight text-sm active:scale-95 duration-200 transition-colors ${currentPage === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-blue-900'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentPage('map')}
            className={`pb-1 font-headline font-semibold tracking-tight text-sm active:scale-95 duration-200 transition-colors ${currentPage === 'map' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-blue-900'}`}
          >
            Map
          </button>
        </nav>

        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-slate-500 hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-slate-500 hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
          
          <button 
            onClick={() => setCurrentPage('emergency')}
            className={`px-4 py-2 rounded-full text-white font-headline font-bold text-sm active:scale-95 duration-200 shadow-lg flex items-center gap-2 transition-all ${currentPage === 'emergency' ? 'bg-error emergency-glow shadow-error/20' : 'bg-rose-600 hover:bg-rose-700'}`}
          >
            {currentPage === 'emergency' && <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>}
            Emergency
          </button>
        </div>
      </div>
    </header>
  );
}