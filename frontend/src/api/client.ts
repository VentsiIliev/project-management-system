const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

type ApiErrorEnvelope = {
  error?: {
    code?: string;
    message?: string;
    details?: Record<string, unknown>;
  };
};

type UnauthorizedHandler = (() => void) | null;

let unauthorizedHandler: UnauthorizedHandler = null;

export class ApiError extends Error {
  status: number;
  code: string;
  details: Record<string, unknown>;

  constructor({
    status,
    code,
    message,
    details,
  }: {
    status: number;
    code: string;
    message: string;
    details?: Record<string, unknown>;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details ?? {};
  }
}

function getCsrfToken() {
  const match = document.cookie.match(/(?:^|; )csrftoken=([^;]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function parseApiError(
  response: Response,
  payload: unknown,
): ApiError {
  const envelope = payload as ApiErrorEnvelope;
  const errorCode =
    envelope?.error?.code ??
    (response.status === 401 ? "UNAUTHENTICATED" : "API_ERROR");
  const message =
    envelope?.error?.message ??
    (response.status === 401
      ? "Authentication is required."
      : "The request could not be completed.");

  return new ApiError({
    status: response.status,
    code: errorCode,
    message,
    details: envelope?.error?.details,
  });
}

async function parseResponseBody(response: Response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : null;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit & { suppressUnauthorizedHandler?: boolean } = {},
): Promise<T> {
  const { suppressUnauthorizedHandler = false, ...requestInit } = init;
  const headers = new Headers(init.headers);
  const method = requestInit.method?.toUpperCase() ?? "GET";
  const isUnsafeMethod = !["GET", "HEAD", "OPTIONS"].includes(method);
  const csrfToken = isUnsafeMethod ? getCsrfToken() : null;

  headers.set("Accept", "application/json");

  if (requestInit.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (csrfToken && !headers.has("X-CSRFToken")) {
    headers.set("X-CSRFToken", csrfToken);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestInit,
    credentials: "include",
    headers,
  });

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    const error = parseApiError(response, payload);

    if (response.status === 401 && !suppressUnauthorizedHandler) {
      unauthorizedHandler?.();
    }

    throw error;
  }

  return payload as T;
}

export function registerUnauthorizedHandler(handler: UnauthorizedHandler) {
  unauthorizedHandler = handler;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
