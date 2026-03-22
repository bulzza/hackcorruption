import { API_BASE } from "./apiConfig";

export type JudgeStatus = "Active" | "Inactive";

export type Judge = {
  id: number;
  slug: string;
  full_name: string;
  year_of_election: number | null;
  area_of_work: string | null;
  primary_court?: string | null;
  status: JudgeStatus;
  photoUrl: string | null;
};

export type EducationItem = {
  institution: string;
  location: string;
  year: number | null;
};

export type ExperienceItem = {
  title: string;
  position: string;
  start_year: number | null;
  end_year: number | null;
  is_current: boolean;
};

export type Metrics = {
  avg_duration_days: number;
  clearance_rate_percent: number;
  total_solved: number;
  active_cases: number;
  sentence_severity: number;
  appeal_reversal_percent: number;
};

export type CaseItem = {
  case_id: string;
  court: string;
  type: string;
  subtype: string;
  basis_type: string;
  filing_date: string;
  status: string;
};

export type JudgeDetail = Judge & {
  education: EducationItem[];
  experience: ExperienceItem[];
  metrics: Metrics;
  cases: CaseItem[];
};

export type EducationItemInput = Omit<EducationItem, "year"> & {
  year: number | string | null;
};

export type ExperienceItemInput = Omit<ExperienceItem, "start_year" | "end_year"> & {
  start_year: number | string | null;
  end_year: number | string | null;
};

export type MetricsInput = {
  avg_duration_days: number | string;
  clearance_rate_percent: number | string;
  total_solved: number | string;
  active_cases: number | string;
  sentence_severity: number | string;
  appeal_reversal_percent: number | string;
};

export type JudgeInput = {
  slug: string;
  full_name: string;
  year_of_election: number | string | null;
  area_of_work: string;
  photoUrl?: string | null;
  education: EducationItemInput[];
  experience: ExperienceItemInput[];
  metrics: MetricsInput;
  cases: CaseItem[];
  status?: JudgeStatus;
};

type ApiResponse<T> = {
  ok: boolean;
  data: T;
  message?: string;
  error?: string;
};

type JudgeRow = {
  id: number;
  slug: string;
  full_name: string;
  year_of_election: number | string | null;
  area_of_work: string | null;
  primary_court?: string | null;
  role?: string;
  has_photo?: boolean;
  photo_url: string | null;
  is_active?: number | boolean | null;
  status?: string | null;
};

const toNumber = (value: number | string | null | undefined, fallback = 0) => {
  if (value === null || value === undefined || value === "") return fallback;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? fallback : numeric;
};

const toNullableNumber = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? null : numeric;
};

const toStatus = (row: JudgeRow): JudgeStatus => {
  if (row.status === "Active" || row.status === "Inactive") return row.status;
  if (row.is_active !== null && row.is_active !== undefined) {
    return Number(row.is_active) === 1 ? "Active" : "Inactive";
  }
  return "Inactive";
};

const mapJudgeRow = (row: JudgeRow): Judge => ({
  id: Number(row.id),
  slug: row.slug,
  full_name: row.full_name,
  year_of_election: toNullableNumber(row.year_of_election),
  area_of_work: row.area_of_work,
  primary_court: row.primary_court ?? null,
  status: toStatus(row),
  photoUrl: resolvePhotoUrl(row.photo_url),
});

const resolvePhotoUrl = (url: string | null): string | null => {
  if (!url) return null;
  const resolved = /^https?:\/\//i.test(url) ? new URL(url) : new URL(url, `${API_BASE}/`);
  resolved.searchParams.set("v", String(Date.now()));
  return resolved.toString();
};

const mapEducationItems = (items: EducationItem[] | null | undefined) =>
  (items ?? []).map((item) => ({
    institution: item.institution ?? "",
    location: item.location ?? "",
    year: toNullableNumber(item.year),
  }));

const mapExperienceItems = (items: ExperienceItem[] | null | undefined) =>
  (items ?? []).map((item) => ({
    title: item.title ?? "",
    position: item.position ?? "",
    start_year: toNullableNumber(item.start_year),
    end_year: toNullableNumber(item.end_year),
    is_current: Boolean(item.is_current),
  }));

const mapMetrics = (metrics: Metrics | null | undefined): Metrics => ({
  avg_duration_days: toNumber(metrics?.avg_duration_days, 0),
  clearance_rate_percent: toNumber(metrics?.clearance_rate_percent, 0),
  total_solved: toNumber(metrics?.total_solved, 0),
  active_cases: toNumber(metrics?.active_cases, 0),
  sentence_severity: toNumber(metrics?.sentence_severity, 0),
  appeal_reversal_percent: toNumber(metrics?.appeal_reversal_percent, 0),
});

const mapCaseItems = (items: CaseItem[] | null | undefined) =>
  (items ?? []).map((item) => ({
    case_id: item.case_id ?? "",
    court: item.court ?? "",
    type: item.type ?? "",
    subtype: item.subtype ?? "",
    basis_type: item.basis_type ?? "",
    filing_date: item.filing_date ?? "",
    status: item.status ?? "",
  }));

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

export async function listJudges(): Promise<Judge[]> {
  const data = await requestJson<JudgeRow[]>(`${API_BASE}/judges`);
  return data.map(mapJudgeRow);
}

export async function getJudgeById(id: number): Promise<JudgeDetail | undefined> {
  type JudgeDetailResponse = {
    judge: JudgeRow;
    education: EducationItem[];
    experience: ExperienceItem[];
    metrics: Metrics;
    cases: CaseItem[];
  };
  const data = await requestJson<JudgeDetailResponse>(`${API_BASE}/judges/${id}`);
  return mapJudgeDetail(data);
}

export async function createJudge(payload: JudgeInput, photo: File | null) {
  const fd = new FormData();
  fd.append("data", JSON.stringify(payload));
  if (photo) fd.append("photo", photo);

  const res = await fetch(`${API_BASE}/judges/create`, {
    method: "POST",
    body: fd,
    credentials: "include",
  });

  // IMPORTANT: always read JSON (even on errors)
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = json?.error || json?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  if (!json?.ok) {
    throw new Error(json?.error || json?.message || "Failed to create judge.");
  }

  return json.data;
}


export async function updateJudge(
  id: number,
  input: JudgeInput,
  photoFile?: File | null
): Promise<JudgeDetail> {
  const formData = new FormData();
  formData.append("data", JSON.stringify(input));
  if (photoFile) formData.append("photo", photoFile);

  const response = await fetch(`${API_BASE}/judges/${id}/update`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  const json = (await response.json().catch(() => null)) as
    | ApiResponse<{
        judge: JudgeRow;
        education: EducationItem[];
        experience: ExperienceItem[];
        metrics: Metrics;
        cases: CaseItem[];
      }>
    | { ok: false; error?: string; message?: string }
    | null;

  if (!response.ok || !json || ("ok" in json && json.ok !== true)) {
    const errorMessage =
      (json as { error?: string; message?: string } | null)?.error ??
      (json as { error?: string; message?: string } | null)?.message ??
      "Failed to update judge";
    throw new Error(errorMessage);
  }

  const data = (json as ApiResponse<{
    judge: JudgeRow;
    education: EducationItem[];
    experience: ExperienceItem[];
    metrics: Metrics;
    cases: CaseItem[];
  }>).data;
  return mapJudgeDetail(data);
}

export async function toggleJudgeStatus(id: number): Promise<Judge> {
  const data = await requestJson<JudgeRow>(`${API_BASE}/judges/${id}/toggle-active`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });
  return mapJudgeRow(data);
}

const mapJudgeDetail = (data: {
  judge: JudgeRow;
  education: EducationItem[];
  experience: ExperienceItem[];
  metrics: Metrics;
  cases: CaseItem[];
}): JudgeDetail => ({
  ...mapJudgeRow(data.judge),
  education: mapEducationItems(data.education),
  experience: mapExperienceItems(data.experience),
  metrics: mapMetrics(data.metrics),
  cases: mapCaseItems(data.cases),
});
