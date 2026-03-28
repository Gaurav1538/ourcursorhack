import React, { useState, useEffect } from 'react';

const MapDetail = ({ setCurrentPage }) => {
  const [routeData, setRouteData] = useState(null);

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

  return (
    <main className="relative h-[calc(100vh-64px)] w-full pt-16 overflow-hidden flex flex-col md:flex-row font-body text-on-background bg-background">
      {/* Sidebar */}
      <aside className="z-40 w-full md:w-96 bg-surface-container-lowest md:shadow-2xl flex flex-col border-r border-slate-200/20 h-full">
        <div className="p-6 flex-1 flex flex-col min-h-0">
          <nav className="mb-6 flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('dashboard')}>
            <span className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to Dashboard
            </span>
            <span className="text-slate-300 text-xs">/</span>
            <span className="text-xs font-bold text-primary">Map Detail</span>
          </nav>
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline text-xl font-bold text-primary">Route Intelligence</h2>
            <span className="text-[0.6875rem] font-label font-bold tracking-wider text-on-tertiary-container bg-[#3ce36a]/20 px-2 py-1 rounded">SECURE ACTIVE</span>
          </div>

          <div className="grid grid-cols-3 gap-2 p-1 bg-surface-container rounded-lg mb-6">
            <button className="py-2 text-[0.6875rem] font-label font-bold tracking-wider text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-md">CRIME DATA</button>
            <button className="py-2 text-[0.6875rem] font-label font-bold tracking-wider text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-md">SENTIMENT</button>
            <button className="py-2 text-[0.6875rem] font-label font-bold tracking-wider bg-surface-container-lowest shadow-sm rounded-md text-primary">SAFE ROUTES</button>
          </div>

          <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-[#3ce36a]">location_on</span>
                <div className="flex-1 border-b border-outline-variant pb-1">
                  <p className="text-[10px] text-outline uppercase font-bold">Current Location</p>
                  <p className="text-sm font-bold text-primary">Market District Hub</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">flag</span>
                <div className="flex-1">
                  <p className="text-[10px] text-outline uppercase font-bold">Destination</p>
                  <p className="text-sm font-bold text-primary">St. Jude Medical Center</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#0e1c2b]/5 p-4 rounded-xl border border-[#0e1c2b]/10">
              <div className="text-center flex-1 border-r border-slate-200">
                <p className="text-[10px] text-outline uppercase font-bold mb-1">Distance</p>
                <p className="text-sm font-bold text-primary">{routeData?.distance || '...'}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[10px] text-outline uppercase font-bold mb-1">Est. Time</p>
                <p className="text-sm font-bold text-primary">{routeData?.estTime || '...'}</p>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wide">Route Safety Score</h3>
                <span className="text-2xl font-black text-[#3ce36a]">{routeData?.safetyScore || '--'}<span className="text-xs font-normal text-outline">/100</span></span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                <div className="bg-[#3ce36a] h-full transition-all duration-1000" style={{ width: `${routeData?.safetyScore || 0}%` }}></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3ce36a] text-[16px]">wb_sunny</span>
                  <span className="text-[10px] font-medium text-on-surface-variant">Optimal Lighting</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3ce36a] text-[16px]">videocam</span>
                  <span className="text-[10px] font-medium text-on-surface-variant">CCTV Coverage</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#233141]/10 rounded-xl border border-[#233141]/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-sm">person_pin</span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Personalized Intelligence</span>
              </div>
              <div className="space-y-3">
                <div className="bg-white/50 p-3 rounded-lg flex gap-3">
                  <span className="material-symbols-outlined text-[#3ce36a] text-lg">verified</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    <strong className="text-primary block mb-0.5">Solo Traveler Alert</strong>
                    Path consists of 95% well-lit major roads. Avoids unlit alleyways behind 5th Ave.
                  </p>
                </div>
                <div className="bg-white/50 p-3 rounded-lg flex gap-3">
                  <span className="material-symbols-outlined text-[#47607e] text-lg">family_restroom</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    <strong className="text-primary block mb-0.5">Family-Friendly Rating</strong>
                    High rating based on presence of emergency kiosks and open businesses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-surface-container-low/50 border-t border-outline-variant/20">
          <button className="w-full bg-primary text-white py-4 rounded-xl font-headline font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-sm">navigation</span>
            Start Guided Navigation
          </button>
        </div>
      </aside>

      {/* Map View */}
      <section className="flex-1 relative bg-slate-200">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover" alt="Urban map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiJHi6WS8lZBXlGvbKEVDTd79xd74ZX6f037WVlcnUgnLfYUhH9LSJOK1BlZegJ9J8XJAkfmSeayIFbJAB-kwxvpmRDRgjF65WXSvjCNo86u36455ce43XP9o_X1L-0PPXJJibmvQJ0gDHISjIu-zBv13b4na27wRti9I2Ts9GQonW1gj0xbQ-kQDba5EugVhKx3FeMwAOYkrgcK8LMdjluY3RzqFgZwn_Q7MGDK0xNjgibxZ1_BJI8tPln84-he8kxe4mOHu5Kts"/>
          <div className="absolute inset-0 bg-gradient-to-tr from-error/10 via-transparent to-[#3ce36a]/10 mix-blend-multiply pointer-events-none"></div>
        </div>

        <svg className="absolute inset-0 z-10 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 1000">
          <defs>
            <filter id="glow">
              <feGaussianBlur result="coloredBlur" stdDeviation="3"></feGaussianBlur>
              <feMerge>
                <feMergeNode in="coloredBlur"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>
          </defs>
          <path className="animate-[dash_30s_linear_infinite]" d="M500 500 L 580 620 L 650 780 L 750 850" fill="transparent" filter="url(#glow)" stroke="#3ce36a" strokeDasharray="12 6" strokeLinecap="round" strokeWidth="5"></path>
        </svg>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="safety-pulse flex items-center justify-center">
            <div className="w-5 h-5 bg-primary rounded-full border-2 border-white shadow-xl relative z-10"></div>
          </div>
        </div>

        <div className="absolute top-[85%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="flex flex-col items-center">
            <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg mb-1 border-b-2 border-primary">
              <span className="text-[10px] font-bold text-primary">St. Jude Medical</span>
            </div>
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-lg">
              <span className="material-symbols-outlined text-white text-[16px]">flag</span>
            </div>
          </div>
        </div>

        <div className="absolute top-[30%] left-[40%] z-20 group">
          <div className="flex flex-col items-center">
            <div className="hidden group-hover:block bg-inverse-surface text-inverse-on-surface p-3 rounded-lg shadow-2xl mb-2 w-48 text-xs">
              <div className="font-bold mb-1 text-error">Risk Hotspot</div>
              Unverified activity reported in this area. Route has been recalculated to avoid this zone.
            </div>
            <div className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center cursor-pointer border-2 border-error transition-transform hover:scale-110">
              <span className="material-symbols-outlined text-error text-md" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
          </div>
        </div>

        <div className="absolute right-6 top-6 flex flex-col gap-3 z-30">
          {['add', 'remove', '-', 'layers'].map((icon, i) => (
             icon === '-' ? <div key={i} className="h-px bg-slate-200/50 w-8 mx-auto"></div> :
             <button key={i} className="w-12 h-12 bg-surface-container-lowest/90 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-center hover:bg-white transition-colors border border-slate-200/50">
                <span className="material-symbols-outlined text-primary">{icon}</span>
             </button>
          ))}
        </div>

        <div className="absolute bottom-6 left-6 z-30 flex gap-4">
          <div className="bg-primary/95 backdrop-blur-2xl p-4 rounded-xl shadow-2xl border border-white/10 max-w-[180px]">
            <p className="text-[9px] font-bold tracking-widest text-[#8b99ac] uppercase mb-2">Security Presence</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/10 h-1 rounded-full overflow-hidden">
                <div className="bg-[#3ce36a] h-full transition-all duration-1000" style={{ width: `${routeData?.securityPresence || 0}%` }}></div>
              </div>
              <span className="text-[10px] font-bold text-white">{routeData?.securityPresence || 0}%</span>
            </div>
          </div>
          <div className="bg-primary/95 backdrop-blur-2xl p-4 rounded-xl shadow-2xl border border-white/10 max-w-[180px]">
            <p className="text-[9px] font-bold tracking-widest text-[#8b99ac] uppercase mb-2">User Confidence</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/10 h-1 rounded-full overflow-hidden">
                <div className="bg-[#3ce36a] h-full transition-all duration-1000" style={{ width: `${routeData?.userConfidence || 0}%` }}></div>
              </div>
              <span className="text-[10px] font-bold text-white">{routeData?.userConfidence || 0}%</span>
            </div>
          </div>
        </div>

        <div className="absolute top-[65%] left-[58%] z-20">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-[#3ce36a]/50">
            <span className="material-symbols-outlined text-[#3ce36a] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>
            <span className="text-[10px] font-bold text-primary whitespace-nowrap">High Lighting Path</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MapDetail;