const BASE_URL = 'http://localhost:8081';

/** First segment before comma — works for "London, UK" → "London" */
export const extractCityKey = (destination) => {
  if (!destination || typeof destination !== 'string') return 'London';
  const part = destination.split(',')[0].trim();
  return part || 'London';
};

async function fetchJson(url, options = {}, fallback = null) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (e) {
    return fallback;
  }
}

const callApi = (path, options = {}, fallback = null) => {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  return fetchJson(url, options, fallback);
};

export const geocodeAddress = async (address) => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await res.json();
    if (data && data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    return null;
  } catch (e) {
    return null;
  }
};

export const analyzeSafety = async (city, area, profile, hour) => callApi('/api/safety/analyze', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ city, area, profile, hour: parseInt(hour) || new Date().getHours() })
}, {
  score: 82, riskLevel: 'Low',
  breakdown: { lighting: 92, cctv: 85, policePresence: 70, pedestrianTraffic: 80 },
  crimes: { theft: 2, vandalism: 1, assault: 0 },
  insights: ['Area shows strong law enforcement presence.', 'Lighting infrastructure operating at high capacity.'],
  recommendations: ['Stay on main illuminated pathways.', 'Keep belongings secured in crowded transit zones.']
});

export const analyzeRoute = async (source, destination, mode, hour) => callApi('/api/route/analyze', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ source, destination, mode, hour })
}, {
  score: 88, riskLevel: 'Safe', eta: '24 mins', traffic: 'Moderate',
  hotspots: [{ lat: 51.5120, lng: -0.1250, risk: 'High' }, { lat: 51.5090, lng: -0.1180, risk: 'Medium' }]
});

export const getAllIncidents = async () => callApi('/api/incidents', {}, [
  { id: '101', type: 'Theft', description: 'Reported pickpocketing', lat: 51.5, lng: -0.1, severity: 2, timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: '102', type: 'Hazard', description: 'Flooded main road', lat: 51.51, lng: -0.12, severity: 3, timestamp: new Date(Date.now() - 7200000).toISOString() }
]);

export const reportIncident = async (payload) => callApi('/api/incidents', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
}, { ...payload, id: Math.random().toString(36).substring(2, 9), timestamp: new Date().toISOString() });

export const getNearbyIncidents = async (lat, lng, radius = 2) => callApi(`/api/incidents/nearby?lat=${lat}&lng=${lng}&radius=${radius}`, {}, [
  { id: '1', type: 'Theft', description: 'Reported pickpocketing', lat: lat + 0.005, lng: lng + 0.005, severity: 2, timestamp: new Date().toISOString() },
  { id: '2', type: 'Vandalism', description: 'Broken streetlights', lat: lat - 0.003, lng: lng - 0.004, severity: 1, timestamp: new Date().toISOString() }
]);

export const chatAssistant = async (message) => callApi('/api/assistant/chat', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message })
}, { reply: "Based on current intelligence, that area is secure but maintain situational awareness." });

export const getTrends = async () => callApi('/api/trends', {}, {
  overallTrend: 'Improving', weeklyIncidents: [12, 15, 8, 10, 5, 7, 4]
});

export const getSafeRoute = async (slat, slng, elat, elng) => callApi(`/api/route/safe?startLat=${slat}&startLng=${slng}&endLat=${elat}&endLng=${elng}`, {}, [
  { lat: slat, lng: slng },
  { lat: (slat + elat) / 2, lng: slng },
  { lat: (slat + elat) / 2, lng: elng },
  { lat: elat, lng: elng }
]);

export const getRiskScore = async (lat, lng) => callApi(`/api/risk?lat=${lat}&lng=${lng}`, {}, { score: Math.floor(Math.random() * 40) + 60 });

export const getRiskDetailed = async (lat, lng) => callApi(`/api/risk/detailed?lat=${lat}&lng=${lng}`, {}, {
  score: Math.floor(Math.random() * 40) + 60,
  riskLevel: 'Moderate',
  factors: ['Low Illumination', 'Recent Minor Incident']
});

export const getCityHeatmap = async (city) => callApi(`/api/map/heatmap?city=${encodeURIComponent(city)}`, {}, [
  { lat: 51.5074, lng: -0.1278, intensity: 0.8 },
  { lat: 51.5150, lng: -0.1150, intensity: 0.4 },
  { lat: 51.5000, lng: -0.1300, intensity: 0.6 }
]);

export const getLocationHeatmap = async (lat, lng, radius = 2) => callApi(`/api/heatmap?lat=${lat}&lng=${lng}&radius=${radius}`, {}, [
  { lat: lat + 0.002, lng: lng + 0.002, risk: 0.7 }
]);

export const getEmergencyServices = async (city) => callApi(`/api/emergency?city=${encodeURIComponent(city)}`, {}, [
  { name: 'City General Hospital', type: 'hospital', distance: '0.8 miles', eta: '5 mins' },
  { name: 'Metropolitan Police Dept', type: 'police', distance: '1.4 miles', eta: '8 mins' },
  { name: 'Fire Station 42', type: 'fire', distance: '2.1 miles', eta: '12 mins' }
]);

/** Apify-backed crime & safety headlines */
export const getCrimeNews = async (city) => {
  const key = extractCityKey(city);
  return callApi(`/api/news/crime?city=${encodeURIComponent(key)}`, {}, [
    { title: 'Local safety briefing unavailable — connect the Spring API on port 8081.', link: '#', source: 'Digital Sentinel', publishedAt: '', image: '' }
  ]);
};

/** Backend weather pipeline (multi-row forecast list) */
export const getWeatherByCity = async (city) => {
  const key = extractCityKey(city);
  return callApi(`/api/weather?city=${encodeURIComponent(key)}`, {}, [
    { day: 'Today', city: key, country: '', temperature: '18°C', weather: 'Partly cloudy', wind: '12 km/h', humidity: '62%', uvIndex: '3' }
  ]);
};

/** Gemini via Spring — plain text */
export const askAiQuestion = async (question) => {
  const url = `${BASE_URL}/api/ai/ask?question=${encodeURIComponent(question)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('API Error');
    const text = await res.text();
    return text?.replace(/^"|"$/g, '') || 'No response.';
  } catch (e) {
    return 'Connect the backend (port 8081) for live AI briefings.';
  }
};

export default {
  geocodeAddress, extractCityKey, analyzeSafety, analyzeRoute, getAllIncidents, reportIncident,
  getNearbyIncidents, chatAssistant, getTrends, getSafeRoute, getRiskScore,
  getRiskDetailed, getCityHeatmap, getLocationHeatmap, getEmergencyServices,
  getCrimeNews, getWeatherByCity, askAiQuestion
};
