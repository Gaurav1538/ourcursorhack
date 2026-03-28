/**
 * Trip journey: Plan → Report → Map. Emergency (SOS) is global via header, not a step.
 */
export const PATHS = {
  home: '/',
  assess: '/assess',
  /** Personalized safety report (analyzeSafety, trends, assistant). */
  insights: '/insights',
  map: '/map',
  /** Always available from header; not part of the numbered trip flow. */
  emergency: '/emergency',
  howItWorks: '/how-it-works',
  /** @deprecated redirects to insights */
  legacyDashboard: '/dashboard',
};

export const TRAVEL_MODES = [
  { id: 'walking', label: 'Walking', icon: 'directions_walk' },
  { id: 'driving', label: 'Driving', icon: 'directions_car' },
  { id: 'transit', label: 'Transit', icon: 'train' }
];

/** Safety report context: where you are now vs a trip to a destination. */
export const REPORT_MODE = {
  HERE: 'here',
  TRAVEL: 'travel',
};

/**
 * @param {Record<string, unknown>} state
 * @param {'here'|'travel'} [state.reportMode]
 * @param { { lat: number, lng: number, accuracy?: number } | null | undefined } [state.currentLocation]
 */
export function tripNavigationState(state) {
  return {
    destination: state.destination,
    profile: state.profile,
    time: state.time,
    coords: state.coords ?? null,
    mode: state.mode ?? 'walking',
    currentLocation: state.currentLocation ?? null,
    reportMode: state.reportMode ?? REPORT_MODE.TRAVEL,
  };
}

/** True when user arrived from Safety check (Insights carries the same object). Direct /map or full refresh loses this. */
export function hasSafetyCheckNavigationState(state) {
  if (!state || typeof state !== 'object') return false;
  if (typeof state.destination === 'string' && state.destination.trim()) return true;
  if (state.coords?.lat != null && state.coords?.lng != null) return true;
  return false;
}

/**
 * Route start captured on Safety check only (not live browser GPS on later pages).
 */
export function assessedRouteOrigin(state) {
  if (!state) return null;
  if (state.currentLocation?.lat != null && state.currentLocation?.lng != null) {
    return { lat: state.currentLocation.lat, lng: state.currentLocation.lng };
  }
  if (state.reportMode === REPORT_MODE.HERE && state.coords?.lat != null && state.coords?.lng != null) {
    return { lat: state.coords.lat, lng: state.coords.lng };
  }
  return null;
}
