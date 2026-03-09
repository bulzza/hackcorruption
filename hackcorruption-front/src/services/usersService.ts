import { API_BASE } from "./apiConfig";

export type UserStatus = "Active" | "Inactive";

export type User = {
  id: number;
  email: string;
  full_name: string | null;
  role: string | null;
  status: UserStatus;
  created_at: string | null;
  last_login: string | null;
};

export type UserDetail = User;

export type UserInput = {
  email: string;
  full_name: string;
  role: string;
  password?: string;
  status?: UserStatus;
};

type ApiResponse<T> = {
  ok: boolean;
  data: T;
  message?: string;
  error?: string;
};

type UserRow = {
  id: number;
  email: string;
  full_name?: string | null;
  name?: string | null;
  username?: string | null;
  role?: string | null;
  status?: string | null;
  is_active?: number | boolean | null;
  created_at?: string | null;
  last_login?: string | null;
};

const toStatus = (row: UserRow): UserStatus => {
  if (row.status === "Active" || row.status === "Inactive") return row.status;
  if (row.is_active !== null && row.is_active !== undefined) {
    return Number(row.is_active) === 1 ? "Active" : "Inactive";
  }
  return "Active";
};

const mapUserRow = (row: UserRow): User => ({
  id: Number(row.id),
  email: row.email ?? "",
  full_name: row.full_name ?? row.name ?? row.username ?? null,
  role: row.role ?? null,
  status: toStatus(row),
  created_at: row.created_at ?? null,
  last_login: row.last_login ?? null,
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

const buildPayload = (input: UserInput) => {
  const payload: Record<string, unknown> = {
    email: input.email,
    full_name: input.full_name,
    role: input.role,
  };
  if (input.password) {
    payload.password = input.password;
  }
  if (input.status) {
    payload.is_active = input.status === "Active" ? 1 : 0;
  }
  return payload;
};

export async function listUsers(): Promise<User[]> {
  const data = await requestJson<UserRow[]>(`${API_BASE}/users`);
  return data.map(mapUserRow);
}

export async function getUserById(id: number): Promise<UserDetail | undefined> {
  const data = await requestJson<UserRow>(`${API_BASE}/users/${id}`);
  return data ? mapUserRow(data) : undefined;
}

export async function createUser(input: UserInput): Promise<UserDetail> {
  const payload = buildPayload(input);
  const data = await requestJson<UserRow>(`${API_BASE}/users/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return mapUserRow(data);
}

export async function updateUser(id: number, input: UserInput): Promise<UserDetail> {
  const payload = buildPayload(input);
  const data = await requestJson<UserRow>(`${API_BASE}/users/${id}/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return mapUserRow(data);
}

export async function toggleUserStatus(id: number): Promise<User> {
  const data = await requestJson<UserRow>(`${API_BASE}/users/${id}/toggle-active`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });
  return mapUserRow(data);
}
