import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useNavigate, useLocation } from 'react-router-dom';
import { analyzeSafety, getTrends, chatAssistant } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState(null);
  const [chatQuery, setChatQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [assistantLoading, setAssistantLoading] = useState(false);

  const searchTarget = location.state?.destination || "London, UK";
  const profile = location.state?.profile || "solo";
  const time = location.state?.time || new Date().getHours();
  const coords = location.state?.coords || null;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await analyzeSafety(searchTarget, searchTarget, profile, time);
      
      setData({
          safetyScore: result.score || 82,
          riskLevel: result.riskLevel || "Low",
          location: searchTarget,
          intelligenceBrief: result.insights?.[0] || "Area intelligence loaded. Proceed with standard caution.",
          insights: result.insights || [],
          signals: result.recommendations?.map((rec, i) => ({
              title: 'Sentinel Advisory ' + (i+1), detail: rec, icon: 'security', colorClass: 'bg-blue-50 text-blue-600'
          })) || [],
          breakdown: result.breakdown || { lighting: 90, cctv: 85 }
      });
      setLoading(false);
    };
    fetchData();
  }, [searchTarget, profile, time]);

  useEffect(() => {
    const fetchTrends = async () => {
      const t = await getTrends();
      setTrends(t || null);
    };
    fetchTrends();
  }, []);

  const sendChat = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!chatQuery) return;
    const userMsg = { from: 'user', text: chatQuery, time: new Date().toISOString() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatQuery('');
    setAssistantLoading(true);
    try {
      const res = await chatAssistant(chatQuery);
      const replyText = res?.reply || 'No assistant response available.';
      const botMsg = { from: 'bot', text: replyText, time: new Date().toISOString() };
      setChatMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const botMsg = { from: 'bot', text: 'Assistant error. Try again later.', time: new Date().toISOString() };
      setChatMessages(prev => [...prev, botMsg]);
    }
    setAssistantLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-blue-600 text-4xl">sync</span>
          <p className="font-headline font-bold text-slate-600 tracking-widest uppercase text-sm">Synthesizing Threat Data...</p>
        </div>
      </div>
    );
  }

=======
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

>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
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
<<<<<<< HEAD
          <input className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm focus:ring-2 focus:ring-blue-500 w-full md:w-72 transition-all outline-none shadow-sm" placeholder="Search destination..." type="text" readOnly value={data?.location || ""} />
=======
          <input className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm focus:ring-2 focus:ring-blue-500 w-full md:w-72 transition-all outline-none shadow-sm" placeholder="Search destination..." type="text" defaultValue="Le Marais, Paris" />
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        <div className="lg:col-span-4 bg-white rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden group shadow-md border border-slate-200/50">
<<<<<<< HEAD
          <div className={`absolute top-0 left-0 w-1 h-full ${data?.safetyScore > 80 ? 'bg-emerald-500' : data?.safetyScore > 50 ? 'bg-amber-500' : 'bg-rose-600'}`}></div>
=======
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
          <div>
            <span className="font-label text-[0.6875rem] uppercase tracking-wider text-slate-500 font-bold mb-2 block">Live Safety Index</span>
            <div className="flex items-baseline gap-2">
              <h1 className="font-headline text-6xl font-extrabold text-[#0e1c2b]">
<<<<<<< HEAD
                {data?.safetyScore}<span className="text-2xl text-slate-400 font-medium">/100</span>
              </h1>
            </div>
            <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${data?.safetyScore > 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : data?.safetyScore > 50 ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{data?.safetyScore > 80 ? 'verified_user' : 'warning'}</span>
              Risk Level: {data?.riskLevel}
=======
                {data ? data.safetyScore : '--'}<span className="text-2xl text-slate-400 font-medium">/100</span>
              </h1>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              Moderate Caution
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
            </div>
          </div>
          <div className="mt-8">
            <p className="text-sm text-slate-600 leading-relaxed">
<<<<<<< HEAD
              Safety levels in <span className="font-bold text-[#0e1c2b]">{data?.location}</span> are mapped using real-time API sentiment and crime reports.
=======
              Safety levels in <span className="font-bold text-[#0e1c2b]">{data?.location || '...'}</span> are currently stable but declining as evening approaches.
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
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
<<<<<<< HEAD
          <p className="text-slate-700 leading-relaxed text-lg italic min-h-[80px] bg-slate-50 p-5 rounded-xl border border-slate-100 shadow-inner">
            "{data?.intelligenceBrief}"
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={() => navigate('/map', { state: { destination: searchTarget, profile, time, coords } })} className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/20 hover:bg-blue-700">
              <span className="material-symbols-outlined text-sm">map</span>
              View Live Route & Heatmap
            </button>
            {trends && (
              <div className="ml-4 mt-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                <div className="font-bold text-slate-700">Latest Trends</div>
                <div className="text-xs text-slate-600 mt-1">{trends.overallTrend || 'Unavailable'}</div>
                {trends.weeklyIncidents && <div className="text-xs text-slate-500 mt-2">Weekly: {trends.weeklyIncidents.join(', ')}</div>}
              </div>
            )}
=======
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
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-md border border-slate-200/50">
          <div className="flex justify-between items-center mb-10">
            <div>
<<<<<<< HEAD
              <h3 className="font-headline text-xl font-extrabold text-[#0e1c2b]">Infrastructure Breakdown</h3>
              <p className="text-xs text-slate-500 font-label uppercase tracking-widest mt-1">API Node Validation</p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {Object.entries(data?.breakdown || {}).map(([key, value]) => (
               <div key={key} className="flex items-center gap-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-600 w-24">{key}</span>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${value}%` }}></div>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{value}%</span>
               </div>
            ))}
=======
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
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 flex flex-col gap-6 shadow-md border border-slate-200/50">
<<<<<<< HEAD
          <h3 className="font-headline text-xl font-extrabold text-[#0e1c2b]">System Advisories</h3>
          <div className="space-y-6">
            {data?.signals?.length > 0 ? data.signals.map((s, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center ${s.colorClass}`}>
                  <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
=======
          <h3 className="font-headline text-xl font-extrabold text-[#0e1c2b]">Local Signals</h3>
          <div className="space-y-6">
            {data?.signals ? data.signals.map((s, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${s.colorClass}`}>
                  <span className="material-symbols-outlined">{s.icon}</span>
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{s.title}</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{s.detail}</p>
                </div>
              </div>
            )) : (
<<<<<<< HEAD
               <p className="text-sm text-slate-500">No active advisories.</p>
            )}
            <div className="pt-4 border-t mt-2">
              <h4 className="text-sm font-bold mb-2">Ask Sentinel Assistant</h4>
              <form onSubmit={sendChat} className="flex items-center gap-2">
                <input value={chatQuery} onChange={(e) => setChatQuery(e.target.value)} placeholder="Ask about this area..." className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none" />
                <button type="submit" disabled={assistantLoading} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">{assistantLoading ? '...' : 'Send'}</button>
              </form>
              <div className="mt-3 max-h-40 overflow-y-auto space-y-2">
                {chatMessages.map((m, i) => (
                  <div key={i} className={`p-2 rounded ${m.from === 'user' ? 'bg-blue-50 text-right' : 'bg-slate-100'}`}>
                    <div className="text-xs text-slate-700">{m.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
=======
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
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
        </div>
      </section>
    </main>
  );
}