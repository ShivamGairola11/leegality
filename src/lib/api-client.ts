/*
 * Thin fetch wrapper for DummyJSON. Network failures and 5xx responses are
 * retried once, since the public API occasionally drops a request.
 */
export const API_BASE_URL = "https://dummyjson.com";

const MAX_RETRIES = 1;

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit, attempt = 0): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, init);
  } catch (error) {
    if (attempt < MAX_RETRIES) return apiFetch<T>(path, init, attempt + 1);
    throw error;
  }

  if (response.status >= 500 && attempt < MAX_RETRIES) {
    return apiFetch<T>(path, init, attempt + 1);
  }

  if (!response.ok) {
    throw new ApiError(`Request to ${path} failed with status ${response.status}`, response.status);
  }

  return response.json() as Promise<T>;
}
