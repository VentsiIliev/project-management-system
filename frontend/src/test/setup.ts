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
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
