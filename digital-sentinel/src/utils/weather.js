/** Open-Meteo — no API key (https://open-meteo.com/) */
export async function fetchOpenMeteoCurrent(lat, lng) {
  if (lat == null || lng == null || Number.isNaN(+lat) || Number.isNaN(+lng)) {
    return null;
  }
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&timezone=auto`,
    );
    if (!res.ok) return null;
    const j = await res.json();
    return j?.current_weather ?? null;
  } catch {
    return null;
  }
}
