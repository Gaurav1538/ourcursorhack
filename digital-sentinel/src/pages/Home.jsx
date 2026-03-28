import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTrends } from "../api";
import PageMain from "../layouts/PageMain";
import { PATHS } from "../constants/journey";

export default function Home() {
  const [networkPulse, setNetworkPulse] = useState(null);

  useEffect(() => {
    getTrends()
      .then(setNetworkPulse)
      .catch(() => setNetworkPulse(null));
  }, []);

  return (
    <PageMain className="bg-white relative overflow-hidden">
      <div
        className="pointer-events-none absolute top-0 right-0 -z-10 h-[90vh] w-[60%] rounded-bl-full bg-gradient-to-bl from-blue-50/80 via-indigo-50/20 to-transparent"
        aria-hidden
      />

      <header className="px-6 pt-28 pb-8 max-w-[1400px] mx-auto">
        <p className="font-label text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-blue-600">
          Personalized travel safety
        </p>
        <h1 className="font-headline mt-3 text-4xl font-extrabold tracking-tight text-[#0f172a] md:text-5xl lg:text-6xl">
          Decision support for safer movement
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Run a safety check for where you are or where you’re going, read
          insights and AI guidance, then open the live map. Your browser can
          share location for a real starting point when you allow it.{" "}
          <strong className="font-semibold text-slate-800">
            Emergency (SOS)
          </strong>{" "}
          is always in the header — not part of that flow.
        </p>
        <nav
          aria-label="Primary actions"
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link
            to={PATHS.assess}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
          >
            Run safety check
            <span className="material-symbols-outlined text-lg">
              arrow_forward
            </span>
          </Link>
          <Link
            to={PATHS.howItWorks}
            className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50/50"
          >
            How the system works
          </Link>
        </nav>
      </header>

      <section
        aria-labelledby="flow-heading"
        className="px-6 py-12 max-w-[1400px] mx-auto border-y border-slate-100 bg-slate-50/50"
      >
        <h2
          id="flow-heading"
          className="font-headline text-2xl font-extrabold text-[#0e1c2b]"
        >
          What you can do
        </h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Safety check",
              body: "Choose “here” or a destination, your traveler profile, how you move, and time of day. Optional GPS anchors the map to your real start.",
            },
            {
              title: "Insights",
              body: "Scores, trends, factor breakdown, Sentinel AI briefs, and chat-style help in one place.",
            },
            {
              title: "Map",
              body: "Greener vs warmer areas, safer-path hint, reports, and weather — all tied to your context.",
            },
          ].map((item) => (
            <li key={item.title}>
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-headline text-lg font-extrabold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.body}
                </p>
              </article>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl rounded-2xl border border-rose-100 bg-rose-50/60 px-5 py-4 text-sm text-slate-700">
          <span className="font-headline font-bold text-rose-700">
            Emergency SOS
          </span>{" "}
          — Top bar on every screen when you need urgent help. Separate from
          checking a place or route.
        </p>
      </section>

      {networkPulse && Array.isArray(networkPulse.weeklyIncidents) && (
        <section
          aria-labelledby="trends-heading"
          className="px-6 py-16 max-w-[1400px] mx-auto"
        >
          <h2 id="trends-heading" className="sr-only">
            Network incident trends
          </h2>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0e1c2b] via-[#1a2d44] to-[#0e1c2b] p-8 text-white shadow-2xl">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
              <div className="lg:w-1/3">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-cyan-300/90">
                  Live signal
                </p>
                <p className="font-headline mt-2 text-2xl font-extrabold">
                  Regional incident cadence
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Same incident cadence you’ll see in your insights after you
                  run a check.
                </p>
              </div>
              <div className="flex h-24 flex-1 items-end gap-1.5">
                {networkPulse.weeklyIncidents.map((n, i) => {
                  const mx = Math.max(...networkPulse.weeklyIncidents, 1);
                  return (
                    <div
                      key={i}
                      className="group flex h-full flex-1 flex-col justify-end"
                    >
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-cyan-500 to-blue-400 opacity-90 transition-opacity group-hover:opacity-100"
                        style={{ height: `${Math.max(12, (n / mx) * 100)}%` }}
                      />
                      <span className="mt-1 text-center text-[0.55rem] font-bold text-slate-500">
                        {i + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col items-start gap-2 lg:w-48 lg:items-end">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Trajectory
                </span>
                <span className="font-headline text-3xl font-black text-emerald-400">
                  {networkPulse.overallTrend || "—"}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
    </PageMain>
  );
}
