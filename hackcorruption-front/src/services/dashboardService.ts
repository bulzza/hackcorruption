import { API_BASE } from "./apiConfig";

export type DashboardPoint = {
  label: string;
  value: number;
};

export type DashboardCaseType = DashboardPoint & {
  color: string;
};

export type DashboardStatus = DashboardPoint & {
  percentage: number;
};

export type DashboardSummary = {
  totals: {
    total_cases: number;
    open_cases: number;
    active_judges: number;
    avg_duration_days: number | null;
    total_courts: number;
    total_users: number;
  };
  recent_activity: DashboardPoint[];
  latest_activity: DashboardPoint | null;
  case_types: DashboardCaseType[];
  statuses: DashboardStatus[];
};

type ApiResponse<T> = {
  ok: boolean;
  data: T;
  message?: string;
  error?: string;
};

const requestJson = async <T>(url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    credentials: "include",
    ...options,
  });
  const json = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !json || !json.ok) {
    throw new Error(json?.error ?? json?.message ?? "Request failed");
  }
  return json.data;
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return requestJson<DashboardSummary>(`${API_BASE}/dashboard/summary`);
}
