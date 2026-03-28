import React from "react";
import { Link } from "react-router-dom";
import PageMain from "../layouts/PageMain";
import { PATHS } from "../constants/journey";

const PIPELINE = [
  {
    step: "Your input",
    detail:
      "“Here now” uses only your position, or “Travel” uses a place you type plus optional GPS for the route start.",
  },
  {
    step: "Signals",
    detail:
      "The service blends public and structured safety signals, with sensible fallbacks if a source is unavailable.",
  },
  {
    step: "Scoring",
    detail:
      "A weighted safety score and plain-language factor breakdown for your context.",
  },
  {
    step: "AI layer",
    detail:
      "Short AI briefs and a conversational assistant so you don’t have to read raw metrics alone.",
  },
  {
    step: "Map",
    detail:
      "Area warmth (calmer vs hotter), a suggested safer corridor, incident markers, and weather for where you’re looking.",
  },
  {
    step: "SOS (separate)",
    detail:
      "Emergency in the header anytime — responders and nearby resources; not bundled into the safety-check flow.",
  },
];

export default function HowItWorks() {
  return (
    <PageMain className="bg-white">
      <article className="mx-auto max-w-3xl px-6 pt-28 pb-20">
        <nav className="mb-8 text-sm">
          <Link
            to={PATHS.home}
            className="font-semibold text-slate-500 hover:text-blue-600"
          >
            ← Home
          </Link>
        </nav>

        <header>
          <h1 className="font-headline text-4xl font-extrabold text-[#0e1c2b]">
            How Digital Sentinel works
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Safety check, insights (with AI), and map work together as one
            experience — with SOS always one tap away in the header, outside
            that flow.
          </p>
        </header>

        <section aria-labelledby="pipeline-title" className="mt-12">
          <h2
            id="pipeline-title"
            className="font-headline text-xl font-extrabold text-slate-900"
          >
            Behind the scenes
          </h2>
          <ol className="mt-6 space-y-6">
            {PIPELINE.map((row, i) => (
              <li key={row.step}>
                <div className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-headline text-sm font-black text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-headline font-bold text-slate-900">
                      {row.step}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {row.detail}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="routes-title" className="mt-14">
          <h2
            id="routes-title"
            className="font-headline text-xl font-extrabold text-slate-900"
          >
            Pages in the app
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
            <li>
              <strong>Home</strong> — Overview, live trend preview, start a
              check.
            </li>
            <li>
              <strong>Safety check</strong> — Here or travel, profile, mode,
              time; then jump to insights.
            </li>
            <li>
              <strong>Insights</strong> — Scores, charts, AI; open the map when
              you’re ready.
            </li>
            <li>
              <strong>Map</strong> — Layers for area warmth, your route, and
              reports.
            </li>
            <li>
              <strong>Emergency</strong> — Full-screen SOS and resources; also
              reachable from the header anytime.
            </li>
            <li>
              <strong>This page</strong> — Plain-language explanation of the
              product.
            </li>
          </ul>
        </section>

        <section
          aria-labelledby="demo-cta"
          className="mt-14 rounded-2xl bg-[#0e1c2b] p-8 text-white"
        >
          <h2 id="demo-cta" className="sr-only">
            Start demo
          </h2>
          <p className="font-headline text-lg font-bold">Ready to demo?</p>
          <p className="mt-2 text-sm text-slate-300">
            Developers: run the backend locally (see project README), then try a
            safety check end to end.
          </p>
          <Link
            to={PATHS.assess}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0e1c2b] hover:bg-slate-100"
          >
            Start safety check
            <span className="material-symbols-outlined text-lg">
              arrow_forward
            </span>
          </Link>
        </section>
      </article>
    </PageMain>
  );
}
