/*
 * Thin fetch wrapper for DummyJSON. Network failures, rate limits (429) and
 * 5xx responses are retried with a short backoff, since the public API
 * occasionally drops requests under load.
 */
export const API_BASE_URL = "https://dummyjson.com";

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 500;

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const isRetryable = (status: number) => status === 429 || status >= 500;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const canRetry = attempt < MAX_RETRIES;

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, init);
      if (response.ok) return (await response.json()) as T;
      if (!canRetry || !isRetryable(response.status)) {
        throw new ApiError(`Request to ${path} failed with status ${response.status}`, response.status);
      }
    } catch (error) {
      if (error instanceof ApiError || !canRetry || init?.signal?.aborted) throw error;
    }

    await wait(RETRY_DELAY_MS * (attempt + 1));
  }
}
