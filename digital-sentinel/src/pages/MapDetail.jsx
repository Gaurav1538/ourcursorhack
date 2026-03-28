import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  analyzeRoute,
  geocodeAddress,
  getCityHeatmap,
  getLocationHeatmap,
  getSafeRoute,
  getNearbyIncidents,
  getRiskDetailed,
  normalizeSafeRoutePoint,
} from "../api";
import MapLegend from "../components/map/MapLegend";
import {
  PATHS,
  tripNavigationState,
  REPORT_MODE,
  hasSafetyCheckNavigationState,
  assessedRouteOrigin,
} from "../constants/journey";
import {
  haversineKm,
  normalizeHeat01,
  validLatLng,
} from "../utils/geo";
import { fetchOpenMeteoCurrent } from "../utils/weather";

export default function MapDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef(null);

  const [routeData, setRouteData] = useState(null);
  const [activeTab, setActiveTab] = useState("Your route");
  const [loading, setLoading] = useState(true);

  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showRadiusHeat, setShowRadiusHeat] = useState(true);
  const [showSafeRoute, setShowSafeRoute] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [weather, setWeather] = useState(null);

  const heatLayerRef = useRef(null);
  const radiusHeatLayerRef = useRef(null);
  const safeRouteRef = useRef(null);
  const incidentsLayerRef = useRef(null);
  const hotspotsLayerRef = useRef(null);

  const hasContext = hasSafetyCheckNavigationState(location.state);
  const destinationStr = location.state?.destination ?? "";
  const profile = location.state?.profile || "solo";
  const travelMode = location.state?.mode || "walking";
  const tripTime = location.state?.time ?? new Date().getHours();
  const coords = location.state?.coords ?? null;
  const reportMode = location.state?.reportMode ?? REPORT_MODE.TRAVEL;
  /** Snapshot from Safety check only — map does not follow live GPS */
  const assessedOrigin = useMemo(
    () => assessedRouteOrigin(location.state),
    [
      location.state?.currentLocation?.lat,
      location.state?.currentLocation?.lng,
      location.state?.coords?.lat,
      location.state?.coords?.lng,
      location.state?.reportMode,
    ],
  );

  const hourForRouteApi =
    typeof tripTime === "number"
      ? tripTime
      : (() => {
          const d = new Date(tripTime);
          return Number.isNaN(d.getTime()) ? new Date().getHours() : d.getHours();
        })();

  const carryTripState = () =>
    tripNavigationState({
      destination:
        destinationStr.trim() ||
        (coords?.lat != null ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : ""),
      profile,
      time: tripTime,
      coords,
      mode: travelMode,
      currentLocation:
        location.state?.currentLocation ??
        (reportMode === REPORT_MODE.HERE && coords?.lat != null
          ? { lat: coords.lat, lng: coords.lng }
          : null),
      reportMode,
    });

  useEffect(() => {
    const fetchMapData = async () => {
      if (!hasContext) {
        setLoading(false);
        setRouteData(null);
        setWeather(null);
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
        return;
      }

      setLoading(true);

      try {
      // 1. Destination coordinates — only from Safety check (geocoded coords or label)
      const destCoords =
        coords?.lat != null && coords?.lng != null
          ? { lat: coords.lat, lng: coords.lng }
          : (await geocodeAddress(destinationStr.trim())) || {
              lat: 51.5074,
              lng: -0.1278,
            };
      const sourceCoords = assessedOrigin
        ? { lat: assessedOrigin.lat, lng: assessedOrigin.lng }
        : {
            lat: destCoords.lat - 0.01,
            lng: destCoords.lng - 0.01,
          };

      const separationKm = haversineKm(sourceCoords, destCoords);
      /** GPS vs destination too far — skip world-spanning line and off-map start marker */
      const longHaul = separationKm > 100;

      // 2. Fetch Route Analysis from Backend API
      const rData = await analyzeRoute({
        source: "Current Location",
        destination: destinationStr,
        mode: travelMode,
        hour: hourForRouteApi,
        startLat: sourceCoords.lat,
        startLng: sourceCoords.lng,
        endLat: destCoords.lat,
        endLng: destCoords.lng,
      });
      setRouteData({ ...rData, destCoords, sourceCoords, longHaul, separationKm });

      // 3. Initialize Leaflet — center on what we’re analyzing (here = your coords, travel = destination)
      if (!window.L) {
        return;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const mapCenterLat =
        reportMode === REPORT_MODE.HERE &&
        coords?.lat != null &&
        coords?.lng != null
          ? coords.lat
          : destCoords.lat;
      const mapCenterLng =
        reportMode === REPORT_MODE.HERE &&
        coords?.lat != null &&
        coords?.lng != null
          ? coords.lng
          : destCoords.lng;

      const map = window.L.map("map-container", { zoomControl: false }).setView(
        [mapCenterLat, mapCenterLng],
        14,
      );

      /* OSM tiles load reliably worldwide; Carto dark often blocked or slow on some networks */
      window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const divMarker = (html, size, anchor) =>
        window.L.divIcon({
          className: "sentinel-marker-root",
          html,
          iconSize: size,
          iconAnchor: anchor,
        });

      // Draw path only when start and end are in the same region (avoids absurd global lines)
      if (!longHaul) {
        const wp = Array.isArray(rData.waypoints)
          ? rData.waypoints
              .filter((w) => validLatLng(w?.lat, w?.lng))
              .map((w) => [w.lat, w.lng])
          : [];
        const pathLatLngs =
          wp.length >= 2
            ? wp
            : [
                [sourceCoords.lat, sourceCoords.lng],
                [destCoords.lat, destCoords.lng],
              ];
        window.L.polyline(pathLatLngs, {
          color: rData.score > 70 ? "#15803d" : "#d97706",
          weight: 5,
          opacity: 0.92,
          dashArray: "12, 8",
          lineCap: "round",
        }).addTo(map);
      }

      // Start marker only when it’s on the same map view as the destination
      if (!longHaul && assessedOrigin) {
        window.L.marker([sourceCoords.lat, sourceCoords.lng], {
          icon: divMarker(
            '<div style="width:18px;height:18px;border-radius:50%;background:#2563eb;border:2px solid #fff;box-shadow:0 0 14px rgba(37,99,235,0.85);"></div>',
            [22, 22],
            [11, 11],
          ),
        }).addTo(map);
      }
      window.L.marker([destCoords.lat, destCoords.lng], {
        icon: divMarker(
          '<div style="width:26px;height:26px;border-radius:50%;background:#334155;border:2px solid #fff;box-shadow:0 4px 14px rgba(51,65,85,0.45);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;line-height:1;">📍</div>',
          [30, 30],
          [15, 15],
        ),
      }).addTo(map);

      // Prepare layer groups for toggles
      const hotspotsGroup = window.L.layerGroup();
      const heatGroup = window.L.layerGroup();
      const radiusHeatGroup = window.L.layerGroup();
      const incidentsGroup = window.L.layerGroup();

      // Hotspots from API (click -> risk details)
      if (rData.hotspots) {
        rData.hotspots.forEach((hs) => {
          if (!validLatLng(hs.lat, hs.lng)) return;
          const circle = window.L.circle([hs.lat, hs.lng], {
            color: hs.risk === "High" ? "#e11d48" : "#f59e0b",
            fillColor: hs.risk === "High" ? "#e11d48" : "#f59e0b",
            fillOpacity: hs.risk === "High" ? 0.42 : 0.32,
            radius: hs.risk === "High" ? 380 : 280,
            weight: 2,
            opacity: 0.9,
          });
          circle.on("click", async () => {
            const details = await getRiskDetailed(hs.lat, hs.lng);
            const html = `<div class="text-sm"><strong>Risk:</strong> ${details.riskLevel || "Unknown"}<br/><strong>Score:</strong> ${details.score || "-"}<br/><em class=\"text-xs\">${(details.factors || []).join(", ")}</em></div>`;
            window.L.popup()
              .setLatLng([hs.lat, hs.lng])
              .setContent(html)
              .openOn(map);
          });
          hotspotsGroup.addLayer(circle);
        });
      }

      // City heatmap overlays (needs a place name from Safety check)
      try {
        const heat =
          destinationStr.trim() !== ""
            ? await getCityHeatmap(destinationStr)
            : null;
        if (heat && Array.isArray(heat) && heat.length) {
          const cityStride = heat.length > 24 ? 2 : 1;
          const cityPoints = heat.filter((_, idx) => idx % cityStride === 0);
          cityPoints.forEach((p) => {
            if (!validLatLng(p.lat, p.lng)) return;
            const t = normalizeHeat01(p.intensity);
            const color = t < 0.42 ? "#16a34a" : t < 0.62 ? "#ca8a04" : "#dc2626";
            const radiusM = Math.min(140 + t * 280, 420);
            const fillOpac = t < 0.42 ? 0.22 : t < 0.62 ? 0.28 : 0.32;
            const c = window.L.circle([p.lat, p.lng], {
              radius: radiusM,
              color,
              fillColor: color,
              fillOpacity: fillOpac,
              weight: 1.5,
              opacity: 0.85,
            });
            heatGroup.addLayer(c);
          });
        }
      } catch (e) {
        // ignore heatmap failures
      }

      // Radius heatmap (/api/heatmap) around focal area
      try {
        const micro = await getLocationHeatmap(destCoords.lat, destCoords.lng, 2);
        if (micro && Array.isArray(micro)) {
          /* Backend returns risk 0–100; drawing radius = risk*350 made multi-km circles → solid “glitch” */
          const stride =
            micro.length > 80 ? 3 : micro.length > 35 ? 2 : 1;
          const sparse = micro.filter((_, idx) => idx % stride === 0);
          sparse.forEach((p) => {
            if (!validLatLng(p.lat, p.lng)) return;
            const inten = normalizeHeat01(p.risk ?? p.intensity);
            const color =
              inten < 0.48 ? "#059669" : inten < 0.68 ? "#d97706" : "#7c3aed";
            const radiusM = Math.min(95 + inten * 240, 340);
            const fillOpac = 0.16 + inten * 0.14;
            const c = window.L.circle([p.lat, p.lng], {
              radius: radiusM,
              color,
              fillColor: color,
              fillOpacity: Math.min(fillOpac, 0.34),
              weight: 1.5,
              opacity: 0.9,
            });
            radiusHeatGroup.addLayer(c);
          });
        }
      } catch (e) {
        // ignore
      }

      // Nearby incidents
      try {
        const nearby = await getNearbyIncidents(
          destCoords.lat,
          destCoords.lng,
          2,
        );
        if (nearby && Array.isArray(nearby)) {
          nearby.forEach((inc) => {
            const m = window.L.marker([inc.lat, inc.lng]);
            m.on("click", async () => {
              const d = await getRiskDetailed(inc.lat, inc.lng);
              const popup = `<div class=\"text-sm\"><strong>${inc.type}</strong><div>${inc.description}</div><div class=\"text-xs\">Risk: ${d.score || "-"} - ${d.riskLevel || "Unknown"}</div></div>`;
              window.L.popup()
                .setLatLng([inc.lat, inc.lng])
                .setContent(popup)
                .openOn(map);
            });
            incidentsGroup.addLayer(m);
          });
        }
      } catch (e) {
        // ignore nearby incidents failures
      }

      // Safe route overlay (only when start/end are regional; avoids nonsense paths)
      try {
        const safe = longHaul
          ? null
          : await getSafeRoute(
              sourceCoords.lat,
              sourceCoords.lng,
              destCoords.lat,
              destCoords.lng,
            );
        if (safe && Array.isArray(safe) && safe.length > 1) {
          const latlngs = safe
            .map((p) => normalizeSafeRoutePoint(p))
            .filter(Boolean)
            .map((p) => [p.lat, p.lng]);
          if (latlngs.length >= 2) {
            const safeLayer = window.L.polyline(latlngs, {
              color: "#15803d",
              weight: 6,
              opacity: 0.95,
            });
            safeRouteRef.current = safeLayer;
            if (showSafeRoute) safeLayer.addTo(map);
          }
        }
      } catch (e) {
        // ignore safe route failures
      }

      // Add groups based on toggles
      if (showIncidents) hotspotsGroup.addTo(map);
      if (showHeatmap) heatGroup.addTo(map);
      if (showRadiusHeat) radiusHeatGroup.addTo(map);
      if (showIncidents) incidentsGroup.addTo(map);

      hotspotsLayerRef.current = hotspotsGroup;
      heatLayerRef.current = heatGroup;
      radiusHeatLayerRef.current = radiusHeatGroup;
      incidentsLayerRef.current = incidentsGroup;

      mapRef.current = map;

      map.whenReady(() => {
        requestAnimationFrame(() => {
          map.invalidateSize();
          setTimeout(() => map.invalidateSize(), 250);
        });
      });

      const w = await fetchOpenMeteoCurrent(destCoords.lat, destCoords.lng);
      setWeather(w);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [
    hasContext,
    destinationStr,
    travelMode,
    hourForRouteApi,
    assessedOrigin?.lat,
    assessedOrigin?.lng,
    coords?.lat,
    coords?.lng,
    reportMode,
  ]);

  useEffect(() => {
    if (!hasContext) return;
    const onResize = () => mapRef.current?.invalidateSize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [hasContext]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (showHeatmap) heatLayerRef.current?.addTo(mapRef.current);
    else heatLayerRef.current?.remove();
  }, [showHeatmap]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (showRadiusHeat) radiusHeatLayerRef.current?.addTo(mapRef.current);
    else radiusHeatLayerRef.current?.remove();
  }, [showRadiusHeat]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (showIncidents) {
      hotspotsLayerRef.current?.addTo(mapRef.current);
      incidentsLayerRef.current?.addTo(mapRef.current);
    } else {
      hotspotsLayerRef.current?.remove();
      incidentsLayerRef.current?.remove();
    }
  }, [showIncidents]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (showSafeRoute) safeRouteRef.current?.addTo(mapRef.current);
    else safeRouteRef.current?.remove();
  }, [showSafeRoute]);

  if (!hasContext) {
    return (
      <main className="relative mt-16 flex min-h-[calc(100vh-64px)] w-full flex-col overflow-hidden bg-slate-50 font-body text-slate-900 lg:flex-row">
        <aside className="relative z-40 flex w-full flex-shrink-0 flex-col border-b border-slate-200 bg-white p-8 lg:h-full lg:min-h-[calc(100vh-64px)] lg:w-[min(440px,100%)] lg:border-b-0 lg:border-r lg:shadow-2xl">
          <h2 className="font-headline text-2xl font-extrabold text-slate-800">
            Choose a place first
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            The map always matches what you confirm on <strong>Safety check</strong> — it does not guess or track your live position on this screen. To see another area, go back, enter a new place or use <strong>Here now</strong>, then open the map from Insights again.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            If you refreshed the page, your last choice was cleared; run Safety check once more.
          </p>
          <Link
            to={PATHS.assess}
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700"
          >
            Open Safety check
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </aside>
        <section className="flex min-h-[40vh] flex-1 items-center justify-center bg-[#0f172a] px-6 py-12 text-center text-slate-400 lg:min-h-0">
          <p className="max-w-sm text-sm leading-relaxed">
            No assessed location in this session. Use Safety check to set where you are or where you’re going — the next screen and this map follow that choice only.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="relative mt-16 flex h-[calc(100vh-64px)] w-full flex-col overflow-hidden bg-slate-50 font-body text-slate-900 lg:flex-row">
      <aside
        aria-label="Map layers and summary"
        className="relative z-40 flex h-[55vh] w-full min-h-0 flex-shrink-0 flex-col border-b border-slate-200 bg-white lg:h-full lg:w-[440px] lg:min-h-0 lg:border-b-0 lg:border-r lg:shadow-2xl"
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-slate-500">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to={PATHS.home} className="font-semibold hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  to={PATHS.insights}
                  state={carryTripState()}
                  className="font-semibold hover:text-blue-600"
                >
                  Insights
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-semibold text-slate-800" aria-current="page">
                Map
              </li>
            </ol>
          </nav>

          <button
            type="button"
            onClick={() =>
              navigate(PATHS.insights, { state: carryTripState() })
            }
            className="group mb-4 flex w-fit items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200"
          >
            <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">
              arrow_back
            </span>
            Back to insights
          </button>

          <div className="mb-8 shrink-0">
            <h2 className="font-headline text-2xl font-extrabold text-slate-800">
              Live safety map
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Greener = calmer, warmer = more to watch. Use the key on the map.
            </p>
            <p className="mt-2 text-xs text-slate-400">
              This view uses only the location from your Safety check. To change it, go back to{" "}
              <Link to={PATHS.assess} className="font-semibold text-blue-600 hover:underline">
                Safety check
              </Link>
              .
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-xl mb-6 shrink-0">
            {["Hotspots", "Your route"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2.5 text-[0.625rem] md:text-[0.6875rem] font-bold tracking-wider rounded-lg transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white shadow-md text-blue-700 border border-slate-200"
                    : "text-slate-500 hover:bg-slate-200 hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto pr-3 space-y-6 pb-6 block custom-scrollbar">
            {weather && (
              <div className="mb-4 bg-white p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-700">
                      wb_sunny
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase">
                      Current Weather
                    </p>
                    <p className="text-lg font-bold">
                      {Math.round(weather.temperature)}°C • Wind{" "}
                      {weather.windspeed} m/s
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showHeatmap}
                  onChange={() => setShowHeatmap((v) => !v)}
                />
                <span className="text-xs">Area overview</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showRadiusHeat}
                  onChange={() => setShowRadiusHeat((v) => !v)}
                />
                <span className="text-xs">Local pattern</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showSafeRoute}
                  onChange={() => setShowSafeRoute((v) => !v)}
                />
                <span className="text-xs">Safer path</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showIncidents}
                  onChange={() => setShowIncidents((v) => !v)}
                />
                <span className="text-xs">Reports</span>
              </label>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              {routeData?.longHaul && (
                <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
                  The <strong>start point</strong> you saved on Safety check is far from{" "}
                  <strong>{destinationStr || "this place"}</strong>. The map stays on that destination; to change either place, go back to{" "}
                  <Link to={PATHS.assess} className="font-bold text-amber-900 underline">
                    Safety check
                  </Link>
                  .
                </p>
              )}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-blue-600 text-[20px]">
                    my_location
                  </span>
                </div>
                <div className="flex-1 border-b border-slate-200 pb-2">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">
                    {routeData?.longHaul
                      ? "Start point (off this map)"
                      : "Start point (from Safety check)"}
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {assessedOrigin
                      ? `${assessedOrigin.lat.toFixed(4)}°, ${assessedOrigin.lng.toFixed(4)}°`
                      : "Not saved — open Safety check, allow location for “Travel”, or use “Here now”."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-[20px]">
                    flag
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">
                    {reportMode === REPORT_MODE.HERE ? "Place you assessed" : "Destination"}
                  </p>
                  <p className="break-words text-sm font-bold text-slate-800">
                    {destinationStr || (coords?.lat != null ? `${coords.lat.toFixed(4)}°, ${coords.lng.toFixed(4)}°` : "—")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white shadow-sm p-5 rounded-2xl border border-slate-200">
              <div className="text-center flex-1 border-r border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5">
                  Traffic
                </p>
                <p className="text-lg font-extrabold text-slate-800">
                  {routeData?.traffic || "..."}
                </p>
              </div>
              <div className="text-center flex-1 border-r border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5">
                  Distance
                </p>
                <p className="text-lg font-extrabold text-slate-800">
                  {routeData?.distanceKm != null && Number.isFinite(+routeData.distanceKm)
                    ? `${Number(routeData.distanceKm).toFixed(routeData.distanceKm >= 10 ? 1 : 2)} km`
                    : routeData?.longHaul
                      ? "—"
                      : "…"}
                </p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5">
                  Est. Time
                </p>
                <p className="text-lg font-extrabold text-slate-800">
                  {routeData?.eta || "..."}
                </p>
              </div>
            </div>
            {routeData?.routeSummary && (
              <p className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-center text-[0.65rem] text-slate-600">
                {routeData.routeSummary}
                {routeData?.durationMinutes != null && Number.isFinite(+routeData.durationMinutes) && (
                  <>
                    {" "}
                    · ~{routeData.durationMinutes} min at typical {routeData.mode || "walking"} speeds
                  </>
                )}
              </p>
            )}

            <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-xl">
              <div className="mb-5 flex items-end justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Route safety score
                </h3>
                <span className="text-4xl font-extrabold leading-none text-[#3ce36a]">
                  {routeData?.score ?? "—"}
                  <span className="text-lg font-normal text-slate-500">/100</span>
                </span>
              </div>
              <div className="mb-1 h-2.5 w-full overflow-hidden rounded-full bg-slate-700 shadow-inner">
                <div
                  className="relative h-full rounded-full bg-[#3ce36a] transition-all duration-1000"
                  style={{ width: `${Math.min(100, Math.max(0, Number(routeData?.score) || 0))}%` }}
                />
              </div>
            </div>

            <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-[0.65rem] leading-relaxed text-slate-600">
              Need help right now? Tap <strong className="text-rose-600">Emergency</strong> at the top.
            </p>

            {activeTab === "Hotspots" && (
              <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="material-symbols-outlined text-rose-600 text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    warning
                  </span>
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-widest">
                    Higher attention
                  </span>
                </div>
                <p className="text-sm text-rose-900 leading-relaxed font-medium">
                  {routeData?.hotspots?.length || 0} spots along your path deserve extra awareness — they’re highlighted on the map.
                </p>
              </div>
            )}

            {activeTab === "Your route" && (
              <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-blue-700 text-lg">
                    route
                  </span>
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">
                    Route check
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl flex gap-4 shadow-sm border border-blue-100">
                  <span
                    className="material-symbols-outlined text-emerald-500 text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-800 block mb-1 text-sm">
                      Suggested path
                    </strong>
                    Tailored for a <strong>{profile}</strong> traveler. The green line on the map is the suggested safer corridor when available.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      <section className="flex-1 relative bg-[#0f172a] h-[45vh] lg:h-full w-full overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-50 bg-[#0f172a]/80 backdrop-blur-sm flex items-center justify-center">
            <span className="material-symbols-outlined animate-spin text-white text-4xl">
              sync
            </span>
          </div>
        )}

        {/* Real Leaflet Map Container */}
        <div
          id="map-container"
          className="absolute inset-0 w-full h-full z-0"
        ></div>

        <MapLegend />

        <div className="absolute right-6 top-6 flex flex-col gap-3 z-30">
          <button
            onClick={() => mapRef.current?.zoomIn()}
            className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-xl shadow-xl flex items-center justify-center hover:bg-white transition-colors border border-slate-200 text-slate-800"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
          <button
            onClick={() => mapRef.current?.zoomOut()}
            className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-xl shadow-xl flex items-center justify-center hover:bg-white transition-colors border border-slate-200 text-slate-800"
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
        </div>
      </section>
    </main>
  );
}
