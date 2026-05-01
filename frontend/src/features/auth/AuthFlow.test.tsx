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
    expect(screen.queryByText(/session expired after inactivity/i)).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const loginRequestHeaders = new Headers(fetchMock.mock.calls[1]?.[1]?.headers);
    expect(loginRequestHeaders.get("X-CSRFToken")).toBe("test-token");
  });

  it("does not show the expired-session notice during an initial unauthenticated bootstrap", async () => {
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
    ]);

    renderApp(["/login"]);

    expect(
      await screen.findByRole("heading", { name: /user login/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/session expired after inactivity/i),
    ).not.toBeInTheDocument();
  });

  it("redirects to the reset-required shell when login returns a forced reset state", async () => {
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
        body: {
          user: {
            id: "user-2",
            email: "temp@example.com",
            name: "Temp User",
            is_admin: false,
            must_reset_password: false,
          },
          requires_password_reset: true,
        },
      }),
    ]);

    const user = userEvent.setup();
    renderApp(["/login"], { cookie: "csrftoken=test-token; path=/" });
    await user.type(await screen.findByLabelText(/email/i), "temp@example.com");
    await user.type(screen.getByLabelText(/password/i), "TempPassword123!");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByRole("heading", {
        name: /your temporary password must be replaced/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/temp user is signed in with/i),
    ).toBeInTheDocument();
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

  it("redirects reset-required users away from the login route", async () => {
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

    renderApp(["/login"]);

    expect(
      await screen.findByRole("heading", {
        name: /your temporary password must be replaced/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /user login/i }),
    ).not.toBeInTheDocument();
  });

  it("logs out from the authenticated shell and returns to the login route", async () => {
    const fetchMock = mockFetchSequence([
      jsonResponse({
        body: {
          id: "user-1",
          email: "jane@example.com",
          name: "Jane Doe",
          is_admin: false,
          must_reset_password: false,
        },
      }),
      new Response(null, { status: 204 }),
    ]);

    const user = userEvent.setup();
    renderApp(["/"], { cookie: "csrftoken=test-token; path=/" });
    await user.click(
      await screen.findByRole("button", {
        name: /sign out/i,
      }),
    );

    expect(
      await screen.findByRole("heading", { name: /user login/i }),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1]?.[0]).toBe("/api/auth/logout");
    const logoutRequestHeaders = new Headers(fetchMock.mock.calls[1]?.[1]?.headers);
    expect(logoutRequestHeaders.get("X-CSRFToken")).toBe("test-token");
  });

  it("returns to login with an expired-session message after a later authenticated request gets 401", async () => {
    mockFetchSequence([
      jsonResponse({
        body: {
          id: "user-1",
          email: "jane@example.com",
          name: "Jane Doe",
          is_admin: false,
          must_reset_password: false,
        },
      }),
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
    ]);

    const user = userEvent.setup();
    renderApp(["/"], { cookie: "csrftoken=test-token; path=/" });
    await user.click(
      await screen.findByRole("button", {
        name: /sign out/i,
      }),
    );

    expect(
      await screen.findByRole("heading", { name: /user login/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/session expired after inactivity\. sign in again to continue\./i),
    ).toBeInTheDocument();
  });

  it("submits a forced password reset and enters the authenticated shell", async () => {
    const fetchMock = mockFetchSequence([
      jsonResponse({
        body: {
          id: "user-2",
          email: "temp@example.com",
          name: "Temp User",
          is_admin: false,
          must_reset_password: true,
        },
      }),
      jsonResponse({
        body: {
          id: "user-2",
          email: "temp@example.com",
          name: "Temp User",
          is_admin: false,
          must_reset_password: false,
        },
      }),
    ]);

    const user = userEvent.setup();
    renderApp(["/reset-password"], { cookie: "csrftoken=test-token; path=/" });
    await user.type(
      await screen.findByLabelText(/^new password$/i),
      "NewPassword123!",
    );
    await user.type(
      screen.getByLabelText(/^confirm new password$/i),
      "NewPassword123!",
    );
    await user.click(screen.getByRole("button", { name: /set new password/i }));

    expect(
      await screen.findByRole("heading", { name: /session established/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: /your temporary password must be replaced/i,
      }),
    ).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1]?.[0]).toBe("/api/auth/force-reset-password");
    const resetRequestHeaders = new Headers(fetchMock.mock.calls[1]?.[1]?.headers);
    expect(resetRequestHeaders.get("X-CSRFToken")).toBe("test-token");
    expect(fetchMock.mock.calls[1]?.[1]?.body).toBe(
      JSON.stringify({ new_password: "NewPassword123!" }),
    );
  });

  it("shows server-side reset validation errors on the form", async () => {
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
      jsonResponse({
        status: 400,
        body: {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input",
            details: {
              new_password: ["This password is too common."],
            },
          },
        },
      }),
    ]);

    const user = userEvent.setup();
    renderApp(["/reset-password"], { cookie: "csrftoken=test-token; path=/" });
    await user.type(
      await screen.findByLabelText(/^new password$/i),
      "CommonPassword123!",
    );
    await user.type(
      screen.getByLabelText(/^confirm new password$/i),
      "CommonPassword123!",
    );
    await user.click(screen.getByRole("button", { name: /set new password/i }));

    expect(
      await screen.findByText("This password is too common."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /your temporary password must be replaced/i,
      }),
    ).toBeInTheDocument();
  });

  it("logs out from the reset-required shell and returns to the login route", async () => {
    const fetchMock = mockFetchSequence([
      jsonResponse({
        body: {
          id: "user-2",
          email: "temp@example.com",
          name: "Temp User",
          is_admin: false,
          must_reset_password: true,
        },
      }),
      new Response(null, { status: 204 }),
    ]);

    const user = userEvent.setup();
    renderApp(["/reset-password"], { cookie: "csrftoken=test-token; path=/" });
    await user.click(
      await screen.findByRole("button", {
        name: /sign out/i,
      }),
    );

    expect(
      await screen.findByRole("heading", { name: /user login/i }),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1]?.[0]).toBe("/api/auth/logout");
  });

  it("keeps reset route guards aligned after the forced reset succeeds", async () => {
    const fetchMock = mockFetchSequence([
      jsonResponse({
        body: {
          id: "user-2",
          email: "temp@example.com",
          name: "Temp User",
          is_admin: false,
          must_reset_password: true,
        },
      }),
      jsonResponse({
        body: {
          id: "user-2",
          email: "temp@example.com",
          name: "Temp User",
          is_admin: false,
          must_reset_password: false,
        },
      }),
    ]);

    const user = userEvent.setup();
    renderApp(["/reset-password"], { cookie: "csrftoken=test-token; path=/" });
    await user.type(
      await screen.findByLabelText(/^new password$/i),
      "AnotherPassword123!",
    );
    await user.type(
      screen.getByLabelText(/^confirm new password$/i),
      "AnotherPassword123!",
    );
    await user.click(screen.getByRole("button", { name: /set new password/i }));

    await screen.findByRole("heading", { name: /session established/i });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: /set a permanent password/i,
        }),
      ).not.toBeInTheDocument();
    });
  });

  it("redirects non-reset users away from the reset-password route", async () => {
    mockFetchSequence([
      jsonResponse({
        body: {
          id: "user-1",
          email: "jane@example.com",
          name: "Jane Doe",
          is_admin: false,
          must_reset_password: false,
        },
      }),
    ]);

    renderApp(["/reset-password"]);

    expect(
      await screen.findByRole("heading", { name: /session established/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: /your temporary password must be replaced/i,
      }),
    ).not.toBeInTheDocument();
  });
});
