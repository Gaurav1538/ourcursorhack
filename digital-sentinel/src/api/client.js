/** Guardian Safety API base — override with VITE_GUARDIAN_API_URL in .env */
export const BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GUARDIAN_API_URL) ||
  'http://localhost:8081';

export async function fetchJson(url, options = {}, fallback = null) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch {
    return fallback;
  }
}

export function callApi(path, options = {}, fallback = null) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  return fetchJson(url, options, fallback);
}
