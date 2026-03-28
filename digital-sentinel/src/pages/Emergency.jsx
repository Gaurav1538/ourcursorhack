import React from 'react';

// UI Sub-component for Emergency Page
const ContactCard = ({ name, role, imgSrc, btn1, btn2, icon1, icon2 }) => (
  <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-6">
    <div className="flex items-center gap-4">
      <img className="w-14 h-14 rounded-full object-cover" alt={name} src={imgSrc} />
      <div>
        <p className="font-headline font-bold text-primary">{name}</p>
        <p className="text-xs text-on-surface-variant uppercase tracking-wide font-bold">{role}</p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <button className="flex items-center justify-center gap-2 py-3 bg-surface-container rounded-md font-bold text-sm text-primary hover:bg-surface-container-high transition-colors">
        <span className="material-symbols-outlined text-lg">{icon1}</span> {btn1}
      </button>
      <button className="flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-md font-bold text-sm hover:opacity-90 transition-opacity">
        <span className="material-symbols-outlined text-lg">{icon2}</span> {btn2}
      </button>
    </div>
  </div>
);

const Emergency = () => {
  const handleAlert = (type) => {
    // In real app, this would be an API call
    console.log(`Triggering ${type} alert...`);
    alert(`MOCK: ${type.toUpperCase()} Alert successfully transmitted to responders. Your location is being tracked.`);
  };

  return (
    <main className="pt-24 pb-12 px-6 max-w-screen-xl mx-auto flex-grow font-body text-on-surface w-full">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-error text-4xl leading-none emergency-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-primary uppercase">Emergency Mode</h1>
          </div>
          <p className="text-on-surface-variant max-w-lg font-body">Immediate assistance is ready. Please select an action below. Your current location is being shared with emergency services.</p>
        </div>
        <div className="bg-surface-container-high px-4 py-2 rounded-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
          <span className="text-label-sm font-label uppercase tracking-wider text-xs font-bold">GPS Signal: Strong</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* SOS Action */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center bg-surface-container-lowest p-12 rounded-xl shadow-[0px_8px_32px_rgba(25,28,29,0.06)] text-center">
          <div className="mb-8 p-1 rounded-full bg-error-container">
            <div 
                onClick={() => handleAlert('global_sos')}
                className="w-48 h-48 rounded-full bg-gradient-to-br from-error to-on-error-container flex flex-col items-center justify-center text-white emergency-pulse cursor-pointer active:scale-95 transition-transform duration-150"
            >
              <span className="material-symbols-outlined text-6xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>sos</span>
              <span className="font-headline font-extrabold text-2xl">Call SOS</span>
            </div>
          </div>
          <h2 className="text-xl font-headline font-bold mb-2">Activate Global Emergency Response</h2>
          <p className="text-on-surface-variant text-sm mb-6 max-w-md">This will immediately dial local emergency services (112/911) and notify all your emergency contacts with your live location.</p>
          <button 
             onClick={() => handleAlert('contacts_only')}
             className="w-full py-4 rounded-md bg-secondary text-white font-headline font-bold text-lg hover:opacity-90 transition-opacity"
          >
            Alert Emergency Contacts Only
          </button>
        </div>

        {/* Support Services */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-label uppercase tracking-widest font-bold text-on-surface-variant">Nearest Support</h3>
            <div className="bg-surface-container p-6 rounded-xl flex items-center justify-between group hover:bg-surface-container-high transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                  <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
                </div>
                <div>
                  <p className="font-headline font-bold text-primary">City General Hospital</p>
                  <p className="text-sm text-on-surface-variant">0.8 miles away • Open 24h</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-md flex items-center gap-2 hover:scale-95 transition-transform">
                  Navigate <span className="material-symbols-outlined text-sm">near_me</span>
              </button>
            </div>
            
            <div className="bg-surface-container p-6 rounded-xl flex items-center justify-between group hover:bg-surface-container-high transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>local_police</span>
                </div>
                <div>
                  <p className="font-headline font-bold text-primary">Metropolitan Precinct</p>
                  <p className="text-sm text-on-surface-variant">1.4 miles away • Active Patrol</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-md flex items-center gap-2 hover:scale-95 transition-transform">
                  Navigate <span className="material-symbols-outlined text-sm">near_me</span>
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl h-48 group">
            <img className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-105 transition-transform duration-500" alt="map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhM8gwJAHOA72HMCvGG_PBV7LkOBW6KqqbZb71MyStHl4jmP34D3SU8AZNx8ReugtfK4mWwGtSetzB7IhgM1CMoqaQazQkOCv7RR7uleHDycSQc_bs1gABfH41leZT5KmdwyYSnHJ-jg14YpEOCf3LWOGm-IsKewtg9ezPSdP0zGqZgM6PvNTr85PAZWdRgPPh_XHJCaQ6kyMmzczM-HoFd8i_mIP52b-d9G_qZBRpixMftckV07zH2BXj27PUPWifihoDjaG7tnU"/>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white font-headline font-bold text-xl mb-1">Safe Haven Guide</h3>
              <p className="text-primary-fixed text-sm mb-4">View verified secure locations nearby</p>
              <button className="bg-tertiary-fixed text-[#002108] px-6 py-2 rounded-md font-bold text-sm w-fit active:scale-95 transition-transform">
                  Find Nearest Safe Haven
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contacts */}
      <div className="bg-surface-container-low p-8 rounded-xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xs font-label uppercase tracking-widest font-bold text-on-surface-variant">Personal Emergency Contacts</h3>
          <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
            <span className="material-symbols-outlined text-sm">edit</span> Manage Contacts
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContactCard 
            name="David Chen" 
            role="Partner • Primary" 
            imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDFvT_HSyDis1KCqA548r0fl9JugICYUsyhO_jKG1KJaC8Uu-EI9LLvwwpXnwBkEPgT2ONHtsWffS7bwmgvXM3rqFG53RBhsUTROdo1Ho1JK1x6ozobci1y0NWBOa_E-WwiqrvOZSIRZ1DvGChp47no-hPnb46dQ0aI5kIsRDNnQUywOgEzFFyJL4GfbVSHBd8lWOn-Lje3v2kEuDnAVAeSVaAI3oi0EndVa69porpPCOiGJoefJYGbruuwXepjpkDdXTahcfOuPkM"
            btn1="Call" btn2="Update" icon1="call" icon2="share_location"
          />
          <ContactCard 
            name="Sarah Miller" 
            role="Family • Secondary" 
            imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuC0sLwZLGpSy8RbiCQEKNA1qcxVI8nkWUdjlw5QE5PDRojB66jAw3mjlBVzevOTW1pXednYaYbrL_U9Laih2SINz_i9o3yCNz4WZsvSxjuCEoW0WfA2FQco1jgc_5aHfdJxpWSkEp6AUO8GBWUzB54dioF9fhBS5BFsyH2mGOPfkZL4D6qQOnnG6s6LMS9b3RhKfgJxNiFkspXxGOwnVa2xRQoiY3goLjYnsXW6LnofqmF6BqSct86WlithjI968kZHMEWleXn9Bj4"
            btn1="Call" btn2="Update" icon1="call" icon2="share_location"
          />
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[#48617e] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
              </div>
              <div>
                <p className="font-headline font-bold text-primary">Guard Sentinel</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-wide font-bold">Private Security • 24/7</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 bg-surface-container rounded-md font-bold text-sm text-primary hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-lg">chat</span> Chat
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-md font-bold text-sm hover:opacity-90 transition-opacity">
                <span className="material-symbols-outlined text-lg">support_agent</span> Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Emergency;