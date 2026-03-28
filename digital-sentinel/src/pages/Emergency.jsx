import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  getEmergencyServices,
  getAllIncidents,
  reportIncident,
  reverseGeocodeLatLng,
  geocodeAddress,
} from "../api";
import PageMain from "../layouts/PageMain";
import { PATHS } from "../constants/journey";
import { useCurrentLocation } from "../hooks/useCurrentLocation";

const ContactCard = ({
  name,
  role,
  imgSrc,
  btn1,
  btn2,
  icon1,
  icon2,
  isPrimary,
}) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-6 hover:shadow-xl transition-all duration-300 group">
    <div className="flex items-center gap-4">
      <img
        className="w-14 h-14 rounded-full object-cover shadow-sm border-2 border-white group-hover:scale-105 transition-transform"
        alt={name}
        src={imgSrc}
      />
      <div>
        <p className="font-headline text-lg font-bold text-slate-900">{name}</p>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
          {role}
        </p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3 mt-auto">
      <button className="flex items-center justify-center gap-2 py-3 bg-slate-50 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors border border-slate-100">
        <span className="material-symbols-outlined text-[16px]">{icon1}</span>{" "}
        {btn1}
      </button>
      <button
        className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-colors shadow-sm ${isPrimary ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20" : "bg-slate-900 hover:bg-slate-800 text-white"}`}
      >
        <span
          className={`material-symbols-outlined text-[16px] ${isPrimary ? "text-rose-200" : "text-slate-400"}`}
        >
          {icon2}
        </span>{" "}
        {btn2}
      </button>
    </div>
  </div>
);

export default function Emergency() {
  const routeLocation = useLocation();
  const { currentLocation, geoStatus, refresh } = useCurrentLocation(true);
  const [resolvedCity, setResolvedCity] = useState(null);
  const [locationContext, setLocationContext] = useState("current");
  const [customLocation, setCustomLocation] = useState("");
  const [isTriggering, setIsTriggering] = useState(false);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [incidents, setIncidents] = useState([]);
  const [incidentsLoading, setIncidentsLoading] = useState(true);
  const [reportType, setReportType] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportLocation, setReportLocation] = useState("");
  const [reporting, setReporting] = useState(false);
  const [dictating, setDictating] = useState(false);

  const speechSupported =
    typeof window !== "undefined" &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const startDictation = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setDictating(true);
    recognition.onend = () => setDictating(false);
    recognition.onerror = () => setDictating(false);
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setReportDesc((prev) => (prev?.trim() ? `${prev.trim()} ${text}` : text));
    };
    try {
      recognition.start();
    } catch {
      setDictating(false);
    }
  };

  useEffect(() => {
    if (!currentLocation) {
      setResolvedCity(null);
      return;
    }
    let cancelled = false;
    reverseGeocodeLatLng(currentLocation.lat, currentLocation.lng).then((city) => {
      if (!cancelled) setResolvedCity(city);
    });
    return () => {
      cancelled = true;
    };
  }, [currentLocation]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      let queryCity = "London";
      let lat;
      let lng;
      try {
        if (locationContext === "custom" && customLocation?.trim()) {
          queryCity = customLocation.trim();
          const g = await geocodeAddress(customLocation.trim());
          if (g?.lat != null && g?.lng != null) {
            lat = g.lat;
            lng = g.lng;
          }
        } else if (locationContext === "current") {
          queryCity = resolvedCity || "Current location";
          if (currentLocation?.lat != null && currentLocation?.lng != null) {
            lat = currentLocation.lat;
            lng = currentLocation.lng;
          }
        }
      } catch {
        /* keep queryCity; API still returns city-based fallbacks */
      }
      const data = await getEmergencyServices(queryCity, lat, lng);
      setServices(Array.isArray(data) ? data.slice(0, 8) : []);
      setLoadingServices(false);
    };
    fetchServices();
  }, [
    locationContext,
    customLocation,
    resolvedCity,
    currentLocation?.lat,
    currentLocation?.lng,
  ]);

  useEffect(() => {
    const fetchIncidents = async () => {
      setIncidentsLoading(true);
      const data = await getAllIncidents();
      setIncidents(Array.isArray(data) ? data : []);
      setIncidentsLoading(false);
    };
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    setIncidentsLoading(true);
    const data = await getAllIncidents();
    setIncidents(Array.isArray(data) ? data : []);
    setIncidentsLoading(false);
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportDesc)
      return alert("Please add a brief description of the incident.");
    setReporting(true);
    const payload = {
      type: reportType || "Other",
      description: reportDesc,
      location:
        reportLocation ||
        (locationContext === "current" && currentLocation
          ? `GPS ${currentLocation.lat.toFixed(5)}, ${currentLocation.lng.toFixed(5)}`
          : locationContext === "current"
            ? "Live GPS (pending)"
            : customLocation || "Unspecified"),
      timestamp: new Date().toISOString(),
    };
    try {
      const res = await reportIncident(payload);
      setIncidents((prev) => [res, ...prev]);
      setReportType("");
      setReportDesc("");
      setReportLocation("");
    } catch (err) {
      alert("Failed to report incident. Try again later.");
    }
    setReporting(false);
  };

  const handleAlert = async (type) => {
    setIsTriggering(true);
    const activeLocation =
      locationContext === "current" && currentLocation
        ? `${currentLocation.lat.toFixed(4)}°, ${currentLocation.lng.toFixed(4)}°`
        : locationContext === "current"
          ? "your live GPS coordinates"
          : customLocation || "the selected destination";
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(
      `${type === 'global_sos' ? 'Emergency services' : 'Contact alert'} activated (demo).\nContext shared for: ${activeLocation}.`,
    );
    setIsTriggering(false);
  };

  return (
    <PageMain className="relative overflow-hidden px-6 pb-12 pt-28 font-body text-slate-900">
      <div
        className="pointer-events-none absolute left-0 top-0 -z-10 h-[90vh] w-[60%] rounded-br-full bg-gradient-to-br from-rose-50/80 via-red-50/20 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm">
          <ol className="flex flex-wrap items-center gap-2 text-slate-500">
            <li>
              <Link to={PATHS.home} className="font-semibold hover:text-blue-600">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="font-semibold text-slate-800" aria-current="page">
              Emergency (SOS)
            </li>
          </ol>
        </nav>

        <aside className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          <p className="font-headline font-bold text-[#0e1c2b]">Outside the trip workflow</p>
          <p className="mt-1">
            SOS is not step 4 of Plan → Report → Map. Open this page whenever you need it from the header, with or without an active trip.
          </p>
          {routeLocation.state?.destination && (
            <p className="mt-2">
              <Link
                to={PATHS.map}
                state={routeLocation.state}
                className="font-semibold text-blue-600 hover:underline"
              >
                Return to map for “{routeLocation.state.destination}”
              </Link>
            </p>
          )}
        </aside>

        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={PATHS.home}
              className="group inline-flex items-center gap-2 rounded-full border border-slate-100 bg-white px-5 py-2.5 text-sm font-bold text-slate-500 shadow-sm transition-colors hover:text-slate-800"
            >
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">
                arrow_back
              </span>
              Home
            </Link>
            <button
              type="button"
              onClick={() => refresh()}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-800 hover:bg-blue-100"
            >
              <span className="material-symbols-outlined text-[16px]">my_location</span>
              Refresh GPS
            </button>
          </div>
          <div className="flex items-center gap-2.5 rounded-full border border-emerald-100 bg-emerald-50/80 px-4 py-2 shadow-sm backdrop-blur-sm">
            <span className="relative h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-hidden />
            <span className="font-label text-[10px] font-extrabold uppercase tracking-widest text-emerald-700">
              Live link ready
            </span>
          </div>
        </div>

        <section aria-labelledby="sos-location-status" className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-slate-700">
          <h2 id="sos-location-status" className="sr-only">
            Automatic location status
          </h2>
          {geoStatus === "loading" && <p>Reading your position for responder context…</p>}
          {geoStatus === "ok" && currentLocation && (
            <p>
              <strong className="text-[#0e1c2b]">GPS:</strong>{" "}
              <span className="font-mono text-xs">
                {currentLocation.lat.toFixed(5)}°, {currentLocation.lng.toFixed(5)}°
              </span>
              {resolvedCity && (
                <>
                  {" "}
                  — approx. <strong>{resolvedCity}</strong> (shared with responders in a real deployment)
                </>
              )}
            </p>
          )}
          {geoStatus === "denied" && (
            <p>Location blocked — choose a specific address below or allow location in the browser.</p>
          )}
          {(geoStatus === "error" || geoStatus === "unsupported") && (
            <p>Could not auto-locate — use “Specific address” for accurate responders.</p>
          )}
        </section>

        <header className="relative z-10 mb-12 max-w-3xl">
          <h1 className="mb-4 font-headline text-[3rem] font-extrabold leading-[1.05] tracking-tight text-[#0f172a] md:text-[4rem]">
            Emergency <span className="text-rose-600">response</span>
          </h1>
          <p className="text-lg font-medium leading-relaxed text-slate-500">
            Confirm where you are, reach help, and see nearby services. This screen is separate from running a safety check or viewing the map.
          </p>
        </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20 relative z-10">
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-5">
            <label className="block font-label text-[0.6875rem] font-extrabold tracking-[0.15em] text-slate-400 uppercase">
              1. Confirm Incident Location
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setLocationContext("current")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 ${
                  locationContext === "current"
                    ? "bg-slate-900 text-white shadow-md transform scale-105"
                    : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100 hover:border-slate-200"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  my_location
                </span>
                My Current GPS
              </button>
              <button
                onClick={() => setLocationContext("custom")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 ${
                  locationContext === "custom"
                    ? "bg-slate-900 text-white shadow-md transform scale-105"
                    : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100 hover:border-slate-200"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  pin_drop
                </span>
                Specific Address
              </button>
            </div>

            <div className="pt-2 min-h-[72px]">
              {locationContext === "current" ? (
                geoStatus === "ok" && currentLocation ? (
                  <div className="flex items-center gap-4 rounded-2xl border border-emerald-100/50 bg-white/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <span className="material-symbols-outlined text-emerald-600 text-[20px]">where_to_vote</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Position in use</p>
                      <p className="mt-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        {currentLocation.lat.toFixed(5)}°, {currentLocation.lng.toFixed(5)}°
                        {currentLocation.accuracy != null && ` · ±${Math.round(currentLocation.accuracy)}m`}
                      </p>
                    </div>
                  </div>
                ) : geoStatus === "loading" ? (
                  <div className="flex items-center gap-4 rounded-2xl border border-emerald-100/50 bg-white/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                      <span className="material-symbols-outlined animate-spin text-emerald-500 text-[20px]">radar</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Acquiring GPS…</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-amber-100 bg-amber-50/80 p-4 text-sm text-amber-950">
                    Allow location or switch to a specific address for this incident.
                  </div>
                )
              ) : (
                <div className="relative animate-[fadeIn_0.2s_ease-out]">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 text-[24px]">
                      search
                    </span>
                  </div>
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="Enter precise address or landmark..."
                    className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 rounded-2xl font-bold text-slate-900 text-lg outline-none transition-all shadow-[0_8px_30px_rgba(0,0,0,0.03)] placeholder:text-slate-300 placeholder:font-medium"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5 pt-4">
            <label className="block font-label text-[0.6875rem] font-extrabold tracking-[0.15em] text-slate-400 uppercase">
              2. Authorize Deployment
            </label>

            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_40px_rgba(225,29,72,0.06)] border border-rose-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none"></div>

              <h2 className="text-2xl font-headline font-extrabold text-slate-900 mb-2">
                Initiate Global SOS
              </h2>
              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed max-w-md">
                Directly dial local emergency services (112/911) and transmit a
                silent alert with your live location to your private security
                network.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => handleAlert("global_sos")}
                  disabled={isTriggering}
                  className={`w-full py-4 rounded-2xl text-white font-headline font-bold text-lg tracking-wide transition-all duration-300 flex items-center justify-center gap-3 shadow-xl relative overflow-hidden ${
                    isTriggering
                      ? "bg-rose-800 pointer-events-none scale-[0.99]"
                      : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20 active:scale-[0.98]"
                  }`}
                >
                  {isTriggering ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[24px]">
                        sync
                      </span>{" "}
                      Connecting...
                    </>
                  ) : (
                    <>
                      <span
                        className="material-symbols-outlined text-[24px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        warning
                      </span>{" "}
                      Deploy Emergency Services
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleAlert("contacts_only")}
                  disabled={isTriggering}
                  className="w-full py-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-headline font-bold text-sm transition-colors border border-slate-200 active:scale-[0.98]"
                >
                  Alert Private Contacts Only (Silent)
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div>
            <label className="block font-label text-[0.6875rem] font-extrabold tracking-[0.15em] text-slate-400 uppercase mb-5">
              Nearby services
            </label>
            <div className="space-y-4">
              {loadingServices ? (
                <p className="text-sm text-slate-500 flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin">
                    sync
                  </span>{" "}
                  Loading nearby listings…
                </p>
              ) : (
                services.map((svc, idx) => {
                  const icon =
                    svc.type === "hospital"
                      ? "medical_services"
                      : svc.type === "fire"
                        ? "local_fire_department"
                        : "local_police";
                  const tone =
                    svc.type === "hospital"
                      ? "bg-rose-50 text-rose-600"
                      : svc.type === "fire"
                        ? "bg-orange-50 text-orange-600"
                        : "bg-blue-50 text-blue-600";
                  const openInMaps = () => {
                    if (svc.lat == null || svc.lon == null) return;
                    const q = `${svc.lat},${svc.lon}`;
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  };
                  return (
                  <div
                    key={`${svc.name}-${idx}`}
                    className="bg-white p-5 rounded-2xl flex items-center justify-between group hover:shadow-lg transition-all duration-300 border border-slate-100"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${tone}`}
                      >
                        <span
                          className="material-symbols-outlined text-[22px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {icon}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-headline font-bold text-slate-900 truncate">
                          {svc.name}
                        </p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {svc.distance} • ETA {svc.eta}
                          {svc.source === "osm" && (
                            <span className="ml-1 text-emerald-600 font-semibold">· OSM</span>
                          )}
                        </p>
                        {svc.address && (
                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{svc.address}</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={openInMaps}
                      disabled={svc.lat == null || svc.lon == null}
                      title={svc.lat != null && svc.lon != null ? "Open in maps" : "No coordinates (demo listing)"}
                      className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors active:scale-95 shrink-0 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        map
                      </span>
                    </button>
                  </div>
                  );
                })
              )}
            </div>

            <div className="mt-6 bg-white p-5 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-900">Recent Incidents</h4>
                <button
                  onClick={fetchIncidents}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Refresh
                </button>
              </div>
              {incidentsLoading ? (
                <p className="text-sm text-slate-500">Loading incidents...</p>
              ) : (
                <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
                  {incidents.map((inc) => (
                    <div
                      key={inc.id || inc.timestamp}
                      className="flex items-start justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100"
                    >
                      <div>
                        <p className="text-sm font-bold">
                          {inc.type}{" "}
                          <span className="text-xs text-slate-400 ml-2">
                            {inc.timestamp
                              ? new Date(inc.timestamp).toLocaleString()
                              : ""}
                          </span>
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {inc.description}
                        </p>
                      </div>
                      <div className="text-xs text-slate-500">
                        {inc.severity ? `Severity ${inc.severity}` : ""}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleReport} className="mt-4 space-y-3">
                <div className="flex gap-2">
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="flex-1 p-2 border rounded-lg text-sm"
                  >
                    <option value="">Select Type</option>
                    <option value="Theft">Theft</option>
                    <option value="Hazard">Hazard</option>
                    <option value="Assault">Assault</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    value={reportLocation}
                    onChange={(e) => setReportLocation(e.target.value)}
                    placeholder="Location (optional)"
                    className="p-2 border rounded-lg text-sm w-44"
                  />
                </div>
                <div className="relative">
                  <textarea
                    value={reportDesc}
                    onChange={(e) => setReportDesc(e.target.value)}
                    placeholder="Brief description… (or use voice)"
                    className="w-full p-2 pr-24 border rounded-lg text-sm h-24"
                  />
                  {speechSupported && (
                    <button
                      type="button"
                      onClick={startDictation}
                      disabled={dictating}
                      className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-800 hover:bg-blue-100 disabled:opacity-60"
                    >
                      <span
                        className={`material-symbols-outlined text-[16px] ${dictating ? "animate-pulse text-rose-600" : ""}`}
                      >
                        mic
                      </span>
                      {dictating ? "Listening" : "Dictate"}
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={reporting}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    {reporting ? "Reporting..." : "Report Incident"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReportType("");
                      setReportDesc("");
                      setReportLocation("");
                    }}
                    className="bg-slate-50 px-4 py-2 rounded-lg text-sm border"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl h-64 group border-[6px] border-white shadow-xl">
            <img
              className="w-full h-full object-cover grayscale-[30%] opacity-90 group-hover:scale-105 transition-transform duration-700"
              alt="map"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhM8gwJAHOA72HMCvGG_PBV7LkOBW6KqqbZb71MyStHl4jmP34D3SU8AZNx8ReugtfK4mWwGtSetzB7IhgM1CMoqaQazQkOCv7RR7uleHDycSQc_bs1gABfH41leZT5KmdwyYSnHJ-jg14YpEOCf3LWOGm-IsKewtg9ezPSdP0zGqZgM6PvNTr85PAZWdRgPPh_XHJCaQ6kyMmzczM-HoFd8i_mIP52b-d9G_qZBRpixMftckV07zH2BXj27PUPWifihoDjaG7tnU"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white font-headline font-extrabold text-xl mb-1">
                Safe Haven Guide
              </h3>
              <p className="text-slate-300 text-xs font-medium mb-4">
                View verified, secure commercial locations nearby.
              </p>
              <Link
                to={PATHS.map}
                state={routeLocation.state}
                className="inline-flex w-fit items-center rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-md transition-colors hover:bg-white hover:text-slate-900"
              >
                Open map view
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-16 mt-8 relative z-10">
        <div className="flex items-center justify-between mb-10">
          <h3 className="font-headline text-2xl font-extrabold text-slate-900">
            Your Secure Network
          </h3>
          <button className="text-blue-600 font-bold text-sm flex items-center gap-1.5 hover:underline bg-blue-50/50 px-4 py-2 rounded-full transition-colors">
            <span className="material-symbols-outlined text-[16px]">add</span>{" "}
            Add Contact
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContactCard
            name="Guard Sentinel"
            role="Private Security • 24/7"
            imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBci9AuLbVIaIfis65sZ3gUB0u1CDXh_viYlmHeJp4X3DnZqCJrg_ydsW_ITNbjlyQfnf2jYuUQUHwzAgXCb9dYMrC0tGHSZqG6eauo8rn0sujZ8HrX6oinA7UGx2Xujf05NXIfRo743Hq2F2RmZ46KpZIcwMqyEK9jUjuC_ObqkWuYGwoJaWpUiOKM9tMeEjDpmTV1NwEM9tjEncP1FsHeBpuMj7uj_Vxr7l1B-joJGhu4QUHCxW_D9fY7GLWH1th7_e0y7y651mo"
            btn1="Secure Chat"
            btn2="Connect Protocol"
            icon1="chat"
            icon2="shield"
            isPrimary={true}
          />
          <ContactCard
            name="David Chen"
            role="Partner • Primary"
            imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDFvT_HSyDis1KCqA548r0fl9JugICYUsyhO_jKG1KJaC8Uu-EI9LLvwwpXnwBkEPgT2ONHtsWffS7bwmgvXM3rqFG53RBhsUTROdo1Ho1JK1x6ozobci1y0NWBOa_E-WwiqrvOZSIRZ1DvGChp47no-hPnb46dQ0aI5kIsRDNnQUywOgEzFFyJL4GfbVSHBd8lWOn-Lje3v2kEuDnAVAeSVaAI3oi0EndVa69porpPCOiGJoefJYGbruuwXepjpkDdXTahcfOuPkM"
            btn1="Voice Call"
            btn2="Share Location"
            icon1="call"
            icon2="share_location"
            isPrimary={false}
          />
          <ContactCard
            name="Sarah Miller"
            role="Family • Secondary"
            imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuC0sLwZLGpSy8RbiCQEKNA1qcxVI8nkWUdjlw5QE5PDRojB66jAw3mjlBVzevOTW1pXednYaYbrL_U9Laih2SINz_i9o3yCNz4WZsvSxjuCEoW0WfA2FQco1jgc_5aHfdJxpWSkEp6AUO8GBWUzB54dioF9fhBS5BFsyH2mGOPfkZL4D6qQOnnG6s6LMS9b3RhKfgJxNiFkspXxGOwnVa2xRQoiY3goLjYnsXW6LnofqmF6BqSct86WlithjI968kZHMEWleXn9Bj4"
            btn1="Voice Call"
            btn2="Share Location"
            icon1="call"
            icon2="share_location"
            isPrimary={false}
          />
        </div>
      </div>
      </div>
    </PageMain>
  );
}
