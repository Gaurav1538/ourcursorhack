<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmergencyServices, getAllIncidents, reportIncident } from '../services/api';

=======
import React, { useState } from 'react';

// Refined, mature contact card matching the landing page aesthetics
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
const ContactCard = ({ name, role, imgSrc, btn1, btn2, icon1, icon2, isPrimary }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-6 hover:shadow-xl transition-all duration-300 group">
    <div className="flex items-center gap-4">
      <img className="w-14 h-14 rounded-full object-cover shadow-sm border-2 border-white group-hover:scale-105 transition-transform" alt={name} src={imgSrc} />
      <div>
        <p className="font-headline text-lg font-bold text-slate-900">{name}</p>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">{role}</p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3 mt-auto">
      <button className="flex items-center justify-center gap-2 py-3 bg-slate-50 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors border border-slate-100">
        <span className="material-symbols-outlined text-[16px]">{icon1}</span> {btn1}
      </button>
      <button className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-colors shadow-sm ${isPrimary ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}>
        <span className={`material-symbols-outlined text-[16px] ${isPrimary ? 'text-rose-200' : 'text-slate-400'}`}>{icon2}</span> {btn2}
      </button>
    </div>
  </div>
);

export default function Emergency() {
<<<<<<< HEAD
  const navigate = useNavigate();
  const [locationContext, setLocationContext] = useState('current'); 
  const [customLocation, setCustomLocation] = useState('');
  const [isTriggering, setIsTriggering] = useState(false);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [incidents, setIncidents] = useState([]);
  const [incidentsLoading, setIncidentsLoading] = useState(true);
  const [reportType, setReportType] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportLocation, setReportLocation] = useState('');
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      const queryCity = locationContext === 'current' ? 'London' : (customLocation || 'London');
      const data = await getEmergencyServices(queryCity);
      setServices(data.slice(0, 2)); // Show top 2
      setLoadingServices(false);
    };
    fetchServices();
  }, [locationContext, customLocation]);

  useEffect(() => {
    const fetchIncidents = async () => {
      setIncidentsLoading(true);
      const data = await getAllIncidents();
      setIncidents(Array.isArray(data) ? data : []);
      setIncidentsLoading(false);
    };
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    setIncidentsLoading(true);
    const data = await getAllIncidents();
    setIncidents(Array.isArray(data) ? data : []);
    setIncidentsLoading(false);
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportDesc) return alert('Please add a brief description of the incident.');
    setReporting(true);
    const payload = {
      type: reportType || 'Other',
      description: reportDesc,
      location: reportLocation || (locationContext === 'current' ? 'Live GPS' : (customLocation || 'Unspecified')),
      timestamp: new Date().toISOString()
    };
    try {
      const res = await reportIncident(payload);
      setIncidents(prev => [res, ...prev]);
      setReportType(''); setReportDesc(''); setReportLocation('');
    } catch (err) {
      alert('Failed to report incident. Try again later.');
    }
    setReporting(false);
  };

  const handleAlert = async (type) => {
    setIsTriggering(true);
    const activeLocation = locationContext === 'current' ? 'your live GPS coordinates' : (customLocation || 'the selected destination');
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`GUARDIAN API: ${type.toUpperCase()} Protocol Activated.\nResponders have been dispatched to ${activeLocation}.`);
=======
  const [locationContext, setLocationContext] = useState('current'); 
  const [customLocation, setCustomLocation] = useState('');
  const [isTriggering, setIsTriggering] = useState(false);

  const handleAlert = async (type) => {
    setIsTriggering(true);
    const activeLocation = locationContext === 'current' 
      ? 'your live GPS coordinates' 
      : (customLocation || 'the selected destination');
      
    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert(`MOCK: ${type.toUpperCase()} Protocol Activated.\nResponders have been dispatched to ${activeLocation}.`);
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
    setIsTriggering(false);
  };

  return (
    <main className="pt-28 pb-12 px-6 max-w-[1400px] mx-auto flex-grow font-body text-slate-900 w-full min-h-screen relative overflow-hidden">
<<<<<<< HEAD
=======
      {/* Soft Ambient Background (Matching Landing Page) */}
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
      <div className="absolute top-0 left-0 w-[60%] h-[90vh] bg-gradient-to-br from-rose-50/80 via-red-50/20 to-transparent rounded-br-full pointer-events-none -z-10"></div>

      <div className="mb-10 flex justify-between items-center relative z-10">
        <button 
<<<<<<< HEAD
            onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/dashboard')}
=======
            onClick={() => window.history.length > 1 ? window.history.back() : (window.location.href = '/dashboard')}
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors bg-white px-5 py-2.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-md group"
        >
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Exit Protocol
        </button>

        <div className="bg-emerald-50/80 backdrop-blur-sm border border-emerald-100 px-4 py-2 rounded-full flex items-center gap-2.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse relative"></span>
<<<<<<< HEAD
          <span className="font-label uppercase tracking-widest text-[10px] font-extrabold text-emerald-700">API Connection: Active</span>
        </div>
      </div>

=======
          <span className="font-label uppercase tracking-widest text-[10px] font-extrabold text-emerald-700">GPS Stream: Active</span>
        </div>
      </div>

      {/* Emergency Header - Mature Typography */}
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
      <div className="mb-12 relative z-10 max-w-3xl">
        <h1 className="font-headline text-[3rem] md:text-[4rem] font-extrabold tracking-tight text-[#0f172a] leading-[1.05] mb-4">
          Emergency <span className="text-rose-600">Response.</span>
        </h1>
        <p className="text-lg text-slate-500 font-medium leading-relaxed">
<<<<<<< HEAD
          Immediate assistance is standing by. Confirm your incident location and authorize deployment to notify local authorities via the Guardian API.
=======
          Immediate assistance is standing by. Confirm your incident location and authorize deployment to notify local authorities.
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20 relative z-10">
<<<<<<< HEAD
        <div className="lg:col-span-7 space-y-10">
=======
        
        {/* LEFT COLUMN: Command Center */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Location Context Module (Sleek Toggles like Landing Page) */}
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
          <div className="space-y-5">
            <label className="block font-label text-[0.6875rem] font-extrabold tracking-[0.15em] text-slate-400 uppercase">
              1. Confirm Incident Location
            </label>
            
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setLocationContext('current')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 ${
<<<<<<< HEAD
                  locationContext === 'current' ? 'bg-slate-900 text-white shadow-md transform scale-105' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100 hover:border-slate-200'
=======
                  locationContext === 'current' 
                    ? 'bg-slate-900 text-white shadow-md transform scale-105' 
                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100 hover:border-slate-200'
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">my_location</span>
                My Current GPS
              </button>
              <button 
                onClick={() => setLocationContext('custom')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 ${
<<<<<<< HEAD
                  locationContext === 'custom' ? 'bg-slate-900 text-white shadow-md transform scale-105' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100 hover:border-slate-200'
=======
                  locationContext === 'custom' 
                    ? 'bg-slate-900 text-white shadow-md transform scale-105' 
                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100 hover:border-slate-200'
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">pin_drop</span>
                Specific Address
              </button>
            </div>

            <div className="pt-2 h-[72px]">
              {locationContext === 'current' ? (
                <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm border border-emerald-100/50 p-4 rounded-2xl animate-[fadeIn_0.2s_ease-out]">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined animate-spin text-emerald-500 text-[20px]">radar</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Locking Coordinates...</p>
                    <p className="text-[10px] font-bold tracking-widest text-emerald-600 uppercase mt-0.5">Accuracy: 3 Meters</p>
                  </div>
                </div>
              ) : (
                <div className="relative animate-[fadeIn_0.2s_ease-out]">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 text-[24px]">search</span>
                  </div>
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="Enter precise address or landmark..."
                    className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 rounded-2xl font-bold text-slate-900 text-lg outline-none transition-all shadow-[0_8px_30px_rgba(0,0,0,0.03)] placeholder:text-slate-300 placeholder:font-medium"
                  />
                </div>
              )}
            </div>
          </div>

<<<<<<< HEAD
=======
          {/* Action Module (Mature Control Panel) */}
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
          <div className="space-y-5 pt-4">
             <label className="block font-label text-[0.6875rem] font-extrabold tracking-[0.15em] text-slate-400 uppercase">
              2. Authorize Deployment
            </label>
            
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_40px_rgba(225,29,72,0.06)] border border-rose-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <h2 className="text-2xl font-headline font-extrabold text-slate-900 mb-2">Initiate Global SOS</h2>
              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed max-w-md">
                Directly dial local emergency services (112/911) and transmit a silent alert with your live location to your private security network.
              </p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => handleAlert('global_sos')}
                  disabled={isTriggering}
                  className={`w-full py-4 rounded-2xl text-white font-headline font-bold text-lg tracking-wide transition-all duration-300 flex items-center justify-center gap-3 shadow-xl relative overflow-hidden ${
<<<<<<< HEAD
                    isTriggering ? 'bg-rose-800 pointer-events-none scale-[0.99]' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20 active:scale-[0.98]'
=======
                    isTriggering 
                      ? 'bg-rose-800 pointer-events-none scale-[0.99]' 
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20 active:scale-[0.98]'
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
                  }`}
                >
                  {isTriggering ? (
                    <><span className="material-symbols-outlined animate-spin text-[24px]">sync</span> Connecting...</>
                  ) : (
                    <><span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span> Deploy Emergency Services</>
                  )}
                </button>
<<<<<<< HEAD
=======
                
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
                <button 
                  onClick={() => handleAlert('contacts_only')}
                  disabled={isTriggering}
                  className="w-full py-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-headline font-bold text-sm transition-colors border border-slate-200 active:scale-[0.98]"
                >
                  Alert Private Contacts Only (Silent)
                </button>
              </div>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <div className="lg:col-span-5 space-y-8">
          <div>
            <label className="block font-label text-[0.6875rem] font-extrabold tracking-[0.15em] text-slate-400 uppercase mb-5">
              Live API Area Intelligence
            </label>
            <div className="space-y-4">
              {loadingServices ? (
                 <p className="text-sm text-slate-500 flex items-center gap-2"><span className="material-symbols-outlined animate-spin">sync</span> Fetching from Guardian API...</p>
              ) : services.map((svc, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl flex items-center justify-between group hover:shadow-lg transition-all duration-300 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${svc.type === 'hospital' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                      <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>{svc.type === 'hospital' ? 'medical_services' : 'local_police'}</span>
                    </div>
                    <div>
                      <p className="font-headline font-bold text-slate-900">{svc.name}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{svc.distance} • ETA {svc.eta}</p>
                    </div>
                  </div>
                  <button className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors active:scale-95 shrink-0">
                      <span className="material-symbols-outlined text-[18px]">near_me</span>
                  </button>
                </div>
              ))}
            </div>
          
            <div className="mt-6 bg-white p-5 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-900">Recent Incidents</h4>
                <button onClick={fetchIncidents} className="text-sm text-blue-600 hover:underline">Refresh</button>
              </div>
              {incidentsLoading ? (
                <p className="text-sm text-slate-500">Loading incidents...</p>
              ) : (
                <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
                  {incidents.map((inc) => (
                    <div key={inc.id || inc.timestamp} className="flex items-start justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div>
                        <p className="text-sm font-bold">{inc.type} <span className="text-xs text-slate-400 ml-2">{inc.timestamp ? new Date(inc.timestamp).toLocaleString() : ''}</span></p>
                        <p className="text-xs text-slate-600 mt-1">{inc.description}</p>
                      </div>
                      <div className="text-xs text-slate-500">{inc.severity ? `Severity ${inc.severity}` : ''}</div>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleReport} className="mt-4 space-y-3">
                <div className="flex gap-2">
                  <select value={reportType} onChange={(e)=>setReportType(e.target.value)} className="flex-1 p-2 border rounded-lg text-sm">
                    <option value="">Select Type</option>
                    <option value="Theft">Theft</option>
                    <option value="Hazard">Hazard</option>
                    <option value="Assault">Assault</option>
                    <option value="Other">Other</option>
                  </select>
                  <input value={reportLocation} onChange={(e)=>setReportLocation(e.target.value)} placeholder="Location (optional)" className="p-2 border rounded-lg text-sm w-44" />
                </div>
                <textarea value={reportDesc} onChange={(e)=>setReportDesc(e.target.value)} placeholder="Brief description..." className="w-full p-2 border rounded-lg text-sm h-20"></textarea>
                <div className="flex gap-2">
                  <button type="submit" disabled={reporting} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                    {reporting ? 'Reporting...' : 'Report Incident'}
                  </button>
                  <button type="button" onClick={() => { setReportType(''); setReportDesc(''); setReportLocation(''); }} className="bg-slate-50 px-4 py-2 rounded-lg text-sm border">Clear</button>
                </div>
              </form>
=======
        {/* RIGHT COLUMN: Live Support Network & Map */}
        <div className="lg:col-span-5 space-y-8">
          
          <div>
            <label className="block font-label text-[0.6875rem] font-extrabold tracking-[0.15em] text-slate-400 uppercase mb-5">
              Live Area Intelligence
            </label>
            
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl flex items-center justify-between group hover:shadow-lg transition-all duration-300 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
                  </div>
                  <div>
                    <p className="font-headline font-bold text-slate-900">City General Hospital</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">0.8 miles • Open 24h</p>
                  </div>
                </div>
                <button className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors active:scale-95 shrink-0">
                    <span className="material-symbols-outlined text-[18px]">near_me</span>
                </button>
              </div>
              
              <div className="bg-white p-5 rounded-2xl flex items-center justify-between group hover:shadow-lg transition-all duration-300 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_police</span>
                  </div>
                  <div>
                    <p className="font-headline font-bold text-slate-900">Metropolitan Precinct</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">1.4 miles • Active Patrol</p>
                  </div>
                </div>
                <button className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors active:scale-95 shrink-0">
                    <span className="material-symbols-outlined text-[18px]">near_me</span>
                </button>
              </div>
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl h-64 group border-[6px] border-white shadow-xl">
            <img className="w-full h-full object-cover grayscale-[30%] opacity-90 group-hover:scale-105 transition-transform duration-700" alt="map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhM8gwJAHOA72HMCvGG_PBV7LkOBW6KqqbZb71MyStHl4jmP34D3SU8AZNx8ReugtfK4mWwGtSetzB7IhgM1CMoqaQazQkOCv7RR7uleHDycSQc_bs1gABfH41leZT5KmdwyYSnHJ-jg14YpEOCf3LWOGm-IsKewtg9ezPSdP0zGqZgM6PvNTr85PAZWdRgPPh_XHJCaQ6kyMmzczM-HoFd8i_mIP52b-d9G_qZBRpixMftckV07zH2BXj27PUPWifihoDjaG7tnU"/>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white font-headline font-extrabold text-xl mb-1">Safe Haven Guide</h3>
              <p className="text-slate-300 text-xs font-medium mb-4">View verified, secure commercial locations nearby.</p>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-xl font-bold text-xs w-fit hover:bg-white hover:text-slate-900 transition-colors">
                  Open Map View
              </button>
            </div>
          </div>
        </div>
      </div>

<<<<<<< HEAD
=======
      {/* Private Network Grid */}
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
      <div className="border-t border-slate-200 pt-16 mt-8 relative z-10">
        <div className="flex items-center justify-between mb-10">
          <h3 className="font-headline text-2xl font-extrabold text-slate-900">Your Secure Network</h3>
          <button className="text-blue-600 font-bold text-sm flex items-center gap-1.5 hover:underline bg-blue-50/50 px-4 py-2 rounded-full transition-colors">
            <span className="material-symbols-outlined text-[16px]">add</span> Add Contact
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContactCard 
<<<<<<< HEAD
            name="Guard Sentinel" role="Private Security • 24/7" imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBci9AuLbVIaIfis65sZ3gUB0u1CDXh_viYlmHeJp4X3DnZqCJrg_ydsW_ITNbjlyQfnf2jYuUQUHwzAgXCb9dYMrC0tGHSZqG6eauo8rn0sujZ8HrX6oinA7UGx2Xujf05NXIfRo743Hq2F2RmZ46KpZIcwMqyEK9jUjuC_ObqkWuYGwoJaWpUiOKM9tMeEjDpmTV1NwEM9tjEncP1FsHeBpuMj7uj_Vxr7l1B-joJGhu4QUHCxW_D9fY7GLWH1th7_e0y7y651mo"
            btn1="Secure Chat" btn2="Connect Protocol" icon1="chat" icon2="shield" isPrimary={true}
          />
          <ContactCard 
            name="David Chen" role="Partner • Primary" imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDFvT_HSyDis1KCqA548r0fl9JugICYUsyhO_jKG1KJaC8Uu-EI9LLvwwpXnwBkEPgT2ONHtsWffS7bwmgvXM3rqFG53RBhsUTROdo1Ho1JK1x6ozobci1y0NWBOa_E-WwiqrvOZSIRZ1DvGChp47no-hPnb46dQ0aI5kIsRDNnQUywOgEzFFyJL4GfbVSHBd8lWOn-Lje3v2kEuDnAVAeSVaAI3oi0EndVa69porpPCOiGJoefJYGbruuwXepjpkDdXTahcfOuPkM"
            btn1="Voice Call" btn2="Share Location" icon1="call" icon2="share_location" isPrimary={false}
          />
          <ContactCard 
            name="Sarah Miller" role="Family • Secondary" imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuC0sLwZLGpSy8RbiCQEKNA1qcxVI8nkWUdjlw5QE5PDRojB66jAw3mjlBVzevOTW1pXednYaYbrL_U9Laih2SINz_i9o3yCNz4WZsvSxjuCEoW0WfA2FQco1jgc_5aHfdJxpWSkEp6AUO8GBWUzB54dioF9fhBS5BFsyH2mGOPfkZL4D6qQOnnG6s6LMS9b3RhKfgJxNiFkspXxGOwnVa2xRQoiY3goLjYnsXW6LnofqmF6BqSct86WlithjI968kZHMEWleXn9Bj4"
            btn1="Voice Call" btn2="Share Location" icon1="call" icon2="share_location" isPrimary={false}
=======
            name="Guard Sentinel" 
            role="Private Security • 24/7" 
            imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBci9AuLbVIaIfis65sZ3gUB0u1CDXh_viYlmHeJp4X3DnZqCJrg_ydsW_ITNbjlyQfnf2jYuUQUHwzAgXCb9dYMrC0tGHSZqG6eauo8rn0sujZ8HrX6oinA7UGx2Xujf05NXIfRo743Hq2F2RmZ46KpZIcwMqyEK9jUjuC_ObqkWuYGwoJaWpUiOKM9tMeEjDpmTV1NwEM9tjEncP1FsHeBpuMj7uj_Vxr7l1B-joJGhu4QUHCxW_D9fY7GLWH1th7_e0y7y651mo"
            btn1="Secure Chat" btn2="Connect Protocol" icon1="chat" icon2="shield"
            isPrimary={true}
          />
          <ContactCard 
            name="David Chen" 
            role="Partner • Primary" 
            imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDFvT_HSyDis1KCqA548r0fl9JugICYUsyhO_jKG1KJaC8Uu-EI9LLvwwpXnwBkEPgT2ONHtsWffS7bwmgvXM3rqFG53RBhsUTROdo1Ho1JK1x6ozobci1y0NWBOa_E-WwiqrvOZSIRZ1DvGChp47no-hPnb46dQ0aI5kIsRDNnQUywOgEzFFyJL4GfbVSHBd8lWOn-Lje3v2kEuDnAVAeSVaAI3oi0EndVa69porpPCOiGJoefJYGbruuwXepjpkDdXTahcfOuPkM"
            btn1="Voice Call" btn2="Share Location" icon1="call" icon2="share_location"
            isPrimary={false}
          />
          <ContactCard 
            name="Sarah Miller" 
            role="Family • Secondary" 
            imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuC0sLwZLGpSy8RbiCQEKNA1qcxVI8nkWUdjlw5QE5PDRojB66jAw3mjlBVzevOTW1pXednYaYbrL_U9Laih2SINz_i9o3yCNz4WZsvSxjuCEoW0WfA2FQco1jgc_5aHfdJxpWSkEp6AUO8GBWUzB54dioF9fhBS5BFsyH2mGOPfkZL4D6qQOnnG6s6LMS9b3RhKfgJxNiFkspXxGOwnVa2xRQoiY3goLjYnsXW6LnofqmF6BqSct86WlithjI968kZHMEWleXn9Bj4"
            btn1="Voice Call" btn2="Share Location" icon1="call" icon2="share_location"
            isPrimary={false}
>>>>>>> 41779a16e8d750d9f143501ed203cb0cdcaba5ee
          />
        </div>
      </div>
    </main>
  );
}