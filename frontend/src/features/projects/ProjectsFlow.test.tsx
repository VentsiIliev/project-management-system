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

function stubFetch(
  handler: (url: string, init?: RequestInit) => Response | Promise<Response>,
) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) =>
    handler(String(input), init),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function sessionResponse(overrides?: Partial<Record<string, unknown>>) {
  return {
    id: "user-1",
    email: "jane@example.com",
    name: "Jane Doe",
    is_admin: true,
    must_reset_password: false,
    ...overrides,
  };
}

function projectDetailResponse(overrides?: Partial<Record<string, unknown>>) {
  return {
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
    can_manage_members: true,
    ...overrides,
  };
}

function projectListResponse(overrides?: Partial<Record<string, unknown>>) {
  return [
    {
      id: "project-1",
      name: "Engineering Platform",
      code: "ENG",
      description: "Internal engineering work",
      owner_id: "user-1",
      task_counter: 0,
      start_date: "2026-05-01",
      end_date: "2026-06-01",
      ...overrides,
    },
  ];
}

function memberListResponse(overrides?: Array<Record<string, unknown>>) {
  return (
    overrides ?? [
      {
        user_id: "user-1",
        email: "jane@example.com",
        name: "Jane Doe",
        is_active: true,
        role: "PROJECT_MANAGER",
      },
    ]
  );
}

function taskListResponse(overrides?: Array<Record<string, unknown>>) {
  return (
    overrides ?? [
      {
        id: "task-1",
        task_key: "ENG-1",
        title: "Initial task",
        description: "Track the first delivery item.",
        status: { name: "TODO" },
        primary_assignee: {
          id: "user-1",
          name: "Jane Doe",
        },
        start_date: "2026-05-01",
        deadline: "2026-05-05",
        version: 1,
        created_at: "2026-05-01T10:00:00Z",
      },
    ]
  );
}

describe("projects flow", () => {
  it("loads the accessible project list after login and opens a project detail route", async () => {
    const fetchMock = stubFetch((url) => {
      if (url === "/api/auth/me") {
        return jsonResponse({ body: sessionResponse({ is_admin: false }) });
      }
      if (url === "/api/projects") {
        return jsonResponse({
          body: {
            projects: projectListResponse({ owner_id: "owner-1" }),
          },
        });
      }
      if (url === "/api/projects/project-1") {
        return jsonResponse({
          body: {
            project: projectDetailResponse({
              owner_id: "owner-1",
              can_edit: false,
              can_delete: false,
              can_manage_members: false,
            }),
          },
        });
      }
      if (url === "/api/projects/project-1/members") {
        return jsonResponse({
          body: {
            members: memberListResponse([
              {
                user_id: "owner-1",
                email: "owner@example.com",
                name: "Owner One",
                is_active: true,
                role: "PROJECT_MANAGER",
              },
            ]),
          },
        });
      }
      if (url === "/api/projects/project-1/tasks") {
        return jsonResponse({
          body: {
            tasks: taskListResponse([
              {
                id: "task-9",
                task_key: "ENG-9",
                title: "Initial task",
                description: "Track the first delivery item.",
                status: { name: "TODO" },
                primary_assignee: null,
                start_date: null,
                deadline: null,
                version: 1,
                created_at: "2026-05-01T10:00:00Z",
              },
            ]),
          },
        });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    const user = userEvent.setup();
    renderApp(["/"], { cookie: "csrftoken=test-token; path=/" });

    await user.click(await screen.findByRole("button", { name: /engineering platform/i }));

    expect(await screen.findAllByText("ENG")).toHaveLength(2);
    expect(await screen.findByText("Owner One")).toBeInTheDocument();
    expect(await screen.findByText("Initial task")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/projects/project-1/members", expect.anything());
    expect(fetchMock).toHaveBeenCalledWith("/api/projects/project-1/tasks", expect.anything());
  });

  it("shows an unavailable state when a project route is not visible to the current account", async () => {
    stubFetch((url) => {
      if (url === "/api/auth/me") {
        return jsonResponse({ body: sessionResponse({ is_admin: false }) });
      }
      if (url === "/api/projects") {
        return jsonResponse({ body: { projects: [] } });
      }
      if (url === "/api/projects/missing-project") {
        return jsonResponse({
          status: 404,
          body: {
            error: {
              code: "PROJECT_NOT_FOUND",
              message: "Project not found.",
              details: {},
            },
          },
        });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    renderApp(["/projects/missing-project"], { cookie: "csrftoken=test-token; path=/" });

    expect(await screen.findByText(/project unavailable/i)).toBeInTheDocument();
    expect(
      screen.getByText(/not visible to the current account or no longer exists/i),
    ).toBeInTheDocument();
  });

  it("creates a project from the workspace and opens the created project details", async () => {
    const fetchMock = stubFetch((url, init) => {
      if (url === "/api/auth/me") {
        return jsonResponse({ body: sessionResponse() });
      }
      if (url === "/api/projects" && !init?.method) {
        return jsonResponse({ body: { projects: [] } });
      }
      if (url === "/api/projects" && init?.method === "POST") {
        return jsonResponse({
          status: 201,
          body: {
            project: projectDetailResponse(),
          },
        });
      }
      if (url === "/api/projects/project-1") {
        return jsonResponse({ body: { project: projectDetailResponse() } });
      }
      if (url === "/api/projects/project-1/members") {
        return jsonResponse({ body: { members: memberListResponse() } });
      }
      if (url === "/api/projects/project-1/tasks") {
        return jsonResponse({ body: { tasks: [] } });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    const user = userEvent.setup();
    renderApp(["/"], { cookie: "csrftoken=test-token; path=/" });

    await user.type(await screen.findByLabelText(/project name/i), "Engineering Platform");
    await user.type(screen.getByLabelText(/project code/i), "eng");
    await user.type(screen.getByLabelText(/^description$/i), "Internal engineering work");
    await user.type(screen.getByLabelText(/^start date$/i), "2026-05-01");
    await user.type(screen.getByLabelText(/^end date$/i), "2026-06-01");
    await user.click(screen.getByRole("button", { name: /create project/i }));

    expect(await screen.findByText(/project created/i)).toBeInTheDocument();
    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();

    const createCall = fetchMock.mock.calls.find(
      ([requestUrl, requestInit]) =>
        requestUrl === "/api/projects" && requestInit?.method === "POST",
    );
    const requestHeaders = new Headers(createCall?.[1]?.headers);
    expect(requestHeaders.get("X-CSRFToken")).toBe("test-token");
    expect(createCall?.[1]?.body).toBe(
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
    stubFetch((url, init) => {
      if (url === "/api/auth/me") {
        return jsonResponse({ body: sessionResponse() });
      }
      if (url === "/api/projects" && !init?.method) {
        return jsonResponse({ body: { projects: [] } });
      }
      if (url === "/api/projects" && init?.method === "POST") {
        return jsonResponse({
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
        });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

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
    const fetchMock = stubFetch((url, init) => {
      if (url === "/api/auth/me") {
        return jsonResponse({ body: sessionResponse() });
      }
      if (url === "/api/projects") {
        return jsonResponse({ body: { projects: projectListResponse() } });
      }
      if (url === "/api/projects/project-1" && (!init?.method || init.method === "GET")) {
        return jsonResponse({ body: { project: projectDetailResponse() } });
      }
      if (url === "/api/projects/project-1/members") {
        return jsonResponse({ body: { members: memberListResponse() } });
      }
      if (url === "/api/projects/project-1/tasks") {
        return jsonResponse({ body: { tasks: taskListResponse() } });
      }
      if (url === "/api/projects/project-1" && init?.method === "PATCH") {
        return jsonResponse({
          body: {
            project: projectDetailResponse({
              name: "Engineering Platform Updated",
              description: "Updated project description",
              start_date: "2026-05-04",
              end_date: "2026-06-10",
            }),
          },
        });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

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
    const patchCall = fetchMock.mock.calls.find(
      ([requestUrl, requestInit]) =>
        requestUrl === "/api/projects/project-1" && requestInit?.method === "PATCH",
    );
    expect(patchCall).toBeTruthy();
  });

  it("shows a read-only member-management state for project members without permission", async () => {
    stubFetch((url) => {
      if (url === "/api/auth/me") {
        return jsonResponse({
          body: sessionResponse({
            id: "user-2",
            email: "member@example.com",
            name: "Team Member",
            is_admin: false,
          }),
        });
      }
      if (url === "/api/projects") {
        return jsonResponse({
          body: {
            projects: projectListResponse({ owner_id: "owner-1" }),
          },
        });
      }
      if (url === "/api/projects/project-1") {
        return jsonResponse({
          body: {
            project: projectDetailResponse({
              owner_id: "owner-1",
              can_edit: false,
              can_delete: false,
              can_manage_members: false,
            }),
          },
        });
      }
      if (url === "/api/projects/project-1/members") {
        return jsonResponse({
          body: {
            members: [
              {
                user_id: "owner-1",
                email: "owner@example.com",
                name: "Owner One",
                is_active: true,
                role: "PROJECT_MANAGER",
              },
              {
                user_id: "user-2",
                email: "member@example.com",
                name: "Team Member",
                is_active: true,
                role: "TEAM_MEMBER",
              },
            ],
          },
        });
      }
      if (url === "/api/projects/project-1/tasks") {
        return jsonResponse({ body: { tasks: taskListResponse() } });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    expect(await screen.findByText(/member changes are restricted/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /add member/i })).not.toBeInTheDocument();
  });

  it("creates a project task from the workspace and updates the visible task list", async () => {
    const fetchMock = stubFetch((url, init) => {
      if (url === "/api/auth/me") {
        return jsonResponse({ body: sessionResponse() });
      }
      if (url === "/api/projects") {
        return jsonResponse({ body: { projects: projectListResponse() } });
      }
      if (url === "/api/projects/project-1" && (!init?.method || init.method === "GET")) {
        return jsonResponse({ body: { project: projectDetailResponse() } });
      }
      if (url === "/api/projects/project-1/members") {
        return jsonResponse({ body: { members: memberListResponse() } });
      }
      if (url === "/api/projects/project-1/tasks" && (!init?.method || init.method === "GET")) {
        return jsonResponse({ body: { tasks: [] } });
      }
      if (url === "/api/projects/project-1/tasks" && init?.method === "POST") {
        return jsonResponse({
          status: 201,
          body: {
            task: {
              id: "task-1",
              task_key: "ENG-1",
              title: "Implement login",
              description: "Add authentication flow",
              status: { name: "TODO" },
              primary_assignee: {
                id: "user-1",
                name: "Jane Doe",
              },
              start_date: "2026-05-01",
              deadline: "2026-05-05",
              version: 1,
              created_at: "2026-05-01T10:00:00Z",
            },
          },
        });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    await user.type(await screen.findByLabelText(/task title/i), "Implement login");
    await user.type(screen.getByLabelText(/task description/i), "Add authentication flow");
    await user.selectOptions(screen.getByLabelText(/primary assignee/i), "user-1");
    await user.type(screen.getByLabelText(/task start date/i), "2026-05-01");
    await user.type(screen.getByLabelText(/task deadline/i), "2026-05-05");
    await user.click(screen.getByRole("button", { name: /create task/i }));

    expect(await screen.findByText(/task created/i)).toBeInTheDocument();
    expect(await screen.findByText("ENG-1")).toBeInTheDocument();
    expect(await screen.findByText("Implement login")).toBeInTheDocument();
    const taskCall = fetchMock.mock.calls.find(
      ([requestUrl, requestInit]) =>
        requestUrl === "/api/projects/project-1/tasks" && requestInit?.method === "POST",
    );
    expect(taskCall?.[1]?.body).toBe(
      JSON.stringify({
        title: "Implement login",
        description: "Add authentication flow",
        start_date: "2026-05-01",
        deadline: "2026-05-05",
        primary_assignee_id: "user-1",
      }),
    );
  });

  it("adds a project member from the workspace and updates the visible member list", async () => {
    const fetchMock = stubFetch((url, init) => {
      if (url === "/api/auth/me") {
        return jsonResponse({ body: sessionResponse() });
      }
      if (url === "/api/projects") {
        return jsonResponse({ body: { projects: projectListResponse() } });
      }
      if (url === "/api/projects/project-1") {
        return jsonResponse({ body: { project: projectDetailResponse() } });
      }
      if (url === "/api/projects/project-1/members" && (!init?.method || init.method === "GET")) {
        return jsonResponse({ body: { members: memberListResponse() } });
      }
      if (url === "/api/projects/project-1/members" && init?.method === "POST") {
        return jsonResponse({
          status: 201,
          body: {
            member: {
              user_id: "user-9",
              email: "new.member@example.com",
              name: "New Member",
              is_active: true,
              role: "TEAM_MEMBER",
            },
          },
        });
      }
      if (url === "/api/projects/project-1/tasks") {
        return jsonResponse({ body: { tasks: taskListResponse() } });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    await user.type(await screen.findByLabelText(/^user id$/i), "d2fe2a4c-6910-4c2b-bcdf-4d1cd03a9999");
    await user.selectOptions(screen.getByLabelText(/project role/i), "TEAM_MEMBER");
    await user.click(screen.getByRole("button", { name: /add member/i }));

    expect(await screen.findByText(/member added/i)).toBeInTheDocument();
    expect(await screen.findByText("New Member")).toBeInTheDocument();
    const addCall = fetchMock.mock.calls.find(
      ([requestUrl, requestInit]) =>
        requestUrl === "/api/projects/project-1/members" && requestInit?.method === "POST",
    );
    expect(addCall?.[1]?.body).toBe(
      JSON.stringify({
        user_id: "d2fe2a4c-6910-4c2b-bcdf-4d1cd03a9999",
        role: "TEAM_MEMBER",
      }),
    );
  });

  it("removes member-management controls after the current user downgrades their own role", async () => {
    let currentRole = "PROJECT_MANAGER";
    const fetchMock = stubFetch((url, init) => {
      if (url === "/api/auth/me") {
        return jsonResponse({
          body: sessionResponse({ is_admin: false }),
        });
      }
      if (url === "/api/projects") {
        return jsonResponse({ body: { projects: projectListResponse() } });
      }
      if (url === "/api/projects/project-1") {
        return jsonResponse({
          body: {
            project: projectDetailResponse({
              can_edit: currentRole === "PROJECT_MANAGER",
              can_delete: currentRole === "PROJECT_MANAGER",
              can_manage_members: currentRole === "PROJECT_MANAGER",
            }),
          },
        });
      }
      if (url === "/api/projects/project-1/members" && (!init?.method || init.method === "GET")) {
        return jsonResponse({
          body: {
            members: memberListResponse([
              {
                user_id: "user-1",
                email: "jane@example.com",
                name: "Jane Doe",
                is_active: true,
                role: currentRole,
              },
              {
                user_id: "user-2",
                email: "member@example.com",
                name: "Member Two",
                is_active: true,
                role: "TEAM_MEMBER",
              },
            ]),
          },
        });
      }
      if (url === "/api/projects/project-1/tasks") {
        return jsonResponse({ body: { tasks: taskListResponse() } });
      }
      if (url === "/api/projects/project-1/members/user-1" && init?.method === "PATCH") {
        currentRole = "TEAM_MEMBER";
        return jsonResponse({
          body: {
            member: {
              user_id: "user-1",
              email: "jane@example.com",
              name: "Jane Doe",
              is_active: true,
              role: "TEAM_MEMBER",
            },
          },
        });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    await user.selectOptions(await screen.findByDisplayValue("PROJECT_MANAGER"), "TEAM_MEMBER");
    await user.click(screen.getAllByRole("button", { name: /save role/i })[0]!);

    expect(await screen.findByText(/member changes are restricted/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /add member/i })).not.toBeInTheDocument();
    const patchCall = fetchMock.mock.calls.find(
      ([requestUrl, requestInit]) =>
        requestUrl === "/api/projects/project-1/members/user-1" &&
        requestInit?.method === "PATCH",
    );
    expect(patchCall?.[1]?.body).toBe(JSON.stringify({ role: "TEAM_MEMBER" }));
  });

  it("redirects to the workspace root when the current user removes their own membership", async () => {
    let removed = false;
    const fetchMock = stubFetch((url, init) => {
      if (url === "/api/auth/me") {
        return jsonResponse({
          body: sessionResponse({ is_admin: false }),
        });
      }
      if (url === "/api/projects") {
        return jsonResponse({
          body: {
            projects: removed ? [] : projectListResponse(),
          },
        });
      }
      if (url === "/api/projects/project-1") {
        return jsonResponse({
          status: removed ? 404 : 200,
          body: removed
            ? {
                error: {
                  code: "PROJECT_NOT_FOUND",
                  message: "Project not found.",
                  details: {},
                },
              }
            : {
                project: projectDetailResponse({
                  can_edit: true,
                  can_delete: true,
                  can_manage_members: true,
                }),
              },
        });
      }
      if (url === "/api/projects/project-1/members" && (!init?.method || init.method === "GET")) {
        return jsonResponse({
          body: {
            members: memberListResponse([
              {
                user_id: "user-1",
                email: "jane@example.com",
                name: "Jane Doe",
                is_active: true,
                role: "PROJECT_MANAGER",
              },
              {
                user_id: "user-2",
                email: "member@example.com",
                name: "Member Two",
                is_active: true,
                role: "TEAM_MEMBER",
              },
            ]),
          },
        });
      }
      if (url === "/api/projects/project-1/tasks") {
        return jsonResponse({ body: { tasks: taskListResponse() } });
      }
      if (url === "/api/projects/project-1/members/user-1" && init?.method === "DELETE") {
        removed = true;
        return new Response(null, { status: 204 });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    await user.click((await screen.findAllByRole("button", { name: /remove member/i }))[0]!);

    await waitFor(() =>
      expect(screen.getByText(/no accessible projects yet/i)).toBeInTheDocument(),
    );
    expect(screen.queryByRole("button", { name: /engineering platform/i })).not.toBeInTheDocument();
    const deleteCall = fetchMock.mock.calls.find(
      ([requestUrl, requestInit]) =>
        requestUrl === "/api/projects/project-1/members/user-1" &&
        requestInit?.method === "DELETE",
    );
    expect(deleteCall).toBeTruthy();
  });

  it("requires explicit confirmation before deleting a project", async () => {
    stubFetch((url) => {
      if (url === "/api/auth/me") {
        return jsonResponse({ body: sessionResponse() });
      }
      if (url === "/api/projects") {
        return jsonResponse({ body: { projects: projectListResponse() } });
      }
      if (url === "/api/projects/project-1") {
        return jsonResponse({ body: { project: projectDetailResponse() } });
      }
      if (url === "/api/projects/project-1/members") {
        return jsonResponse({ body: { members: memberListResponse() } });
      }
      if (url === "/api/projects/project-1/tasks") {
        return jsonResponse({ body: { tasks: taskListResponse() } });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    await user.click(await screen.findByRole("button", { name: /delete project/i }));

    expect(
      await screen.findByText(/project deletion confirmation is required before continuing/i),
    ).toBeInTheDocument();
  });

  it("deletes a project after confirmation and returns to the workspace list", async () => {
    let deleteSeen = false;
    const fetchMock = stubFetch((url, init) => {
      if (url === "/api/auth/me") {
        return jsonResponse({ body: sessionResponse() });
      }
      if (url === "/api/projects") {
        return jsonResponse({
          body: {
            projects:
              deleteSeen && !init?.method
                ? []
                : projectListResponse(),
          },
        });
      }
      if (url === "/api/projects/project-1") {
        return jsonResponse({ body: { project: projectDetailResponse() } });
      }
      if (url === "/api/projects/project-1/members") {
        return jsonResponse({ body: { members: memberListResponse() } });
      }
      if (url === "/api/projects/project-1/tasks") {
        return jsonResponse({ body: { tasks: taskListResponse() } });
      }
      if (url === "/api/projects/project-1" && init?.method === "DELETE") {
        deleteSeen = true;
        return new Response(null, { status: 204 });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    await user.click(
      await screen.findByLabelText(
        /i understand this will soft-delete this project and its memberships/i,
      ),
    );
    await user.click(screen.getByRole("button", { name: /delete project/i }));

    await waitFor(() =>
      expect(screen.getByText(/no accessible projects yet/i)).toBeInTheDocument(),
    );
    expect(screen.queryByRole("button", { name: /engineering platform/i })).not.toBeInTheDocument();
    const deleteCall = fetchMock.mock.calls.find(
      ([requestUrl, requestInit]) =>
        requestUrl === "/api/projects/project-1" && requestInit?.method === "DELETE",
    );
    expect(deleteCall?.[1]?.body).toBe(JSON.stringify({ confirm_project_delete: true }));
  });

  it("shows task creation as restricted for team members while still listing project tasks", async () => {
    stubFetch((url) => {
      if (url === "/api/auth/me") {
        return jsonResponse({
          body: sessionResponse({
            id: "user-2",
            email: "member@example.com",
            name: "Team Member",
            is_admin: false,
          }),
        });
      }
      if (url === "/api/projects") {
        return jsonResponse({
          body: {
            projects: projectListResponse({ owner_id: "owner-1" }),
          },
        });
      }
      if (url === "/api/projects/project-1") {
        return jsonResponse({
          body: {
            project: projectDetailResponse({
              owner_id: "owner-1",
              can_edit: false,
              can_delete: false,
              can_manage_members: false,
            }),
          },
        });
      }
      if (url === "/api/projects/project-1/members") {
        return jsonResponse({
          body: {
            members: [
              {
                user_id: "owner-1",
                email: "owner@example.com",
                name: "Owner One",
                is_active: true,
                role: "PROJECT_MANAGER",
              },
              {
                user_id: "user-2",
                email: "member@example.com",
                name: "Team Member",
                is_active: true,
                role: "TEAM_MEMBER",
              },
            ],
          },
        });
      }
      if (url === "/api/projects/project-1/tasks") {
        return jsonResponse({
          body: {
            tasks: taskListResponse([
              {
                id: "task-2",
                task_key: "ENG-2",
                title: "Visible task",
                description: null,
                status: { name: "TODO" },
                primary_assignee: null,
                start_date: null,
                deadline: null,
                version: 1,
                created_at: "2026-05-01T10:00:00Z",
              },
            ]),
          },
        });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    expect(await screen.findByText(/task creation is restricted/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /create task/i })).not.toBeInTheDocument();
    expect(screen.getByText("Visible task")).toBeInTheDocument();
  });
});
