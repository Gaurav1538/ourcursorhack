<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MapDetail() {
  const navigate = useNavigate();
  const [routeData, setRouteData] = useState(null);
  const [activeTab, setActiveTab] = useState('SAFE ROUTES');

  useEffect(() => {
    setTimeout(() => {
      setRouteData({
        safetyScore: 88,
        distance: "1.4 miles",
        estTime: "18 mins",
        securityPresence: 92,
        userConfidence: 85
      });
    }, 1000);
  }, []);
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee

  return (
    <main className="relative h-[calc(100vh-64px)] w-full mt-16 flex flex-col lg:flex-row font-body text-slate-900 bg-slate-50 overflow-hidden">
      
<<<<<<< HEAD
      <aside className="z-40 w-full lg:w-[440px] flex-shrink-0 bg-white lg:shadow-2xl flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 h-[55vh] lg:h-full relative">
=======
      <aside className="z-40 w-full lg:w-[440px] flex-shrink-0 bg-white lg:shadow-2xl flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 h-[55vh] lg:h-full">
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
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
<<<<<<< HEAD
            <span className="text-[0.6875rem] font-label font-bold tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-md shadow-sm">API ACTIVE</span>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-xl mb-6 shrink-0">
            {['CRIME DATA', 'SAFE ROUTES'].map((tab) => (
=======
            <span className="text-[0.6875rem] font-label font-bold tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-md shadow-sm">SECURE ACTIVE</span>
          </div>

          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-xl mb-6 shrink-0">
            {['CRIME DATA', 'SENTIMENT', 'SAFE ROUTES'].map((tab) => (
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
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
<<<<<<< HEAD
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
=======
            
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                   <span className="material-symbols-outlined text-emerald-600 text-[20px]">location_on</span>
                </div>
                <div className="flex-1 border-b border-slate-200 pb-2">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Current Location</p>
                  <p className="text-sm font-bold text-[#0e1c2b]">Market District Hub</p>
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#0e1c2b] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-[20px]">flag</span>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Destination</p>
<<<<<<< HEAD
                  <p className="text-sm font-bold text-[#0e1c2b] truncate">{destinationStr}</p>
=======
                  <p className="text-sm font-bold text-[#0e1c2b]">St. Jude Medical Center</p>
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white shadow-sm p-5 rounded-2xl border border-slate-200">
              <div className="text-center flex-1 border-r border-slate-200">
<<<<<<< HEAD
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5">Traffic</p>
                <p className="text-lg font-extrabold text-[#0e1c2b]">{routeData?.traffic || '...'}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5">Est. Time</p>
                <p className="text-lg font-extrabold text-[#0e1c2b]">{routeData?.eta || '...'}</p>
=======
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5">Distance</p>
                <p className="text-lg font-extrabold text-[#0e1c2b]">{routeData?.distance || '...'}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5">Est. Time</p>
                <p className="text-lg font-extrabold text-[#0e1c2b]">{routeData?.estTime || '...'}</p>
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0e1c2b] to-[#233141] p-6 rounded-2xl shadow-xl text-white">
              <div className="flex justify-between items-end mb-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Route Safety Score</h3>
<<<<<<< HEAD
                <span className="text-4xl font-extrabold text-[#3ce36a] leading-none">{routeData?.score || '--'}<span className="text-lg font-normal text-slate-400">/100</span></span>
              </div>
              <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden mb-6 shadow-inner">
                <div className="bg-[#3ce36a] h-full transition-all duration-1000 relative" style={{ width: `${routeData?.score || 0}%` }}></div>
=======
                <span className="text-4xl font-extrabold text-[#3ce36a] leading-none">{routeData?.safetyScore || '--'}<span className="text-lg font-normal text-slate-400">/100</span></span>
              </div>
              <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden mb-6 shadow-inner">
                <div className="bg-[#3ce36a] h-full transition-all duration-1000 relative" style={{ width: `${routeData?.safetyScore || 0}%` }}>
                   <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3ce36a] text-[18px]">wb_sunny</span>
                  <span className="text-xs font-medium text-slate-300">Optimal Lighting</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3ce36a] text-[18px]">videocam</span>
                  <span className="text-xs font-medium text-slate-300">CCTV Coverage</span>
                </div>
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
              </div>
            </div>

            {activeTab === 'CRIME DATA' && (
              <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-rose-600 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
<<<<<<< HEAD
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-widest">API Hotspots</span>
                </div>
                <p className="text-sm text-rose-900 leading-relaxed font-medium">{routeData?.hotspots?.length || 0} risk zones identified along the requested route. Leaflet map updated to reflect bounds.</p>
=======
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-widest">Recent Incidents</span>
                </div>
                <p className="text-sm text-rose-900 leading-relaxed font-medium">2 reported incidents of petty theft within 1 mile in the last 48 hours. Increased caution advised at night.</p>
              </div>
            )}

            {activeTab === 'SENTIMENT' && (
              <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-200 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-indigo-600 text-lg">forum</span>
                  <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest">Community Pulse</span>
                </div>
                <p className="text-sm text-indigo-900 leading-relaxed italic border-l-4 border-indigo-300 pl-3">"Generally feels safe, but the alleyways are poorly lit. Main roads are fine." <br/><span className="text-xs text-indigo-500 font-bold not-italic block mt-2">— Local Guide (2 hrs ago)</span></p>
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
              </div>
            )}

            {activeTab === 'SAFE ROUTES' && (
<<<<<<< HEAD
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
=======
              <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-blue-700 text-lg">person_pin</span>
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">Personalized Intelligence</span>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl flex gap-4 shadow-sm border border-blue-100">
                    <span className="material-symbols-outlined text-emerald-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-[#0e1c2b] block mb-1 text-sm">Solo Traveler Alert</strong>
                      Path consists of 95% well-lit major roads. Avoids unlit alleyways behind 5th Ave.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl flex gap-4 shadow-sm border border-blue-100">
                    <span className="material-symbols-outlined text-amber-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>family_restroom</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-[#0e1c2b] block mb-1 text-sm">Family-Friendly Rating</strong>
                      High rating based on presence of emergency kiosks and open businesses.
                    </p>
                  </div>
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
                </div>
              </div>
            )}
          </div>
<<<<<<< HEAD
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
=======
          
          <div className="pt-5 border-t border-slate-200 shrink-0">
            <button className="w-full bg-[#0e1c2b] text-white py-4 rounded-xl font-headline font-bold flex items-center justify-center gap-3 hover:bg-[#1a2d42] transition-colors active:scale-[0.98] shadow-lg">
              <span className="material-symbols-outlined text-lg">navigation</span>
              Start Guided Navigation
            </button>
          </div>

        </div>
      </aside>

      <section className="flex-1 relative bg-slate-900 h-[45vh] lg:h-full w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover opacity-50 mix-blend-luminosity" alt="Urban map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiJHi6WS8lZBXlGvbKEVDTd79xd74ZX6f037WVlcnUgnLfYUhH9LSJOK1BlZegJ9J8XJAkfmSeayIFbJAB-kwxvpmRDRgjF65WXSvjCNo86u36455ce43XP9o_X1L-0PPXJJibmvQJ0gDHISjIu-zBv13b4na27wRti9I2Ts9GQonW1gj0xbQ-kQDba5EugVhKx3FeMwAOYkrgcK8LMdjluY3RzqFgZwn_Q7MGDK0xNjgibxZ1_BJI8tPln84-he8kxe4mOHu5Kts"/>
          <div className="absolute inset-0 bg-gradient-to-tr from-error/20 via-transparent to-[#3ce36a]/20 mix-blend-color pointer-events-none"></div>
        </div>

        <svg className="absolute inset-0 z-10 w-full h-full pointer-events-none drop-shadow-[0_0_10px_rgba(60,227,106,0.8)]" preserveAspectRatio="none" viewBox="0 0 1000 1000">
          <path className="animate-[dash_30s_linear_infinite]" d="M500 500 L 580 620 L 650 780 L 750 850" fill="transparent" stroke="#3ce36a" strokeDasharray="16 8" strokeLinecap="round" strokeWidth="6"></path>
        </svg>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative">
            <div className="w-6 h-6 bg-blue-500 rounded-full border-[3px] border-white shadow-[0_0_20px_rgba(59,130,246,1)] relative z-10"></div>
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-60 scale-150"></div>
          </div>
        </div>

        <div className="absolute top-[85%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="flex flex-col items-center">
            <div className="bg-white px-4 py-2 rounded-lg shadow-xl mb-2 border-b-[3px] border-[#0e1c2b]">
              <span className="text-[11px] font-bold text-[#0e1c2b] uppercase tracking-wider">St. Jude Medical</span>
            </div>
            <div className="w-8 h-8 bg-[#0e1c2b] rounded-full flex items-center justify-center border-[3px] border-white shadow-xl">
              <span className="material-symbols-outlined text-white text-[18px]">flag</span>
            </div>
          </div>
        </div>

        <div className="absolute top-[30%] left-[40%] z-20 group">
          <div className="flex flex-col items-center">
            <div className="hidden group-hover:block bg-[#191c1d] text-white p-4 rounded-xl shadow-2xl mb-3 w-56 text-xs border border-rose-900">
              <div className="font-bold mb-1.5 text-rose-500 flex items-center gap-1.5 uppercase tracking-wider"><span className="material-symbols-outlined text-[14px]">warning</span> Risk Hotspot</div>
              Unverified activity reported in this area. Route has been recalculated to avoid this zone.
            </div>
            <div className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full shadow-[0_0_15px_rgba(225,29,72,0.6)] flex items-center justify-center cursor-pointer border-2 border-rose-600 transition-transform hover:scale-110">
              <span className="material-symbols-outlined text-rose-600 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
          </div>
        </div>

        <div className="absolute right-6 top-6 flex flex-col gap-3 z-30">
          {['add', 'remove', '-', 'layers'].map((icon, i) => (
             icon === '-' ? <div key={i} className="h-px bg-white/20 w-8 mx-auto"></div> :
             <button key={i} className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-xl shadow-xl flex items-center justify-center hover:bg-white transition-colors border border-slate-200 text-[#0e1c2b]">
                <span className="material-symbols-outlined">{icon}</span>
             </button>
          ))}
        </div>

        <div className="absolute bottom-6 left-6 z-30 flex flex-col md:flex-row gap-4">
          <div className="bg-[#0e1c2b]/95 backdrop-blur-2xl p-5 rounded-2xl shadow-2xl border border-slate-700 w-full md:w-48">
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">Security Presence</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#3ce36a] h-full transition-all duration-1000 shadow-[0_0_8px_#3ce36a]" style={{ width: `${routeData?.securityPresence || 0}%` }}></div>
              </div>
              <span className="text-xs font-bold text-white">{routeData?.securityPresence || 0}%</span>
            </div>
          </div>
          <div className="bg-[#0e1c2b]/95 backdrop-blur-2xl p-5 rounded-2xl shadow-2xl border border-slate-700 w-full md:w-48">
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">User Confidence</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full transition-all duration-1000 shadow-[0_0_8px_#60a5fa]" style={{ width: `${routeData?.userConfidence || 0}%` }}></div>
              </div>
              <span className="text-xs font-bold text-white">{routeData?.userConfidence || 0}%</span>
            </div>
          </div>
        </div>

        <div className="absolute top-[65%] left-[58%] z-20">
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border border-[#3ce36a]/50">
            <span className="material-symbols-outlined text-[#3ce36a] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>
            <span className="text-xs font-bold text-[#0e1c2b] whitespace-nowrap uppercase tracking-wider">High Lighting Path</span>
          </div>
        </div>
      </section>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
    </main>
  );
}