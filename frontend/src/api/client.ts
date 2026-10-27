const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) || '/api';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  const token = localStorage.getItem('token');

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  const text = await response.text();
  const data: unknown = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? String(data.message)
        : `Request failed (${response.status})`;
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
    throw new ApiError(message, response.status);
  }

  return data as T;
}

export function jsonBody(value: unknown): BodyInit {
  return JSON.stringify(value);
}
