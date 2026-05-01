import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

Object.assign(globalThis, {
  AbortController: window.AbortController,
  AbortSignal: window.AbortSignal,
  Headers: window.Headers,
  Request: window.Request,
  Response: window.Response,
});

afterEach(() => {
  cleanup();
  document.cookie.split(";").forEach((cookie) => {
    const cookieName = cookie.split("=")[0]?.trim();
    if (cookieName) {
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  });
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
