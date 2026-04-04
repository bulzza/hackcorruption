const DEFAULT_BACKEND_BASE =
  "http://localhost/hackcorruption-final/hackcorruption/";

const normalizeBase = (value: string) => value.replace(/\/+$/, "");

const envBase = (import.meta.env.VITE_BACKEND_BASE as string | undefined)?.trim();
const BACKEND_BASE = normalizeBase(envBase && envBase.length > 0 ? envBase : DEFAULT_BACKEND_BASE);

export const API_BASE = `${BACKEND_BASE}/backend/api`;
export const AUTH_BASE = `${BACKEND_BASE}/backend/src/auth.php`;
export const SITE_ACCESS_BASE = `${BACKEND_BASE}/backend/src/site_access.php`;
export const AUTH_LOGIN_URL = `${AUTH_BASE}?action=login`;
export const AUTH_ME_URL = `${AUTH_BASE}?action=me`;
export const AUTH_LOGOUT_URL = `${AUTH_BASE}?action=logout`;
export const SITE_ACCESS_LOGIN_URL = `${SITE_ACCESS_BASE}?action=login`;
export const SITE_ACCESS_ME_URL = `${SITE_ACCESS_BASE}?action=me`;
export const SITE_ACCESS_LOGOUT_URL = `${SITE_ACCESS_BASE}?action=logout`;
