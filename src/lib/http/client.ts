import { env } from "@/config/env";
import { useAuthStore } from "@/stores/auth";
import { ApiError } from "./ApiError";
import type { QueryParams, RequestOptions } from "./types";

function buildUrl(path: string, query?: QueryParams): string {
  const base = env.apiUrl.replace(/\/$/, "");
  const url = new URL(`${base}${path.startsWith("/") ? "" : "/"}${path}`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

/**
 * HTTP call to the system API.
 *
 * Centralizes the base URL, the bearer token, JSON handling and error mapping so
 * each endpoint in `src/services/aws` stays a one-liner. The token is read from
 * the auth store at call time, so a refreshed session is picked up immediately.
 */
export async function request<T>(
  path: string,
  { body, query, headers, ...init }: RequestOptions = {},
): Promise<T> {
  if (!env.apiUrl) {
    throw new ApiError(
      "VITE_API_URL is not configured. Register the API URL in the Amplify environment variables.",
      0,
      null,
    );
  }

  const token = useAuthStore.getState().session?.accessToken ?? null;

  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const raw = await response.text();
  const payload = parseJson(raw);

  if (!response.ok) {
    throw new ApiError(
      errorMessage(payload) ?? `Request failed with status ${response.status}.`,
      response.status,
      // The unparsed text when the body was not JSON, so the gateway's own
      // response is still available to whoever inspects the error.
      payload ?? raw,
    );
  }

  return payload as T;
}

/**
 * A gateway can answer with HTML — a 502 page, a WAF block — and `JSON.parse`
 * would then throw past `ApiError`, leaving the UI to show "Unexpected token
 * '<'". Every failure leaves this module as an `ApiError`.
 */
function parseJson(raw: string): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function errorMessage(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;
  const { message } = payload as { message?: unknown };
  return typeof message === "string" && message ? message : null;
}

export const api = {
  get: <T>(path: string, query?: QueryParams) =>
    request<T>(path, { method: "GET", query }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
