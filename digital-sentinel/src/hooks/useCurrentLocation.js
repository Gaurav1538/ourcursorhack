import { useState, useEffect, useCallback } from 'react';

const DEFAULT_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 15000,
  maximumAge: 60_000,
};

/**
 * Browser geolocation for route origin and SOS context.
 * @param {boolean} enabled — set false to skip request (SSR/tests).
 */
export function useCurrentLocation(enabled = true) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [geoError, setGeoError] = useState(null);
  /** idle | loading | ok | denied | error | unsupported */
  const [geoStatus, setGeoStatus] = useState('idle');

  const refresh = useCallback(() => {
    if (!enabled || typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoStatus('unsupported');
      return;
    }
    setGeoStatus('loading');
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setGeoStatus('ok');
      },
      (err) => {
        setGeoError(err.message || 'Location error');
        setGeoStatus(err.code === 1 ? 'denied' : 'error');
      },
      DEFAULT_OPTIONS,
    );
  }, [enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { currentLocation, geoError, geoStatus, refresh };
}
