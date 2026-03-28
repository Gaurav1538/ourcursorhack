import { callApi } from "./client.js";

export const analyzeSafety = async (city, area, profile, hour) =>
  callApi(
    "/api/safety/analyze",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city,
        area,
        profile,
        hour: parseInt(hour, 10) || new Date().getHours(),
      }),
    },
    {
      score: 82,
      riskLevel: "Low",
      breakdown: {
        lighting: 92,
        cctv: 85,
        policePresence: 70,
        pedestrianTraffic: 80,
      },
      crimes: { theft: 2, vandalism: 1, assault: 0 },
      insights: [
        "Area shows strong law enforcement presence.",
        "Lighting infrastructure operating at high capacity.",
      ],
      recommendations: [
        "Stay on main illuminated pathways.",
        "Keep belongings secured in crowded transit zones.",
      ],
    },
  );

/** @param {object} p — include startLat/startLng/endLat/endLng when known for realistic ETA */
export const analyzeRoute = async (p) =>
  callApi(
    "/api/route/analyze",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: p.source,
        destination: p.destination,
        mode: p.mode,
        hour: p.hour,
        startLat: p.startLat,
        startLng: p.startLng,
        endLat: p.endLat,
        endLng: p.endLng,
      }),
    },
    {
      score: 88,
      riskLevel: "Safe",
      eta: "24 mins",
      traffic: "Moderate",
      distanceKm: 2.4,
      durationMinutes: 24,
      mode: p.mode || "walking",
      routeSummary: "Offline fallback — connect backend for live metrics",
      waypoints: [
        { lat: p.startLat ?? 51.5, lng: p.startLng ?? -0.12 },
        { lat: p.endLat ?? 51.512, lng: p.endLng ?? -0.125 },
      ],
      hotspots: [
        { lat: p.endLat ?? 51.512, lng: p.endLng ?? -0.125, risk: "High" },
        {
          lat: (p.endLat ?? 51.51) - 0.002,
          lng: (p.endLng ?? -0.12) + 0.002,
          risk: "Moderate",
        },
      ],
    },
  );

export const getAllIncidents = async () =>
  callApi("/api/incidents", {}, [
    {
      id: "101",
      type: "Theft",
      description: "Reported pickpocketing",
      lat: 51.5,
      lng: -0.1,
      severity: 2,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "102",
      type: "Hazard",
      description: "Flooded main road",
      lat: 51.51,
      lng: -0.12,
      severity: 3,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
  ]);

export const reportIncident = async (payload) =>
  callApi(
    "/api/incidents",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    {
      ...payload,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    },
  );

export const getNearbyIncidents = async (lat, lng, radius = 2) =>
  callApi(`/api/incidents/nearby?lat=${lat}&lng=${lng}&radius=${radius}`, {}, [
    {
      id: "1",
      type: "Theft",
      description: "Reported pickpocketing",
      lat: lat + 0.005,
      lng: lng + 0.005,
      severity: 2,
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      type: "Vandalism",
      description: "Broken streetlights",
      lat: lat - 0.003,
      lng: lng - 0.004,
      severity: 1,
      timestamp: new Date().toISOString(),
    },
  ]);

export const chatAssistant = async (message) =>
  callApi(
    "/api/assistant/chat",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    },
    {
      reply:
        "Based on current intelligence, that area is secure but maintain situational awareness.",
    },
  );

/** One-shot AI brief (project doc: /api/ai/ask). */
export const askAi = async (prompt, context = {}) =>
  callApi(
    "/api/ai/ask",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, context }),
    },
    {
      answer:
        "Based on fused signals for this location and profile, conditions appear typical for the time window. Use the chat panel for follow-up questions.",
    },
  );

export const getTrends = async () =>
  callApi(
    "/api/trends",
    {},
    {
      overallTrend: "Improving",
      weeklyIncidents: [12, 15, 8, 10, 5, 7, 4],
    },
  );

/** Normalize backend safe-route points (supports legacy latitude/longitude). */
export function normalizeSafeRoutePoint(p) {
  if (!p || typeof p !== "object") return null;
  const lat = p.lat ?? p.latitude;
  const lng = p.lng ?? p.longitude;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng, riskScore: p.riskScore };
}

export const getSafeRoute = async (slat, slng, elat, elng) =>
  callApi(
    `/api/route/safe?startLat=${slat}&startLng=${slng}&endLat=${elat}&endLng=${elng}`,
    {},
    [
      { lat: slat, lng: slng },
      { lat: (slat + elat) / 2, lng: slng },
      { lat: (slat + elat) / 2, lng: elng },
      { lat: elat, lng: elng },
    ],
  );

export const getRiskScore = async (lat, lng) =>
  callApi(
    `/api/risk?lat=${lat}&lng=${lng}`,
    {},
    { score: Math.floor(Math.random() * 40) + 60 },
  );

export const getRiskDetailed = async (lat, lng) =>
  callApi(
    `/api/risk/detailed?lat=${lat}&lng=${lng}`,
    {},
    {
      score: Math.floor(Math.random() * 40) + 60,
      riskLevel: "Moderate",
      factors: ["Low Illumination", "Recent Minor Incident"],
    },
  );

export const getCityHeatmap = async (city) =>
  callApi(`/api/map/heatmap?city=${encodeURIComponent(city)}`, {}, [
    { lat: 51.5074, lng: -0.1278, intensity: 0.8 },
    { lat: 51.515, lng: -0.115, intensity: 0.4 },
    { lat: 51.5, lng: -0.13, intensity: 0.6 },
  ]);

/** Radius heatmap around a coordinate (distinct from city-wide /api/map/heatmap). */
export const getLocationHeatmap = async (lat, lng, radius = 2) =>
  callApi(`/api/heatmap?lat=${lat}&lng=${lng}&radius=${radius}`, {}, [
    { lat: lat + 0.002, lng: lng + 0.002, risk: 0.7 },
    { lat: lat - 0.001, lng: lng + 0.003, risk: 0.45 },
  ]);

function mockEmergencyList(city, lat, lng) {
  const hospitals = [
    "District Hospital",
    "Regional Medical Center",
    "City General Hospital",
    "Trauma & Emergency Unit",
    "Community Health Center",
  ];
  const police = [
    "City Police Headquarters",
    "Metro Safety Office",
    "Central Police Post",
    "North Precinct",
  ];
  let h = 0;
  if (lat != null && lng != null) {
    h = Math.abs(Math.floor(lat * 10000 + lng * 10000));
  } else {
    h = (city || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  }
  const km = (n) => `${(0.5 + (n % 33) / 10).toFixed(1)} km`;
  const et = (n) => `${3 + (n % 18)} mins`;
  return [
    {
      name: hospitals[h % hospitals.length],
      type: "hospital",
      distance: km(h),
      eta: et(h + 1),
    },
    {
      name: police[(h >> 3) % police.length],
      type: "police",
      distance: km(h + 7),
      eta: et(h + 5),
    },
  ];
}

/** Pass lat/lng from browser GPS or geocoded address so listings/distance vary by location */
export const getEmergencyServices = async (
  city,
  lat,
  lng,
  radiusMeters = 10000,
) => {
  const q = new URLSearchParams();
  q.set("city", city && String(city).trim() ? city : "Unknown");
  if (
    lat != null &&
    lng != null &&
    Number.isFinite(+lat) &&
    Number.isFinite(+lng)
  ) {
    q.set("lat", String(lat));
    q.set("lon", String(lng));
    if (radiusMeters != null && Number.isFinite(+radiusMeters)) {
      q.set(
        "radiusMeters",
        String(Math.min(500000, Math.max(500, Math.round(+radiusMeters)))),
      );
    }
  }
  return callApi(
    `/api/emergency?${q.toString()}`,
    {},
    mockEmergencyList(city, lat, lng),
  );
};

/** Direct coordinate query (backend GET /api/emergency/nearby). */
export const getEmergencyNearby = async (lat, lng, radiusMeters = 10000) => {
  const r = Math.min(500000, Math.max(500, Math.round(radiusMeters)));
  return callApi(
    `/api/emergency/nearby?lat=${lat}&lng=${lng}&radiusMeters=${r}`,
    {},
    mockEmergencyList("Near you", lat, lng),
  );
};
