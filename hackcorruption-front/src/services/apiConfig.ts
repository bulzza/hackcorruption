const DEFAULT_BACKEND_BASE =
  "http://localhost/hackcorruption-final/hackcorruption/";

const normalizeBase = (value: string) => value.replace(/\/+$/, "");

const envBase = (import.meta.env.VITE_BACKEND_BASE as string | undefined)?.trim();
const BACKEND_BASE = normalizeBase(envBase && envBase.length > 0 ? envBase : DEFAULT_BACKEND_BASE);

export const API_BASE = `${BACKEND_BASE}/backend/api`;
export const AUTH_BASE = `${BACKEND_BASE}/backend/src/auth.php`;
export const AUTH_LOGIN_URL = `${AUTH_BASE}?action=login`;
export const AUTH_ME_URL = `${AUTH_BASE}?action=me`;
export const AUTH_LOGOUT_URL = `${AUTH_BASE}?action=logout`;
