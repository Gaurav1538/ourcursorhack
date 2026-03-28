/** Forward geocode (Nominatim). */
export async function geocodeAddress(address) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
    );
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch {
    return null;
  }
}

/** City / area string for emergency lookup. */
export async function reverseGeocodeLatLng(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    );
    const data = await res.json();
    const a = data?.address;
    if (!a) return null;
    return (
      a.city ||
      a.town ||
      a.village ||
      a.suburb ||
      a.county ||
      data?.display_name?.split(',')?.[0]?.trim() ||
      null
    );
  } catch {
    return null;
  }
}

/** Full place label for “here” reports and analyzeSafety city field. */
export async function reverseGeocodePlace(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    );
    const data = await res.json();
    const a = data?.address;
    const city =
      a?.city ||
      a?.town ||
      a?.village ||
      a?.suburb ||
      a?.county ||
      data?.display_name?.split(',')?.[0]?.trim() ||
      null;
    return {
      displayName: data?.display_name || `${lat}, ${lng}`,
      city: city || 'Unknown area',
    };
  } catch {
    return null;
  }
}
