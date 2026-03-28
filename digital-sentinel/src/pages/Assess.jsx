import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { geocodeAddress, reverseGeocodePlace } from '../api';
import PageMain from '../layouts/PageMain';
import { PATHS, TRAVEL_MODES, tripNavigationState, REPORT_MODE } from '../constants/journey';
import { useCurrentLocation } from '../hooks/useCurrentLocation';

const PROFILES = [
  { id: 'solo', icon: 'person', label: 'Solo traveler' },
  { id: 'female', icon: 'female', label: 'Female traveler' },
  { id: 'family', icon: 'family_restroom', label: 'Family' },
  { id: 'student', icon: 'school', label: 'Student' },
  { id: 'tourist', icon: 'luggage', label: 'Tourist' }
];

const TRENDING = ['London, UK', 'Tokyo, JP', 'Paris, FR', 'New York, US'];

export default function Assess() {
  const navigate = useNavigate();
  const { currentLocation, geoStatus, geoError } = useCurrentLocation(true);
  const [reportMode, setReportMode] = useState(REPORT_MODE.HERE);
  /** User explicitly picked Here vs Travel — don’t override with auto-switch */
  const [userSetMode, setUserSetMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState('solo');
  const [mode, setMode] = useState('walking');
  const [destination, setDestination] = useState('');
  const [isRightNow, setIsRightNow] = useState(true);
  const [customTime, setCustomTime] = useState('');

  useEffect(() => {
    if (userSetMode) return;
    if (
      geoStatus === 'denied' ||
      geoStatus === 'error' ||
      geoStatus === 'unsupported'
    ) {
      setReportMode(REPORT_MODE.TRAVEL);
    }
  }, [geoStatus, userSetMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const time = isRightNow ? new Date().getHours() : customTime;

    if (reportMode === REPORT_MODE.HERE) {
      if (!currentLocation) {
        alert('Allow location access (or switch to “Travel to a place”) so we can score where you are.');
        return;
      }
      setSubmitting(true);
      try {
        const place = await reverseGeocodePlace(currentLocation.lat, currentLocation.lng);
        const label = place?.displayName || `Near ${place?.city || 'current position'}`;
        navigate(PATHS.insights, {
          state: tripNavigationState({
            reportMode: REPORT_MODE.HERE,
            destination: label,
            profile,
            time,
            coords: { lat: currentLocation.lat, lng: currentLocation.lng },
            mode,
            currentLocation,
          }),
        });
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!destination.trim()) return;
    setSubmitting(true);
    try {
      const coords = await geocodeAddress(destination.trim());
      navigate(PATHS.insights, {
        state: tripNavigationState({
          reportMode: REPORT_MODE.TRAVEL,
          destination: destination.trim(),
          profile,
          time,
          coords,
          mode,
          currentLocation: currentLocation ?? null,
        }),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmitHere = reportMode === REPORT_MODE.HERE && geoStatus === 'ok' && currentLocation;
  const canSubmitTravel =
    reportMode === REPORT_MODE.TRAVEL && destination.trim().length > 0;

  return (
    <PageMain className="bg-slate-50">
      <div className="mx-auto max-w-[720px] px-6 pt-24 pb-20">
        <nav className="mb-6 text-sm">
          <Link to={PATHS.home} className="font-semibold text-slate-500 hover:text-blue-600">
            ← Home
          </Link>
        </nav>

        <header className="mb-8">
          <h1 className="font-headline text-3xl font-extrabold text-[#0e1c2b] md:text-4xl">Safety check</h1>
          <p className="mt-3 text-slate-600">
            <strong className="text-slate-800">Here now</strong> summarizes safety around your current position.{' '}
            <strong className="text-slate-800">Travel</strong> checks a place you plan to go; sharing location still helps draw a better route on the map.
          </p>
        </header>

        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setUserSetMode(true);
              setReportMode(REPORT_MODE.HERE);
            }}
            className={`rounded-2xl border-2 p-5 text-left transition ${
              reportMode === REPORT_MODE.HERE
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-blue-600">my_location</span>
            <p className="mt-2 font-headline font-bold text-[#0e1c2b]">Here now</p>
            <p className="mt-1 text-xs text-slate-600">
              Risk score, local heat-style view, and nearby reports for where you are standing.
            </p>
          </button>
          <button
            type="button"
            onClick={() => {
              setUserSetMode(true);
              setReportMode(REPORT_MODE.TRAVEL);
            }}
            className={`rounded-2xl border-2 p-5 text-left transition ${
              reportMode === REPORT_MODE.TRAVEL
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-blue-600">route</span>
            <p className="mt-2 font-headline font-bold text-[#0e1c2b]">Travel to a place</p>
            <p className="mt-1 text-xs text-slate-600">
              We look up the place you enter, then build route and area views for that trip.
            </p>
          </button>
        </div>

        {reportMode === REPORT_MODE.TRAVEL &&
          (geoStatus === 'denied' ||
            geoStatus === 'error' ||
            geoStatus === 'unsupported') && (
            <p className="mb-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              We couldn’t detect your position automatically. Enter where you’re going below, or allow location in the browser and choose <strong>Here now</strong>.
            </p>
          )}

        {reportMode === REPORT_MODE.TRAVEL && (
          <aside
            aria-live="polite"
            className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm text-slate-700"
          >
            <p className="font-headline font-bold text-[#0e1c2b]">Your current position</p>
            <p className="mt-1 text-slate-600">
              {(geoStatus === 'idle' || geoStatus === 'loading') &&
                !currentLocation &&
                'Requesting browser location for route start…'}
              {geoStatus === 'ok' && currentLocation && (
                <>
                  GPS{' '}
                  <span className="font-mono text-xs">
                    ({currentLocation.lat.toFixed(4)}°, {currentLocation.lng.toFixed(4)}°)
                  </span>{' '}
                  anchors the map route.
                </>
              )}
              {geoStatus === 'denied' && 'Location declined — map uses a fallback start near your destination.'}
              {geoStatus === 'error' &&
                (geoError || 'Could not read location — map will use a fallback.')}
              {geoStatus === 'unsupported' && 'Geolocation unavailable — map uses a fallback start.'}
            </p>
          </aside>
        )}

        {reportMode === REPORT_MODE.HERE && (
          <aside
            aria-live="polite"
            className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
              canSubmitHere
                ? 'border-emerald-200 bg-emerald-50/90 text-emerald-950'
                : 'border-amber-200 bg-amber-50/90 text-amber-950'
            }`}
          >
            <p className="font-headline font-bold text-[#0e1c2b]">GPS required for “Here now”</p>
            <p className="mt-1">
              {geoStatus === 'loading' && 'Acquiring position…'}
              {canSubmitHere && <>Ready — we’ll analyze safety for your current area.</>}
              {geoStatus === 'denied' && 'Enable location or choose “Travel to a place”.'}
              {(geoStatus === 'error' || geoStatus === 'unsupported') &&
                'Cannot read GPS — switch to Travel mode or try HTTPS / localhost.'}
            </p>
          </aside>
        )}

        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-md">
          <fieldset className="space-y-4 border-0 p-0">
            <legend className="font-headline text-lg font-extrabold text-[#0e1c2b]">Traveler profile</legend>
            <p className="text-sm text-slate-500">Who is moving through the area?</p>
            <div className="flex flex-wrap gap-2">
              {PROFILES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProfile(p.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                    profile === p.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{p.icon}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-10 space-y-4 border-0 border-t border-slate-100 p-0 pt-10">
            <legend className="font-headline text-lg font-extrabold text-[#0e1c2b]">Travel mode</legend>
            <p className="text-sm text-slate-500">How you’re moving affects route timing and risk on the map.</p>
            <div className="flex flex-wrap gap-2">
              {TRAVEL_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                    mode === m.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </fieldset>

          {reportMode === REPORT_MODE.TRAVEL && (
            <fieldset className="mt-10 space-y-4 border-0 border-t border-slate-100 p-0 pt-10">
              <legend className="font-headline text-lg font-extrabold text-[#0e1c2b]">Destination</legend>
              <label htmlFor="trip-destination" className="sr-only">
                Destination address or place name
              </label>
              <div className="flex flex-col gap-3 rounded-2xl border-2 border-slate-100 p-2 sm:flex-row sm:items-center">
                <span className="material-symbols-outlined hidden pl-3 text-blue-600 sm:inline">location_on</span>
                <input
                  id="trip-destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="City, neighborhood, or full address"
                  className="min-w-0 flex-1 border-0 bg-transparent py-3 pl-3 text-lg font-semibold outline-none placeholder:text-slate-400 sm:pl-0"
                  required={reportMode === REPORT_MODE.TRAVEL}
                  autoComplete="street-address"
                />
              </div>
              <p className="text-xs text-slate-400">Geocoding via OpenStreetMap (Nominatim).</p>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Suggestions:</span>
                {TRENDING.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setDestination(city)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 hover:border-blue-200 hover:bg-blue-50"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <fieldset className="mt-10 space-y-4 border-0 border-t border-slate-100 p-0 pt-10">
            <legend className="font-headline text-lg font-extrabold text-[#0e1c2b]">Departure time</legend>
            <p className="text-sm text-slate-500">Time of day can change how we weight night travel and crowding.</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsRightNow(true)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${
                  isRightNow ? 'border-blue-200 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                Right now
              </button>
              <button
                type="button"
                onClick={() => setIsRightNow(false)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${
                  !isRightNow ? 'border-blue-200 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                Schedule
              </button>
            </div>
            {!isRightNow && (
              <label className="block text-sm font-semibold text-slate-700">
                <span className="mb-1 block">Pick date & time</span>
                <input
                  type="datetime-local"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="w-full max-w-xs rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </label>
            )}
          </fieldset>

          <div className="mt-10 border-t border-slate-100 pt-8">
            <button
              type="submit"
              disabled={submitting || (!canSubmitHere && !canSubmitTravel)}
              className="w-full rounded-full bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {submitting
                ? reportMode === REPORT_MODE.HERE
                  ? 'Preparing report…'
                  : 'Geocoding…'
                : reportMode === REPORT_MODE.HERE
                  ? 'Run report for my location'
                  : 'Run safety analysis'}
            </button>
          </div>
        </form>
      </div>
    </PageMain>
  );
}
