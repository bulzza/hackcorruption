import { API_BASE } from "./apiConfig";
import type { CourtCaseRow, CourtItem, CourtMetric } from "../data/courts";

export type CourtStatus = "Active" | "Inactive";

export type Court = {
  id: number;
  name: string;
  slug: string;
  type: string;
  jurisdiction: string;
  address: string;
  phones: string[];
  website: string;
  status: CourtStatus;
};

export type CourtDetail = CourtItem & {
  status: CourtStatus;
  slug: string;
  caseSummary: CourtCaseSummary;
};

export type CourtInput = {
  name: string;
  slug: string;
  type: string;
  jurisdiction: string;
  address: string;
  phones: string[];
  website: string;
  about: string;
  status?: CourtStatus;
};

type ApiResponse<T> = {
  ok: boolean;
  data: T;
  message?: string;
  error?: string;
};

export type CourtCaseSummary = {
  total: number;
  active: number;
  closed: number;
  unknown: number;
};

export type CourtCasesPage = {
  items: CourtCaseRow[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type GetCourtByIdOptions = {
  includeCases?: boolean;
};

type GetCourtCasesPageOptions = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "All" | CourtCaseRow["status"];
};

type CourtRow = {
  id: number | string;
  slug: string;
  name: string;
  court_type?: string | null;
  address?: string | null;
  phone?: string | null;
  jurisdiction?: string | null;
  website?: string | null;
  about?: string | null;
  status?: string | null;
  is_active?: number | boolean | null;
};

type CourtChartRow = {
  label: string;
  value: number;
  color?: string | null;
};

type CourtMetricRow = {
  label: string;
  value: string | number;
  tone?: CourtMetric["tone"];
  info?: string;
};

type CourtCaseRowResponse = {
  id: string;
  recordKey?: string | null;
  type?: string | null;
  subtype?: string | null;
  basisType?: string | null;
  filingDate?: string | null;
  status?: CourtCaseRow["status"] | string | null;
};

type CourtCaseSummaryResponse = {
  total?: number | string | null;
  active?: number | string | null;
  closed?: number | string | null;
  unknown?: number | string | null;
};

type CourtCasesPageResponse = {
  items?: CourtCaseRowResponse[];
  page?: number | string | null;
  pageSize?: number | string | null;
  total?: number | string | null;
  totalPages?: number | string | null;
};

type CourtDetailResponse = CourtRow & {
  metrics?: CourtMetricRow[];
  caseTypes?: CourtChartRow[];
  casesPerYear?: CourtChartRow[];
  avgTimeByType?: CourtChartRow[];
  avgCostByType?: CourtChartRow[];
  cases?: CourtCaseRowResponse[];
  caseSummary?: CourtCaseSummaryResponse;
};

const chartColors = ["#3b6f95", "#9ac6e5", "#e7a24a", "#78b8b1", "#4f78a8"];

const toStatus = (row: CourtRow): CourtStatus => {
  if (row.status === "Active" || row.status === "Inactive") return row.status;
  if (row.is_active !== null && row.is_active !== undefined) {
    return Number(row.is_active) === 1 ? "Active" : "Inactive";
  }
  return "Active";
};

const splitPhones = (value: string | null | undefined) =>
  value
    ? value
        .split(/[;,]/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const mapCourtRow = (row: CourtRow): Court => ({
  id: Number(row.id),
  name: row.name ?? "",
  slug: row.slug ?? "",
  type: row.court_type ?? "",
  jurisdiction: row.jurisdiction ?? "",
  address: row.address ?? "",
  phones: splitPhones(row.phone),
  website: row.website ?? "",
  status: toStatus(row),
});

const mapMetrics = (items: CourtMetricRow[] | null | undefined): CourtMetric[] =>
  (items ?? []).map((item) => ({
    label: item.label ?? "",
    value: String(item.value ?? ""),
    tone: item.tone,
    info: item.info,
  }));

const mapChartItems = (items: CourtChartRow[] | null | undefined) =>
  (items ?? []).map((item, index) => ({
    label: item.label ?? "",
    value: Number(item.value ?? 0),
    color: item.color ?? chartColors[index % chartColors.length],
  }));

const normalizeCaseStatus = (value?: string | null): CourtCaseRow["status"] => {
  if (value === "Active" || value === "Closed" || value === "Unknown") return value;
  return "Unknown";
};

const mapCases = (items: CourtCaseRowResponse[] | null | undefined): CourtCaseRow[] =>
  (items ?? []).map((item) => ({
    id: item.id ?? "",
    recordKey: item.recordKey ?? undefined,
    type: item.type ?? "",
    subtype: item.subtype ?? "",
    basisType: item.basisType ?? "",
    filingDate: item.filingDate ?? "",
    status: normalizeCaseStatus(item.status ?? undefined),
  }));

const toNumber = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const mapCaseSummary = (value: CourtCaseSummaryResponse | null | undefined): CourtCaseSummary => ({
  total: toNumber(value?.total),
  active: toNumber(value?.active),
  closed: toNumber(value?.closed),
  unknown: toNumber(value?.unknown),
});

const mapCourtCasesPage = (value: CourtCasesPageResponse | null | undefined): CourtCasesPage => ({
  items: mapCases(value?.items),
  page: Math.max(1, toNumber(value?.page) || 1),
  pageSize: Math.max(1, toNumber(value?.pageSize) || 1),
  total: Math.max(0, toNumber(value?.total)),
  totalPages: Math.max(1, toNumber(value?.totalPages) || 1),
});

const mapCourtDetail = (detail: CourtDetailResponse): CourtDetail => ({
  id: detail.slug ?? String(detail.id ?? ""),
  slug: detail.slug ?? "",
  name: detail.name ?? "",
  cardTag: detail.court_type ?? "COURT",
  type: detail.court_type ?? "",
  address: detail.address ?? "",
  phones: splitPhones(detail.phone),
  jurisdiction: detail.jurisdiction ?? "",
  website: detail.website ?? "",
  about: detail.about ?? "",
  metrics: mapMetrics(detail.metrics),
  caseTypes: mapChartItems(detail.caseTypes),
  casesPerYear: mapChartItems(detail.casesPerYear),
  avgTimeByType: mapChartItems(detail.avgTimeByType),
  avgCostByType: mapChartItems(detail.avgCostByType),
  cases: mapCases(detail.cases),
  caseSummary: mapCaseSummary(detail.caseSummary),
  status: toStatus(detail),
});

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

const buildPayload = (input: CourtInput) => ({
  name: input.name,
  slug: input.slug,
  type: input.type,
  jurisdiction: input.jurisdiction,
  address: input.address,
  phones: input.phones,
  website: input.website,
  about: input.about,
  status: input.status,
});

export async function listCourts(): Promise<Court[]> {
  const data = await requestJson<CourtRow[]>(`${API_BASE}/courts`);
  return data.map(mapCourtRow);
}

export async function getCourtById(
  id: number | string,
  options: GetCourtByIdOptions = {}
): Promise<CourtDetail | null> {
  const params = new URLSearchParams();
  if (options.includeCases === false) {
    params.set("includeCases", "0");
  }
  const query = params.toString();
  const url = `${API_BASE}/courts/${encodeURIComponent(String(id))}${query ? `?${query}` : ""}`;
  const data = await requestJson<CourtDetailResponse>(url);
  return data ? mapCourtDetail(data) : null;
}

export async function getCourtCasesPage(
  id: number | string,
  options: GetCourtCasesPageOptions = {}
): Promise<CourtCasesPage> {
  const params = new URLSearchParams();
  params.set("page", String(options.page ?? 1));
  params.set("pageSize", String(options.pageSize ?? 8));

  const search = options.search?.trim();
  if (search) {
    params.set("q", search);
  }
  if (options.status && options.status !== "All") {
    params.set("status", options.status);
  }

  const data = await requestJson<CourtCasesPageResponse>(
    `${API_BASE}/courts/${encodeURIComponent(String(id))}/cases?${params.toString()}`
  );
  return mapCourtCasesPage(data);
}

export async function createCourt(input: CourtInput): Promise<Court> {
  const payload = buildPayload(input);
  const data = await requestJson<CourtRow>(`${API_BASE}/courts/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return mapCourtRow(data);
}

export async function updateCourt(id: number | string, input: Partial<CourtInput>): Promise<Court> {
  const payload = {
    ...input,
  };
  const data = await requestJson<CourtRow>(`${API_BASE}/courts/${encodeURIComponent(String(id))}/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return mapCourtRow(data);
}

export async function toggleCourtStatus(id: number | string): Promise<Court> {
  const data = await requestJson<CourtRow>(`${API_BASE}/courts/${encodeURIComponent(String(id))}/toggle-active`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });
  return mapCourtRow(data);
}
