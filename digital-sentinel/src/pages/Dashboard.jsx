import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  analyzeSafety,
  getTrends,
  chatAssistant,
  getRiskScore,
  getRiskDetailed,
  getNearbyIncidents,
  getLocationHeatmap,
  askAi,
  geocodeAddress,
} from "../api";
import { fetchOpenMeteoCurrent } from "../utils/weather";
import PageMain from "../layouts/PageMain";
import { PATHS, tripNavigationState, REPORT_MODE } from "../constants/journey";

function inferRecentTrend(weekly) {
  if (!Array.isArray(weekly) || weekly.length < 2) return null;
  const last = weekly[weekly.length - 1];
  const prev = weekly[weekly.length - 2];
  if (last > prev) return "Up vs prior week (from incident counts)";
  if (last < prev) return "Down vs prior week (from incident counts)";
  return "Stable (from incident counts)";
}

/** Insights view — user chose “here” or “travel”; no step wizard in the UI. */
export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState(null);
  const [chatQuery, setChatQuery] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [positionIntel, setPositionIntel] = useState(null);
  const [weather, setWeather] = useState(null);

  const reportMode = location.state?.reportMode ?? REPORT_MODE.TRAVEL;
  const fromPlanner = Boolean(location.state?.destination);
  const searchTarget = location.state?.destination || "London, UK";
  const profile = location.state?.profile || "solo";
  const rawTime = location.state?.time ?? new Date().getHours();
  const time =
    typeof rawTime === "number"
      ? rawTime
      : (() => {
          const d = new Date(rawTime);
          return Number.isNaN(d.getTime())
            ? new Date().getHours()
            : d.getHours();
        })();
  const coords = location.state?.coords ?? null;
  const mode = location.state?.mode ?? "walking";

  const carryState = () =>
    tripNavigationState({
      destination: searchTarget,
      profile,
      time: location.state?.time !== undefined ? location.state.time : time,
      coords,
      mode,
      currentLocation:
        location.state?.currentLocation ??
        (reportMode === REPORT_MODE.HERE && coords?.lat != null
          ? { lat: coords.lat, lng: coords.lng }
          : null),
      reportMode,
    });

  /** “Here” = score where you are. “Travel” = score the destination area (not your home GPS). */
  /** Same coordinates you confirmed on Safety check — not live GPS on this page */
  const focalPoint = useMemo(() => {
    if (reportMode === REPORT_MODE.HERE) {
      const here =
        coords?.lat != null && coords?.lng != null
          ? coords
          : location.state?.currentLocation;
      if (here?.lat != null && here?.lng != null)
        return { lat: here.lat, lng: here.lng };
      return null;
    }
    if (coords?.lat != null && coords?.lng != null)
      return { lat: coords.lat, lng: coords.lng };
    return null;
  }, [
    reportMode,
    location.state?.currentLocation?.lat,
    location.state?.currentLocation?.lng,
    coords?.lat,
    coords?.lng,
  ]);

  useEffect(() => {
    if (!focalPoint) {
      setPositionIntel(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const [quick, detail, nearby, microHeat, aiRes] = await Promise.all([
        getRiskScore(focalPoint.lat, focalPoint.lng),
        getRiskDetailed(focalPoint.lat, focalPoint.lng),
        getNearbyIncidents(focalPoint.lat, focalPoint.lng, 2),
        getLocationHeatmap(focalPoint.lat, focalPoint.lng, 2),
        askAi(
          reportMode === REPORT_MODE.HERE
            ? "One short paragraph: safety snapshot for someone at this GPS position now."
            : "One short paragraph: safety snapshot for a traveler heading to this destination.",
          { destination: searchTarget, profile, mode, reportMode },
        ),
      ]);
      if (!cancelled) {
        setPositionIntel({ quick, detail, nearby, microHeat, ai: aiRes });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    focalPoint?.lat,
    focalPoint?.lng,
    searchTarget,
    profile,
    mode,
    reportMode,
  ]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      let lat = focalPoint?.lat;
      let lng = focalPoint?.lng;
      if (lat == null || lng == null) {
        const g = await geocodeAddress(searchTarget);
        if (g?.lat != null && g?.lng != null) {
          lat = g.lat;
          lng = g.lng;
        }
      }
      const result = await analyzeSafety(
        searchTarget,
        searchTarget,
        profile,
        time,
        lat,
        lng,
      );
      if (cancelled) return;
      setData({
        safetyScore:
          typeof result?.score === "number" ? result.score : 82,
        riskLevel: result.riskLevel || "Low",
        location: searchTarget,
        intelligenceBrief:
          result.insights?.[0] ||
          "Area intelligence loaded. Proceed with standard caution.",
        insights: result.insights || [],
        signals:
          result.recommendations?.map((rec, i) => ({
            title: "Sentinel Advisory " + (i + 1),
            detail: rec,
            icon: "security",
            colorClass:
              "border border-slate-200 bg-slate-100 text-slate-800 shadow-sm",
          })) || [],
        breakdown: result.breakdown || { lighting: 90, cctv: 85 },
      });
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [searchTarget, profile, time, focalPoint?.lat, focalPoint?.lng]);

  useEffect(() => {
    const fetchTrends = async () => {
      const t = await getTrends();
      setTrends(t || null);
    };
    fetchTrends();
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let lat;
      let lng;
      if (focalPoint?.lat != null && focalPoint?.lng != null) {
        lat = focalPoint.lat;
        lng = focalPoint.lng;
      } else {
        const g = await geocodeAddress(searchTarget);
        if (g?.lat != null && g?.lng != null) {
          lat = g.lat;
          lng = g.lng;
        }
      }
      if (lat == null || cancelled) {
        if (!cancelled) setWeather(null);
        return;
      }
      const w = await fetchOpenMeteoCurrent(lat, lng);
      if (!cancelled) setWeather(w);
    })();
    return () => {
      cancelled = true;
    };
  }, [focalPoint?.lat, focalPoint?.lng, searchTarget]);

  const sendChat = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!chatQuery) return;
    const userMsg = {
      from: "user",
      text: chatQuery,
      time: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    const q = chatQuery;
    setChatQuery("");
    setAssistantLoading(true);
    try {
      const res = await chatAssistant(q);
      const replyText = res?.reply || "No assistant response available.";
      const botMsg = {
        from: "bot",
        text: replyText,
        time: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch {
      const botMsg = {
        from: "bot",
        text: "Assistant error. Try again later.",
        time: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }
    setAssistantLoading(false);
  };

  if (loading) {
    return (
      <PageMain className="flex min-h-screen items-center justify-center bg-slate-50">
        <div
          className="flex flex-col items-center gap-4"
          role="status"
          aria-live="polite"
        >
          <span className="material-symbols-outlined animate-spin text-blue-600 text-4xl">
            sync
          </span>
          <p className="font-headline font-bold text-slate-600 tracking-widest uppercase text-sm">
            Synthesizing threat data…
          </p>
        </div>
      </PageMain>
    );
  }

  return (
    <PageMain className="bg-slate-50 pb-16 pt-24">
      <div className="mx-auto w-full max-w-[1400px] px-6">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm">
          <ol className="flex flex-wrap items-center gap-2 text-slate-500">
            <li>
              <Link
                to={PATHS.home}
                className="font-semibold hover:text-blue-600"
              >
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                to={PATHS.assess}
                className="font-semibold hover:text-blue-600"
              >
                Safety check
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="font-semibold text-slate-800" aria-current="page">
              Insights
            </li>
          </ol>
        </nav>

        {!fromPlanner && (
          <section
            aria-label="Demo context"
            className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950"
          >
            <p>
              No assessment context — <strong>demo report</strong> for{" "}
              <strong>{searchTarget}</strong>.{" "}
              <Link
                to={PATHS.assess}
                className="font-bold text-blue-700 underline hover:no-underline"
              >
                Run a safety check
              </Link>
              .
            </p>
          </section>
        )}

        {fromPlanner && reportMode === REPORT_MODE.HERE && (
          <section
            aria-label="Here mode"
            className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-950"
          >
            <strong className="font-headline">Right where you are</strong> —
            this view is built around your current area. Checking a trip
            instead?{" "}
            <Link
              to={PATHS.assess}
              className="font-bold text-blue-700 underline hover:no-underline"
            >
              Switch to travel mode
            </Link>
            .
          </section>
        )}

        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-headline text-2xl font-extrabold text-slate-800 md:text-3xl">
              {reportMode === REPORT_MODE.HERE
                ? "Safety around you"
                : "Safety for your trip"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              {reportMode === REPORT_MODE.HERE
                ? "A snapshot of the area you’re in right now — score, trends, and what to watch."
                : "A snapshot for where you’re going — open the map to see safer paths, heat patterns, and reports nearby."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to={PATHS.assess}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
            >
              <span className="material-symbols-outlined text-[18px]">
                tune
              </span>
              Change place or mode
            </Link>
            <button
              type="button"
              onClick={() => navigate(PATHS.map, { state: carryState() })}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              <span className="material-symbols-outlined text-[18px]">map</span>
              Open map
            </button>
          </div>
        </header>

        {positionIntel && focalPoint && (
          <section
            aria-labelledby="ai-spotlight-heading"
            className="mb-10 rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50/80 p-6 shadow-md md:p-8"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-800 shadow-lg ring-2 ring-violet-300/70">
                  <span
                    className="material-symbols-outlined text-3xl text-white drop-shadow-md"
                    style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}
                  >
                    smart_toy
                  </span>
                </div>
                <div>
                  <h2
                    id="ai-spotlight-heading"
                    className="font-headline text-xl font-extrabold text-slate-800 md:text-2xl"
                  >
                    Sentinel AI
                  </h2>
                  <p className="text-sm text-slate-600">
                    Plain-language summary for your situation
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-6 text-base leading-relaxed text-slate-700 md:text-lg">
              {positionIntel.ai?.answer ||
                positionIntel.ai?.reply ||
                "Summary will appear when location data is available."}
            </p>
          </section>
        )}

        <section
          aria-labelledby="score-brief-heading"
          className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-12"
        >
          <h2 id="score-brief-heading" className="sr-only">
            Score and intelligence brief
          </h2>
          <article className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-8 shadow-md lg:col-span-4">
            <div
              className={`absolute left-0 top-0 h-full w-1 ${data?.safetyScore > 80 ? "bg-emerald-500" : data?.safetyScore > 50 ? "bg-amber-500" : "bg-rose-600"}`}
              aria-hidden
            />
            <div>
              <span className="mb-2 block font-label text-[0.6875rem] font-bold uppercase tracking-wider text-slate-500">
                Live safety index
              </span>
              <div className="flex items-baseline gap-2">
                <p className="font-headline text-6xl font-extrabold text-slate-800">
                  {data?.safetyScore}
                  <span className="text-2xl font-medium text-slate-400">
                    /100
                  </span>
                </p>
              </div>
              <p
                className={`mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${data?.safetyScore > 80 ? "border-emerald-100 bg-emerald-50 text-emerald-700" : data?.safetyScore > 50 ? "border-amber-100 bg-amber-50 text-amber-700" : "border-rose-100 bg-rose-50 text-rose-700"}`}
              >
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {data?.safetyScore > 80 ? "verified_user" : "warning"}
                </span>
                Risk level: {data?.riskLevel}
              </p>
            </div>
            <p className="mt-8 text-sm leading-relaxed text-slate-600">
              For{" "}
              <span className="font-bold text-slate-800">{data?.location}</span>{" "}
              we combine live signals, infrastructure cues, and recent activity
              into one score.
            </p>
          </article>

          <article className="flex flex-col justify-center rounded-2xl border border-slate-200/50 bg-white p-8 shadow-md lg:col-span-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0e1c2b] to-[#233141] shadow-lg ring-2 ring-slate-600/40">
                <span
                  className="material-symbols-outlined text-2xl text-white drop-shadow-md"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}
                >
                  auto_awesome
                </span>
              </div>
              <h3 className="font-headline text-2xl font-extrabold text-slate-800">
                Sentinel intelligence brief
              </h3>
            </div>
            <blockquote className="min-h-[80px] rounded-xl border border-slate-100 bg-slate-50 p-5 text-lg italic leading-relaxed text-slate-700 shadow-inner">
              &ldquo;{data?.intelligenceBrief}&rdquo;
            </blockquote>
            {trends && (
              <aside className="mt-6 rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-sm">
                <p className="font-bold text-slate-700">Regional trends</p>
                <p className="mt-1 text-xs text-slate-600">
                  Trajectory:{" "}
                  <strong>
                    {trends.overallTrend ||
                      inferRecentTrend(trends.weeklyIncidents) ||
                      "Not provided by server"}
                  </strong>
                  {trends.weeklyIncidents && (
                    <span className="mt-1 block text-slate-500">
                      Weekly series: {trends.weeklyIncidents.join(", ")}
                    </span>
                  )}
                </p>
              </aside>
            )}
          </article>
        </section>

        <section
          aria-labelledby="weather-heading"
          className="mb-10 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-slate-50 p-5 shadow-sm md:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-md ring-2 ring-sky-300/80">
                <span
                  className="material-symbols-outlined text-3xl drop-shadow"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}
                >
                  partly_cloudy_day
                </span>
              </div>
              <div>
                <h2
                  id="weather-heading"
                  className="font-headline text-lg font-extrabold text-slate-800"
                >
                  Weather at this location
                </h2>
                <p className="text-xs text-slate-500">
                  Open-Meteo (no key) · same coordinates as your safety report
                </p>
              </div>
            </div>
            {weather ? (
              <div className="text-left sm:text-right">
                <p className="font-headline text-3xl font-black text-slate-800">
                  {Math.round(weather.temperature)}°C
                </p>
                <p className="text-sm text-slate-600">
                  Wind {weather.windspeed} m/s
                  {weather.weathercode != null && (
                    <span className="block text-xs text-slate-500">
                      Code {weather.weathercode}
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Waiting for coordinates… If this stays empty, run Safety check
                with a clear place name.
              </p>
            )}
          </div>
        </section>

        {positionIntel && focalPoint && (
          <section
            aria-labelledby="around-you-heading"
            className="mb-12 grid grid-cols-1 gap-4 lg:grid-cols-12"
          >
            <h2 id="around-you-heading" className="sr-only">
              Around this location
            </h2>
            <article className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-md lg:col-span-4">
              <h3 className="font-headline text-sm font-extrabold uppercase tracking-wider text-slate-500">
                Risk at a glance
              </h3>
              <p className="mt-2 font-headline text-4xl font-black text-slate-800">
                {positionIntel.quick?.score ?? "—"}
                <span className="text-lg font-medium text-slate-400">/100</span>
              </p>
              <p className="mt-2 text-xs text-slate-600">
                Quick read for this point on the map.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-md lg:col-span-4">
              <h3 className="font-headline text-sm font-extrabold uppercase tracking-wider text-slate-500">
                What’s driving the score
              </h3>
              <p className="mt-2 text-sm font-bold text-slate-800">
                {positionIntel.detail?.riskLevel ?? "—"} ·{" "}
                {positionIntel.detail?.score ?? "—"}/100
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                {(positionIntel.detail?.factors || []).join(" · ") ||
                  "No extra detail returned."}
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-md lg:col-span-4">
              <h3 className="font-headline text-sm font-extrabold uppercase tracking-wider text-slate-500">
                Reports nearby
              </h3>
              <p className="mt-2 font-headline text-3xl font-black text-rose-600">
                {Array.isArray(positionIntel.nearby)
                  ? positionIntel.nearby.length
                  : 0}
              </p>
              <p className="text-xs text-slate-600">
                Community or official reports in the area we’re watching.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-md lg:col-span-12">
              <h3 className="font-headline text-sm font-extrabold uppercase tracking-wider text-slate-500">
                Heat near you
              </h3>
              <p className="mt-2 text-sm text-slate-700">
                {Array.isArray(positionIntel.microHeat) &&
                positionIntel.microHeat.length > 0
                  ? `We found ${positionIntel.microHeat.length} risk “patches” around this spot — on the map, greener tends to mean calmer and warmer colors mean pay more attention.`
                  : "No local heat pattern returned — the map may still show the wider area view."}
              </p>
            </article>
          </section>
        )}

        <section aria-labelledby="sentinel-chat-heading" className="mb-12">
          <div className="overflow-hidden rounded-2xl border-2 border-indigo-200 bg-white shadow-lg">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 text-white md:px-6 md:py-5">
              <h2
                id="sentinel-chat-heading"
                className="font-headline text-xl font-extrabold md:text-2xl"
              >
                Sentinel chat
              </h2>
              <p className="mt-1 max-w-2xl text-sm font-medium text-white/95">
                Full-width assistant — ask about safety, this area, or your trip
                in plain language.
              </p>
            </div>
            <div className="grid min-h-[min(420px,55vh)] lg:grid-cols-12">
              <div className="flex min-h-[280px] flex-col border-b border-slate-100 lg:col-span-8 lg:min-h-[360px] lg:border-b-0 lg:border-r">
                <ul
                  className="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-4 md:p-5"
                  aria-live="polite"
                >
                  {chatMessages.length === 0 && (
                    <li className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">
                      No messages yet. Try: &ldquo;Is this area safe after
                      dark?&rdquo; or &ldquo;What should I watch for near
                      transit?&rdquo;
                    </li>
                  )}
                  {chatMessages.map((m, i) => (
                    <li
                      key={i}
                      className={`max-w-[95%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm md:max-w-[85%] ${
                        m.from === "user"
                          ? "ml-auto bg-blue-600 text-white"
                          : "mr-auto border border-slate-200 bg-white text-slate-800"
                      }`}
                    >
                      {m.text}
                    </li>
                  ))}
                  {assistantLoading && (
                    <li className="text-xs text-slate-400">
                      Assistant is typing…
                    </li>
                  )}
                </ul>
                <form
                  onSubmit={sendChat}
                  className="mt-auto flex flex-col gap-2 border-t border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center"
                >
                  <label htmlFor="sentinel-chat-input" className="sr-only">
                    Message to assistant
                  </label>
                  <input
                    id="sentinel-chat-input"
                    value={chatQuery}
                    onChange={(e) => setChatQuery(e.target.value)}
                    placeholder="Ask about this area, weather context, or routes…"
                    className="min-h-[44px] flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                  <button
                    type="submit"
                    disabled={assistantLoading}
                    className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {assistantLoading ? "Sending…" : "Send"}
                  </button>
                </form>
              </div>
              <aside className="flex flex-col justify-center bg-slate-50/90 p-5 text-sm text-slate-600 lg:col-span-4 lg:p-6">
                <p className="font-headline font-bold text-slate-800">Tips</p>
                <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-relaxed">
                  <li>
                    Mention time of day or solo vs group travel for better
                    answers.
                  </li>
                  <li>
                    Open the map from the header when you want visual context.
                  </li>
                  <li>
                    Weather above uses Open-Meteo for the same coordinates as
                    this report.
                  </li>
                </ul>
              </aside>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="breakdown-advisories-heading"
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          <h2 id="breakdown-advisories-heading" className="sr-only">
            Infrastructure breakdown and advisories
          </h2>
          <article className="rounded-2xl border border-slate-200/50 bg-white p-8 shadow-md lg:col-span-2">
            <header className="mb-10">
              <h3 className="font-headline text-xl font-extrabold text-slate-800">
                Infrastructure breakdown
              </h3>
              <p className="mt-1 font-label text-xs uppercase tracking-widest text-slate-500">
                What’s working well in this area
              </p>
            </header>
            <ul className="flex flex-col gap-6">
              {Object.entries(data?.breakdown || {}).map(([key, value]) => (
                <li key={key} className="flex items-center gap-4">
                  <span className="w-28 text-sm font-bold uppercase tracking-wider text-slate-600">
                    {key}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${value}%` }}
                      role="progressbar"
                      aria-valuenow={value}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-800">
                    {value}%
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article className="flex flex-col gap-6 rounded-2xl border border-slate-200/50 bg-white p-8 shadow-md">
            <header>
              <h3 className="font-headline text-xl font-extrabold text-slate-800">
                System advisories
              </h3>
            </header>
            <ul className="space-y-6">
              {data?.signals?.length > 0 ? (
                data.signals.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${s.colorClass}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {s.icon}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {s.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        {s.detail}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-sm text-slate-500">
                  No active advisories.
                </li>
              )}
            </ul>
            <p className="border-t pt-4 text-xs text-slate-500">
              Use <strong className="text-slate-700">Sentinel chat</strong>{" "}
              above for follow-up questions — same assistant, larger panel.
            </p>
          </article>
        </section>
      </div>
    </PageMain>
  );
}
