import React, { useState, useEffect } from 'react';

const Dashboard = ({ setCurrentPage }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Mock API Fetch
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
    <main className="pt-24 pb-16 px-6 max-w-7xl mx-auto flex-grow font-body text-on-surface w-full">
      {/* Search Header included in Dashboard spec */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-auto">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
            <input className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-600 w-full md:w-64 transition-all outline-none" placeholder="Search destination..." type="text" defaultValue="Le Marais, Paris" />
          </div>
      </div>

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group shadow-sm border border-slate-200/50">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
          <div>
            <span className="font-label text-[0.6875rem] uppercase tracking-wider text-on-surface-variant font-bold mb-2 block">Live Safety Index</span>
            <div className="flex items-baseline gap-2">
              <h1 className="font-headline text-6xl font-extrabold text-blue-900">
                {data ? data.safetyScore : '--'}<span className="text-2xl text-on-surface-variant font-medium">/100</span>
              </h1>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              Moderate Caution
            </div>
          </div>
          <div className="mt-8">
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Safety levels in <span className="font-semibold text-blue-900">{data?.location || '...'}</span> are currently stable but declining as evening approaches.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 flex flex-col justify-center relative shadow-sm border border-slate-200/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white">auto_awesome</span>
            </div>
            <h2 className="font-headline text-xl font-bold text-blue-900">Sentinel Intelligence Brief</h2>
          </div>
          <p className="text-on-surface leading-relaxed text-lg italic text-slate-700 min-h-[80px]">
            {data ? data.intelligenceBrief : 'Analyzing local signals...'}
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <button onClick={() => setCurrentPage('map')} className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-blue-600/20 hover:bg-blue-700">
              <span className="material-symbols-outlined text-sm">map</span>
              View Heatmap
            </button>
            <button className="px-6 py-3 rounded-lg border border-slate-200 text-blue-900 text-sm font-semibold hover:bg-slate-50 transition-colors">
              Detailed Breakdown
            </button>
          </div>
        </div>
      </section>

      {/* Radar Section */}
      <section className="mb-12">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200/50">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-headline text-xl font-bold text-blue-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">radar</span>
                Local Safety Radar
              </h3>
              <p className="text-sm text-on-surface-variant mt-1">Real-time safety overview for your immediate <span className="font-semibold text-blue-900">50km radius</span>.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Safe</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Caution</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500"></span> High Risk</div>
            </div>
          </div>
          <div className="relative h-[400px] w-full bg-slate-50 overflow-hidden cursor-pointer" onClick={() => setCurrentPage('map')}>
            <img alt="Detailed topographic map" className="w-full h-full object-cover grayscale opacity-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZOrpNFoT7acW0teq2L4KjMJqopCMAhmn5jCS1BG9XJevBIzdvhhaJ2aDRKySjbHxrk_Fmj04pQYqLnCdmA-SJGSTUZ39EHZP-Y4YcJ8w9FeN6vaCG_A7q4YQJEjjK0DwKdeSasvEe025KCp9kSCZwt3UlWK68kOhzZfqiI_eomNVbphzQE2dWEAOfXaO_agEJDTtnpyZiEz_XWwV3j7GPh7MhlpNMQPeTGJt5hVlb6KGeCHF9LVvRtU-ZfpuX8Az70o3QJL0qlEI"/>
            
            {/* Overlays */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-[380px] h-[380px] rounded-full border-2 border-emerald-500/30 bg-emerald-500/5 flex items-center justify-center">
                <span className="absolute -top-6 text-[10px] font-bold text-emerald-700 uppercase tracking-widest">50km Boundary</span>
              </div>
              <div className="absolute w-[240px] h-[240px] rounded-full border-2 border-amber-500/40 bg-amber-500/10 flex items-center justify-center">
                <span className="absolute -top-5 text-[10px] font-bold text-amber-700 uppercase tracking-widest">25km Caution Zone</span>
              </div>
              <div className="absolute w-[100px] h-[100px] rounded-full border-2 border-rose-500/50 bg-rose-500/20 flex items-center justify-center">
                <div className="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg">
                  <div className="absolute inset-0 w-full h-full bg-blue-600 rounded-full radar-pulse"></div>
                </div>
              </div>
              <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-rose-500/30 blur-2xl rounded-full"></div>
              <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-amber-500/20 blur-2xl rounded-full"></div>
              <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-emerald-500/20 blur-2xl rounded-full"></div>
            </div>
            
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <button className="bg-white p-2 rounded-lg shadow-md border border-slate-200 text-blue-900 hover:bg-slate-50">
                <span className="material-symbols-outlined block">my_location</span>
              </button>
              <button className="bg-white p-2 rounded-lg shadow-md border border-slate-200 text-blue-900 hover:bg-slate-50">
                <span className="material-symbols-outlined block">layers</span>
              </button>
            </div>
          </div>
          <div className="p-4 bg-slate-50/50 text-center border-t border-slate-100">
            <p className="text-xs text-on-surface-variant font-medium italic">Scanning 14 active safety nodes within your 50km perimeter. All values updated 2m ago.</p>
          </div>
        </div>
      </section>

      {/* Dynamic Risk */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-8 shadow-sm border border-slate-200/50">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="font-headline text-lg font-bold text-blue-900">24-Hour Risk Projection</h3>
              <p className="text-xs text-on-surface-variant font-label uppercase tracking-widest mt-1">Real-time predictive analytics</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-slate-400">Update: Just now</span>
            </div>
          </div>
          <div className="relative h-48 flex items-end justify-between gap-2 px-4">
            {data?.riskProjections ? data.riskProjections.map((proj, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-3 group">
                <div className={`w-full ${proj.color} ${proj.height} rounded-t-lg transition-all group-hover:opacity-80`}></div>
                <span className={`text-[0.625rem] font-bold uppercase ${proj.textColors}`}>{proj.period}</span>
                <span className={`text-[0.625rem] ${proj.level === 'High Risk' ? 'text-rose-600 font-bold' : 'text-on-surface-variant'}`}>{proj.level}</span>
              </div>
            )) : (
               <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">Loading projection...</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 flex flex-col gap-6 shadow-sm border border-slate-200/50">
          <h3 className="font-headline text-lg font-bold text-blue-900">Local Signals</h3>
          {data?.signals ? data.signals.map((s, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <span className={`material-symbols-outlined p-2 rounded-lg ${s.colorClass}`}>{s.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{s.title}</p>
                <p className="text-xs text-on-surface-variant mt-1">{s.detail}</p>
              </div>
            </div>
          )) : (
             <div className="text-sm text-slate-400">Loading signals...</div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;