import React, { useState } from 'react';

const Landing = ({ setCurrentPage }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [profile, setProfile] = useState('solo');
  const [destination, setDestination] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    // Simulate API Call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to dashboard
    setCurrentPage('dashboard');
  };

  return (
    <main className="flex-grow pt-24 pb-12 font-body text-on-surface bg-surface">
      <section className="relative px-6 max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[80vh]">
        
        {/* Content Column */}
        <div className="lg:col-span-7 z-10 space-y-10">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1.5 bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase rounded-full font-label shadow-sm">
              Step 1: Intelligence Input
            </span>
            <h1 className="font-headline text-5xl md:text-[4rem] font-extrabold text-primary tracking-tight leading-[1.1]">
              Travel With Confidence, <br/>
              <span className="text-secondary">Stay Sentinel Safe.</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed">
              Begin your journey by entering your parameters. Our AI engine transforms your profile into real-time safety insights.
            </p>
          </div>

          {/* Main Search Brief (The Command Center) */}
          <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-2xl shadow-[0_8px_32px_rgba(25,28,29,0.08)] space-y-8 border border-white/60 relative overflow-hidden">
            {/* Subtle Gradient Overlay for glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>

            {/* Destination Search */}
            <div className="relative z-10">
              <label className="block font-label text-[0.6875rem] font-bold tracking-widest text-on-surface-variant uppercase mb-3">Target Destination</label>
              <div className="relative flex items-center group">
                <span className="material-symbols-outlined absolute left-4 text-primary transition-transform group-focus-within:scale-110">location_on</span>
                <input 
                    className="w-full pl-12 pr-4 py-5 bg-surface-container-low border-b-2 border-primary focus:border-blue-600 focus:bg-surface-container-highest focus:ring-0 text-lg font-medium transition-all outline-none rounded-t-xl" 
                    placeholder="Enter City, Locality or Neighborhood..." 
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
              {/* Traveler Profile */}
              <div className="space-y-4">
                <label className="block font-label text-[0.6875rem] font-bold tracking-widest text-on-surface-variant uppercase">Traveler Profile</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'solo', icon: 'person', label: 'Solo' },
                    { id: 'female', icon: 'female', label: 'Female' },
                    { id: 'family', icon: 'family_restroom', label: 'Family' },
                    { id: 'student', icon: 'school', label: 'Student' }
                  ].map((p) => (
                    <button 
                        key={p.id}
                        onClick={() => setProfile(p.id)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 border-2 ${
                          profile === p.id 
                            ? 'bg-primary-container text-white border-primary shadow-md transform scale-[1.02]' 
                            : 'bg-surface-container text-on-surface-variant border-transparent hover:bg-surface-container-high hover:text-primary group'
                        }`}
                    >
                      <span className={`material-symbols-outlined text-2xl mb-2 transition-colors ${profile === p.id ? 'text-white' : 'text-secondary group-hover:text-primary'}`}>{p.icon}</span>
                      <span className="font-label text-[0.6875rem] font-bold tracking-wide">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-4">
                <label className="block font-label text-[0.6875rem] font-bold tracking-widest text-on-surface-variant uppercase">Schedule Departure</label>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-primary-container text-white shadow-md transition-all hover:opacity-95">
                    <span className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-tertiary-fixed-dim">bolt</span>
                      <span className="text-sm font-bold tracking-wide">Right Now</span>
                    </span>
                    <span className="material-symbols-outlined text-tertiary-fixed-dim text-sm">check_circle</span>
                  </button>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">calendar_today</span>
                    <input className="w-full pl-12 pr-4 py-4 bg-surface-container rounded-xl border-2 border-transparent focus:border-outline-variant/30 text-sm font-medium outline-none transition-all text-on-surface" type="datetime-local" />
                  </div>
                </div>
              </div>
            </div>

            <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`relative z-10 w-full py-5 rounded-xl text-white font-headline font-bold text-xl tracking-wide transition-all duration-300 flex items-center justify-center gap-3 group overflow-hidden ${
                  isAnalyzing 
                    ? 'bg-emerald-600 shadow-lg pointer-events-none scale-[0.99]' 
                    : 'bg-gradient-to-br from-primary to-primary-container shadow-[0_8px_24px_rgba(14,28,43,0.3)] hover:shadow-[0_12px_32px_rgba(14,28,43,0.4)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]'
                }`}
            >
              {isAnalyzing ? (
                <><span className="material-symbols-outlined animate-spin">sync</span> Initializing Sentinel AI...</>
              ) : (
                <>Analyze Safety & View Dashboard <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">dashboard_customize</span></>
              )}
            </button>
          </div>
        </div>

        {/* Visual Column (Asymmetric Grid) */}
        <div className="lg:col-span-5 hidden lg:grid grid-cols-2 gap-5 h-full py-12">
          <div className="space-y-5 pt-16">
            <div className="h-72 rounded-2xl overflow-hidden shadow-2xl transform hover:-translate-y-2 transition-transform duration-500 border border-white/20">
              <img alt="Modern high-tech city street at night" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGz_xcMKnVcjcf5OVcNxoub3YXmEODuLdFCunBCDF1GAMmZEz_fS99sFnu39VxHmjr36bw2uracpudlVVcUJu0l4GAEIEvsSYG-FjZkVd9uaOb0yQ3WLVoj5W2vkS3r3KRewJ-vmNEfaQR7y2T1im1CVt8LXNint4EOAfj6rKSmIfheeMR2-ixdbhNdqxUaWbWPd7-GHDrGF8WKS0_OXU4dVNPb1RhkSOSGsY1uanHEiA43lVkQEFQL93nnkfMzTbk_XaPxkXFl1w"/>
            </div>
            <div className="h-56 rounded-2xl overflow-hidden shadow-2xl relative border border-white/20">
              <div className="absolute inset-0 bg-primary/50 backdrop-blur-[2px] flex items-center justify-center p-6 text-center z-10">
                <p className="text-white font-headline font-extrabold text-xl leading-snug tracking-tight">98% Data Accuracy <br/>in Major Hubs</p>
              </div>
              <img alt="Data visualization" className="w-full h-full object-cover scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB02UOIcwfp5gV8owvPHc_09tlX_XZ8-GSBDzKi0XJSofcpuOfIDj5YRGUXpCfF7wgpOVa3W8UNR7mfP4b-Yr1zjSm_9jlmVqEZgTXh9IyGndYv8hCRWlHoR4c-w8iU9_3g3XU5yOL6fWmsflIRwGU_5MxaTpAhTQdMTxZoa9_MiwrmHzEoxGyATCl7SNlQNFtQJzwwpv9FfwBON2Jvaiz9jS8zylFzf_UMn6okly0QAQlDkTNBL7CghsRx15Shn3-fCTMp59J7qAQ"/>
            </div>
          </div>
          <div className="space-y-5">
            <div className="h-56 rounded-2xl overflow-hidden shadow-2xl group relative border border-white/20">
              <div className="absolute top-4 left-4 z-20 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-lg">Live Feed</div>
              <img alt="Traveler" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBci9AuLbVIaIfis65sZ3gUB0u1CDXh_viYlmHeJp4X3DnZqCJrg_ydsW_ITNbjlyQfnf2jYuUQUHwzAgXCb9dYMrC0tGHSZqG6eauo8rn0sujZ8HrX6oinA7UGx2Xujf05NXIfRo743Hq2F2RmZ46KpZIcwMqyEK9jUjuC_ObqkWuYGwoJaWpUiOKM9tMeEjDpmTV1NwEM9tjEncP1FsHeBpuMj7uj_Vxr7l1B-joJGhu4QUHCxW_D9fY7GLWH1th7_e0y7y651mo"/>
            </div>
            <div className="h-[22rem] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.03] transition-transform duration-500 border border-white/20 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
              <img alt="Security map" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ44TQ7rz6e_D8jRZLPNAE_zYEPTS_s_mSFtGf1xibuAAyaU_v77k_ww9pbzBsy2mgsnBFGyhl7T8FAOIj6BCpR6cZk6UlehG1gzRFiLT7jwnu7MhjPEXKR_u6udDk4JmVgBgLrjGNH8kW_nnfOw35sIHfMWDkwzvjCXAklFoNQPxqqcXehtWiMEvR3zaw8co5bDAj4EOp9FKzcnA-piUjnVeE1lwqZ_Go9BPNVJ1muNebiPLt-TzDFwdUI0t0wsiH9thg3PSCCHY"/>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Briefs (Editorial Layout) */}
      <section className="mt-32 px-6 max-w-screen-2xl mx-auto border-t border-slate-200/60 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <div className="space-y-4 border-l-4 border-[#3ce36a] pl-6 transition-all hover:pl-8 duration-300">
            <span className="text-[0.6875rem] font-bold text-[#00531e] uppercase tracking-widest block">01 Input</span>
            <h3 className="font-headline font-extrabold text-2xl text-primary">Sentinel AI Monitoring</h3>
            <p className="text-on-surface-variant leading-relaxed text-base">Continuous analysis of local law enforcement data and news cycles to predict risk before it happens.</p>
          </div>
          <div className="space-y-4 border-l-4 border-secondary/50 pl-6 opacity-80 hover:opacity-100 transition-all hover:pl-8 duration-300 hover:border-secondary">
            <span className="text-[0.6875rem] font-bold text-secondary uppercase tracking-widest block">02 Insight</span>
            <h3 className="font-headline font-extrabold text-2xl text-primary">Personalized Vectors</h3>
            <p className="text-on-surface-variant leading-relaxed text-base">Safety isn't one-size-fits-all. We adjust risk scores based on your profile, time of day, and transit mode.</p>
          </div>
          <div className="space-y-4 border-l-4 border-primary/40 pl-6 opacity-80 hover:opacity-100 transition-all hover:pl-8 duration-300 hover:border-primary">
            <span className="text-[0.6875rem] font-bold text-primary uppercase tracking-widest block">03 Action</span>
            <h3 className="font-headline font-extrabold text-2xl text-primary">Emergency Link</h3>
            <p className="text-on-surface-variant leading-relaxed text-base">One-tap connection to local emergency services and your private security contacts with live GPS streaming.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Landing;