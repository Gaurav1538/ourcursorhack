import React from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../constants/journey";

export default function Footer() {
  return (
    <footer className="relative z-50 mt-auto w-full border-t border-slate-200 bg-slate-50 py-8 font-body text-xs font-medium uppercase tracking-widest">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-8 md:flex-row md:justify-between">
        <p className="text-slate-900">© 2026 Digital Sentinel</p>
        <nav
          className="flex flex-wrap justify-center gap-8"
          aria-label="Footer"
        >
          <a
            href="#"
            className="text-slate-500 transition-colors hover:text-blue-600"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-slate-500 transition-colors hover:text-blue-600"
          >
            Support
          </a>
          <Link
            to={PATHS.howItWorks}
            className="text-slate-500 transition-colors hover:text-blue-600"
          >
            Documentation
          </Link>
        </nav>
        <div className="flex gap-4" aria-hidden>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200/50">
            <span className="material-symbols-outlined text-sm">security</span>
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200/50">
            <span className="material-symbols-outlined text-sm">language</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
