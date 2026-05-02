import { screen } from "@testing-library/react";
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

describe("projects flow", () => {
  it("creates a project from the protected shell and renders the returned project details", async () => {
    const fetchMock = mockFetchSequence([
      jsonResponse({
        body: {
          id: "user-1",
          email: "jane@example.com",
          name: "Jane Doe",
          is_admin: true,
          must_reset_password: false,
        },
      }),
      jsonResponse({
        status: 201,
        body: {
          project: {
            id: "project-1",
            name: "Engineering Platform",
            code: "ENG",
            description: "Internal engineering work",
            owner_id: "user-1",
            task_counter: 0,
            start_date: "2026-05-01",
            end_date: "2026-06-01",
          },
        },
      }),
    ]);

    const user = userEvent.setup();
    renderApp(["/"], { cookie: "csrftoken=test-token; path=/" });

    await user.type(await screen.findByLabelText(/project name/i), "Engineering Platform");
    await user.type(screen.getByLabelText(/project code/i), "eng");
    await user.type(screen.getByLabelText(/description/i), "Internal engineering work");
    await user.type(screen.getByLabelText(/start date/i), "2026-05-01");
    await user.type(screen.getByLabelText(/end date/i), "2026-06-01");
    await user.click(screen.getByRole("button", { name: /create project/i }));

    expect(await screen.findByText("ENG")).toBeInTheDocument();
    expect(screen.getByText(/engineering platform/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1]?.[0]).toBe("/api/projects");
    const requestHeaders = new Headers(fetchMock.mock.calls[1]?.[1]?.headers);
    expect(requestHeaders.get("X-CSRFToken")).toBe("test-token");
    expect(fetchMock.mock.calls[1]?.[1]?.body).toBe(
      JSON.stringify({
        name: "Engineering Platform",
        code: "ENG",
        description: "Internal engineering work",
        start_date: "2026-05-01",
        end_date: "2026-06-01",
      }),
    );
  });

  it("shows server-side validation feedback when the backend rejects a duplicate code", async () => {
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
      jsonResponse({
        status: 400,
        body: {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input",
            details: {
              code: ["A project with this code already exists."],
            },
          },
        },
      }),
    ]);

    const user = userEvent.setup();
    renderApp(["/"], { cookie: "csrftoken=test-token; path=/" });

    await user.type(await screen.findByLabelText(/project name/i), "Engineering Platform");
    await user.type(screen.getByLabelText(/project code/i), "eng");
    await user.click(screen.getByRole("button", { name: /create project/i }));

    expect(
      await screen.findByText("A project with this code already exists."),
    ).toBeInTheDocument();
  });

  it("shows permission feedback when the backend denies project creation", async () => {
    mockFetchSequence([
      jsonResponse({
        body: {
          id: "user-2",
          email: "member@example.com",
          name: "Team Member",
          is_admin: false,
          must_reset_password: false,
        },
      }),
      jsonResponse({
        status: 403,
        body: {
          error: {
            code: "PROJECT_PERMISSION_DENIED",
            message: "You do not have permission to create projects.",
            details: {},
          },
        },
      }),
    ]);

    const user = userEvent.setup();
    renderApp(["/"], { cookie: "csrftoken=test-token; path=/" });

    await user.type(await screen.findByLabelText(/project name/i), "Blocked Project");
    await user.type(screen.getByLabelText(/project code/i), "blk");
    await user.click(screen.getByRole("button", { name: /create project/i }));

    expect(
      await screen.findByText("You do not have permission to create projects."),
    ).toBeInTheDocument();
  });
});
