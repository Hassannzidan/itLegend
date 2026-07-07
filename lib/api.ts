import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import { readJSON } from "@/lib/persist";

/**
 * The single HTTP seam for the app.
 *
 * Everything network-related lives here: one configured axios instance, the
 * request/response interceptors (auth, error normalization), and a thin `api`
 * facade exposing the HTTP verbs. Services import `api` and never touch axios
 * directly, so cross-cutting concerns (base URL, tokens, retries, error shape)
 * are changed in exactly one place.
 */

/** localStorage key holding the bearer token; shared with the auth layer. */
export const AUTH_TOKEN_KEY = "auth_token";

/** Normalized error every rejected request throws — stable for callers/UI. */
export interface ApiError {
  /** HTTP status, or 0 when the request never reached the server. */
  status: number;
  /** Human-readable message, preferring the server's own when present. */
  message: string;
  /** Raw response payload, if any, for callers that need field-level detail. */
  data?: unknown;
}

const client: AxiosInstance = axios.create({
  // Falls back to a relative path so the same code works against a local
  // Next.js route handler or an absolute API origin set per environment.
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  timeout: 20_000,
  headers: { "Content-Type": "application/json" },
});

// Request: attach the bearer token when one is stored. `readJSON` is SSR-safe,
// so this is a no-op on the server and simply skips the header.
client.interceptors.request.use((config) => {
  const token = readJSON<string | null>(AUTH_TOKEN_KEY, null);
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// Response: pass successes through untouched and collapse every failure into
// the `ApiError` shape so callers handle one predictable type.
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(toApiError(error)),
);

function toApiError(error: AxiosError): ApiError {
  const status = error.response?.status ?? 0;
  const data = error.response?.data;
  const serverMessage =
    data && typeof data === "object" && "message" in data
      ? String((data as { message: unknown }).message)
      : undefined;

  return {
    status,
    message: serverMessage ?? error.message ?? "Request failed",
    data,
  };
}

/**
 * HTTP facade used by services. Each method unwraps `response.data`, so callers
 * receive the typed payload directly and never deal with the axios envelope.
 */
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    client.get<T>(url, config).then((r) => r.data),

  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    client.post<T>(url, body, config).then((r) => r.data),

  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    client.put<T>(url, body, config).then((r) => r.data),

  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    client.patch<T>(url, body, config).then((r) => r.data),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    client.delete<T>(url, config).then((r) => r.data),
};

/** Escape hatch for the rare case a caller needs the raw axios instance. */
export { client as axiosClient };
