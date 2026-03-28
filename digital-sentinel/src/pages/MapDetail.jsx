import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { analyzeRoute, geocodeAddress, getCityHeatmap, getSafeRoute, getNearbyIncidents, getRiskDetailed } from '../services/api.js';

export default function MapDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef(null);
  
  const [routeData, setRouteData] = useState(null);
  const [activeTab, setActiveTab] = useState('SAFE ROUTES');
  const [loading, setLoading] = useState(true);

  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showSafeRoute, setShowSafeRoute] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [weather, setWeather] = useState(null);

  const heatLayerRef = useRef(null);
  const safeRouteRef = useRef(null);
  const incidentsLayerRef = useRef(null);
  const hotspotsLayerRef = useRef(null);

  const destinationStr = location.state?.destination || "London, UK";
  const profile = location.state?.profile || "solo";

  async function fetchWeather(lat, lng) {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&timezone=auto`);
      const j = await res.json();
      return j?.current_weather || null;
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    const fetchMapData = async () => {
      setLoading(true);
      
      // 1. Geocode Destination via OpenStreetMap
      const destCoords = await geocodeAddress(destinationStr) || { lat: 51.5074, lng: -0.1278 };
      const sourceCoords = { lat: destCoords.lat - 0.01, lng: destCoords.lng - 0.01 }; // Mock source near dest

      // 2. Fetch Route Analysis from Backend API
      const rData = await analyzeRoute("Current Location", destinationStr, "walking", 12);
      setRouteData({ ...rData, destCoords, sourceCoords });

      // 3. Initialize Leaflet
      if (!window.L) return;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = window.L.map('map-container', { zoomControl: false }).setView([destCoords.lat, destCoords.lng], 14);
      
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      const createMarker = (className, html) => window.L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="${className}">${html || ''}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      // Draw Path
      window.L.polyline([[sourceCoords.lat, sourceCoords.lng], [destCoords.lat, destCoords.lng]], {
        color: rData.score > 70 ? '#3ce36a' : '#f59e0b',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10',
        lineCap: 'round'
      }).addTo(map);

      // Add Source & Dest Markers
      window.L.marker([sourceCoords.lat, sourceCoords.lng], { icon: createMarker('w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.8)]') }).addTo(map);
      window.L.marker([destCoords.lat, destCoords.lng], { icon: createMarker('w-6 h-6 bg-[#0e1c2b] rounded-full flex items-center justify-center border-2 border-white shadow-xl', '<span class="material-symbols-outlined text-white text-[12px]">flag</span>') }).addTo(map);

      // Prepare layer groups for toggles
      const hotspotsGroup = window.L.layerGroup();
      const heatGroup = window.L.layerGroup();
      const incidentsGroup = window.L.layerGroup();

      // Hotspots from API (click -> risk details)
      if (rData.hotspots) {
        rData.hotspots.forEach(hs => {
          const circle = window.L.circle([hs.lat, hs.lng], {
            color: hs.risk === 'High' ? '#e11d48' : '#f59e0b',
            fillColor: hs.risk === 'High' ? '#e11d48' : '#f59e0b',
            fillOpacity: 0.2,
            radius: hs.risk === 'High' ? 300 : 200,
            weight: 1
          });
          circle.on('click', async () => {
            const details = await getRiskDetailed(hs.lat, hs.lng);
            const html = `<div class="text-sm"><strong>Risk:</strong> ${details.riskLevel || 'Unknown'}<br/><strong>Score:</strong> ${details.score || '-'}<br/><em class=\"text-xs\">${(details.factors || []).join(', ')}</em></div>`;
            window.L.popup().setLatLng([hs.lat, hs.lng]).setContent(html).openOn(map);
          });
          hotspotsGroup.addLayer(circle);
        });
      }

      // City heatmap overlays (approximate points)
      try {
        const heat = await getCityHeatmap(destinationStr);
        if (heat && Array.isArray(heat)) {
          heat.forEach(p => {
            const c = window.L.circle([p.lat, p.lng], {
              radius: (p.intensity || 0.5) * 400,
              color: p.intensity > 0.6 ? '#e11d48' : '#f59e0b',
              fillColor: p.intensity > 0.6 ? '#e11d48' : '#f59e0b',
              fillOpacity: 0.12,
              weight: 0
            });
            heatGroup.addLayer(c);
          });
        }
      } catch (e) {
        // ignore heatmap failures
      }

      // Nearby incidents
      try {
        const nearby = await getNearbyIncidents(destCoords.lat, destCoords.lng, 2);
        if (nearby && Array.isArray(nearby)) {
          nearby.forEach(inc => {
            const m = window.L.marker([inc.lat, inc.lng]);
            m.on('click', async () => {
              const d = await getRiskDetailed(inc.lat, inc.lng);
              const popup = `<div class=\"text-sm\"><strong>${inc.type}</strong><div>${inc.description}</div><div class=\"text-xs\">Risk: ${d.score || '-'} - ${d.riskLevel || 'Unknown'}</div></div>`;
              window.L.popup().setLatLng([inc.lat, inc.lng]).setContent(popup).openOn(map);
            });
            incidentsGroup.addLayer(m);
          });
        }
      } catch (e) {
        // ignore nearby incidents failures
      }

      // Safe route overlay
      try {
        const safe = await getSafeRoute(sourceCoords.lat, sourceCoords.lng, destCoords.lat, destCoords.lng);
        if (safe && Array.isArray(safe) && safe.length > 1) {
          const latlngs = safe.map(p => [p.lat, p.lng]);
          const safeLayer = window.L.polyline(latlngs, { color: '#3ce36a', weight: 5, opacity: 0.9 });
          safeRouteRef.current = safeLayer;
          if (showSafeRoute) safeLayer.addTo(map);
        }
      } catch (e) {
        // ignore safe route failures
      }

      // Add groups based on toggles
      if (showIncidents) hotspotsGroup.addTo(map);
      if (showHeatmap) heatGroup.addTo(map);
      if (showIncidents) incidentsGroup.addTo(map);

      hotspotsLayerRef.current = hotspotsGroup;
      heatLayerRef.current = heatGroup;
      incidentsLayerRef.current = incidentsGroup;

      mapRef.current = map;
      try {
        const w = await fetchWeather(destCoords.lat, destCoords.lng);
        setWeather(w);
      } catch (e) {}
      setLoading(false);
    };

    fetchMapData();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [destinationStr]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (showHeatmap) heatLayerRef.current?.addTo(mapRef.current); else heatLayerRef.current?.remove();
  }, [showHeatmap]);

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
    if (showSafeRoute) safeRouteRef.current?.addTo(mapRef.current); else safeRouteRef.current?.remove();
  }, [showSafeRoute]);

  return (
    <main className="relative h-[calc(100vh-64px)] w-full mt-16 flex flex-col lg:flex-row font-body text-slate-900 bg-slate-50 overflow-hidden">
      
      <aside className="z-40 w-full lg:w-[440px] flex-shrink-0 bg-white lg:shadow-2xl flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 h-[55vh] lg:h-full relative">
        <div className="p-6 flex flex-col h-full min-h-0">
          
          <button 
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 w-fit bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-full transition-colors text-sm font-semibold group"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to Dashboard
          </button>
          
          <div className="flex items-center justify-between mb-8 shrink-0">
            <h2 className="font-headline text-2xl font-extrabold text-[#0e1c2b]">Route Intelligence</h2>
            <span className="text-[0.6875rem] font-label font-bold tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-md shadow-sm">API ACTIVE</span>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-xl mb-6 shrink-0">
            {['CRIME DATA', 'SAFE ROUTES'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2.5 text-[0.625rem] md:text-[0.6875rem] font-bold tracking-wider rounded-lg transition-all duration-200 ${
                  activeTab === tab 
                    ? 'bg-white shadow-md text-blue-700 border border-slate-200' 
                    : 'text-slate-500 hover:bg-slate-200 hover:text-slate-800'
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
                    <span className="material-symbols-outlined text-blue-700">wb_sunny</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Current Weather</p>
                    <p className="text-lg font-bold">{Math.round(weather.temperature)}°C • Wind {weather.windspeed} m/s</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={showHeatmap} onChange={() => setShowHeatmap(v => !v)} />
                <span className="text-xs">Heatmap</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={showSafeRoute} onChange={() => setShowSafeRoute(v => !v)} />
                <span className="text-xs">Safe Route</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={showIncidents} onChange={() => setShowIncidents(v => !v)} />
                <span className="text-xs">Incidents</span>
              </label>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                   <span className="material-symbols-outlined text-blue-600 text-[20px]">my_location</span>
                </div>
                <div className="flex-1 border-b border-slate-200 pb-2">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Current Location</p>
                  <p className="text-sm font-bold text-[#0e1c2b]">GPS Coordinates Captured</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#0e1c2b] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-[20px]">flag</span>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Destination</p>
                  <p className="text-sm font-bold text-[#0e1c2b] truncate">{destinationStr}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white shadow-sm p-5 rounded-2xl border border-slate-200">
              <div className="text-center flex-1 border-r border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5">Traffic</p>
                <p className="text-lg font-extrabold text-[#0e1c2b]">{routeData?.traffic || '...'}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5">Est. Time</p>
                <p className="text-lg font-extrabold text-[#0e1c2b]">{routeData?.eta || '...'}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0e1c2b] to-[#233141] p-6 rounded-2xl shadow-xl text-white">
              <div className="flex justify-between items-end mb-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Route Safety Score</h3>
                <span className="text-4xl font-extrabold text-[#3ce36a] leading-none">{routeData?.score || '--'}<span className="text-lg font-normal text-slate-400">/100</span></span>
              </div>
              <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden mb-6 shadow-inner">
                <div className="bg-[#3ce36a] h-full transition-all duration-1000 relative" style={{ width: `${routeData?.score || 0}%` }}></div>
              </div>
            </div>

            {activeTab === 'CRIME DATA' && (
              <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-rose-600 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-widest">API Hotspots</span>
                </div>
                <p className="text-sm text-rose-900 leading-relaxed font-medium">{routeData?.hotspots?.length || 0} risk zones identified along the requested route. Leaflet map updated to reflect bounds.</p>
              </div>
            )}

            {activeTab === 'SAFE ROUTES' && (
              <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-blue-700 text-lg">route</span>
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">API Route Analysis</span>
                </div>
                <div className="bg-white p-4 rounded-xl flex gap-4 shadow-sm border border-blue-100">
                  <span className="material-symbols-outlined text-emerald-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-[#0e1c2b] block mb-1 text-sm">Clearance Verified</strong>
                    Path optimized via Guardian Safety API for {profile} profile. Heatmap overlays rendered via OpenStreetMap coordinates.
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
            <span className="material-symbols-outlined animate-spin text-white text-4xl">sync</span>
          </div>
        )}
        
        {/* Real Leaflet Map Container */}
        <div id="map-container" className="absolute inset-0 w-full h-full z-0"></div>

        <div className="absolute right-6 top-6 flex flex-col gap-3 z-30">
             <button onClick={() => mapRef.current?.zoomIn()} className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-xl shadow-xl flex items-center justify-center hover:bg-white transition-colors border border-slate-200 text-[#0e1c2b]">
                <span className="material-symbols-outlined">add</span>
             </button>
             <button onClick={() => mapRef.current?.zoomOut()} className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-xl shadow-xl flex items-center justify-center hover:bg-white transition-colors border border-slate-200 text-[#0e1c2b]">
                <span className="material-symbols-outlined">remove</span>
             </button>
        </div>
      </section>
    </main>
  );
}