export function validLatLng(lat, lng) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -85 &&
    lat <= 85 &&
    lng >= -180 &&
    lng <= 180
  );
}

/** Haversine distance in kilometers */
export function haversineKm(a, b) {
  if (a?.lat == null || a?.lng == null || b?.lat == null || b?.lng == null)
    return 0;
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)));
}

/**
 * Backend often returns risk/intensity on 0–100; mocks use 0–1.
 * @param {number} [v]
 * @param {number} [fallback]
 * @returns {number} in [0, 1]
 */
export function normalizeHeat01(v, fallback = 0.5) {
  if (v == null || Number.isNaN(Number(v))) return fallback;
  const n = Number(v);
  if (n > 1) return Math.min(Math.max(n / 100, 0), 1);
  return Math.min(Math.max(n, 0), 1);
}
