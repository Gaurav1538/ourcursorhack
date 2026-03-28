import React from "react";

/**
 * Single top-level landmark per route (avoids nested <main> with App shell).
 */
export default function PageMain({
  children,
  className = "",
  id = "main-content",
}) {
  return (
    <main
      id={id}
      className={`min-h-screen flex-grow font-body text-slate-900 ${className}`.trim()}
    >
      {children}
    </main>
  );
}
