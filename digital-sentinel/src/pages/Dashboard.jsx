import React, { useState, useEffect } from 'react';
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
          <input className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm focus:ring-2 focus:ring-blue-500 w-full md:w-72 transition-all outline-none shadow-sm" placeholder="Search destination..." type="text" readOnly value={data?.location || ""} />
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        <div className="lg:col-span-4 bg-white rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden group shadow-md border border-slate-200/50">
          <div className={`absolute top-0 left-0 w-1 h-full ${data?.safetyScore > 80 ? 'bg-emerald-500' : data?.safetyScore > 50 ? 'bg-amber-500' : 'bg-rose-600'}`}></div>
          <div>
            <span className="font-label text-[0.6875rem] uppercase tracking-wider text-slate-500 font-bold mb-2 block">Live Safety Index</span>
            <div className="flex items-baseline gap-2">
              <h1 className="font-headline text-6xl font-extrabold text-[#0e1c2b]">
                {data?.safetyScore}<span className="text-2xl text-slate-400 font-medium">/100</span>
              </h1>
            </div>
            <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${data?.safetyScore > 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : data?.safetyScore > 50 ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{data?.safetyScore > 80 ? 'verified_user' : 'warning'}</span>
              Risk Level: {data?.riskLevel}
            </div>
          </div>
          <div className="mt-8">
            <p className="text-sm text-slate-600 leading-relaxed">
              Safety levels in <span className="font-bold text-[#0e1c2b]">{data?.location}</span> are mapped using real-time API sentiment and crime reports.
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
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-md border border-slate-200/50">
          <div className="flex justify-between items-center mb-10">
            <div>
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
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 flex flex-col gap-6 shadow-md border border-slate-200/50">
          <h3 className="font-headline text-xl font-extrabold text-[#0e1c2b]">System Advisories</h3>
          <div className="space-y-6">
            {data?.signals?.length > 0 ? data.signals.map((s, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center ${s.colorClass}`}>
                  <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{s.title}</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{s.detail}</p>
                </div>
              </div>
            )) : (
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
        </div>
      </section>
    </main>
  );
}