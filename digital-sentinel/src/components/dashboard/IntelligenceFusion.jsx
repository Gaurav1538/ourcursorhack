import React, { useEffect, useState } from 'react';
import { getCrimeNews, getWeatherByCity, askAiQuestion } from '../../services/api';

export default function IntelligenceFusion({ city, safetyScore, riskLevel }) {
  const [news, setNews] = useState([]);
  const [weather, setWeather] = useState([]);
  const [aiBrief, setAiBrief] = useState('');
  const [loading, setLoading] = useState({ news: true, weather: true, ai: true });

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading({ news: true, weather: true, ai: true });
      const [n, w] = await Promise.all([
        getCrimeNews(city),
        getWeatherByCity(city)
      ]);
      if (cancelled) return;
      setNews(Array.isArray(n) ? n.slice(0, 6) : []);
      setWeather(Array.isArray(w) ? w : []);
      setLoading((s) => ({ ...s, news: false, weather: false }));

      const q = `In under 80 words, give a traveler a practical safety and situational-awareness summary for ${city}. Current sentinel score context: ${safetyScore}/100, risk: ${riskLevel}. No markdown.`;
      const brief = await askAiQuestion(q);
      if (!cancelled) {
        setAiBrief(brief);
        setLoading((s) => ({ ...s, ai: false }));
      }
    };
    run();
    return () => { cancelled = true; };
  }, [city, safetyScore, riskLevel]);

  return (
    <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-12">
      <div className="xl:col-span-4 rounded-2xl overflow-hidden bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-900 text-white shadow-xl border border-white/10">
        <div className="p-6 pb-4 flex items-center justify-between">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-sky-200/90">Live forecast</p>
            <h3 className="font-headline text-xl font-extrabold mt-1">{city}</h3>
          </div>
          <span className="material-symbols-outlined text-4xl text-sky-200/80">thunderstorm</span>
        </div>
        <div className="px-6 pb-6 space-y-3 max-h-[320px] overflow-y-auto custom-scrollbar">
          {loading.weather ? (
            <div className="flex items-center gap-2 text-sky-100 text-sm py-8 justify-center">
              <span className="material-symbols-outlined animate-spin">sync</span>
              Pulling /api/weather…
            </div>
          ) : weather.length === 0 ? (
            <p className="text-sm text-sky-100/80">No weather rows for this city.</p>
          ) : (
            weather.map((row, i) => (
              <div
                key={`${row.day}-${i}`}
                className="rounded-xl bg-white/10 backdrop-blur-md border border-white/15 p-4 flex justify-between gap-3 items-start"
              >
                <div>
                  <p className="text-xs font-bold text-sky-200 uppercase tracking-wider">{row.day || `Day ${i + 1}`}</p>
                  <p className="text-lg font-headline font-extrabold mt-1">{row.temperature ?? '—'}</p>
                  <p className="text-sm text-white/85 mt-0.5">{row.weather ?? '—'}</p>
                </div>
                <div className="text-right text-[0.7rem] text-sky-100/90 space-y-0.5 shrink-0">
                  {row.wind && <p>Wind {row.wind}</p>}
                  {row.humidity && <p>Humidity {row.humidity}</p>}
                  {row.uvIndex && <p>UV {row.uvIndex}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="xl:col-span-5 rounded-2xl bg-slate-900 text-slate-100 shadow-xl border border-slate-700/80 flex flex-col min-h-[360px]">
        <div className="p-6 border-b border-slate-700/80 flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-violet-300">psychology</span>
          </div>
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-500">Gemini · /api/ai/ask</p>
            <h3 className="font-headline text-lg font-extrabold text-white mt-0.5">Strategic AI brief</h3>
          </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          {loading.ai ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-500">
              <span className="material-symbols-outlined animate-spin text-3xl">auto_awesome</span>
              <p className="text-sm">Synthesizing multi-source intelligence…</p>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">{aiBrief}</p>
          )}
        </div>
      </div>

      <div className="xl:col-span-3 rounded-2xl bg-white shadow-md border border-slate-200/80 flex flex-col min-h-[360px]">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-400">Media fusion</p>
            <h3 className="font-headline text-base font-extrabold text-[#0e1c2b]">Crime & safety news</h3>
          </div>
          <span className="material-symbols-outlined text-rose-500">newspaper</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
          {loading.news ? (
            <p className="text-sm text-slate-500 flex items-center gap-2 p-4">
              <span className="material-symbols-outlined animate-spin text-lg">sync</span>
              /api/news/crime…
            </p>
          ) : (
            news.map((item, idx) => (
              <a
                key={idx}
                href={item.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all overflow-hidden group bg-slate-50/50"
              >
                {item.image ? (
                  <div className="h-24 overflow-hidden">
                    <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="h-2 bg-gradient-to-r from-rose-400 to-amber-400" />
                )}
                <div className="p-3">
                  <p className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">{item.title}</p>
                  <p className="text-[0.65rem] text-slate-500 mt-2 flex justify-between gap-2">
                    <span>{item.source || 'Source'}</span>
                    <span className="truncate">{item.publishedAt}</span>
                  </p>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
