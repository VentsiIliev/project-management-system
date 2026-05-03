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

      if (/^\/api\/projects\/[^/]+\/activity$/.test(url)) {
        return jsonResponse({
          body: {
            activity: [],
          },
        });
      }

      if (/^\/api\/tasks\/[^/]+\/activity$/.test(url)) {
        return jsonResponse({
          body: {
            activity: [],
          },
        });
      }

      if (/^\/api\/tasks\/[^/]+\/comments(?:\?.*)?$/.test(url)) {
        return jsonResponse({
          body: {
            comments: [],
          },
        });
      }

      if (url === "/api/tasks") {
        return jsonResponse({
          body: {
            tasks: [],
            pagination: {
              page: 1,
              page_size: 10,
              total_count: 0,
              total_pages: 1,
              has_next: false,
              has_previous: false,
            },
          },
        });
      }

      if (/^\/api\/notifications(?:\?.*)?$/.test(url)) {
        return jsonResponse({
          body: {
            notifications: [],
            pagination: {
              page: 1,
              page_size: 10,
              total_count: 0,
              total_pages: 1,
              has_next: false,
              has_previous: false,
            },
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

function commentListResponse(overrides?: Array<Record<string, unknown>>) {
  return (
    overrides ?? [
      {
        id: "comment-1",
        task_id: "task-1",
        author: {
          id: "user-2",
          name: "Alex Smith",
        },
        content: "Initial comment",
        created_at: "2026-05-03T10:00:00Z",
      },
    ]
  );
}

function notificationListResponse(overrides?: Array<Record<string, unknown>>) {
  return (
    overrides ?? [
      {
        id: "notification-1",
        event_type: "TASK_UPDATED",
        message: "Jane Doe updated ENG-1.",
        is_read: false,
        read_at: null,
        metadata: {
          task_id: "task-1",
        },
        created_at: "2026-05-03T12:00:00Z",
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
    expect((await screen.findAllByText("Owner One")).length).toBeGreaterThan(0);
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
    let currentTasks: Array<Record<string, unknown>> = [];
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
        return jsonResponse({ body: { tasks: currentTasks } });
      }
      if (url === "/api/projects/project-1/tasks" && init?.method === "POST") {
        const createdTask = {
          ...taskListResponse()[0],
          title: "Implement login",
          description: "Add authentication flow",
          status: workflowMetadataResponse().statuses[0],
          priority: workflowMetadataResponse().priorities[1],
          primary_assignee: {
            id: "user-1",
            name: "Jane Doe",
          },
        };
        currentTasks = [createdTask];
        return jsonResponse({
          status: 201,
          body: {
            task: createdTask,
          },
        });
      }
      if (url === "/api/tasks/task-1") {
        return jsonResponse({ body: { task: currentTasks[0] } });
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
    expect((await screen.findAllByText("Implement login")).length).toBeGreaterThan(1);
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

  it("searches, filters, and paginates project tasks from the workspace", async () => {
    const todoStatus = workflowMetadataResponse().statuses[0]!;
    const highPriority = workflowMetadataResponse().priorities[1]!;
    const fetchMock = stubFetch((url) => {
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
      if (url.startsWith("/api/projects/project-1/tasks")) {
        const requestUrl = new URL(`http://localhost${url}`);
        const search = requestUrl.searchParams.get("search");
        const page = requestUrl.searchParams.get("page");

        if (search === "API") {
          expect(requestUrl.searchParams.get("status_id")).toBe("status-todo");
          expect(requestUrl.searchParams.get("priority_id")).toBe("priority-high");
          expect(requestUrl.searchParams.get("assignee_id")).toBe("user-1");
          expect(requestUrl.searchParams.get("deadline_from")).toBe("2026-05-01");
          expect(requestUrl.searchParams.get("deadline_to")).toBe("2026-05-06");
          expect(requestUrl.searchParams.get("is_blocked")).toBe("true");

          return jsonResponse({
            body: {
              tasks: [
                {
                  ...taskListResponse()[0],
                  title: "API blocker",
                  is_blocked: true,
                  status: todoStatus,
                  priority: highPriority,
                },
              ],
              pagination: {
                page: 1,
                page_size: 10,
                total_count: 1,
                total_pages: 1,
                has_next: false,
                has_previous: false,
              },
            },
          });
        }

        if (page === "2") {
          return jsonResponse({
            body: {
              tasks: [
                {
                  ...taskListResponse()[0],
                  id: "task-2",
                  task_key: "ENG-2",
                  title: "Later task",
                },
              ],
              pagination: {
                page: 2,
                page_size: 10,
                total_count: 2,
                total_pages: 2,
                has_next: false,
                has_previous: true,
              },
            },
          });
        }

        return jsonResponse({
          body: {
            tasks: taskListResponse(),
            pagination: {
              page: 1,
              page_size: 10,
              total_count: 2,
              total_pages: 2,
              has_next: true,
              has_previous: false,
            },
          },
        });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    expect(await screen.findByText("Initial task")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /next task page/i }));
    expect(await screen.findByText("Later task")).toBeInTheDocument();

    await user.clear(screen.getByLabelText(/search project tasks/i));
    await user.type(screen.getByLabelText(/search project tasks/i), "API");
    await user.selectOptions(screen.getByLabelText(/status filter/i), "status-todo");
    await user.selectOptions(screen.getByLabelText(/priority filter/i), "priority-high");
    await user.selectOptions(screen.getByLabelText(/assignee filter/i), "user-1");
    await user.type(screen.getByLabelText(/deadline from/i), "2026-05-01");
    await user.type(screen.getByLabelText(/deadline to/i), "2026-05-06");
    await user.click(screen.getByLabelText(/only blocked tasks/i));
    await user.click(screen.getByRole("button", { name: /apply task filters/i }));

    expect(await screen.findByText("API blocker")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/projects/project-1/tasks?"),
      expect.anything(),
    );
  });

  it("renders My Tasks and expands to collaborator work sorted by priority", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

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
      if (url === "/api/projects/project-1/activity") {
        return jsonResponse({ body: { activity: [] } });
      }
      if (url === "/api/task-statuses") {
        return jsonResponse({ body: { statuses: workflowMetadataResponse().statuses } });
      }
      if (url === "/api/task-status-transitions") {
        return jsonResponse({ body: { transitions: workflowMetadataResponse().transitions } });
      }
      if (url === "/api/task-priorities") {
        return jsonResponse({ body: { priorities: workflowMetadataResponse().priorities } });
      }
      if (url === "/api/notifications?page=1&page_size=10") {
        return jsonResponse({
          body: {
            notifications: [],
            pagination: {
              page: 1,
              page_size: 10,
              total_count: 0,
              total_pages: 1,
              has_next: false,
              has_previous: false,
            },
          },
        });
      }
      if (url === "/api/tasks") {
        return jsonResponse({
          body: {
            tasks: [
              {
                ...taskListResponse()[0],
                title: "Assigned low",
                priority: workflowMetadataResponse().priorities[0],
                is_overdue: true,
              },
            ],
            pagination: {
              page: 1,
              page_size: 10,
              total_count: 1,
              total_pages: 1,
              has_next: false,
              has_previous: false,
            },
          },
        });
      }
      if (url === "/api/tasks?sort_by=priority") {
        return jsonResponse({
          body: {
            tasks: [
              {
                ...taskListResponse()[0],
                title: "Assigned low",
                priority: workflowMetadataResponse().priorities[0],
                is_overdue: true,
              },
            ],
            pagination: {
              page: 1,
              page_size: 10,
              total_count: 1,
              total_pages: 1,
              has_next: false,
              has_previous: false,
            },
          },
        });
      }
      if (url === "/api/tasks?include_collaborator_tasks=true&sort_by=priority") {
        return jsonResponse({
          body: {
            tasks: [
              {
                ...taskListResponse()[0],
                id: "task-2",
                task_key: "ENG-2",
                title: "Collaborator urgent",
                priority: workflowMetadataResponse().priorities[2],
                is_blocked: true,
              },
              {
                ...taskListResponse()[0],
                title: "Assigned low",
                priority: workflowMetadataResponse().priorities[0],
                is_overdue: true,
              },
            ],
            pagination: {
              page: 1,
              page_size: 10,
              total_count: 2,
              total_pages: 1,
              has_next: false,
              has_previous: false,
            },
          },
        });
      }

      throw new Error(`Unexpected request: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    expect(await screen.findByText("Assigned low")).toBeInTheDocument();
    expect((await screen.findAllByText("Overdue")).length).toBeGreaterThan(0);

    await user.selectOptions(screen.getByLabelText(/sort my tasks by/i), "priority");
    await user.click(screen.getByLabelText(/include collaborator tasks/i));

    expect(await screen.findByText("Collaborator urgent")).toBeInTheDocument();
    expect((await screen.findAllByText("Blocked")).length).toBeGreaterThan(0);
    expect(fetchMock).toHaveBeenCalledWith("/api/tasks?include_collaborator_tasks=true&sort_by=priority", expect.anything());
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
    expect((await screen.findAllByText("New Member")).length).toBeGreaterThan(0);
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
    expect((await screen.findAllByText("Collaborator One")).length).toBeGreaterThan(1);
    expect(await screen.findAllByText("Overdue")).toHaveLength(2);
  });

  it("renders project and task activity from the activity endpoints", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);

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
        if (url === "/api/tasks") {
          return jsonResponse({
            body: {
              tasks: [],
              pagination: {
                page: 1,
                page_size: 10,
                total_count: 0,
                total_pages: 1,
                has_next: false,
                has_previous: false,
              },
            },
          });
        }
        if (url === "/api/notifications?page=1&page_size=10") {
          return jsonResponse({
            body: {
              notifications: [],
              pagination: {
                page: 1,
                page_size: 10,
                total_count: 0,
                total_pages: 1,
                has_next: false,
                has_previous: false,
              },
            },
          });
        }
        if (url === "/api/projects/project-1/tasks") {
          return jsonResponse({ body: { tasks: taskListResponse() } });
        }
        if (url === "/api/projects/project-1/activity") {
          return jsonResponse({
            body: {
              activity: [
                {
                  id: "activity-project-1",
                  event_type: "TASK_CREATED",
                  message: "Jane Doe created ENG-1 Initial task.",
                  actor_name: "Jane Doe",
                  project_code: "ENG",
                  project_name: "Engineering Platform",
                  task_key: "ENG-1",
                  task_title: "Initial task",
                  related_user_name: null,
                  metadata: {},
                  created_at: "2026-05-03T10:00:00Z",
                },
              ],
            },
          });
        }
        if (url === "/api/tasks/task-1") {
          return jsonResponse({ body: { task: taskListResponse()[0] } });
        }
        if (url === "/api/tasks/task-1/comments") {
          return jsonResponse({ body: { comments: [] } });
        }
        if (url === "/api/tasks/task-1/activity") {
          return jsonResponse({
            body: {
              activity: [
                {
                  id: "activity-task-1",
                  event_type: "TASK_STATUS_CHANGED",
                  message: "Jane Doe changed ENG-1 from TODO to IN_PROGRESS.",
                  actor_name: "Jane Doe",
                  project_code: "ENG",
                  project_name: "Engineering Platform",
                  task_key: "ENG-1",
                  task_title: "Initial task",
                  related_user_name: null,
                  metadata: {
                    from_status: "TODO",
                    to_status: "IN_PROGRESS",
                  },
                  created_at: "2026-05-03T11:00:00Z",
                },
              ],
            },
          });
        }
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

        throw new Error(`Unexpected request: ${url}`);
      }),
    );

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    expect(await screen.findByRole("heading", { name: /project activity/i })).toBeInTheDocument();
    expect(await screen.findByText("Jane Doe created ENG-1 Initial task.")).toBeInTheDocument();

    const taskTitle = await screen.findByText("Initial task");
    const taskButton = taskTitle.closest("button");

    expect(taskButton).not.toBeNull();

    await user.click(taskButton!);

    expect(await screen.findByRole("heading", { name: /task activity/i })).toBeInTheDocument();
    expect(
      await screen.findByText("Jane Doe changed ENG-1 from TODO to IN_PROGRESS."),
    ).toBeInTheDocument();
  });

  it("renders notifications and lets the user mark one or all as read", async () => {
    let currentNotifications = notificationListResponse([
      notificationListResponse()[0],
      {
        id: "notification-2",
        event_type: "COMMENT_CREATED",
        message: "Alex Smith commented on ENG-1.",
        is_read: false,
        read_at: null,
        metadata: {
          task_id: "task-1",
        },
        created_at: "2026-05-03T11:00:00Z",
      },
    ]);

    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);

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
        if (url === "/api/tasks") {
          return jsonResponse({
            body: {
              tasks: [],
              pagination: {
                page: 1,
                page_size: 10,
                total_count: 0,
                total_pages: 1,
                has_next: false,
                has_previous: false,
              },
            },
          });
        }
        if (url === "/api/projects/project-1/tasks") {
          return jsonResponse({ body: { tasks: taskListResponse() } });
        }
        if (url === "/api/projects/project-1/activity") {
          return jsonResponse({ body: { activity: [] } });
        }
        if (url === "/api/task-statuses") {
          return jsonResponse({ body: { statuses: workflowMetadataResponse().statuses } });
        }
        if (url === "/api/task-status-transitions") {
          return jsonResponse({ body: { transitions: workflowMetadataResponse().transitions } });
        }
        if (url === "/api/task-priorities") {
          return jsonResponse({ body: { priorities: workflowMetadataResponse().priorities } });
        }
        if (url === "/api/notifications?page=1&page_size=10") {
          return jsonResponse({
            body: {
              notifications: currentNotifications,
              pagination: {
                page: 1,
                page_size: 10,
                total_count: currentNotifications.length,
                total_pages: 1,
                has_next: false,
                has_previous: false,
              },
            },
          });
        }
        if (url === "/api/notifications/notification-1/read" && init?.method === "POST") {
          currentNotifications = currentNotifications.map((notification) =>
            notification.id === "notification-1"
              ? {
                  ...notification,
                  is_read: true,
                  read_at: "2026-05-03T12:10:00Z",
                }
              : notification,
          );
          return jsonResponse({ body: { notification: currentNotifications[0] } });
        }
        if (url === "/api/notifications/read-all" && init?.method === "POST") {
          currentNotifications = currentNotifications.map((notification) => ({
            ...notification,
            is_read: true,
            read_at: notification.read_at ?? "2026-05-03T12:15:00Z",
          }));
          return jsonResponse({ body: { updated_count: 1 } });
        }

        throw new Error(`Unexpected request: ${url}`);
      }),
    );

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    expect(await screen.findByText("2 unread")).toBeInTheDocument();

    const markReadButtons = await screen.findAllByRole("button", { name: /^mark read$/i });
    await user.click(markReadButtons[0]!);
    expect(await screen.findByText("1 unread")).toBeInTheDocument();

    await user.click(await screen.findByRole("button", { name: /mark all read/i }));
    expect(await screen.findByText("All caught up")).toBeInTheDocument();
  });

  it("renders task comments and posts a new immutable comment", async () => {
    let currentComments = commentListResponse([
      {
        id: "comment-1",
        task_id: "task-1",
        author: { id: "user-2", name: "Alex Smith" },
        content: "Existing timeline comment",
        created_at: "2026-05-03T10:00:00Z",
      },
    ]);

    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);

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
        if (url === "/api/tasks") {
          return jsonResponse({
            body: {
              tasks: [],
              pagination: {
                page: 1,
                page_size: 10,
                total_count: 0,
                total_pages: 1,
                has_next: false,
                has_previous: false,
              },
            },
          });
        }
        if (url === "/api/projects/project-1/tasks") {
          return jsonResponse({ body: { tasks: taskListResponse() } });
        }
        if (url === "/api/projects/project-1/activity") {
          return jsonResponse({ body: { activity: [] } });
        }
        if (url === "/api/task-statuses") {
          return jsonResponse({ body: { statuses: workflowMetadataResponse().statuses } });
        }
        if (url === "/api/task-status-transitions") {
          return jsonResponse({ body: { transitions: workflowMetadataResponse().transitions } });
        }
        if (url === "/api/task-priorities") {
          return jsonResponse({ body: { priorities: workflowMetadataResponse().priorities } });
        }
        if (url === "/api/notifications?page=1&page_size=10") {
          return jsonResponse({
            body: {
              notifications: [],
              pagination: {
                page: 1,
                page_size: 10,
                total_count: 0,
                total_pages: 1,
                has_next: false,
                has_previous: false,
              },
            },
          });
        }
        if (url === "/api/tasks/task-1") {
          return jsonResponse({ body: { task: taskListResponse()[0] } });
        }
        if (url === "/api/tasks/task-1/activity") {
          return jsonResponse({ body: { activity: [] } });
        }
        if (url === "/api/tasks/task-1/comments" && !init?.method) {
          return jsonResponse({ body: { comments: currentComments } });
        }
        if (url === "/api/tasks/task-1/comments" && init?.method === "POST") {
          currentComments = [
            ...currentComments,
            {
              id: "comment-2",
              task_id: "task-1",
              author: { id: "user-1", name: "Jane Doe" },
              content: "Fresh immutable note",
              created_at: "2026-05-03T10:05:00Z",
            },
          ];
          return jsonResponse({ body: { comment: currentComments[1] }, status: 201 });
        }

        throw new Error(`Unexpected request: ${url}`);
      }),
    );

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    await user.click(await screen.findByText("Initial task"));
    expect(await screen.findByText("Existing timeline comment")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /edit comment/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /delete comment/i })).not.toBeInTheDocument();

    await user.type(screen.getByLabelText(/add comment/i), "Fresh immutable note");
    await user.click(await screen.findByRole("button", { name: /post comment/i }));

    expect(await screen.findByText("Fresh immutable note")).toBeInTheDocument();
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

  it("adds and removes task dependencies from task detail", async () => {
    const dependencySummary = {
      id: "task-2",
      task_key: "ENG-2",
      title: "API prerequisite",
      parent_task_id: null,
      status: workflowMetadataResponse().statuses[1],
      is_blocked: false,
    };
    let currentTasks = taskListResponse([
      {
        ...taskListResponse()[0],
        is_blocked: false,
        dependencies: [],
      },
      {
        ...taskListResponse()[0],
        id: "task-2",
        task_key: "ENG-2",
        title: "API prerequisite",
        status: workflowMetadataResponse().statuses[1],
        dependencies: [],
      },
    ]);
    let selectedTask = currentTasks[0]!;
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
        return jsonResponse({ body: { tasks: currentTasks } });
      }
      if (url === "/api/tasks/task-1" && (!init?.method || init.method === "GET")) {
        return jsonResponse({ body: { task: selectedTask } });
      }
      if (url === "/api/tasks/task-1/dependencies" && init?.method === "POST") {
        selectedTask = {
          ...selectedTask,
          is_blocked: true,
          dependencies: [dependencySummary],
        };
        currentTasks = [
          selectedTask,
          currentTasks[1]!,
        ];
        return jsonResponse({ body: { task: selectedTask } });
      }
      if (url === "/api/tasks/task-1/dependencies/task-2" && init?.method === "DELETE") {
        selectedTask = {
          ...selectedTask,
          is_blocked: false,
          dependencies: [],
        };
        currentTasks = [
          selectedTask,
          currentTasks[1]!,
        ];
        return jsonResponse({ body: { task: selectedTask } });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    await user.click(await screen.findByText("Initial task"));
    await user.selectOptions(screen.getByLabelText(/add dependency/i), "task-2");
    await user.click(screen.getByRole("button", { name: /add dependency/i }));

    expect((await screen.findAllByText("API prerequisite")).length).toBeGreaterThan(0);
    expect((await screen.findAllByText("Blocked")).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /remove dependency/i }));

    expect(await screen.findByText(/no dependencies/i)).toBeInTheDocument();
    const addCall = fetchMock.mock.calls.find(
      ([requestUrl, requestInit]) =>
        requestUrl === "/api/tasks/task-1/dependencies" && requestInit?.method === "POST",
    );
    expect(addCall?.[1]?.body).toBe(JSON.stringify({ depends_on_task_id: "task-2" }));
  });

  it("shows blocked status-change errors in task detail", async () => {
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
        return jsonResponse({ body: { task: taskListResponse()[0] } });
      }
      if (url === "/api/tasks/task-1/status" && init?.method === "POST") {
        return jsonResponse({
          status: 400,
          body: {
            error: {
              code: "TASK_BLOCKED",
              message: "Blocked tasks cannot move forward until all dependencies are complete.",
              details: {},
            },
          },
        });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    const user = userEvent.setup();
    renderApp(["/projects/project-1"], { cookie: "csrftoken=test-token; path=/" });

    await user.click(await screen.findByText("Initial task"));
    await user.click(screen.getByRole("button", { name: /start work/i }));

    expect(await screen.findByText(/blocked tasks cannot move forward until all dependencies are complete\./i)).toBeInTheDocument();
    const statusCall = fetchMock.mock.calls.find(
      ([requestUrl, requestInit]) =>
        requestUrl === "/api/tasks/task-1/status" && requestInit?.method === "POST",
    );
    expect(statusCall?.[1]?.body).toBe(
      JSON.stringify({
        to_status_id: "status-in-progress",
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
