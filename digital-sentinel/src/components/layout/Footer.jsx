import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-auto border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-body text-xs font-medium uppercase tracking-widest relative z-50">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 w-full max-w-7xl mx-auto gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="text-slate-900 dark:text-slate-100">© 2026 Digital Sentinel. All rights reserved.</p>
        </div>
        <div className="flex gap-8">
          <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Privacy</a>
          <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Support</a>
          <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Documentation</a>
        </div>
        <div className="flex gap-4">
          <button className="w-10 h-10 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center hover:opacity-70 transition-opacity">
            <span className="material-symbols-outlined text-sm">security</span>
          </button>
          <button className="w-10 h-10 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center hover:opacity-70 transition-opacity">
            <span className="material-symbols-outlined text-sm">language</span>
          </button>
        </div>
      </div>
    </footer>
  );
}