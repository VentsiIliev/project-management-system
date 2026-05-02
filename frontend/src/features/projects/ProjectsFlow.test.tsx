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
  it("loads the accessible project list after login and opens a project detail route", async () => {
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
      jsonResponse({
        body: {
          projects: [
            {
              id: "project-1",
              name: "Engineering Platform",
              code: "ENG",
              description: "Internal engineering work",
              owner_id: "owner-1",
              task_counter: 0,
              start_date: "2026-05-01",
              end_date: "2026-06-01",
            },
          ],
        },
      }),
      jsonResponse({
        body: {
          project: {
            id: "project-1",
            name: "Engineering Platform",
            code: "ENG",
            description: "Internal engineering work",
            owner_id: "owner-1",
            task_counter: 0,
            start_date: "2026-05-01",
            end_date: "2026-06-01",
            can_edit: false,
            can_delete: false,
          },
        },
      }),
    ]);

    const user = userEvent.setup();
    renderApp(["/"], { cookie: "csrftoken=test-token; path=/" });

    await user.click(await screen.findByRole("button", { name: /engineering platform/i }));

    expect(await screen.findAllByText("ENG")).toHaveLength(2);
    expect(screen.getByText("Owner ID")).toBeInTheDocument();
    expect(fetchMock.mock.calls[1]?.[0]).toBe("/api/projects");
    expect(fetchMock.mock.calls[2]?.[0]).toBe("/api/projects/project-1");
  });

  it("shows an unavailable state when a project route is not visible to the current account", async () => {
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
        body: {
          projects: [],
        },
      }),
      jsonResponse({
        status: 404,
        body: {
          error: {
            code: "PROJECT_NOT_FOUND",
            message: "Project not found.",
            details: {},
          },
        },
      }),
    ]);

    renderApp(["/projects/missing-project"], { cookie: "csrftoken=test-token; path=/" });

    expect(await screen.findByText(/project unavailable/i)).toBeInTheDocument();
    expect(
      screen.getByText(/not visible to the current account or no longer exists/i),
    ).toBeInTheDocument();
  });

  it("creates a project from the workspace and opens the created project details", async () => {
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
        body: {
          projects: [],
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
            can_edit: true,
            can_delete: true,
          },
        },
      }),
      jsonResponse({
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
            can_edit: true,
            can_delete: true,
          },
        },
      }),
      jsonResponse({
        body: {
          projects: [
            {
              id: "project-1",
              name: "Engineering Platform",
              code: "ENG",
              description: "Internal engineering work",
              owner_id: "user-1",
              task_counter: 0,
              start_date: "2026-05-01",
              end_date: "2026-06-01",
            },
          ],
        },
      }),
      jsonResponse({
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
            can_edit: true,
            can_delete: true,
          },
        },
      }),
      jsonResponse({
        body: {
          projects: [
            {
              id: "project-1",
              name: "Engineering Platform",
              code: "ENG",
              description: "Internal engineering work",
              owner_id: "user-1",
              task_counter: 0,
              start_date: "2026-05-01",
              end_date: "2026-06-01",
            },
          ],
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

    expect(await screen.findByText(/project created/i)).toBeInTheDocument();
    expect(await screen.findByText("Owner ID")).toBeInTheDocument();
    const requestHeaders = new Headers(fetchMock.mock.calls[2]?.[1]?.headers);
    expect(requestHeaders.get("X-CSRFToken")).toBe("test-token");
    expect(fetchMock.mock.calls[2]?.[0]).toBe("/api/projects");
    expect(fetchMock.mock.calls[2]?.[1]?.body).toBe(
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
        body: {
          projects: [],
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

  it("edits a project from the detail workspace without exposing a mutable code field", async () => {
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
        body: {
          projects: [
            {
              id: "project-1",
              name: "Engineering Platform",
              code: "ENG",
              description: "Internal engineering work",
              owner_id: "user-1",
              task_counter: 0,
              start_date: "2026-05-01",
              end_date: "2026-06-01",
            },
          ],
        },
      }),
      jsonResponse({
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
            can_edit: true,
            can_delete: true,
          },
        },
      }),
      jsonResponse({
        body: {
          project: {
            id: "project-1",
            name: "Engineering Platform Updated",
            code: "ENG",
            description: "Updated project description",
            owner_id: "user-1",
            task_counter: 0,
            start_date: "2026-05-04",
            end_date: "2026-06-10",
            can_edit: true,
            can_delete: true,
          },
        },
      }),
    ]);

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    const editStartDateInput = (await screen.findAllByLabelText(/^start date$/i))[0]!;
    const editEndDateInput = (await screen.findAllByLabelText(/^end date$/i))[0]!;
    await user.clear(editStartDateInput);
    await user.type(editStartDateInput, "2026-05-04");
    await user.clear(editEndDateInput);
    await user.type(editEndDateInput, "2026-06-10");
    await user.click(screen.getAllByRole("button", { name: /save changes/i }).at(-1)!);

    expect(await screen.findByText(/project updated/i)).toBeInTheDocument();
    expect(screen.getAllByDisplayValue("ENG")[0]).toHaveAttribute("readonly");
    expect(fetchMock.mock.calls[3]?.[0]).toBe("/api/projects/project-1");
    expect(fetchMock.mock.calls[3]?.[1]?.method).toBe("PATCH");
  });

  it("shows a read-only edit state for project members without edit permission", async () => {
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
        body: {
          projects: [
            {
              id: "project-1",
              name: "Engineering Platform",
              code: "ENG",
              description: "Internal engineering work",
              owner_id: "owner-1",
              task_counter: 0,
              start_date: "2026-05-01",
              end_date: "2026-06-01",
            },
          ],
        },
      }),
      jsonResponse({
        body: {
          project: {
            id: "project-1",
            name: "Engineering Platform",
            code: "ENG",
            description: "Internal engineering work",
            owner_id: "owner-1",
            task_counter: 0,
            start_date: "2026-05-01",
            end_date: "2026-06-01",
            can_edit: false,
            can_delete: false,
          },
        },
      }),
    ]);

    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    expect(await screen.findByText(/read-only access/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /save changes/i })).not.toBeInTheDocument();
  });

  it("requires explicit confirmation before deleting a project", async () => {
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
        body: {
          projects: [
            {
              id: "project-1",
              name: "Engineering Platform",
              code: "ENG",
              description: "Internal engineering work",
              owner_id: "user-1",
              task_counter: 0,
              start_date: "2026-05-01",
              end_date: "2026-06-01",
            },
          ],
        },
      }),
      jsonResponse({
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
            can_edit: true,
            can_delete: true,
          },
        },
      }),
    ]);

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    await user.click(await screen.findByRole("button", { name: /delete project/i }));

    expect(
      await screen.findByText(/project deletion confirmation is required before continuing/i),
    ).toBeInTheDocument();
  });

  it("deletes a project after confirmation and returns to the workspace list", async () => {
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
        body: {
          projects: [
            {
              id: "project-1",
              name: "Engineering Platform",
              code: "ENG",
              description: "Internal engineering work",
              owner_id: "user-1",
              task_counter: 0,
              start_date: "2026-05-01",
              end_date: "2026-06-01",
            },
          ],
        },
      }),
      jsonResponse({
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
            can_edit: true,
            can_delete: true,
          },
        },
      }),
      new Response(null, { status: 204 }),
    ]);

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    await user.click(
      await screen.findByLabelText(
        /i understand this will soft-delete this project and its memberships/i,
      ),
    );
    await user.click(screen.getByRole("button", { name: /delete project/i }));

    expect(await screen.findByText(/no accessible projects yet/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /engineering platform/i })).not.toBeInTheDocument();
    expect(fetchMock.mock.calls[3]?.[0]).toBe("/api/projects/project-1");
    expect(fetchMock.mock.calls[3]?.[1]?.method).toBe("DELETE");
    expect(fetchMock.mock.calls[3]?.[1]?.body).toBe(
      JSON.stringify({ confirm_project_delete: true }),
    );
  });
});
