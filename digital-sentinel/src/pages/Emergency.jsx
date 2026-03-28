import React from 'react';

const ContactCard = ({ name, role, imgSrc, btn1, btn2, icon1, icon2 }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/60 flex flex-col gap-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center gap-4">
      <img className="w-16 h-16 rounded-full object-cover shadow-sm" alt={name} src={imgSrc} />
      <div>
        <p className="font-headline text-lg font-bold text-[#0e1c2b]">{name}</p>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">{role}</p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3 mt-auto">
      <button className="flex items-center justify-center gap-2 py-3 bg-slate-100 rounded-xl font-bold text-sm text-[#0e1c2b] hover:bg-slate-200 transition-colors border border-slate-200/50">
        <span className="material-symbols-outlined text-[18px]">{icon1}</span> {btn1}
      </button>
      <button className="flex items-center justify-center gap-2 py-3 bg-[#0e1c2b] text-white rounded-xl font-bold text-sm hover:bg-[#1a2d42] transition-colors shadow-md">
        <span className="material-symbols-outlined text-[18px] text-blue-400">{icon2}</span> {btn2}
      </button>
    </div>
  </div>
);

export default function Emergency({ setCurrentPage }) {
  const handleAlert = (type) => {
    console.log(`Triggering ${type} alert...`);
    alert(`MOCK: ${type.toUpperCase()} Alert successfully transmitted to responders. Your location is being tracked.`);
  };

  return (
    <main className="pt-24 pb-12 px-6 max-w-screen-xl mx-auto flex-grow font-body text-slate-900 w-full min-h-screen">
      <div className="mb-8">
        <button 
            onClick={() => setCurrentPage('dashboard')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-rose-600 transition-colors bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200 hover:shadow-md group"
        >
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Exit Emergency Mode
        </button>
      </div>

      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-rose-600 text-4xl leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-[#0e1c2b] uppercase">Emergency Mode</h1>
          </div>
          <p className="text-slate-600 max-w-xl font-body text-lg leading-relaxed">Immediate assistance is ready. Please select an action below. Your current location is being continuously shared with emergency services.</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl flex items-center gap-2.5 shadow-sm h-fit">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute opacity-75"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative"></span>
          <span className="font-label uppercase tracking-widest text-[10px] font-extrabold text-emerald-800">GPS Signal: Strong</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        <div className="lg:col-span-7 flex flex-col justify-center items-center bg-white p-12 rounded-3xl shadow-xl text-center border border-slate-200/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-50/50 to-white pointer-events-none"></div>
          
          <div className="mb-10 p-3 rounded-full bg-rose-50 border border-rose-100 relative z-10">
            <div 
                onClick={() => handleAlert('global_sos')}
                className="w-56 h-56 rounded-full bg-gradient-to-br from-rose-600 to-rose-800 flex flex-col items-center justify-center text-white cursor-pointer active:scale-95 transition-transform duration-150 shadow-[0_0_40px_rgba(225,29,72,0.4)] hover:shadow-[0_0_60px_rgba(225,29,72,0.6)]"
            >
              <span className="material-symbols-outlined text-[80px] mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>sos</span>
              <span className="font-headline font-black text-3xl tracking-widest uppercase">Call SOS</span>
            </div>
          </div>
          <h2 className="text-2xl font-headline font-extrabold mb-3 text-[#0e1c2b] relative z-10">Activate Global Emergency Response</h2>
          <p className="text-slate-600 text-base mb-8 max-w-md relative z-10">This will immediately dial local emergency services (112/911) and notify all your emergency contacts with your live location.</p>
          <button 
             onClick={() => handleAlert('contacts_only')}
             className="w-full py-5 rounded-xl bg-slate-100 text-slate-700 font-headline font-extrabold text-lg hover:bg-slate-200 transition-colors border border-slate-300 relative z-10 active:scale-[0.98]"
          >
            Alert Emergency Contacts Only
          </button>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xs font-label uppercase tracking-widest font-extrabold text-slate-500 pl-2">Nearest Support</h3>
            <div className="bg-white p-5 rounded-2xl flex items-center justify-between group hover:shadow-md transition-shadow border border-slate-200">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100">
                  <span className="material-symbols-outlined text-rose-600 text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
                </div>
                <div>
                  <p className="font-headline font-bold text-[#0e1c2b] text-lg">City General Hospital</p>
                  <p className="text-xs text-slate-500 font-semibold mt-1">0.8 miles away • Open 24h</p>
                </div>
              </div>
              <button className="w-12 h-12 bg-[#0e1c2b] text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md active:scale-95">
                  <span className="material-symbols-outlined text-[20px]">near_me</span>
              </button>
            </div>
            
            <div className="bg-white p-5 rounded-2xl flex items-center justify-between group hover:shadow-md transition-shadow border border-slate-200">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                  <span className="material-symbols-outlined text-blue-600 text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_police</span>
                </div>
                <div>
                  <p className="font-headline font-bold text-[#0e1c2b] text-lg">Metropolitan Precinct</p>
                  <p className="text-xs text-slate-500 font-semibold mt-1">1.4 miles away • Active Patrol</p>
                </div>
              </div>
              <button className="w-12 h-12 bg-[#0e1c2b] text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md active:scale-95">
                  <span className="material-symbols-outlined text-[20px]">near_me</span>
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl h-56 group border border-slate-200 shadow-sm">
            <img className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-105 transition-transform duration-700" alt="map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhM8gwJAHOA72HMCvGG_PBV7LkOBW6KqqbZb71MyStHl4jmP34D3SU8AZNx8ReugtfK4mWwGtSetzB7IhgM1CMoqaQazQkOCv7RR7uleHDycSQc_bs1gABfH41leZT5KmdwyYSnHJ-jg14YpEOCf3LWOGm-IsKewtg9ezPSdP0zGqZgM6PvNTr85PAZWdRgPPh_XHJCaQ6kyMmzczM-HoFd8i_mIP52b-d9G_qZBRpixMftckV07zH2BXj27PUPWifihoDjaG7tnU"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1c2b] via-[#0e1c2b]/60 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white font-headline font-extrabold text-2xl mb-1">Safe Haven Guide</h3>
              <p className="text-slate-300 text-sm mb-5 font-medium">View verified secure locations nearby</p>
              <button className="bg-[#3ce36a] text-[#002108] px-6 py-3 rounded-xl font-bold text-sm w-fit active:scale-95 transition-transform shadow-[0_0_15px_rgba(60,227,106,0.4)] hover:bg-[#2bbb54]">
                  Find Nearest Safe Haven
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-100 p-8 rounded-3xl border border-slate-200">
        <div className="flex items-center justify-between mb-8 px-2">
          <h3 className="text-xs font-label uppercase tracking-widest font-extrabold text-slate-500">Personal Emergency Contacts</h3>
          <button className="text-blue-600 font-bold text-sm flex items-center gap-1.5 hover:underline bg-blue-50 px-3 py-1.5 rounded-md">
            <span className="material-symbols-outlined text-[16px]">edit</span> Manage Contacts
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContactCard 
            name="David Chen" 
            role="Partner • Primary" 
            imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDFvT_HSyDis1KCqA548r0fl9JugICYUsyhO_jKG1KJaC8Uu-EI9LLvwwpXnwBkEPgT2ONHtsWffS7bwmgvXM3rqFG53RBhsUTROdo1Ho1JK1x6ozobci1y0NWBOa_E-WwiqrvOZSIRZ1DvGChp47no-hPnb46dQ0aI5kIsRDNnQUywOgEzFFyJL4GfbVSHBd8lWOn-Lje3v2kEuDnAVAeSVaAI3oi0EndVa69porpPCOiGJoefJYGbruuwXepjpkDdXTahcfOuPkM"
            btn1="Call" btn2="Share Live Location" icon1="call" icon2="share_location"
          />
          <ContactCard 
            name="Sarah Miller" 
            role="Family • Secondary" 
            imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuC0sLwZLGpSy8RbiCQEKNA1qcxVI8nkWUdjlw5QE5PDRojB66jAw3mjlBVzevOTW1pXednYaYbrL_U9Laih2SINz_i9o3yCNz4WZsvSxjuCEoW0WfA2FQco1jgc_5aHfdJxpWSkEp6AUO8GBWUzB54dioF9fhBS5BFsyH2mGOPfkZL4D6qQOnnG6s6LMS9b3RhKfgJxNiFkspXxGOwnVa2xRQoiY3goLjYnsXW6LnofqmF6BqSct86WlithjI968kZHMEWleXn9Bj4"
            btn1="Call" btn2="Share Live Location" icon1="call" icon2="share_location"
          />
          <div className="bg-gradient-to-br from-[#0e1c2b] to-[#233141] p-6 rounded-2xl shadow-xl border border-slate-700 flex flex-col gap-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center border border-slate-600 shadow-inner">
                <span className="material-symbols-outlined text-[#3ce36a] text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
              </div>
              <div>
                <p className="font-headline text-lg font-bold text-white">Guard Sentinel</p>
                <p className="text-[10px] text-[#3ce36a] uppercase tracking-widest font-bold mt-1">Private Security • 24/7</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <button className="flex items-center justify-center gap-2 py-3 bg-white/10 rounded-xl font-bold text-sm text-white hover:bg-white/20 transition-colors border border-white/10">
                <span className="material-symbols-outlined text-[18px]">chat</span> Chat
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-[#3ce36a] text-[#002108] rounded-xl font-bold text-sm hover:bg-[#2bbb54] transition-colors shadow-[0_0_15px_rgba(60,227,106,0.3)]">
                <span className="material-symbols-outlined text-[18px]">support_agent</span> Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}