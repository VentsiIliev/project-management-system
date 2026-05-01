import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderApp } from "../../test/renderApp";

type MockResponseOptions = {
  body?: unknown;
  status?: number;
};

function jsonResponse({ body, status = 200 }: MockResponseOptions = {}) {
  return new Response(body ? JSON.stringify(body) : null, {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function mockFetchSequence(responses: Response[]) {
  const fetchMock = vi.fn();
  responses.forEach((response) => {
    fetchMock.mockResolvedValueOnce(response);
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("auth flow", () => {
  it("transitions into the authenticated shell after a successful login", async () => {
    const fetchMock = mockFetchSequence([
      jsonResponse({
        status: 401,
        body: {
          error: {
            code: "UNAUTHENTICATED",
            message: "Authentication required.",
            details: {},
          },
        },
      }),
      jsonResponse({
        body: {
          user: {
            id: "user-1",
            email: "jane@example.com",
            name: "Jane Doe",
            is_admin: false,
            must_reset_password: false,
          },
          requires_password_reset: false,
        },
      }),
    ]);

    const user = userEvent.setup();
    renderApp(["/login"], { cookie: "csrftoken=test-token; path=/" });
    await user.type(await screen.findByLabelText(/email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/password/i), "Secret123!");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByRole("heading", { name: /session established/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/jane@example.com/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const loginRequestHeaders = new Headers(fetchMock.mock.calls[1]?.[1]?.headers);
    expect(loginRequestHeaders.get("X-CSRFToken")).toBe("test-token");
  });

  it("shows the generic invalid credentials error", async () => {
    mockFetchSequence([
      jsonResponse({
        status: 401,
        body: {
          error: {
            code: "UNAUTHENTICATED",
            message: "Authentication required.",
            details: {},
          },
        },
      }),
      jsonResponse({
        status: 401,
        body: {
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password.",
            details: {},
          },
        },
      }),
    ]);

    const user = userEvent.setup();
    renderApp(["/login"], { cookie: "csrftoken=test-token; path=/" });
    await user.type(await screen.findByLabelText(/email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrong-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText("Invalid email or password."),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /user login/i })).toBeInTheDocument();
  });

  it("boots directly into the authenticated shell when a session already exists", async () => {
    mockFetchSequence([
      jsonResponse({
        body: {
          id: "user-1",
          email: "jane@example.com",
          name: "Jane Doe",
          is_admin: true,
          must_reset_password: false,
        },
      }),
    ]);

    renderApp(["/"]);

    expect(
      await screen.findByRole("heading", { name: /session established/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("routes reset-required users into the reset-required shell state", async () => {
    mockFetchSequence([
      jsonResponse({
        body: {
          id: "user-2",
          email: "temp@example.com",
          name: "Temp User",
          is_admin: false,
          must_reset_password: true,
        },
      }),
    ]);

    renderApp(["/"]);

    expect(
      await screen.findByRole("heading", {
        name: /your temporary password must be replaced/i,
      }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /session established/i }),
      ).not.toBeInTheDocument();
    });
  });
});
