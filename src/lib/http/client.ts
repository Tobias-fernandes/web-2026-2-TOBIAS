import { env } from '@/config/env'
import { useAuthStore } from '@/stores/auth'
import { ApiError } from './ApiError'
import type { QueryParams, RequestOptions } from './types'

function buildUrl(path: string, query?: QueryParams): string {
  const base = env.apiUrl.replace(/\/$/, '')
  const url = new URL(`${base}${path.startsWith('/') ? '' : '/'}${path}`)

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
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
      'VITE_API_URL is not configured. Register the API URL in the Amplify environment variables.',
      0,
      null,
    )
  }

  const token = useAuthStore.getState().session?.accessToken ?? null

  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const raw = await response.text()
  const payload = raw ? (JSON.parse(raw) as unknown) : null

  if (!response.ok) {
    const message =
      (payload as { message?: string } | null)?.message ??
      `Request failed with status ${response.status}.`
    throw new ApiError(message, response.status, payload)
  }

  return payload as T
}

export const api = {
  get: <T>(path: string, query?: QueryParams) =>
    request<T>(path, { method: 'GET', query }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
