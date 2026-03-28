import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { PATHS } from "../../constants/journey";

const navClass = ({ isActive }) =>
  `pb-1 font-headline text-sm font-semibold tracking-tight transition-colors ${
    isActive
      ? "border-b-2 border-blue-600 text-blue-600"
      : "text-slate-500 hover:text-blue-900"
  }`;

export default function Header() {
  const location = useLocation();
  const onEmergency = location.pathname === PATHS.emergency;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-6">
        <Link
          to={PATHS.home}
          className="font-headline text-xl font-bold tracking-tighter text-[#0e1c2b] transition-opacity hover:opacity-80"
        >
          Digital Sentinel
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          <NavLink to={PATHS.home} className={navClass} end>
            Home
          </NavLink>
          <NavLink to={PATHS.assess} className={navClass}>
            Safety check
          </NavLink>
          <NavLink to={PATHS.insights} className={navClass}>
            Insights
          </NavLink>
          <NavLink to={PATHS.map} className={navClass}>
            Map
          </NavLink>
          <NavLink to={PATHS.howItWorks} className={navClass}>
            How it works
          </NavLink>
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <Link
            to={PATHS.emergency}
            state={location.state}
            aria-label="Emergency help"
            title="Get help now"
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-headline text-sm font-bold text-white shadow-lg transition-all md:px-5 ${
              onEmergency
                ? "bg-[#ba1a1a] shadow-red-500/30"
                : "bg-rose-600 hover:bg-rose-700 hover:shadow-rose-600/30"
            }`}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              error
            </span>
            Emergency
          </Link>
        </div>
      </div>
    </header>
  );
}
