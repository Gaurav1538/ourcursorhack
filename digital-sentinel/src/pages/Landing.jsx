import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { geocodeAddress } from '../services/api';

export default function Landing() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [profile, setProfile] = useState('solo');
  const [destination, setDestination] = useState('');
  
  const [isRightNow, setIsRightNow] = useState(true);
  const [customTime, setCustomTime] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!destination) return;

    setIsAnalyzing(true);
    const coords = await geocodeAddress(destination);
    setTimeout(() => {
      navigate('/dashboard', { state: { destination, profile, time: isRightNow ? new Date().getHours() : customTime, coords } });
    }, 800);
  };

  const profiles = [
    { id: 'solo', icon: 'person', label: 'Solo Traveler' },
    { id: 'female', icon: 'female', label: 'Female' },
    { id: 'family', icon: 'family_restroom', label: 'Family' },
    { id: 'student', icon: 'school', label: 'Student' }
  ];

  const trendingDestinations = ['London, UK', 'Tokyo, JP', 'Paris, FR', 'New York, US'];

  return (
    <main className="flex-grow pt-28 pb-0 font-body text-slate-900 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[60%] h-[90vh] bg-gradient-to-bl from-blue-50/80 via-indigo-50/20 to-transparent rounded-bl-full pointer-events-none -z-10"></div>

      <section className="relative z-10 px-6 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center min-h-[75vh] pb-16">
        <div className="lg:col-span-6 space-y-10">
          <div className="space-y-6">
            <h1 className="font-headline text-[3.5rem] md:text-[4.5rem] font-extrabold text-[#0f172a] tracking-tight leading-[1.05]">
              Discover Safe <br/>
              Routes Worldwide.
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
              Explore real-time threat data and personalized safety intelligence to ensure your next journey is secure.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              {profiles.map((p) => (
                <button 
                  key={p.id}
                  onClick={() => setProfile(p.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                    profile === p.id 
                      ? 'bg-slate-900 text-white shadow-md transform scale-105' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{p.icon}</span>
                  {p.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="flex items-center bg-white border-2 border-slate-100 rounded-full p-2 shadow-[0_8px_30px_rgba(0,0,0,0.04)] focus-within:shadow-[0_8px_40px_rgba(59,130,246,0.1)] focus-within:border-blue-200 transition-all duration-300 relative z-20">
                <div className="pl-5 pr-3 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600 text-[28px]">location_on</span>
                </div>
                <input 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-medium py-4 outline-none" 
                    placeholder="Where are you heading?" 
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze(e)}
                />
                <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !destination}
                    className={`px-8 py-4 rounded-full text-white font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                      isAnalyzing 
                        ? 'bg-emerald-500 pointer-events-none' 
                        : destination 
                          ? 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg hover:shadow-blue-600/20 active:scale-95' 
                          : 'bg-slate-800 text-white opacity-50 pointer-events-none'
                    }`}
                >
                  {isAnalyzing ? (
                    <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                  ) : (
                    <>Analyze Route <span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 pl-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trending:</span>
                {trendingDestinations.map(city => (
                  <button 
                    key={city} 
                    onClick={() => setDestination(city)} 
                    className="text-xs font-bold text-slate-500 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 px-3 py-1.5 rounded-full transition-all"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest w-24">Departure:</span>
                <button 
                  onClick={() => setIsRightNow(true)} 
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors border flex items-center gap-1.5 ${isRightNow ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  Right Now
                </button>
                <button 
                  onClick={() => setIsRightNow(false)} 
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors border flex items-center gap-1.5 ${!isRightNow ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  Custom Time
                </button>
                
                {!isRightNow && (
                  <input 
                    type="datetime-local" 
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="text-xs font-bold text-slate-700 bg-white border border-blue-200 rounded-full px-4 py-1.5 outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm animate-[fadeIn_0.2s_ease-out]"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 hidden lg:flex justify-end relative">
          <div className="w-[90%] h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl relative border-[6px] border-white">
            <img 
              alt="Cityscape" 
              className="w-full h-full object-cover opacity-90" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGz_xcMKnVcjcf5OVcNxoub3YXmEODuLdFCunBCDF1GAMmZEz_fS99sFnu39VxHmjr36bw2uracpudlVVcUJu0l4GAEIEvsSYG-FjZkVd9uaOb0yQ3WLVoj5W2vkS3r3KRewJ-vmNEfaQR7y2T1im1CVt8LXNint4EOAfj6rKSmIfheeMR2-ixdbhNdqxUaWbWPd7-GHDrGF8WKS0_OXU4dVNPb1RhkSOSGsY1uanHEiA43lVkQEFQL93nnkfMzTbk_XaPxkXFl1w"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 shadow-2xl flex flex-col items-center animate-[fadeIn_1s_ease-out]">
              <div className="w-12 h-12 bg-emerald-400/20 rounded-full flex items-center justify-center mb-4 relative">
                <span className="w-3 h-3 bg-emerald-400 rounded-full animate-ping absolute"></span>
                <span className="w-3 h-3 bg-emerald-400 rounded-full relative"></span>
              </div>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Safety Score</p>
              <h2 className="text-white text-6xl font-headline font-black mb-6">88<span className="text-2xl text-white/50 font-medium">°</span></h2>
              
              <div className="w-full space-y-3">
                <div className="bg-white/10 rounded-xl p-3 flex justify-between items-center">
                  <span className="text-white/70 text-xs">Lighting</span>
                  <span className="text-white text-xs font-bold">Optimal</span>
                </div>
                <div className="bg-white/10 rounded-xl p-3 flex justify-between items-center">
                  <span className="text-white/70 text-xs">CCTV</span>
                  <span className="text-white text-xs font-bold">Active</span>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/30">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
              </div>
              <div>
                <span className="text-sm font-bold text-white block">Secure Network Active</span>
                <span className="text-[10px] text-white/70 uppercase tracking-widest">Monitoring 150+ Regions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}