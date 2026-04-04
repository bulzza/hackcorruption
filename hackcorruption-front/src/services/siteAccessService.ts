import {
  SITE_ACCESS_LOGIN_URL,
  SITE_ACCESS_LOGOUT_URL,
  SITE_ACCESS_ME_URL,
} from "./apiConfig";

export const SITE_ACCESS_STATE_KEY = "hc_site_access_state";

type SiteAccessResponse = {
  ok?: boolean;
  user?: {
    email?: string;
  };
  error?: string;
  message?: string;
};

async function readResponse(response: Response) {
  return (await response.json().catch(() => null)) as SiteAccessResponse | null;
}

export async function getSiteAccessSession() {
  const response = await fetch(SITE_ACCESS_ME_URL, {
    credentials: "include",
  });
  return readResponse(response);
}

export async function loginSiteAccess(email: string, password: string) {
  const response = await fetch(SITE_ACCESS_LOGIN_URL, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await readResponse(response);

  if (!response.ok || !data || data.ok !== true) {
    throw new Error(data?.error || data?.message || `Login failed (${response.status}).`);
  }

  try {
    localStorage.setItem(SITE_ACCESS_STATE_KEY, "granted");
  } catch {}

  return data;
}

export async function logoutSiteAccess() {
  await fetch(SITE_ACCESS_LOGOUT_URL, {
    method: "POST",
    credentials: "include",
  }).catch(() => null);

  try {
    localStorage.removeItem(SITE_ACCESS_STATE_KEY);
  } catch {}
}

export function clearSiteAccessState() {
  try {
    localStorage.removeItem(SITE_ACCESS_STATE_KEY);
  } catch {}
}
