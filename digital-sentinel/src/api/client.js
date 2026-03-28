const PRODUCTION_API =
  'https://ourcursorhack-production.up.railway.app';

/**
 * Guardian API base.
 * - `.env.development` / `.env.production` set `VITE_GUARDIAN_API_URL`
 * - Netlify etc. can override at build time with the same variable
 */
function resolveBaseUrl() {
  const fromEnv =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_GUARDIAN_API_URL;
  if (fromEnv) return String(fromEnv).replace(/\/$/, '');
  if (typeof import.meta !== 'undefined' && import.meta.env?.PROD) {
    return PRODUCTION_API;
  }
  return 'http://localhost:8081';
}

export const BASE_URL = resolveBaseUrl();

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
