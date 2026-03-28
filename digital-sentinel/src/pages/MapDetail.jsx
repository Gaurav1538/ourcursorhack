import React, { useState, useEffect } from 'react';

export default function MapDetail({ setCurrentPage }) {
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

  return (
    <main className="relative h-[calc(100vh-64px)] w-full mt-16 flex flex-col lg:flex-row font-body text-slate-900 bg-slate-50 overflow-hidden">
      
      <aside className="z-40 w-full lg:w-[440px] flex-shrink-0 bg-white lg:shadow-2xl flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 h-[55vh] lg:h-full">
        <div className="p-6 flex flex-col h-full min-h-0">
          
          <button 
            onClick={() => setCurrentPage('dashboard')}
            className="mb-6 flex items-center gap-2 w-fit bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-full transition-colors text-sm font-semibold group"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to Dashboard
          </button>
          
          <div className="flex items-center justify-between mb-8 shrink-0">
            <h2 className="font-headline text-2xl font-extrabold text-[#0e1c2b]">Route Intelligence</h2>
            <span className="text-[0.6875rem] font-label font-bold tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-md shadow-sm">SECURE ACTIVE</span>
          </div>

          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-xl mb-6 shrink-0">
            {['CRIME DATA', 'SENTIMENT', 'SAFE ROUTES'].map((tab) => (
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

          {/* Block layout avoids compression issues inside flex */}
          <div className="flex-1 overflow-y-auto pr-3 space-y-6 pb-6 block custom-scrollbar">
            
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                   <span className="material-symbols-outlined text-emerald-600 text-[20px]">location_on</span>
                </div>
                <div className="flex-1 border-b border-slate-200 pb-2">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Current Location</p>
                  <p className="text-sm font-bold text-[#0e1c2b]">Market District Hub</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#0e1c2b] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-[20px]">flag</span>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Destination</p>
                  <p className="text-sm font-bold text-[#0e1c2b]">St. Jude Medical Center</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white shadow-sm p-5 rounded-2xl border border-slate-200">
              <div className="text-center flex-1 border-r border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5">Distance</p>
                <p className="text-lg font-extrabold text-[#0e1c2b]">{routeData?.distance || '...'}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5">Est. Time</p>
                <p className="text-lg font-extrabold text-[#0e1c2b]">{routeData?.estTime || '...'}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0e1c2b] to-[#233141] p-6 rounded-2xl shadow-xl text-white">
              <div className="flex justify-between items-end mb-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Route Safety Score</h3>
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
              </div>
            </div>

            {/* TAB CONTENT RENDERING */}
            {activeTab === 'CRIME DATA' && (
              <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-rose-600 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
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
              </div>
            )}

            {activeTab === 'SAFE ROUTES' && (
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
                </div>
              </div>
            )}
          </div>
          
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
    </main>
  );
}