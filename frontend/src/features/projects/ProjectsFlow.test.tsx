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
    {
      const url = String(input);

      if (url === "/api/task-statuses") {
        return jsonResponse({
          body: {
            statuses: workflowMetadataResponse().statuses,
          },
        });
      }

      if (url === "/api/task-status-transitions") {
        return jsonResponse({
          body: {
            transitions: workflowMetadataResponse().transitions,
          },
        });
      }

      if (url === "/api/task-priorities") {
        return jsonResponse({
          body: {
            priorities: workflowMetadataResponse().priorities,
          },
        });
      }

      return handler(url, init);
    },
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
        project_id: "project-1",
        parent_task_id: null,
        title: "Initial task",
        description: "Track the first delivery item.",
        status: {
          id: "status-todo",
          name: "TODO",
          sort_order: 1,
          is_final: false,
          is_active: true,
          color: null,
        },
        priority: {
          id: "priority-high",
          name: "HIGH",
          sort_order: 3,
          is_active: true,
          color: null,
        },
        primary_assignee: {
          id: "user-1",
          name: "Jane Doe",
        },
        collaborators: [],
        is_blocked: false,
        is_overdue: false,
        start_date: "2026-05-01",
        deadline: "2026-05-05",
        version: 1,
        created_at: "2026-05-01T10:00:00Z",
        subtasks: [],
        dependencies: [],
      },
    ]
  );
}

function workflowMetadataResponse() {
  return {
    statuses: [
      {
        id: "status-todo",
        name: "TODO",
        sort_order: 1,
        is_final: false,
        is_active: true,
        color: null,
      },
      {
        id: "status-in-progress",
        name: "IN_PROGRESS",
        sort_order: 2,
        is_final: false,
        is_active: true,
        color: null,
      },
      {
        id: "status-done",
        name: "DONE",
        sort_order: 3,
        is_final: true,
        is_active: false,
        color: null,
      },
    ],
    transitions: [
      {
        id: "transition-1",
        name: "Start work",
        is_active: true,
        from_status_id: "status-todo",
        to_status_id: "status-in-progress",
      },
    ],
    priorities: [
      {
        id: "priority-low",
        name: "LOW",
        sort_order: 1,
        is_active: true,
        color: null,
      },
      {
        id: "priority-high",
        name: "HIGH",
        sort_order: 3,
        is_active: true,
        color: null,
      },
      {
        id: "priority-urgent",
        name: "URGENT",
        sort_order: 4,
        is_active: false,
        color: null,
      },
    ],
  };
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
                ...taskListResponse()[0],
                id: "task-9",
                task_key: "ENG-9",
                status: workflowMetadataResponse().statuses[0],
                priority: null,
                primary_assignee: null,
                start_date: null,
                deadline: null,
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
              ...taskListResponse()[0],
              title: "Implement login",
              description: "Add authentication flow",
              status: workflowMetadataResponse().statuses[0],
              priority: workflowMetadataResponse().priorities[1],
              primary_assignee: {
                id: "user-1",
                name: "Jane Doe",
              },
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
    await user.selectOptions(screen.getByLabelText(/^priority$/i), "priority-high");
    await user.selectOptions(screen.getByLabelText(/primary assignee/i), "user-1");
    await user.type(screen.getByLabelText(/task start date/i), "2026-05-01");
    await user.type(screen.getByLabelText(/task deadline/i), "2026-05-05");
    await user.click(screen.getByRole("button", { name: /create task/i }));

    expect(await screen.findByText(/task created/i)).toBeInTheDocument();
    expect(await screen.findByText("ENG-1")).toBeInTheDocument();
    expect(await screen.findByText("Implement login")).toBeInTheDocument();
    expect((await screen.findAllByText("HIGH")).length).toBeGreaterThan(0);
    const taskCall = fetchMock.mock.calls.find(
      ([requestUrl, requestInit]) =>
        requestUrl === "/api/projects/project-1/tasks" && requestInit?.method === "POST",
    );
    expect(taskCall?.[1]?.body).toBe(
      JSON.stringify({
        title: "Implement login",
        description: "Add authentication flow",
        priority_id: "priority-high",
        start_date: "2026-05-01",
        deadline: "2026-05-05",
        primary_assignee_id: "user-1",
        parent_task_id: null,
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
                ...taskListResponse()[0],
                id: "task-2",
                task_key: "ENG-2",
                title: "Visible task",
                description: null,
                status: workflowMetadataResponse().statuses[0],
                priority: workflowMetadataResponse().priorities[2],
                primary_assignee: null,
                start_date: null,
                deadline: null,
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
    expect(screen.getByText("URGENT (inactive)")).toBeInTheDocument();
  });

  it("loads task detail when a task is selected from the project workspace", async () => {
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
                email: "collaborator@example.com",
                name: "Collaborator One",
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
      if (url === "/api/tasks/task-1") {
        return jsonResponse({
          body: {
            task: {
              ...taskListResponse()[0],
              collaborators: [{ id: "user-2", name: "Collaborator One" }],
              is_overdue: true,
            },
          },
        });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    await user.click(await screen.findByText("Initial task"));

    expect(await screen.findByText(/task detail/i)).toBeInTheDocument();
    expect(await screen.findAllByText("Collaborator One")).toHaveLength(2);
    expect(await screen.findAllByText("Overdue")).toHaveLength(2);
  });

  it("creates a subtask from the project workspace", async () => {
    let currentTasks = taskListResponse();
    let selectedTask = {
      ...currentTasks[0],
      subtasks: [],
    };
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
      if (url === "/api/projects/project-1/members") {
        return jsonResponse({ body: { members: memberListResponse() } });
      }
      if (url === "/api/projects/project-1/tasks" && (!init?.method || init.method === "GET")) {
        return jsonResponse({ body: { tasks: currentTasks } });
      }
      if (url === "/api/tasks/task-1") {
        return jsonResponse({ body: { task: selectedTask } });
      }
      if (url === "/api/projects/project-1/tasks" && init?.method === "POST") {
        const createdTask = {
          ...taskListResponse()[0],
          id: "task-2",
          task_key: "ENG-2",
          parent_task_id: "task-1",
          title: "Subtask alpha",
          subtasks: [],
        };
        currentTasks = [...currentTasks, createdTask];
        selectedTask = {
          ...selectedTask,
          subtasks: [createdTask],
        };
        return jsonResponse({ body: { task: createdTask }, status: 201 });
      }
      if (url === "/api/tasks/task-2") {
        return jsonResponse({
          body: {
            task: {
              ...currentTasks[1],
              subtasks: [],
            },
          },
        });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    await user.click(await screen.findByText("Initial task"));
    const taskTitleInputs = await screen.findAllByLabelText(/task title/i);
    await user.type(taskTitleInputs[0]!, "Subtask alpha");
    await user.selectOptions(screen.getByLabelText(/parent task/i), "task-1");
    await user.click(screen.getByRole("button", { name: /create task/i }));

    expect(await screen.findByText(/task created/i)).toBeInTheDocument();
    expect(await screen.findAllByText("Subtask alpha")).toHaveLength(2);
    const postCall = fetchMock.mock.calls.find(
      ([requestUrl, requestInit]) =>
        requestUrl === "/api/projects/project-1/tasks" && requestInit?.method === "POST",
    );
    expect(postCall?.[1]?.body).toBe(
      JSON.stringify({
        title: "Subtask alpha",
        description: undefined,
        priority_id: null,
        start_date: null,
        deadline: null,
        primary_assignee_id: null,
        parent_task_id: "task-1",
      }),
    );
  });

  it("deletes a parent task with cascade confirmation from task detail", async () => {
    let currentTasks = taskListResponse([
      {
        ...taskListResponse()[0],
        subtasks: [
          {
            ...taskListResponse()[0],
            id: "task-2",
            task_key: "ENG-2",
            parent_task_id: "task-1",
            title: "Nested task",
            subtasks: [],
          },
        ],
      },
      {
        ...taskListResponse()[0],
        id: "task-2",
        task_key: "ENG-2",
        parent_task_id: "task-1",
        title: "Nested task",
        subtasks: [],
      },
    ]);
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
      if (url === "/api/projects/project-1/members") {
        return jsonResponse({ body: { members: memberListResponse() } });
      }
      if (url === "/api/projects/project-1/tasks" && (!init?.method || init.method === "GET")) {
        return jsonResponse({ body: { tasks: currentTasks } });
      }
      if (url === "/api/tasks/task-1" && (!init?.method || init.method === "GET")) {
        return jsonResponse({ body: { task: currentTasks[0] } });
      }
      if (url === "/api/tasks/task-1" && init?.method === "DELETE") {
        currentTasks = [];
        return new Response(null, { status: 204 });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    await user.click(await screen.findByText("Initial task"));
    await user.click(await screen.findByLabelText(/i understand this will also soft-delete all active subtasks/i));
    await user.click(screen.getByRole("button", { name: /delete task/i }));

    expect(await screen.findByText(/task deleted/i)).toBeInTheDocument();
    expect(await screen.findByText(/no project tasks yet/i)).toBeInTheDocument();
    const deleteCall = fetchMock.mock.calls.find(
      ([requestUrl, requestInit]) =>
        requestUrl === "/api/tasks/task-1" && requestInit?.method === "DELETE",
    );
    expect(deleteCall?.[1]?.body).toBe(JSON.stringify({ confirm_cascade_subtasks: true }));
  });

  it("edits task fields and changes task status from the project workspace", async () => {
    let currentTask = {
      ...taskListResponse()[0],
      collaborators: [{ id: "user-2", name: "Collaborator One" }],
    };
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
      if (url === "/api/projects/project-1/members") {
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
                email: "collaborator@example.com",
                name: "Collaborator One",
                is_active: true,
                role: "TEAM_MEMBER",
              },
            ]),
          },
        });
      }
      if (url === "/api/projects/project-1/tasks") {
        return jsonResponse({ body: { tasks: [currentTask] } });
      }
      if (url === "/api/tasks/task-1" && (!init?.method || init.method === "GET")) {
        return jsonResponse({ body: { task: currentTask } });
      }
      if (url === "/api/tasks/task-1" && init?.method === "PATCH") {
        currentTask = {
          ...currentTask,
          title: "Updated task title",
          description: "Updated execution notes",
          version: 2,
        };
        return jsonResponse({ body: { task: currentTask } });
      }
      if (url === "/api/tasks/task-1/status" && init?.method === "POST") {
        currentTask = {
          ...currentTask,
          status: workflowMetadataResponse().statuses[1],
          version: 3,
        };
        return jsonResponse({ body: { task: currentTask } });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    await user.click(await screen.findByText("Initial task"));

    const taskTitleInputs = await screen.findAllByLabelText(/task title/i);
    const taskDescriptionInputs = await screen.findAllByLabelText(/task description/i);
    await user.clear(taskTitleInputs.at(-1)!);
    await user.type(taskTitleInputs.at(-1)!, "Updated task title");
    await user.clear(taskDescriptionInputs.at(-1)!);
    await user.type(taskDescriptionInputs.at(-1)!, "Updated execution notes");
    await user.click(screen.getByRole("button", { name: /save task/i }));

    expect(await screen.findByText(/task updated/i)).toBeInTheDocument();
    expect(screen.getAllByText("Updated task title").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /start work/i }));

    expect(await screen.findByText(/status updated/i)).toBeInTheDocument();
    expect((await screen.findAllByText("IN_PROGRESS")).length).toBeGreaterThan(0);

    const patchCall = fetchMock.mock.calls.find(
      ([requestUrl, requestInit]) =>
        requestUrl === "/api/tasks/task-1" && requestInit?.method === "PATCH",
    );
    expect(patchCall?.[1]?.body).toBe(
      JSON.stringify({
        title: "Updated task title",
        description: "Updated execution notes",
        priority_id: "priority-high",
        start_date: "2026-05-01",
        deadline: "2026-05-05",
        primary_assignee_id: "user-1",
        collaborator_ids: ["user-2"],
        version: 1,
      }),
    );
  });

  it("shows an optimistic-lock conflict message and refreshes task detail", async () => {
    let detailFetchCount = 0;
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
      if (url === "/api/projects/project-1/members") {
        return jsonResponse({ body: { members: memberListResponse() } });
      }
      if (url === "/api/projects/project-1/tasks") {
        return jsonResponse({ body: { tasks: taskListResponse() } });
      }
      if (url === "/api/tasks/task-1" && (!init?.method || init.method === "GET")) {
        detailFetchCount += 1;

        return jsonResponse({
          body: {
            task: {
              ...taskListResponse()[0],
              title: detailFetchCount > 1 ? "Updated on server" : "Initial task",
              version: detailFetchCount > 1 ? 2 : 1,
            },
          },
        });
      }
      if (url === "/api/tasks/task-1" && init?.method === "PATCH") {
        return jsonResponse({
          status: 409,
          body: {
            error: {
              code: "OPTIMISTIC_LOCK_FAILED",
              message: "Task was modified by another user. Please refresh and try again.",
              details: {
                current_version: 2,
              },
            },
          },
        });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    await user.click(await screen.findByText("Initial task"));

    const taskDescriptionInputs = await screen.findAllByLabelText(/task description/i);
    await user.clear(taskDescriptionInputs.at(-1)!);
    await user.type(taskDescriptionInputs.at(-1)!, "Conflicting change");
    await user.click(screen.getByRole("button", { name: /save task/i }));

    expect(
      await screen.findByText(/this task was changed by someone else\. please refresh and try again\./i),
    ).toBeInTheDocument();
    expect(await screen.findByText("Updated on server")).toBeInTheDocument();
  });
});
