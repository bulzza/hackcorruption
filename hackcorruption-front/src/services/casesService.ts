import { API_BASE } from "./apiConfig";

export type Case = {
  record_key: string;
  id: string;
  court_id: number | null;
  court: string;
  judge: string | null;
  decision_date: string | null;
  legal_area: string | null;
  summary: string | null;
  source: "registry" | "court_file";
  court_slug: string | null;
  case_status: string | null;
  case_type?: string | null;
  case_subtype?: string | null;
  basis_type?: string | null;
  basis?: string | null;
  articles?: string | null;
  public_prosecutor_case?: string | null;
  case_cost?: number | null;
  total_case_cost?: number | null;
  download_link?: string | null;
  can_edit: boolean;
  can_delete: boolean;
};

export type CaseDetailInfo = {
  case_type: string | null;
  case_subtype: string | null;
  basis_type: string | null;
  basis: string | null;
  articles: string | null;
  public_prosecutor_case: string | null;
};

export type CaseFinancials = {
  case_cost: number | null;
  total_case_cost: number | null;
};

export type CaseInsights = {
  mitigating_factors: string | null;
  plea_deal: string | null;
  duration_days: number | null;
  severity_ratio: number | null;
  sentence_severity: string | null;
  appeal: string | null;
};

export type CaseTimelineItem = {
  event_name: string;
  event_date: string;
};

export type CaseDetail = Case & {
  case_detail: CaseDetailInfo;
  case_financials: CaseFinancials;
  case_insights: CaseInsights;
  case_timeline: CaseTimelineItem[];
};

export type CaseDetailInput = {
  case_type: string | null;
  case_subtype: string | null;
  basis_type: string | null;
  basis: string | null;
  articles: string | null;
  public_prosecutor_case: string | null;
};

export type CaseFinancialsInput = {
  case_cost: number | string | null;
  total_case_cost: number | string | null;
};

export type CaseInsightsInput = {
  mitigating_factors: string | null;
  plea_deal: string | null;
  duration_days: number | string | null;
  severity_ratio: number | string | null;
  sentence_severity: string | null;
  appeal: string | null;
};

export type CaseTimelineItemInput = {
  event_name: string;
  event_date: string;
};

export type CaseInput = {
  id: string;
  court_id: number | null;
  court: string;
  judge: string;
  decision_date: string;
  legal_area: string;
  summary: string;
  case_detail: CaseDetailInput;
  case_financials: CaseFinancialsInput;
  case_insights: CaseInsightsInput;
  case_timeline: CaseTimelineItemInput[];
};

type ApiResponse<T> = {
  ok: boolean;
  data: T;
  message?: string;
  error?: string;
};

type CaseRow = {
  record_key?: string | null;
  id: string;
  court_id?: number | string | null;
  court: string;
  judge: string | null;
  decision_date: string | null;
  legal_area: string | null;
  summary: string | null;
  source?: "registry" | "court_file" | null;
  court_slug?: string | null;
  case_status?: string | null;
  case_type?: string | null;
  case_subtype?: string | null;
  basis_type?: string | null;
  basis?: string | null;
  articles?: string | null;
  public_prosecutor_case?: string | null;
  case_cost?: number | string | null;
  total_case_cost?: number | string | null;
  download_link?: string | null;
  can_edit?: boolean | number | null;
  can_delete?: boolean | number | null;
};

type CaseDetailResponse = CaseRow & {
  case_detail: CaseDetailInfo;
  case_financials?: CaseFinancials;
  case_insights?: CaseInsights;
  case_timeline?: CaseTimelineItem[];
};

const toNullableNumber = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? null : numeric;
};

const mapCaseRow = (row: CaseRow): Case => ({
  record_key: row.record_key ?? String(row.id ?? ""),
  id: String(row.id ?? ""),
  court_id: toNullableNumber(row.court_id ?? null),
  court: row.court ?? "",
  judge: row.judge ?? null,
  decision_date: row.decision_date ?? null,
  legal_area: row.legal_area ?? null,
  summary: row.summary ?? null,
  source: row.source === "court_file" ? "court_file" : "registry",
  court_slug: row.court_slug ?? null,
  case_status: row.case_status ?? null,
  case_type: row.case_type ?? null,
  case_subtype: row.case_subtype ?? null,
  basis_type: row.basis_type ?? null,
  basis: row.basis ?? null,
  articles: row.articles ?? null,
  public_prosecutor_case: row.public_prosecutor_case ?? null,
  case_cost: toNullableNumber(row.case_cost ?? null),
  total_case_cost: toNullableNumber(row.total_case_cost ?? null),
  download_link: row.download_link ?? null,
  can_edit: Number(row.can_edit ?? 1) === 1,
  can_delete: Number(row.can_delete ?? 1) === 1,
});

const mapCaseDetail = (detail: CaseDetailResponse): CaseDetail => ({
  ...mapCaseRow(detail),
  case_detail: {
    case_type: detail.case_detail?.case_type ?? null,
    case_subtype: detail.case_detail?.case_subtype ?? null,
    basis_type: detail.case_detail?.basis_type ?? null,
    basis: detail.case_detail?.basis ?? null,
    articles: detail.case_detail?.articles ?? null,
    public_prosecutor_case: detail.case_detail?.public_prosecutor_case ?? null,
  },
  case_financials: {
    case_cost: toNullableNumber(detail.case_financials?.case_cost ?? null),
    total_case_cost: toNullableNumber(detail.case_financials?.total_case_cost ?? null),
  },
  case_insights: {
    mitigating_factors: detail.case_insights?.mitigating_factors ?? null,
    plea_deal: detail.case_insights?.plea_deal ?? null,
    duration_days: toNullableNumber(detail.case_insights?.duration_days ?? null),
    severity_ratio: toNullableNumber(detail.case_insights?.severity_ratio ?? null),
    sentence_severity: detail.case_insights?.sentence_severity ?? null,
    appeal: detail.case_insights?.appeal ?? null,
  },
  case_timeline:
    detail.case_timeline?.map((item) => ({
      event_name: item.event_name ?? "",
      event_date: item.event_date ?? "",
    })) ?? [],
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

export async function listCases(): Promise<Case[]> {
  const data = await requestJson<CaseRow[]>(`${API_BASE}/cases`);
  return data.map(mapCaseRow);
}

export async function listDashboardCases(): Promise<Case[]> {
  const data = await requestJson<CaseRow[]>(`${API_BASE}/cases?include_court_files=1`);
  return data.map(mapCaseRow);
}

export async function getCaseById(id: string): Promise<CaseDetail | undefined> {
  // For case IDs with slashes, use query parameter instead of path param
  // to avoid Apache URL decoding issues with encoded slashes
  let url = `${API_BASE}/cases`;
  if (id.includes('/')) {
    url += `?id=${encodeURIComponent(id)}`;
  } else {
    url += `/${encodeURIComponent(id)}`;
  }
  
  const data = await requestJson<CaseDetailResponse>(url);
  return mapCaseDetail(data);
}

export async function createCase(payload: CaseInput): Promise<CaseDetail> {
  const data = await requestJson<CaseDetailResponse>(`${API_BASE}/cases/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return mapCaseDetail(data);
}

export async function updateCase(id: string, payload: CaseInput): Promise<CaseDetail> {
  // For case IDs with slashes, use query parameter instead of path param
  let url = `${API_BASE}/cases`;
  if (id.includes('/')) {
    url += `?id=${encodeURIComponent(id)}&action=update`;
  } else {
    url += `/${encodeURIComponent(id)}/update`;
  }
  
  const data = await requestJson<CaseDetailResponse>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return mapCaseDetail(data);
}

export async function deleteCase(id: string): Promise<{ id: string }> {
  // For case IDs with slashes, use query parameter instead of path param
  let url = `${API_BASE}/cases`;
  if (id.includes('/')) {
    url += `?id=${encodeURIComponent(id)}`;
  } else {
    url += `/${encodeURIComponent(id)}`;
  }
  
  return requestJson<{ id: string }>(url, {
    method: "DELETE",
  });
}
