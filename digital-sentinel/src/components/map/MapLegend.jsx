import React from 'react';

/** On-map key: readable on light basemaps (no heavy black panel) */
export default function MapLegend() {
  const rows = [
    { swatch: 'bg-emerald-500', label: 'Cooler / relatively calmer zones' },
    { swatch: 'bg-amber-400', label: 'Warm — pay a bit more attention' },
    { swatch: 'bg-red-500', label: 'Hot — higher attention or incidents' },
    { swatch: 'bg-violet-600', label: 'Local area — finer risk pattern' },
    { line: 'border-t-2 border-emerald-500 border-dashed', label: 'Suggested safer path' },
    { dot: 'bg-blue-600 ring-2 ring-white shadow-sm', label: 'You (start)' },
    { dot: 'bg-slate-700 ring-2 ring-white shadow-sm', label: 'Where you’re heading' },
  ];

  return (
    <div
      className="pointer-events-none absolute bottom-4 left-4 z-[400] max-w-[240px] rounded-xl border border-slate-300/90 bg-white/95 p-3.5 text-[11px] leading-snug text-slate-800 shadow-lg backdrop-blur-sm md:max-w-[270px] md:text-[12px]"
      aria-label="Map legend"
    >
      <p className="mb-2.5 font-headline text-xs font-bold uppercase tracking-wider text-slate-700">
        Map key
      </p>
      <ul className="space-y-2.5">
        {rows.map((row, i) => (
          <li key={i} className="flex items-center gap-2.5">
            {row.swatch && (
              <span className={`h-3.5 w-3.5 shrink-0 rounded-full shadow-sm ${row.swatch}`} aria-hidden />
            )}
            {row.dot && (
              <span className={`h-3.5 w-3.5 shrink-0 rounded-full ${row.dot}`} aria-hidden />
            )}
            {row.line && (
              <span className={`h-0 w-7 shrink-0 ${row.line}`} aria-hidden />
            )}
            <span className="text-slate-700">{row.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
