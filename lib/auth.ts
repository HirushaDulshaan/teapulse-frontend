// lib/auth.ts
const TOKEN_KEY = 'teapulse_token';
const COOKIE_NAME = 'teapulse_token';

/**
 * Call this right after a successful /login or /register-land response,
 * passing data.access_token from the backend response.
 */
export function saveAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);

  // Also set a plain (non-httpOnly) cookie so middleware.ts can check for
  // its presence when gating page access. It's readable client-side
  // because we also need to attach it as an Authorization header on
  // fetch() calls to the separate FastAPI backend (cookies aren't
  // automatically sent cross-origin/cross-port like localhost:8000).
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/** Call this on logout. */
export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}


export function authFetch(url: string, options: RequestInit = {}) {
  const token = getAuthToken();
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}