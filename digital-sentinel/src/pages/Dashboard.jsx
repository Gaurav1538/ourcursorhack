import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setData({
        safetyScore: 78,
        location: "Le Marais, Paris",
        intelligenceBrief: `"This area is generally safe for solo travelers during the day, but we recommend avoiding the south-east park area after 9 PM due to low lighting and reported incidents. Local transit remains high-frequency and well-monitored through 11 PM."`,
        riskProjections: [
          { period: 'Morning', level: 'Safe', height: 'h-16', color: 'bg-emerald-100', textColors: 'text-emerald-700' },
          { period: 'Afternoon', level: 'Safe', height: 'h-12', color: 'bg-emerald-100', textColors: 'text-emerald-700' },
          { period: 'Evening', level: 'Caution', height: 'h-32', color: 'bg-amber-100', textColors: 'text-amber-700' },
          { period: 'Late Night', level: 'High Risk', height: 'h-44', color: 'bg-rose-100', textColors: 'text-rose-700' }
        ],
        signals: [
          { title: 'Infrastructure', detail: 'Lighting efficiency at 84%. Two CCTV nodes offline in North Sector.', icon: 'router', colorClass: 'bg-blue-50 text-blue-600' },
          { title: 'News Activity', detail: 'Minor public gathering reported at Place des Vosges. Non-violent.', icon: 'newspaper', colorClass: 'bg-indigo-50 text-indigo-600' },
          { title: 'Weather Risk', detail: 'Heavy rain expected at 10 PM. Reduced visibility may impact walk safety.', icon: 'thunderstorm', colorClass: 'bg-rose-50 text-rose-600' }
        ]
      });
    }, 800);
  }, []);

  return (
    <main className="pt-24 pb-16 px-6 max-w-[1400px] mx-auto flex-grow font-body text-slate-900 w-full bg-slate-50 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 hover:shadow-md"
        >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Input
        </button>

        <div className="relative w-full md:w-auto">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm focus:ring-2 focus:ring-blue-500 w-full md:w-72 transition-all outline-none shadow-sm" placeholder="Search destination..." type="text" defaultValue="Le Marais, Paris" />
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        <div className="lg:col-span-4 bg-white rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden group shadow-md border border-slate-200/50">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
          <div>
            <span className="font-label text-[0.6875rem] uppercase tracking-wider text-slate-500 font-bold mb-2 block">Live Safety Index</span>
            <div className="flex items-baseline gap-2">
              <h1 className="font-headline text-6xl font-extrabold text-[#0e1c2b]">
                {data ? data.safetyScore : '--'}<span className="text-2xl text-slate-400 font-medium">/100</span>
              </h1>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              Moderate Caution
            </div>
          </div>
          <div className="mt-8">
            <p className="text-sm text-slate-600 leading-relaxed">
              Safety levels in <span className="font-bold text-[#0e1c2b]">{data?.location || '...'}</span> are currently stable but declining as evening approaches.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white rounded-2xl p-8 flex flex-col justify-center relative shadow-md border border-slate-200/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0e1c2b] to-[#233141] flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white">auto_awesome</span>
            </div>
            <h2 className="font-headline text-2xl font-extrabold text-[#0e1c2b]">Sentinel Intelligence Brief</h2>
          </div>
          <p className="text-slate-700 leading-relaxed text-lg italic min-h-[80px] bg-slate-50 p-4 rounded-xl border border-slate-100">
            {data ? data.intelligenceBrief : 'Analyzing local signals...'}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={() => navigate('/map')} className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/20 hover:bg-blue-700">
              <span className="material-symbols-outlined text-sm">map</span>
              View Local Heatmap
            </button>
            <button className="px-6 py-3 rounded-xl border border-slate-200 text-[#0e1c2b] text-sm font-bold hover:bg-slate-50 transition-colors">
              Detailed Breakdown
            </button>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200/50">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-headline text-xl font-extrabold text-[#0e1c2b] flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">radar</span>
                Local Safety Radar
              </h3>
              <p className="text-sm text-slate-500 mt-1">Real-time safety overview for your immediate <span className="font-semibold text-[#0e1c2b]">50km radius</span>.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></span> Safe</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></span> Caution</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm"></span> High Risk</div>
            </div>
          </div>
          <div className="relative h-[400px] w-full bg-slate-900 overflow-hidden cursor-pointer" onClick={() => navigate('/map')}>
            <img alt="Detailed topographic map" className="w-full h-full object-cover opacity-60 mix-blend-luminosity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZOrpNFoT7acW0teq2L4KjMJqopCMAhmn5jCS1BG9XJevBIzdvhhaJ2aDRKySjbHxrk_Fmj04pQYqLnCdmA-SJGSTUZ39EHZP-Y4YcJ8w9FeN6vaCG_A7q4YQJEjjK0DwKdeSasvEe025KCp9kSCZwt3UlWK68kOhzZfqiI_eomNVbphzQE2dWEAOfXaO_agEJDTtnpyZiEz_XWwV3j7GPh7MhlpNMQPeTGJt5hVlb6KGeCHF9LVvRtU-ZfpuX8Az70o3QJL0qlEI"/>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-[380px] h-[380px] rounded-full border-2 border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center backdrop-blur-[1px]">
                <span className="absolute -top-6 text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-slate-900/80 px-2 py-0.5 rounded">50km Boundary</span>
              </div>
              <div className="absolute w-[240px] h-[240px] rounded-full border-2 border-amber-500/40 bg-amber-500/10 flex items-center justify-center backdrop-blur-[2px]">
                <span className="absolute -top-5 text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-slate-900/80 px-2 py-0.5 rounded">25km Caution Zone</span>
              </div>
              <div className="absolute w-[100px] h-[100px] rounded-full border-2 border-rose-500/50 bg-rose-500/20 flex items-center justify-center backdrop-blur-[4px]">
                <div className="relative w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                  <div className="absolute inset-0 w-full h-full bg-blue-500 rounded-full animate-ping opacity-75"></div>
                </div>
              </div>
              <div className="absolute top-1/4 left-1/3 w-20 h-20 bg-rose-500/40 blur-2xl rounded-full"></div>
              <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-amber-500/30 blur-2xl rounded-full"></div>
              <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-emerald-500/30 blur-2xl rounded-full"></div>
            </div>
            
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <button className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200 text-[#0e1c2b] hover:bg-white transition-colors">
                <span className="material-symbols-outlined block">my_location</span>
              </button>
              <button className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200 text-[#0e1c2b] hover:bg-white transition-colors">
                <span className="material-symbols-outlined block">layers</span>
              </button>
            </div>
          </div>
          <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Scanning 14 active safety nodes within perimeter • Updated 2m ago</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-md border border-slate-200/50">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="font-headline text-xl font-extrabold text-[#0e1c2b]">24-Hour Risk Projection</h3>
              <p className="text-xs text-slate-500 font-label uppercase tracking-widest mt-1">Real-time predictive analytics</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Live Updates</span>
            </div>
          </div>
          <div className="relative h-48 flex items-end justify-between gap-3 px-4">
            {data?.riskProjections ? data.riskProjections.map((proj, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-3 group">
                <div className={`w-full max-w-[120px] ${proj.color} ${proj.height} rounded-t-xl transition-all duration-300 group-hover:opacity-80 border-t-2 ${proj.color.replace('100', '300')}`}></div>
                <span className={`text-[0.625rem] font-bold uppercase tracking-wider ${proj.textColors}`}>{proj.period}</span>
                <span className={`text-[0.625rem] font-semibold ${proj.level === 'High Risk' ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>{proj.level}</span>
              </div>
            )) : (
               <div className="w-full h-full flex items-center justify-center text-sm text-slate-400 font-medium">Loading projection models...</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 flex flex-col gap-6 shadow-md border border-slate-200/50">
          <h3 className="font-headline text-xl font-extrabold text-[#0e1c2b]">Local Signals</h3>
          <div className="space-y-6">
            {data?.signals ? data.signals.map((s, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${s.colorClass}`}>
                  <span className="material-symbols-outlined">{s.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{s.title}</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{s.detail}</p>
                </div>
              </div>
            )) : (
               <div className="text-sm text-slate-400 font-medium">Loading signal streams...</div>
            )}
          </div>
        </div>
      </section>
      
      <section className="mt-12">
        <div className="bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-md">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-5 max-w-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center shadow-xl shadow-rose-600/40 animate-pulse">
              <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>emergency_home</span>
            </div>
            <div>
              <h3 className="text-rose-950 font-headline text-2xl font-extrabold">Emergency Protocol</h3>
              <p className="text-rose-800 text-sm mt-2 leading-relaxed font-medium">Instant alert to local authorities and emergency contacts with your live location. One-tap activation for immediate assistance.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/emergency')}
            className="w-full md:w-auto px-10 py-5 bg-rose-600 text-white font-bold rounded-xl shadow-xl shadow-rose-600/30 hover:bg-rose-700 active:scale-[0.98] transition-all uppercase tracking-widest text-sm text-center flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">warning</span>
            Activate Emergency Mode
          </button>
        </div>
      </section>
    </main>
  );
}