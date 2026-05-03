import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { isApiError } from "../../../api/client";
import { Button } from "../../../components/Button";
import { Field } from "../../../components/Field";
import { Panel } from "../../../components/Panel";
import { StatusMessage } from "../../../components/StatusMessage";
import { AppShellPage } from "../../auth/pages/AppShellPage";
import { type SessionUser } from "../../auth/types";
import { useCreateProjectMutation } from "../hooks/useCreateProjectMutation";
import { useCreateTaskCommentMutation } from "../hooks/useCreateTaskCommentMutation";
import { useCreateProjectTaskMutation } from "../hooks/useCreateProjectTaskMutation";
import { useAddProjectMemberMutation } from "../hooks/useAddProjectMemberMutation";
import { useAddTaskDependencyMutation } from "../hooks/useAddTaskDependencyMutation";
import { useChangeTaskStatusMutation } from "../hooks/useChangeTaskStatusMutation";
import { useDeleteTaskMutation } from "../hooks/useDeleteTaskMutation";
import { useDeleteProjectMutation } from "../hooks/useDeleteProjectMutation";
import { useMarkAllNotificationsReadMutation } from "../hooks/useMarkAllNotificationsReadMutation";
import { useMarkNotificationReadMutation } from "../hooks/useMarkNotificationReadMutation";
import { useMyTasksQuery } from "../hooks/useMyTasksQuery";
import { useNotificationsQuery } from "../hooks/useNotificationsQuery";
import { useProjectActivityQuery } from "../hooks/useProjectActivityQuery";
import { useProjectQuery } from "../hooks/useProjectQuery";
import { useProjectMembersQuery } from "../hooks/useProjectMembersQuery";
import { useProjectTasksQuery } from "../hooks/useProjectTasksQuery";
import { useProjectsQuery } from "../hooks/useProjectsQuery";
import { useRemoveProjectMemberMutation } from "../hooks/useRemoveProjectMemberMutation";
import { useRemoveTaskDependencyMutation } from "../hooks/useRemoveTaskDependencyMutation";
import { useTaskCommentsQuery } from "../hooks/useTaskCommentsQuery";
import { useTaskCommentsSocket } from "../hooks/useTaskCommentsSocket";
import { useTaskActivityQuery } from "../hooks/useTaskActivityQuery";
import { useTaskQuery } from "../hooks/useTaskQuery";
import { useUpdateTaskMutation } from "../hooks/useUpdateTaskMutation";
import { useUpdateProjectMemberMutation } from "../hooks/useUpdateProjectMemberMutation";
import { useUpdateProjectMutation } from "../hooks/useUpdateProjectMutation";
import { useWorkflowMetadataQuery } from "../hooks/useWorkflowMetadataQuery";
import {
  addProjectMemberSchema,
  type AddProjectMemberFormValues,
} from "../schemas/addProjectMemberSchema";
import {
  createProjectSchema,
  type CreateProjectFormValues,
} from "../schemas/createProjectSchema";
import {
  createProjectTaskSchema,
  type CreateProjectTaskFormValues,
} from "../schemas/createProjectTaskSchema";
import {
  updateProjectTaskSchema,
  type UpdateProjectTaskFormValues,
} from "../schemas/updateProjectTaskSchema";
import {
  updateProjectSchema,
  type UpdateProjectFormValues,
} from "../schemas/updateProjectSchema";
import { type ProjectMemberRole, type TaskStatusTransition } from "../types";

type ProjectsHomePageProps = {
  projectId: string | null;
  user: SessionUser;
};

function getDetailMessages(detail: unknown): string[] {
  if (typeof detail === "string") {
    return [detail];
  }

  if (Array.isArray(detail)) {
    return detail.filter(
      (message): message is string => typeof message === "string" && message.length > 0,
    );
  }

  return [];
}

export function ProjectsHomePage({ projectId, user }: ProjectsHomePageProps) {
  const navigate = useNavigate();
  const createProjectMutation = useCreateProjectMutation();
  const projectsQuery = useProjectsQuery();
  const projectQuery = useProjectQuery(projectId);
  const [projectTaskPage, setProjectTaskPage] = useState(1);
  const [projectTaskSearchDraft, setProjectTaskSearchDraft] = useState("");
  const [projectTaskStatusDraft, setProjectTaskStatusDraft] = useState("");
  const [projectTaskPriorityDraft, setProjectTaskPriorityDraft] = useState("");
  const [projectTaskAssigneeDraft, setProjectTaskAssigneeDraft] = useState("");
  const [projectTaskDeadlineFromDraft, setProjectTaskDeadlineFromDraft] = useState("");
  const [projectTaskDeadlineToDraft, setProjectTaskDeadlineToDraft] = useState("");
  const [projectTaskBlockedOnlyDraft, setProjectTaskBlockedOnlyDraft] = useState(false);
  const [projectTaskFilters, setProjectTaskFilters] = useState({
    assignee_id: "",
    deadline_from: "",
    deadline_to: "",
    is_blocked: false,
    priority_id: "",
    search: "",
    status_id: "",
  });
  const [myTasksPage, setMyTasksPage] = useState(1);
  const [includeCollaboratorTasks, setIncludeCollaboratorTasks] = useState(false);
  const [myTasksSortBy, setMyTasksSortBy] = useState<"deadline" | "priority">("deadline");
  const [notificationPage, setNotificationPage] = useState(1);
  const notificationsQuery = useNotificationsQuery(notificationPage, 10);
  const markNotificationReadMutation = useMarkNotificationReadMutation();
  const markAllNotificationsReadMutation = useMarkAllNotificationsReadMutation();
  const projectActivityQuery = useProjectActivityQuery(projectQuery.data ? projectId : null);
  const projectMembersQuery = useProjectMembersQuery(projectQuery.data ? projectId : null);
  const projectTasksQuery = useProjectTasksQuery(projectQuery.data ? projectId : null, {
    assignee_id: projectTaskFilters.assignee_id || undefined,
    deadline_from: projectTaskFilters.deadline_from || undefined,
    deadline_to: projectTaskFilters.deadline_to || undefined,
    is_blocked: projectTaskFilters.is_blocked ? true : undefined,
    page: projectTaskPage,
    page_size: 10,
    priority_id: projectTaskFilters.priority_id || undefined,
    search: projectTaskFilters.search || undefined,
    status_id: projectTaskFilters.status_id || undefined,
  });
  const myTasksQuery = useMyTasksQuery({
    include_collaborator_tasks: includeCollaboratorTasks,
    page: myTasksPage,
    page_size: 10,
    sort_by: myTasksSortBy,
  });
  const workflowMetadataQuery = useWorkflowMetadataQuery(Boolean(projectId));
  const updateProjectMutation = useUpdateProjectMutation(projectId);
  const addProjectMemberMutation = useAddProjectMemberMutation(projectId);
  const updateProjectMemberMutation = useUpdateProjectMemberMutation(projectId);
  const removeProjectMemberMutation = useRemoveProjectMemberMutation(projectId);
  const deleteProjectMutation = useDeleteProjectMutation(projectId);
  const createProjectTaskMutation = useCreateProjectTaskMutation(projectId);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const selectedTaskQuery = useTaskQuery(selectedTaskId);
  const taskCommentsQuery = useTaskCommentsQuery(selectedTaskQuery.data ? selectedTaskId : null);
  const createTaskCommentMutation = useCreateTaskCommentMutation(selectedTaskId);
  const taskCommentsConnectionState = useTaskCommentsSocket(
    selectedTaskQuery.data ? selectedTaskId : null,
    taskCommentsQuery.data,
  );
  const taskActivityQuery = useTaskActivityQuery(selectedTaskQuery.data ? selectedTaskId : null);
  const updateTaskMutation = useUpdateTaskMutation(projectId, selectedTaskId);
  const changeTaskStatusMutation = useChangeTaskStatusMutation(projectId, selectedTaskId);
  const addTaskDependencyMutation = useAddTaskDependencyMutation(projectId, selectedTaskId);
  const removeTaskDependencyMutation = useRemoveTaskDependencyMutation(projectId, selectedTaskId);
  const deleteTaskMutation = useDeleteTaskMutation(projectId, selectedTaskId);
  const [lastCreatedProjectId, setLastCreatedProjectId] = useState<string | null>(null);
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [showAddMemberSuccess, setShowAddMemberSuccess] = useState(false);
  const [showTaskSuccess, setShowTaskSuccess] = useState(false);
  const [showTaskUpdateSuccess, setShowTaskUpdateSuccess] = useState(false);
  const [showTaskStatusSuccess, setShowTaskStatusSuccess] = useState(false);
  const [showTaskDeleteSuccess, setShowTaskDeleteSuccess] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const [taskConflictMessage, setTaskConflictMessage] = useState<string | null>(null);
  const [confirmCascadeDelete, setConfirmCascadeDelete] = useState(false);
  const [dependencyDraft, setDependencyDraft] = useState("");
  const [memberRoleDrafts, setMemberRoleDrafts] = useState<Record<string, ProjectMemberRole>>({});
  const [memberActionSuccess, setMemberActionSuccess] = useState<string | null>(null);
  const [activeRoleUpdateUserId, setActiveRoleUpdateUserId] = useState<string | null>(null);
  const [activeRemoveUserId, setActiveRemoveUserId] = useState<string | null>(null);
  const [deleteConfirmationChecked, setDeleteConfirmationChecked] = useState(false);
  const [deleteConfirmationError, setDeleteConfirmationError] = useState<string | null>(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<CreateProjectFormValues>({
    defaultValues: {
      name: "",
      code: "",
      description: "",
      start_date: "",
      end_date: "",
    },
    resolver: zodResolver(createProjectSchema),
  });
  const {
    formState: { errors: editErrors },
    handleSubmit: handleEditSubmit,
    register: registerEdit,
    reset: resetEditForm,
  } = useForm<UpdateProjectFormValues>({
    defaultValues: {
      name: "",
      description: "",
      start_date: "",
      end_date: "",
    },
    resolver: zodResolver(updateProjectSchema),
  });
  const {
    formState: { errors: memberErrors },
    handleSubmit: handleMemberSubmit,
    register: registerMember,
    reset: resetMemberForm,
  } = useForm<AddProjectMemberFormValues>({
    defaultValues: {
      user_id: "",
      role: "TEAM_MEMBER",
    },
    resolver: zodResolver(addProjectMemberSchema),
  });
  const {
    formState: { errors: taskErrors },
    handleSubmit: handleTaskSubmit,
    register: registerTask,
    reset: resetTaskForm,
  } = useForm<CreateProjectTaskFormValues>({
    defaultValues: {
      title: "",
      description: "",
      start_date: "",
      deadline: "",
      primary_assignee_id: "",
      priority_id: "",
      parent_task_id: "",
    },
    resolver: zodResolver(createProjectTaskSchema),
  });
  const {
    formState: { errors: taskEditErrors },
    handleSubmit: handleTaskEditSubmit,
    register: registerTaskEdit,
    reset: resetTaskEditForm,
  } = useForm<UpdateProjectTaskFormValues>({
    defaultValues: {
      title: "",
      description: "",
      priority_id: "",
      start_date: "",
      deadline: "",
      primary_assignee_id: "",
      collaborator_ids: [],
    },
    resolver: zodResolver(updateProjectTaskSchema),
  });

  const projectError = isApiError(createProjectMutation.error)
    ? createProjectMutation.error
    : null;
  const selectedProjectError = isApiError(projectQuery.error)
    ? projectQuery.error
    : null;
  const updateProjectError = isApiError(updateProjectMutation.error)
    ? updateProjectMutation.error
    : null;
  const deleteProjectError = isApiError(deleteProjectMutation.error)
    ? deleteProjectMutation.error
    : null;
  const addProjectMemberError = isApiError(addProjectMemberMutation.error)
    ? addProjectMemberMutation.error
    : null;
  const updateProjectMemberError = isApiError(updateProjectMemberMutation.error)
    ? updateProjectMemberMutation.error
    : null;
  const removeProjectMemberError = isApiError(removeProjectMemberMutation.error)
    ? removeProjectMemberMutation.error
    : null;
  const createProjectTaskError = isApiError(createProjectTaskMutation.error)
    ? createProjectTaskMutation.error
    : null;
  const updateTaskError = isApiError(updateTaskMutation.error) ? updateTaskMutation.error : null;
  const changeTaskStatusError = isApiError(changeTaskStatusMutation.error)
    ? changeTaskStatusMutation.error
    : null;
  const createTaskCommentError = isApiError(createTaskCommentMutation.error)
    ? createTaskCommentMutation.error
    : null;
  const deleteTaskError = isApiError(deleteTaskMutation.error) ? deleteTaskMutation.error : null;
  const addTaskDependencyError = isApiError(addTaskDependencyMutation.error)
    ? addTaskDependencyMutation.error
    : null;
  const removeTaskDependencyError = isApiError(removeTaskDependencyMutation.error)
    ? removeTaskDependencyMutation.error
    : null;
  const serverNameError = getDetailMessages(projectError?.details.name)[0];
  const serverCodeError = getDetailMessages(projectError?.details.code)[0];
  const serverStartDateError = getDetailMessages(projectError?.details.start_date)[0];
  const serverEndDateError = getDetailMessages(projectError?.details.end_date)[0];
  const serverDescriptionError = getDetailMessages(projectError?.details.description)[0];
  const serverFormError =
    projectError?.code === "PROJECT_PERMISSION_DENIED"
      ? null
      : Object.entries(projectError?.details ?? {})
          .flatMap(([field, detail]) =>
            ["name", "code", "description", "start_date", "end_date"].includes(field)
              ? []
              : getDetailMessages(detail),
          )[0] ??
        (projectError &&
        !serverNameError &&
        !serverCodeError &&
        !serverStartDateError &&
        !serverEndDateError &&
        !serverDescriptionError
          ? projectError.message
          : null);
  const serverEditNameError = getDetailMessages(updateProjectError?.details.name)[0];
  const serverEditDescriptionError = getDetailMessages(updateProjectError?.details.description)[0];
  const serverEditStartDateError = getDetailMessages(updateProjectError?.details.start_date)[0];
  const serverEditEndDateError = getDetailMessages(updateProjectError?.details.end_date)[0];
  const serverEditCodeError = getDetailMessages(updateProjectError?.details.code)[0];
  const serverEditFormError =
    updateProjectError?.code === "PROJECT_PERMISSION_DENIED"
      ? null
      : updateProjectError &&
        !serverEditNameError &&
        !serverEditDescriptionError &&
        !serverEditStartDateError &&
        !serverEditEndDateError &&
        !serverEditCodeError
      ? updateProjectError.message
      : null;
  const serverDeleteConfirmationError = getDetailMessages(
    deleteProjectError?.details.confirm_project_delete,
  )[0];
  const serverDeleteFormError =
    deleteProjectError &&
    !serverDeleteConfirmationError &&
    deleteProjectError.code !== "PROJECT_PERMISSION_DENIED"
      ? deleteProjectError.message
      : null;
  const serverMemberUserIdError = getDetailMessages(addProjectMemberError?.details.user_id)[0];
  const serverMemberRoleError = getDetailMessages(addProjectMemberError?.details.role)[0];
  const serverMemberFormError =
    addProjectMemberError &&
    !serverMemberUserIdError &&
    !serverMemberRoleError &&
    addProjectMemberError.code !== "PROJECT_PERMISSION_DENIED"
      ? addProjectMemberError.message
      : null;
  const memberActionError = updateProjectMemberError ?? removeProjectMemberError;
  const serverTaskTitleError = getDetailMessages(createProjectTaskError?.details.title)[0];
  const serverTaskDescriptionError = getDetailMessages(createProjectTaskError?.details.description)[0];
  const serverTaskStartDateError = getDetailMessages(createProjectTaskError?.details.start_date)[0];
  const serverTaskDeadlineError = getDetailMessages(createProjectTaskError?.details.deadline)[0];
  const serverTaskPriorityError = getDetailMessages(createProjectTaskError?.details.priority_id)[0];
  const serverTaskAssigneeError = getDetailMessages(
    createProjectTaskError?.details.primary_assignee_id,
  )[0];
  const serverTaskParentError = getDetailMessages(createProjectTaskError?.details.parent_task_id)[0];
  const serverTaskFormError =
    createProjectTaskError &&
    !serverTaskTitleError &&
    !serverTaskDescriptionError &&
    !serverTaskStartDateError &&
    !serverTaskDeadlineError &&
    !serverTaskPriorityError &&
    !serverTaskAssigneeError &&
    !serverTaskParentError &&
    createProjectTaskError.code !== "PROJECT_PERMISSION_DENIED"
      ? createProjectTaskError.message
      : null;
  const serverTaskEditTitleError = getDetailMessages(updateTaskError?.details.title)[0];
  const serverTaskEditDescriptionError = getDetailMessages(updateTaskError?.details.description)[0];
  const serverTaskEditPriorityError = getDetailMessages(updateTaskError?.details.priority_id)[0];
  const serverTaskEditStartDateError = getDetailMessages(updateTaskError?.details.start_date)[0];
  const serverTaskEditDeadlineError = getDetailMessages(updateTaskError?.details.deadline)[0];
  const serverTaskEditAssigneeError = getDetailMessages(updateTaskError?.details.primary_assignee_id)[0];
  const serverTaskEditCollaboratorError = getDetailMessages(
    updateTaskError?.details.collaborator_ids,
  )[0];

  const activeProjectMembers =
    projectMembersQuery.data?.filter((member) => member.is_active) ?? [];
  const projectTasks = projectTasksQuery.data?.tasks ?? [];
  const myTasks = myTasksQuery.data?.tasks ?? [];
  const currentProjectMember = projectMembersQuery.data?.find((member) => member.user_id === user.id) ?? null;
  const canManageTaskPlanning =
    user.is_admin || currentProjectMember?.role === "PROJECT_MANAGER";
  const canEditTaskDescription = canManageTaskPlanning || Boolean(currentProjectMember);
  const canChangeTaskStatus = canEditTaskDescription;
  const canManageTaskDependencies = canManageTaskPlanning;
  const selectedParentTask =
    selectedTaskQuery.data?.parent_task_id
      ? projectTasks.find((task) => task.id === selectedTaskQuery.data?.parent_task_id) ?? null
      : null;
  const availableStatusTransitions =
    workflowMetadataQuery.data?.transitions.filter(
      (transition) =>
        transition.is_active &&
        transition.from_status_id === selectedTaskQuery.data?.status.id,
    ) ?? [];
  const availableDependencyTargets =
    selectedTaskQuery.data && projectTasks.length
      ? projectTasks.filter(
          (task) =>
            task.id !== selectedTaskQuery.data?.id &&
            !selectedTaskQuery.data.dependencies.some((dependency) => dependency.id === task.id),
        )
      : [];
  const unreadNotificationsCount =
    notificationsQuery.data?.notifications.filter((notification) => !notification.is_read).length ?? 0;

  useEffect(() => {
    if (!projectQuery.data) {
      resetEditForm({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
      });
      return;
    }

    resetEditForm({
      name: projectQuery.data.name,
      description: projectQuery.data.description ?? "",
      start_date: projectQuery.data.start_date ?? "",
      end_date: projectQuery.data.end_date ?? "",
    });
  }, [projectQuery.data, resetEditForm]);

  useEffect(() => {
    setDeleteConfirmationChecked(false);
    setDeleteConfirmationError(null);
    setShowDeleteSuccess(false);
    deleteProjectMutation.reset();
  }, [projectId]);

  useEffect(() => {
    setShowAddMemberSuccess(false);
    setMemberActionSuccess(null);
    addProjectMemberMutation.reset();
    updateProjectMemberMutation.reset();
    removeProjectMemberMutation.reset();
    setMemberRoleDrafts({});
    setActiveRoleUpdateUserId(null);
    setActiveRemoveUserId(null);
    resetMemberForm({
      user_id: "",
      role: "TEAM_MEMBER",
    });
  }, [projectId, resetMemberForm]);

  useEffect(() => {
    setProjectTaskPage(1);
    setProjectTaskSearchDraft("");
    setProjectTaskStatusDraft("");
    setProjectTaskPriorityDraft("");
    setProjectTaskAssigneeDraft("");
    setProjectTaskDeadlineFromDraft("");
    setProjectTaskDeadlineToDraft("");
    setProjectTaskBlockedOnlyDraft(false);
    setProjectTaskFilters({
      assignee_id: "",
      deadline_from: "",
      deadline_to: "",
      is_blocked: false,
      priority_id: "",
      search: "",
      status_id: "",
    });
    setMyTasksPage(1);
    setIncludeCollaboratorTasks(false);
    setMyTasksSortBy("deadline");
    setShowTaskSuccess(false);
    setShowTaskDeleteSuccess(false);
    createProjectTaskMutation.reset();
    resetTaskForm({
      title: "",
      description: "",
      priority_id: "",
      start_date: "",
      deadline: "",
      primary_assignee_id: "",
      parent_task_id: "",
    });
  }, [projectId, resetTaskForm]);

  useEffect(() => {
    if (!projectTasks.length) {
      setSelectedTaskId(null);
      return;
    }

    if (selectedTaskId && !projectTasks.some((task) => task.id === selectedTaskId)) {
      setSelectedTaskId(null);
    }
  }, [projectTasks, selectedTaskId]);

  useEffect(() => {
    setShowTaskUpdateSuccess(false);
    setShowTaskStatusSuccess(false);
    setTaskConflictMessage(null);
    setConfirmCascadeDelete(false);
    setCommentDraft("");
    setDependencyDraft("");
    updateTaskMutation.reset();
    changeTaskStatusMutation.reset();
    createTaskCommentMutation.reset();
    addTaskDependencyMutation.reset();
    removeTaskDependencyMutation.reset();
    deleteTaskMutation.reset();
  }, [selectedTaskId]);

  useEffect(() => {
    if (!selectedTaskQuery.data) {
      resetTaskEditForm({
        title: "",
        description: "",
        priority_id: "",
        start_date: "",
        deadline: "",
        primary_assignee_id: "",
        collaborator_ids: [],
      });
      return;
    }

    resetTaskEditForm({
      title: selectedTaskQuery.data.title,
      description: selectedTaskQuery.data.description ?? "",
      priority_id: selectedTaskQuery.data.priority?.id ?? "",
      start_date: selectedTaskQuery.data.start_date ?? "",
      deadline: selectedTaskQuery.data.deadline ?? "",
      primary_assignee_id: selectedTaskQuery.data.primary_assignee?.id ?? "",
      collaborator_ids: selectedTaskQuery.data.collaborators.map((collaborator) => collaborator.id),
    });
  }, [resetTaskEditForm, selectedTaskQuery.data]);

  useEffect(() => {
    if (!projectMembersQuery.data) {
      setMemberRoleDrafts({}); 
      return;
    }

    setMemberRoleDrafts((currentDrafts) => {
      const nextDrafts: Record<string, ProjectMemberRole> = {};
      for (const member of projectMembersQuery.data) {
        nextDrafts[member.user_id] = currentDrafts[member.user_id] ?? member.role;
      }
      return nextDrafts;
    });
  }, [projectMembersQuery.data]);

  return (
    <AppShellPage user={user}>
      <div className="workspace-grid workspace-grid--projects">
        <Panel>
          <div className="panel-heading">
            <h2 className="panel-heading__title">Accessible projects</h2>
            <p className="panel-heading__body">
              Open any project you can access from the current session. Admins see the active workspace; members only
              see projects where their membership is still active.
            </p>
          </div>
          {projectsQuery.isPending ? (
            <StatusMessage title="Loading projects">
              The shell is fetching the current project access list.
            </StatusMessage>
          ) : null}
          {isApiError(projectsQuery.error) ? (
            <StatusMessage tone="error" title="Project list unavailable">
              {projectsQuery.error.message}
            </StatusMessage>
          ) : null}
          {!projectsQuery.isPending &&
          !projectsQuery.error &&
          (projectsQuery.data?.length ?? 0) === 0 ? (
            <StatusMessage title="No accessible projects yet">
              Create the first project from this workspace to make a real project route available after login.
            </StatusMessage>
          ) : null}
          {projectsQuery.data?.length ? (
            <div className="project-list" role="list" aria-label="Accessible projects">
              {projectsQuery.data.map((project) => {
                const isSelected = project.id === projectId;
                return (
                  <button
                    className={`project-list__item${isSelected ? " project-list__item--active" : ""}`}
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    type="button"
                  >
                    <span className="project-list__code">{project.code}</span>
                    <span className="project-list__content">
                      <strong>{project.name}</strong>
                      <span>{project.description || "No description yet."}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </Panel>

        <Panel>
          <div className="panel-heading">
            <h2 className="panel-heading__title">Project details</h2>
            <p className="panel-heading__body">
              Opening a project now resolves a dedicated protected route instead of leaving the app on a static
              placeholder.
            </p>
          </div>
          {!projectId ? (
            <StatusMessage title="Select a project">
              Choose a project from the list to load its details in the workspace.
            </StatusMessage>
          ) : null}
          {projectId && projectQuery.isPending ? (
            <StatusMessage title="Loading project details">
              The selected project route is resolving against the backend.
            </StatusMessage>
          ) : null}
          {projectId && selectedProjectError?.code === "PROJECT_NOT_FOUND" ? (
            <StatusMessage tone="warning" title="Project unavailable">
              This project is not visible to the current account or no longer exists in the active workspace.
            </StatusMessage>
          ) : null}
          {projectId &&
          selectedProjectError &&
          selectedProjectError.code !== "PROJECT_NOT_FOUND" ? (
            <StatusMessage tone="error" title="Project detail unavailable">
              {selectedProjectError.message}
            </StatusMessage>
          ) : null}
          {projectQuery.data ? (
            <div className="form-stack">
              <div className="project-summary">
                <div className="project-summary__code">{projectQuery.data.code}</div>
                <h3 className="card-title">{projectQuery.data.name}</h3>
                <p className="shell__summary project-summary__description">
                  {projectQuery.data.description || "No description was provided for this project."}
                </p>
                <dl className="details-list">
                  <div>
                    <dt>Owner ID</dt>
                    <dd>{projectQuery.data.owner_id}</dd>
                  </div>
                  <div>
                    <dt>Task counter</dt>
                    <dd>{projectQuery.data.task_counter}</dd>
                  </div>
                  <div>
                    <dt>Start date</dt>
                    <dd>{projectQuery.data.start_date || "Not set"}</dd>
                  </div>
                  <div>
                    <dt>End date</dt>
                    <dd>{projectQuery.data.end_date || "Not set"}</dd>
                  </div>
                </dl>
                <div className="project-summary__rule">
                  Project code is locked after creation and cannot be edited.
                </div>
              </div>

              <div className="form-stack">
                <h3 className="card-title">Project activity</h3>
                {projectActivityQuery.isPending ? (
                  <StatusMessage title="Loading activity">
                    The project activity timeline is loading from the backend.
                  </StatusMessage>
                ) : null}
                {isApiError(projectActivityQuery.error) ? (
                  <StatusMessage tone="error" title="Project activity unavailable">
                    {projectActivityQuery.error.message}
                  </StatusMessage>
                ) : null}
                {!projectActivityQuery.isPending &&
                !projectActivityQuery.error &&
                !(projectActivityQuery.data?.length ?? 0) ? (
                  <StatusMessage title="No project activity yet">
                    New project, task, membership, and workflow events will appear here.
                  </StatusMessage>
                ) : null}
                {projectActivityQuery.data?.length ? (
                  <div className="task-list" role="list" aria-label="Project activity">
                    {projectActivityQuery.data.map((entry) => (
                      <div className="task-list__item" key={entry.id} role="listitem">
                        <div className="task-list__identity">
                          <strong>{entry.message}</strong>
                          <span>{new Date(entry.created_at).toLocaleString()}</span>
                        </div>
                        <div className="task-list__meta">
                          <span>{entry.event_type}</span>
                          <span>{entry.actor_name ?? "System"}</span>
                          <span>{entry.task_key ?? projectQuery.data.code}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </Panel>

        <Panel>
          <div className="panel-heading">
            <h2 className="panel-heading__title">Notifications</h2>
            <p className="panel-heading__body">
              Recent in-app task notifications stay inside the workspace for MVP. Unread items remain highlighted until
              you mark them as read.
            </p>
          </div>
          {notificationsQuery.isPending ? (
            <StatusMessage title="Loading notifications">
              Your newest in-app notifications are loading from the backend.
            </StatusMessage>
          ) : null}
          {isApiError(notificationsQuery.error) ? (
            <StatusMessage tone="error" title="Notifications unavailable">
              {notificationsQuery.error.message}
            </StatusMessage>
          ) : null}
          {!notificationsQuery.isPending &&
          !notificationsQuery.error &&
          !(notificationsQuery.data?.notifications.length ?? 0) ? (
            <StatusMessage title="No notifications yet">
              Task activity notifications will appear here once another relevant participant changes shared work.
            </StatusMessage>
          ) : null}
          {notificationsQuery.data?.notifications.length ? (
            <div className="form-stack">
              <div className="member-actions">
                <span>{unreadNotificationsCount ? `${unreadNotificationsCount} unread` : "All caught up"}</span>
                <Button
                  disabled={
                    markAllNotificationsReadMutation.isPending || unreadNotificationsCount === 0
                  }
                  onClick={() => markAllNotificationsReadMutation.mutate()}
                  type="button"
                  variant="secondary"
                >
                  {markAllNotificationsReadMutation.isPending ? "Marking..." : "Mark all read"}
                </Button>
              </div>
              <div className="task-list" role="list" aria-label="Notifications">
                {notificationsQuery.data.notifications.map((notification) => (
                  <div className="task-list__item" key={notification.id} role="listitem">
                    <div className="task-list__identity">
                      <strong>{notification.message}</strong>
                      <span>{new Date(notification.created_at).toLocaleString()}</span>
                    </div>
                    <div className="task-list__meta">
                      <span>{notification.event_type}</span>
                      <span>{notification.is_read ? "Read" : "Unread"}</span>
                      <Button
                        disabled={markNotificationReadMutation.isPending || notification.is_read}
                        onClick={() => markNotificationReadMutation.mutate(notification.id)}
                        type="button"
                        variant="secondary"
                      >
                        {notification.is_read ? "Read" : "Mark read"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="member-actions">
                <Button
                  disabled={
                    notificationsQuery.data.pagination.has_previous === false
                    || notificationsQuery.isPending
                  }
                  onClick={() =>
                    setNotificationPage((currentPage) => Math.max(1, currentPage - 1))
                  }
                  type="button"
                  variant="secondary"
                >
                  Previous notifications
                </Button>
                <span>
                  Page {notificationsQuery.data.pagination.page} of {notificationsQuery.data.pagination.total_pages}
                </span>
                <Button
                  disabled={
                    notificationsQuery.data.pagination.has_next === false
                    || notificationsQuery.isPending
                  }
                  onClick={() => setNotificationPage((currentPage) => currentPage + 1)}
                  type="button"
                  variant="secondary"
                >
                  Next notifications
                </Button>
              </div>
            </div>
          ) : null}
        </Panel>

        <Panel>
          <div className="panel-heading">
            <h2 className="panel-heading__title">My Tasks</h2>
            <p className="panel-heading__body">
              Focus the workspace on tasks assigned to you, optionally include collaborator work, and sort by deadline or priority.
            </p>
          </div>
          <div className="form-stack">
            <label className="field" htmlFor="my-tasks-sort">
              <span className="field__label">Sort My Tasks by</span>
              <select
                className="field__input"
                id="my-tasks-sort"
                onChange={(event) => {
                  setMyTasksSortBy(event.target.value as "deadline" | "priority");
                  setMyTasksPage(1);
                }}
                value={myTasksSortBy}
              >
                <option value="deadline">Deadline</option>
                <option value="priority">Priority</option>
              </select>
            </label>
            <label className="field" htmlFor="my-tasks-collaborators">
              <span className="field__label">Task scope</span>
              <div className="member-actions">
                <input
                  checked={includeCollaboratorTasks}
                  id="my-tasks-collaborators"
                  onChange={(event) => {
                    setIncludeCollaboratorTasks(event.target.checked);
                    setMyTasksPage(1);
                  }}
                  type="checkbox"
                />
                <span>Include collaborator tasks</span>
              </div>
            </label>
          </div>
          {myTasksQuery.isPending ? (
            <StatusMessage title="Loading My Tasks">
              Your assigned task list is loading from the backend.
            </StatusMessage>
          ) : null}
          {isApiError(myTasksQuery.error) ? (
            <StatusMessage tone="error" title="My Tasks unavailable">
              {myTasksQuery.error.message}
            </StatusMessage>
          ) : null}
          {!myTasksQuery.isPending && !myTasksQuery.error && myTasks.length === 0 ? (
            <StatusMessage title="No tasks assigned">
              Assigned work will appear here once you are added as a primary assignee{includeCollaboratorTasks ? " or collaborator" : ""}.
            </StatusMessage>
          ) : null}
          {myTasks.length ? (
            <div className="form-stack">
              <div className="task-list" role="list" aria-label="My tasks">
                {myTasks.map((task) => (
                  <button
                    className={`task-list__item${task.id === selectedTaskId ? " project-list__item--active" : ""}`}
                    key={task.id}
                    onClick={() => {
                      setShowTaskDeleteSuccess(false);
                      setTaskConflictMessage(null);
                      setSelectedTaskId(task.id);
                    }}
                    role="listitem"
                    type="button"
                  >
                    <div className="task-list__identity">
                      <span className="task-list__key">{task.task_key}</span>
                      <strong>{task.title}</strong>
                      <span>{task.description || "No description yet."}</span>
                    </div>
                    <div className="task-list__meta">
                      <span>{task.status.name}</span>
                      <span>{task.priority?.name ?? "No priority"}</span>
                      <span>{task.primary_assignee?.name || "Unassigned"}</span>
                      <span>{task.deadline ? `Due ${task.deadline}` : "No deadline"}</span>
                      <span>{task.is_blocked ? "Blocked" : "Not blocked"}</span>
                      <span>{task.is_overdue ? "Overdue" : "On track"}</span>
                    </div>
                  </button>
                ))}
              </div>
              {myTasksQuery.data ? (
                <div className="member-actions">
                  <Button
                    disabled={myTasksQuery.data.pagination.has_previous === false || myTasksQuery.isPending}
                    onClick={() => setMyTasksPage((currentPage) => Math.max(1, currentPage - 1))}
                    type="button"
                    variant="secondary"
                  >
                    Previous My Tasks
                  </Button>
                  <span>
                    Page {myTasksQuery.data.pagination.page} of {myTasksQuery.data.pagination.total_pages}
                  </span>
                  <Button
                    disabled={myTasksQuery.data.pagination.has_next === false || myTasksQuery.isPending}
                    onClick={() => setMyTasksPage((currentPage) => currentPage + 1)}
                    type="button"
                    variant="secondary"
                  >
                    Next My Tasks
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </Panel>

        <Panel className="project-tasks-panel">
          <div className="panel-heading">
            <h2 className="panel-heading__title">Project tasks</h2>
            <p className="panel-heading__body">
              Search, filter, and page through root tasks and subtasks without leaving the selected project workspace.
            </p>
          </div>
          {!projectId ? (
            <StatusMessage title="Project tasks are unavailable">
              Select a project detail route before managing tasks.
            </StatusMessage>
          ) : null}
          {projectId ? (
            <form
              className="form-stack"
              onSubmit={(event) => {
                event.preventDefault();
                setProjectTaskPage(1);
                setProjectTaskFilters({
                  assignee_id: projectTaskAssigneeDraft,
                  deadline_from: projectTaskDeadlineFromDraft,
                  deadline_to: projectTaskDeadlineToDraft,
                  is_blocked: projectTaskBlockedOnlyDraft,
                  priority_id: projectTaskPriorityDraft,
                  search: projectTaskSearchDraft.trim(),
                  status_id: projectTaskStatusDraft,
                });
              }}
            >
              <Field
                label="Search project tasks"
                onChange={(event) => setProjectTaskSearchDraft(event.target.value)}
                type="search"
                value={projectTaskSearchDraft}
              />
              <div className="split-fields">
                <label className="field" htmlFor="task-filter-status">
                  <span className="field__label">Status filter</span>
                  <select
                    className="field__input"
                    id="task-filter-status"
                    onChange={(event) => setProjectTaskStatusDraft(event.target.value)}
                    value={projectTaskStatusDraft}
                  >
                    <option value="">All statuses</option>
                    {workflowMetadataQuery.data?.statuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field" htmlFor="task-filter-priority">
                  <span className="field__label">Priority filter</span>
                  <select
                    className="field__input"
                    id="task-filter-priority"
                    onChange={(event) => setProjectTaskPriorityDraft(event.target.value)}
                    value={projectTaskPriorityDraft}
                  >
                    <option value="">All priorities</option>
                    {workflowMetadataQuery.data?.priorities.map((priority) => (
                      <option key={priority.id} value={priority.id}>
                        {priority.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="split-fields">
                <label className="field" htmlFor="task-filter-assignee">
                  <span className="field__label">Assignee filter</span>
                  <select
                    className="field__input"
                    id="task-filter-assignee"
                    onChange={(event) => setProjectTaskAssigneeDraft(event.target.value)}
                    value={projectTaskAssigneeDraft}
                  >
                    <option value="">All assignees</option>
                    {activeProjectMembers.map((member) => (
                      <option key={member.user_id} value={member.user_id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field" htmlFor="task-filter-blocked">
                  <span className="field__label">Blocked filter</span>
                  <div className="member-actions">
                    <input
                      checked={projectTaskBlockedOnlyDraft}
                      id="task-filter-blocked"
                      onChange={(event) => setProjectTaskBlockedOnlyDraft(event.target.checked)}
                      type="checkbox"
                    />
                    <span>Only blocked tasks</span>
                  </div>
                </label>
              </div>
              <div className="split-fields">
                <Field
                  label="Deadline from"
                  onChange={(event) => setProjectTaskDeadlineFromDraft(event.target.value)}
                  type="date"
                  value={projectTaskDeadlineFromDraft}
                />
                <Field
                  label="Deadline to"
                  onChange={(event) => setProjectTaskDeadlineToDraft(event.target.value)}
                  type="date"
                  value={projectTaskDeadlineToDraft}
                />
              </div>
              <div className="member-actions">
                <Button type="submit" variant="secondary">
                  Apply task filters
                </Button>
                <Button
                  onClick={() => {
                    setProjectTaskPage(1);
                    setProjectTaskSearchDraft("");
                    setProjectTaskStatusDraft("");
                    setProjectTaskPriorityDraft("");
                    setProjectTaskAssigneeDraft("");
                    setProjectTaskDeadlineFromDraft("");
                    setProjectTaskDeadlineToDraft("");
                    setProjectTaskBlockedOnlyDraft(false);
                    setProjectTaskFilters({
                      assignee_id: "",
                      deadline_from: "",
                      deadline_to: "",
                      is_blocked: false,
                      priority_id: "",
                      search: "",
                      status_id: "",
                    });
                  }}
                  type="button"
                  variant="secondary"
                >
                  Clear task filters
                </Button>
              </div>
            </form>
          ) : null}
          {projectId && projectTasksQuery.isPending ? (
            <StatusMessage title="Loading tasks">
              The current project task list is loading from the backend.
            </StatusMessage>
          ) : null}
          {projectId && isApiError(projectTasksQuery.error) ? (
            <StatusMessage tone="error" title="Task list unavailable">
              {projectTasksQuery.error.message}
            </StatusMessage>
          ) : null}
          {projectId &&
          !projectTasksQuery.isPending &&
          !projectTasksQuery.error &&
          projectTasks.length === 0 ? (
            <StatusMessage
              title={
                projectTaskFilters.search
                || projectTaskFilters.status_id
                || projectTaskFilters.priority_id
                || projectTaskFilters.assignee_id
                || projectTaskFilters.deadline_from
                || projectTaskFilters.deadline_to
                || projectTaskFilters.is_blocked
                  ? "No matching tasks"
                  : "No project tasks yet"
              }
            >
              {projectTaskFilters.search
              || projectTaskFilters.status_id
              || projectTaskFilters.priority_id
              || projectTaskFilters.assignee_id
              || projectTaskFilters.deadline_from
              || projectTaskFilters.deadline_to
              || projectTaskFilters.is_blocked
                ? "No tasks match the current search and filters."
                : "Create the first task to start building project-level work tracking beyond membership setup."}
            </StatusMessage>
          ) : null}
          {projectTasks.length ? (
            <div className="form-stack">
              <div className="task-list" role="list" aria-label="Project tasks">
                {projectTasks.map((task) => (
                  <button
                    className={`task-list__item${task.id === selectedTaskId ? " project-list__item--active" : ""}`}
                    key={task.id}
                    onClick={() => {
                      setShowTaskDeleteSuccess(false);
                      setTaskConflictMessage(null);
                      setSelectedTaskId(task.id);
                    }}
                    role="listitem"
                    type="button"
                  >
                    <div className="task-list__identity">
                      <span className="task-list__key">{task.task_key}</span>
                      <strong>{task.title}</strong>
                      <span>{task.description || "No description yet."}</span>
                    </div>
                    <div className="task-list__meta">
                      <span>{task.parent_task_id ? "Subtask" : "Root task"}</span>
                      <span>{task.is_blocked ? "Blocked" : "Not blocked"}</span>
                      <span className="task-status-pill">
                        {task.status.name}
                        {!task.status.is_active ? " (inactive)" : ""}
                      </span>
                      <span>
                        {task.priority
                          ? `${task.priority.name}${task.priority.is_active ? "" : " (inactive)"}`
                          : "No priority"}
                      </span>
                      <span>{task.primary_assignee?.name || "Unassigned"}</span>
                      <span>{task.deadline ? `Due ${task.deadline}` : "No deadline"}</span>
                      <span>{task.is_overdue ? "Overdue" : "On track"}</span>
                    </div>
                  </button>
                ))}
              </div>
              {projectTasksQuery.data ? (
                <div className="member-actions">
                  <Button
                    disabled={projectTasksQuery.data.pagination.has_previous === false || projectTasksQuery.isPending}
                    onClick={() => setProjectTaskPage((currentPage) => Math.max(1, currentPage - 1))}
                    type="button"
                    variant="secondary"
                  >
                    Previous task page
                  </Button>
                  <span>
                    Page {projectTasksQuery.data.pagination.page} of {projectTasksQuery.data.pagination.total_pages}
                  </span>
                  <Button
                    disabled={projectTasksQuery.data.pagination.has_next === false || projectTasksQuery.isPending}
                    onClick={() => setProjectTaskPage((currentPage) => currentPage + 1)}
                    type="button"
                    variant="secondary"
                  >
                    Next task page
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
          {projectQuery.data && !projectQuery.data.can_edit ? (
            <StatusMessage tone="warning" title="Task creation is restricted">
              Only Admins and active Project Managers can create tasks in this project.
            </StatusMessage>
          ) : null}
          {projectQuery.data?.can_edit ? (
            <form
              className="form-stack"
              onSubmit={handleTaskSubmit((values) => {
                setShowTaskSuccess(false);
                createProjectTaskMutation.reset();
                createProjectTaskMutation.mutate(
                  {
                    title: values.title,
                    description: values.description || undefined,
                    priority_id: values.priority_id || null,
                    start_date: values.start_date || null,
                    deadline: values.deadline || null,
                    primary_assignee_id: values.primary_assignee_id || null,
                    parent_task_id: values.parent_task_id || null,
                  },
                  {
                    onSuccess: (task) => {
                      setShowTaskSuccess(true);
                      setShowTaskDeleteSuccess(false);
                      setSelectedTaskId(task.id);
                      resetTaskForm({
                        title: "",
                        description: "",
                        priority_id: values.priority_id,
                        start_date: "",
                        deadline: "",
                        primary_assignee_id: values.primary_assignee_id,
                        parent_task_id: values.parent_task_id,
                      });
                    },
                  },
                );
              })}
            >
              <Field
                error={taskErrors.title?.message ?? serverTaskTitleError}
                label="Task title"
                type="text"
                {...registerTask("title")}
              />
              <label className="field" htmlFor="task-description">
                <span className="field__label">Task description</span>
                <textarea
                  className="field__input field__input--textarea"
                  id="task-description"
                  rows={4}
                  {...registerTask("description")}
                />
                {taskErrors.description?.message ?? serverTaskDescriptionError ? (
                  <span className="field__error" role="alert">
                    {taskErrors.description?.message ?? serverTaskDescriptionError}
                  </span>
                ) : null}
              </label>
              <label className="field" htmlFor="task-priority">
                <span className="field__label">Priority</span>
                <select className="field__input" id="task-priority" {...registerTask("priority_id")}>
                  <option value="">No priority</option>
                  {workflowMetadataQuery.data?.priorities
                    .filter((priority) => priority.is_active)
                    .map((priority) => (
                      <option key={priority.id} value={priority.id}>
                        {priority.name}
                      </option>
                    ))}
                </select>
                {taskErrors.priority_id?.message ?? serverTaskPriorityError ? (
                  <span className="field__error" role="alert">
                    {taskErrors.priority_id?.message ?? serverTaskPriorityError}
                  </span>
                ) : null}
              </label>
              <label className="field" htmlFor="task-assignee">
                <span className="field__label">Primary assignee</span>
                <select className="field__input" id="task-assignee" {...registerTask("primary_assignee_id")}>
                  <option value="">Unassigned</option>
                  {projectMembersQuery.data
                    ?.filter((member) => member.is_active)
                    .map((member) => (
                      <option key={member.user_id} value={member.user_id}>
                        {member.name} ({member.role})
                      </option>
                    ))}
                </select>
                {taskErrors.primary_assignee_id?.message ?? serverTaskAssigneeError ? (
                  <span className="field__error" role="alert">
                    {taskErrors.primary_assignee_id?.message ?? serverTaskAssigneeError}
                  </span>
                ) : null}
              </label>
              <label className="field" htmlFor="task-parent">
                <span className="field__label">Parent task</span>
                <select className="field__input" id="task-parent" {...registerTask("parent_task_id")}>
                  <option value="">Root task</option>
                  {projectTasks
                    ?.filter((task) => task.parent_task_id === null)
                    .map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.task_key} {task.title}
                      </option>
                    ))}
                </select>
                {taskErrors.parent_task_id?.message ?? serverTaskParentError ? (
                  <span className="field__error" role="alert">
                    {taskErrors.parent_task_id?.message ?? serverTaskParentError}
                  </span>
                ) : null}
              </label>
              <div className="split-fields">
                <Field
                  error={taskErrors.start_date?.message ?? serverTaskStartDateError}
                  label="Task start date"
                  type="date"
                  {...registerTask("start_date")}
                />
                <Field
                  error={taskErrors.deadline?.message ?? serverTaskDeadlineError}
                  label="Task deadline"
                  type="date"
                  {...registerTask("deadline")}
                />
              </div>
              {createProjectTaskError?.code === "PROJECT_PERMISSION_DENIED" ? (
                <StatusMessage tone="error" title="Permission denied">
                  {createProjectTaskError.message}
                </StatusMessage>
              ) : null}
              {isApiError(workflowMetadataQuery.error) ? (
                <StatusMessage tone="error" title="Workflow metadata unavailable">
                  {workflowMetadataQuery.error.message}
                </StatusMessage>
              ) : null}
              {serverTaskFormError ? (
                <StatusMessage tone="error" title="Task creation failed">
                  {serverTaskFormError}
                </StatusMessage>
              ) : null}
              {showTaskSuccess ? (
                <StatusMessage title="Task created">
                  The project task list was updated with the new active task.
                </StatusMessage>
              ) : null}
              <Button
                disabled={createProjectTaskMutation.isPending || workflowMetadataQuery.isPending}
                type="submit"
              >
                {createProjectTaskMutation.isPending ? "Creating task..." : "Create task"}
              </Button>
            </form>
          ) : null}
        </Panel>

        <Panel className="task-detail-panel">
          <div className="panel-heading">
            <h2 className="panel-heading__title">Task detail</h2>
            <p className="panel-heading__body">
              Open a task to inspect hierarchy, dependencies, and workflow metadata, update allowed fields, and manage deletion
              without leaving the project workspace.
            </p>
          </div>
          {!projectId ? (
            <StatusMessage title="Task detail is unavailable">
              Select a project before opening task detail.
            </StatusMessage>
          ) : null}
          {projectId && !selectedTaskId && showTaskDeleteSuccess ? (
            <StatusMessage title="Task deleted">
              The selected task was removed from the active project workspace.
            </StatusMessage>
          ) : null}
          {projectId && !selectedTaskId && !projectTasksQuery.isPending ? (
            <StatusMessage title="Select a task">
              Choose a task from the project list to load the detail view.
            </StatusMessage>
          ) : null}
          {selectedTaskId && selectedTaskQuery.isPending ? (
            <StatusMessage title="Loading task detail">
              The selected task is loading from the backend.
            </StatusMessage>
          ) : null}
          {selectedTaskId && isApiError(selectedTaskQuery.error) ? (
            <StatusMessage
              tone={selectedTaskQuery.error.code === "TASK_NOT_FOUND" ? "warning" : "error"}
              title={
                selectedTaskQuery.error.code === "TASK_NOT_FOUND"
                  ? "Task unavailable"
                  : "Task detail unavailable"
              }
            >
              {selectedTaskQuery.error.code === "TASK_NOT_FOUND"
                ? "This task is no longer visible in the current workspace."
                : selectedTaskQuery.error.message}
            </StatusMessage>
          ) : null}
          {selectedTaskQuery.data ? (
            <div className="form-stack">
              <div className="project-summary">
                <div className="project-summary__code">{selectedTaskQuery.data.task_key}</div>
                <h3 className="card-title">{selectedTaskQuery.data.title}</h3>
                <p className="shell__summary project-summary__description">
                  {selectedTaskQuery.data.description || "No task description yet."}
                </p>
                <dl className="details-list">
                  <div>
                    <dt>Hierarchy</dt>
                    <dd>{selectedTaskQuery.data.parent_task_id ? "Subtask" : "Root task"}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>
                      {selectedTaskQuery.data.status.name}
                      {!selectedTaskQuery.data.status.is_active ? " (inactive)" : ""}
                    </dd>
                  </div>
                  <div>
                    <dt>Priority</dt>
                    <dd>
                      {selectedTaskQuery.data.priority
                        ? `${selectedTaskQuery.data.priority.name}${
                            selectedTaskQuery.data.priority.is_active ? "" : " (inactive)"
                          }`
                        : "No priority"}
                    </dd>
                  </div>
                  <div>
                    <dt>Assignee</dt>
                    <dd>{selectedTaskQuery.data.primary_assignee?.name || "Unassigned"}</dd>
                  </div>
                  <div>
                    <dt>Parent task</dt>
                    <dd>{selectedParentTask ? `${selectedParentTask.task_key} ${selectedParentTask.title}` : "No parent task"}</dd>
                  </div>
                  <div>
                    <dt>Collaborators</dt>
                    <dd>
                      {selectedTaskQuery.data.collaborators.length
                        ? selectedTaskQuery.data.collaborators.map((collaborator) => collaborator.name).join(", ")
                        : "No collaborators"}
                    </dd>
                  </div>
                  <div>
                    <dt>Start date</dt>
                    <dd>{selectedTaskQuery.data.start_date || "Not set"}</dd>
                  </div>
                  <div>
                    <dt>Deadline</dt>
                    <dd>{selectedTaskQuery.data.deadline || "Not set"}</dd>
                  </div>
                  <div>
                    <dt>Blocked</dt>
                    <dd>{selectedTaskQuery.data.is_blocked ? "Blocked" : "Not blocked"}</dd>
                  </div>
                  <div>
                    <dt>Overdue</dt>
                    <dd>{selectedTaskQuery.data.is_overdue ? "Overdue" : "Not overdue"}</dd>
                  </div>
                  <div>
                    <dt>Version</dt>
                    <dd>{selectedTaskQuery.data.version}</dd>
                  </div>
                </dl>
              </div>

              <div className="form-stack">
                <h3 className="card-title">Subtasks</h3>
                {selectedTaskQuery.data.subtasks.length ? (
                  <div className="task-list" role="list" aria-label="Subtasks">
                    {selectedTaskQuery.data.subtasks.map((subtask) => (
                      <button
                        className={`task-list__item${subtask.id === selectedTaskId ? " project-list__item--active" : ""}`}
                        key={subtask.id}
                        onClick={() => {
                          setShowTaskDeleteSuccess(false);
                          setTaskConflictMessage(null);
                          setSelectedTaskId(subtask.id);
                        }}
                        role="listitem"
                        type="button"
                      >
                        <div className="task-list__identity">
                          <span className="task-list__key">{subtask.task_key}</span>
                          <strong>{subtask.title}</strong>
                          <span>{subtask.description || "No description yet."}</span>
                        </div>
                        <div className="task-list__meta">
                          <span className="task-status-pill">{subtask.status.name}</span>
                          <span>{subtask.primary_assignee?.name || "Unassigned"}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <StatusMessage title="No subtasks">
                    This task has no active subtasks yet.
                  </StatusMessage>
                )}
              </div>

              <div className="form-stack">
                <h3 className="card-title">Dependencies</h3>
                {selectedTaskQuery.data.dependencies.length ? (
                  <div className="task-list" role="list" aria-label="Task dependencies">
                    {selectedTaskQuery.data.dependencies.map((dependency) => (
                      <div className="task-list__item" key={dependency.id} role="listitem">
                        <button
                          className="task-list__identity"
                          onClick={() => {
                            setShowTaskDeleteSuccess(false);
                            setTaskConflictMessage(null);
                            setSelectedTaskId(dependency.id);
                          }}
                          type="button"
                        >
                          <span className="task-list__key">{dependency.task_key}</span>
                          <strong>{dependency.title}</strong>
                        </button>
                        <div className="task-list__meta">
                          <span>{dependency.parent_task_id ? "Subtask" : "Root task"}</span>
                          <span className="task-status-pill">{dependency.status.name}</span>
                          <span>{dependency.is_blocked ? "Blocked" : "Not blocked"}</span>
                          {canManageTaskDependencies ? (
                            <Button
                              disabled={removeTaskDependencyMutation.isPending}
                              onClick={() => {
                                removeTaskDependencyMutation.reset();
                                addTaskDependencyMutation.reset();
                                removeTaskDependencyMutation.mutate(dependency.id);
                              }}
                              type="button"
                              variant="secondary"
                            >
                              Remove dependency
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <StatusMessage title="No dependencies">
                    This task is not waiting on another active task yet.
                  </StatusMessage>
                )}
                {canManageTaskDependencies ? (
                  <div className="form-stack">
                    <label className="field" htmlFor="task-dependency">
                      <span className="field__label">Add dependency</span>
                      <select
                        className="field__input"
                        id="task-dependency"
                        onChange={(event) => {
                          setDependencyDraft(event.target.value);
                          addTaskDependencyMutation.reset();
                          removeTaskDependencyMutation.reset();
                        }}
                        value={dependencyDraft}
                      >
                        <option value="">Select a task</option>
                        {availableDependencyTargets.map((task) => (
                          <option key={task.id} value={task.id}>
                            {task.task_key} {task.title}
                          </option>
                        ))}
                      </select>
                    </label>
                    <Button
                      disabled={addTaskDependencyMutation.isPending || !dependencyDraft}
                      onClick={() => {
                        if (!dependencyDraft) {
                          return;
                        }

                        removeTaskDependencyMutation.reset();
                        addTaskDependencyMutation.reset();
                        addTaskDependencyMutation.mutate(
                          { depends_on_task_id: dependencyDraft },
                          {
                            onSuccess: () => {
                              setDependencyDraft("");
                            },
                          },
                        );
                      }}
                      type="button"
                      variant="secondary"
                    >
                      {addTaskDependencyMutation.isPending ? "Adding dependency..." : "Add dependency"}
                    </Button>
                  </div>
                ) : (
                  <StatusMessage tone="warning" title="Dependency changes are restricted">
                    Only Admins and active Project Managers can manage dependencies.
                  </StatusMessage>
                )}
                {addTaskDependencyError ? (
                  <StatusMessage tone="error" title="Dependency add failed">
                    {addTaskDependencyError.message}
                  </StatusMessage>
                ) : null}
                {removeTaskDependencyError ? (
                  <StatusMessage tone="error" title="Dependency remove failed">
                    {removeTaskDependencyError.message}
                  </StatusMessage>
                ) : null}
              </div>

              <div className="form-stack">
                <h3 className="card-title">Comments</h3>
                {taskCommentsConnectionState === "connecting" ? (
                  <StatusMessage title="Connecting live comments">
                    The task comment stream is connecting.
                  </StatusMessage>
                ) : null}
                {taskCommentsConnectionState === "reconnecting" ? (
                  <StatusMessage tone="warning" title="Reconnecting live comments">
                    Live comment updates are reconnecting. Missed comments will be fetched automatically.
                  </StatusMessage>
                ) : null}
                {taskCommentsConnectionState === "unavailable" ? (
                  <StatusMessage tone="warning" title="Live comments unavailable">
                    Real-time comment updates are unavailable in this environment. The saved timeline still works.
                  </StatusMessage>
                ) : null}
                {taskCommentsQuery.isPending ? (
                  <StatusMessage title="Loading comments">
                    The saved comment timeline is loading from the backend.
                  </StatusMessage>
                ) : null}
                {isApiError(taskCommentsQuery.error) ? (
                  <StatusMessage tone="error" title="Comments unavailable">
                    {taskCommentsQuery.error.message}
                  </StatusMessage>
                ) : null}
                {!taskCommentsQuery.isPending &&
                !taskCommentsQuery.error &&
                !(taskCommentsQuery.data?.length ?? 0) ? (
                  <StatusMessage title="No comments yet">
                    Add the first immutable task comment to start the discussion timeline.
                  </StatusMessage>
                ) : null}
                {taskCommentsQuery.data?.length ? (
                  <div className="task-list" role="list" aria-label="Task comments">
                    {taskCommentsQuery.data.map((comment) => (
                      <div className="task-list__item" key={comment.id} role="listitem">
                        <div className="task-list__identity">
                          <strong>{comment.author.name}</strong>
                          <span>{comment.content}</span>
                        </div>
                        <div className="task-list__meta">
                          <span>{new Date(comment.created_at).toLocaleString()}</span>
                          <span>Immutable</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
                {canEditTaskDescription ? (
                  <div className="form-stack">
                    <label className="field" htmlFor="task-comment">
                      <span className="field__label">Add comment</span>
                      <textarea
                        className="field__input field__input--textarea"
                        id="task-comment"
                        onChange={(event) => setCommentDraft(event.target.value)}
                        rows={3}
                        value={commentDraft}
                      />
                    </label>
                    <Button
                      disabled={createTaskCommentMutation.isPending || commentDraft.trim().length === 0}
                      onClick={() => {
                        createTaskCommentMutation.reset();
                        createTaskCommentMutation.mutate(
                          { content: commentDraft },
                          {
                            onSuccess: () => {
                              setCommentDraft("");
                            },
                          },
                        );
                      }}
                      type="button"
                    >
                      {createTaskCommentMutation.isPending ? "Posting comment..." : "Post comment"}
                    </Button>
                    {createTaskCommentError ? (
                      <StatusMessage tone="error" title="Comment failed">
                        {createTaskCommentError.message}
                      </StatusMessage>
                    ) : null}
                  </div>
                ) : (
                  <StatusMessage tone="warning" title="Comments are restricted">
                    Only active project members can add task comments.
                  </StatusMessage>
                )}
              </div>

              <div className="form-stack">
                <h3 className="card-title">Task activity</h3>
                {taskActivityQuery.isPending ? (
                  <StatusMessage title="Loading activity">
                    The task activity timeline is loading from the backend.
                  </StatusMessage>
                ) : null}
                {isApiError(taskActivityQuery.error) ? (
                  <StatusMessage tone="error" title="Task activity unavailable">
                    {taskActivityQuery.error.message}
                  </StatusMessage>
                ) : null}
                {!taskActivityQuery.isPending &&
                !taskActivityQuery.error &&
                !(taskActivityQuery.data?.length ?? 0) ? (
                  <StatusMessage title="No task activity yet">
                    Task creation, updates, status changes, and dependency events will appear here.
                  </StatusMessage>
                ) : null}
                {taskActivityQuery.data?.length ? (
                  <div className="task-list" role="list" aria-label="Task activity">
                    {taskActivityQuery.data.map((entry) => (
                      <div className="task-list__item" key={entry.id} role="listitem">
                        <div className="task-list__identity">
                          <strong>{entry.message}</strong>
                          <span>{new Date(entry.created_at).toLocaleString()}</span>
                        </div>
                        <div className="task-list__meta">
                          <span>{entry.event_type}</span>
                          <span>{entry.actor_name ?? "System"}</span>
                          <span>{entry.task_key ?? selectedTaskQuery.data.task_key}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              {taskConflictMessage ? (
                <StatusMessage tone="warning" title="Version conflict">
                  {taskConflictMessage}
                </StatusMessage>
              ) : null}

              {canChangeTaskStatus ? (
                <div className="form-stack">
                  <h3 className="card-title">Change status</h3>
                  {availableStatusTransitions.length ? (
                    <div className="member-actions">
                      {availableStatusTransitions.map((transition: TaskStatusTransition) => {
                        const nextStatus = workflowMetadataQuery.data?.statuses.find(
                          (status) => status.id === transition.to_status_id,
                        );

                        return (
                          <Button
                            key={transition.id}
                            disabled={changeTaskStatusMutation.isPending}
                            onClick={() => {
                              setShowTaskStatusSuccess(false);
                              setTaskConflictMessage(null);
                              changeTaskStatusMutation.reset();
                              changeTaskStatusMutation.mutate(
                                {
                                  to_status_id: transition.to_status_id,
                                  version: selectedTaskQuery.data.version,
                                },
                                {
                                  onError: async (error) => {
                                    if (isApiError(error) && error.code === "OPTIMISTIC_LOCK_FAILED") {
                                      setTaskConflictMessage(
                                        "This task was changed by someone else. Please refresh and try again.",
                                      );
                                      await Promise.all([
                                        selectedTaskQuery.refetch(),
                                        projectTasksQuery.refetch(),
                                      ]);
                                    }
                                  },
                                  onSuccess: () => {
                                    setShowTaskStatusSuccess(true);
                                  },
                                },
                              );
                            }}
                            type="button"
                            variant="secondary"
                          >
                            {transition.name ?? nextStatus?.name ?? "Change status"}
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <StatusMessage title="No status changes available">
                      The current workflow metadata does not expose another active transition from this status.
                    </StatusMessage>
                  )}
                  {["INVALID_STATUS_TRANSITION", "TASK_BLOCKED", "SUBTASKS_INCOMPLETE"].includes(
                    changeTaskStatusError?.code ?? "",
                  ) ? (
                    <StatusMessage tone="error" title="Status change failed">
                      {changeTaskStatusError.message}
                    </StatusMessage>
                  ) : null}
                  {changeTaskStatusError?.code === "TASK_PERMISSION_DENIED" ? (
                    <StatusMessage tone="error" title="Permission denied">
                      {changeTaskStatusError.message}
                    </StatusMessage>
                  ) : null}
                  {showTaskStatusSuccess ? (
                    <StatusMessage title="Status updated">
                      The selected task status was saved successfully.
                    </StatusMessage>
                  ) : null}
                </div>
              ) : (
                <StatusMessage tone="warning" title="Status changes are restricted">
                  Only active project members can change task status.
                </StatusMessage>
              )}

              {canEditTaskDescription ? (
                <form
                  className="form-stack"
                  onSubmit={handleTaskEditSubmit((values) => {
                    if (!selectedTaskQuery.data) {
                      return;
                    }

                    setShowTaskUpdateSuccess(false);
                    setTaskConflictMessage(null);
                    updateTaskMutation.reset();

                    const payload = canManageTaskPlanning
                      ? {
                          title: values.title,
                          description: values.description || null,
                          priority_id: values.priority_id || null,
                          start_date: values.start_date || null,
                          deadline: values.deadline || null,
                          primary_assignee_id: values.primary_assignee_id || null,
                          collaborator_ids: values.collaborator_ids,
                          version: selectedTaskQuery.data.version,
                        }
                      : {
                          description: values.description || null,
                          version: selectedTaskQuery.data.version,
                        };

                    updateTaskMutation.mutate(payload, {
                      onError: async (error) => {
                        if (isApiError(error) && error.code === "OPTIMISTIC_LOCK_FAILED") {
                          setTaskConflictMessage(
                            "This task was changed by someone else. Please refresh and try again.",
                          );
                          await Promise.all([
                            selectedTaskQuery.refetch(),
                            projectTasksQuery.refetch(),
                          ]);
                        }
                      },
                      onSuccess: () => {
                        setShowTaskUpdateSuccess(true);
                      },
                    });
                  })}
                >
                  <h3 className="card-title">
                    {canManageTaskPlanning ? "Edit task" : "Update description"}
                  </h3>
                  {canManageTaskPlanning ? (
                    <Field
                      error={taskEditErrors.title?.message ?? serverTaskEditTitleError}
                      label="Task title"
                      type="text"
                      {...registerTaskEdit("title")}
                    />
                  ) : null}
                  <label className="field" htmlFor="selected-task-description">
                    <span className="field__label">Task description</span>
                    <textarea
                      className="field__input field__input--textarea"
                      id="selected-task-description"
                      rows={4}
                      {...registerTaskEdit("description")}
                    />
                    {taskEditErrors.description?.message ?? serverTaskEditDescriptionError ? (
                      <span className="field__error" role="alert">
                        {taskEditErrors.description?.message ?? serverTaskEditDescriptionError}
                      </span>
                    ) : null}
                  </label>
                  {canManageTaskPlanning ? (
                    <>
                      <label className="field" htmlFor="selected-task-priority">
                        <span className="field__label">Priority</span>
                        <select
                          className="field__input"
                          id="selected-task-priority"
                          {...registerTaskEdit("priority_id")}
                        >
                          <option value="">No priority</option>
                          {workflowMetadataQuery.data?.priorities.map((priority) => (
                            <option key={priority.id} value={priority.id}>
                              {priority.name}
                              {priority.is_active ? "" : " (inactive)"}
                            </option>
                          ))}
                        </select>
                        {taskEditErrors.priority_id?.message ?? serverTaskEditPriorityError ? (
                          <span className="field__error" role="alert">
                            {taskEditErrors.priority_id?.message ?? serverTaskEditPriorityError}
                          </span>
                        ) : null}
                      </label>
                      <label className="field" htmlFor="selected-task-assignee">
                        <span className="field__label">Primary assignee</span>
                        <select
                          className="field__input"
                          id="selected-task-assignee"
                          {...registerTaskEdit("primary_assignee_id")}
                        >
                          <option value="">Unassigned</option>
                          {activeProjectMembers.map((member) => (
                            <option key={member.user_id} value={member.user_id}>
                              {member.name} ({member.role})
                            </option>
                          ))}
                        </select>
                        {taskEditErrors.primary_assignee_id?.message ?? serverTaskEditAssigneeError ? (
                          <span className="field__error" role="alert">
                            {taskEditErrors.primary_assignee_id?.message ?? serverTaskEditAssigneeError}
                          </span>
                        ) : null}
                      </label>
                      <label className="field" htmlFor="selected-task-collaborators">
                        <span className="field__label">Collaborators</span>
                        <select
                          className="field__input"
                          id="selected-task-collaborators"
                          multiple
                          {...registerTaskEdit("collaborator_ids")}
                        >
                          {activeProjectMembers.map((member) => (
                            <option key={member.user_id} value={member.user_id}>
                              {member.name} ({member.role})
                            </option>
                          ))}
                        </select>
                        {taskEditErrors.collaborator_ids?.message ?? serverTaskEditCollaboratorError ? (
                          <span className="field__error" role="alert">
                            {taskEditErrors.collaborator_ids?.message ?? serverTaskEditCollaboratorError}
                          </span>
                        ) : null}
                      </label>
                      <div className="split-fields">
                        <Field
                          error={taskEditErrors.start_date?.message ?? serverTaskEditStartDateError}
                          label="Task start date"
                          type="date"
                          {...registerTaskEdit("start_date")}
                        />
                        <Field
                          error={taskEditErrors.deadline?.message ?? serverTaskEditDeadlineError}
                          label="Task deadline"
                          type="date"
                          {...registerTaskEdit("deadline")}
                        />
                      </div>
                    </>
                  ) : null}
                  {updateTaskError?.code === "TASK_PERMISSION_DENIED" ? (
                    <StatusMessage tone="error" title="Permission denied">
                      {updateTaskError.message}
                    </StatusMessage>
                  ) : null}
                  {showTaskUpdateSuccess ? (
                    <StatusMessage title="Task updated">
                      The selected task fields were saved successfully.
                    </StatusMessage>
                  ) : null}
                  <Button disabled={updateTaskMutation.isPending} type="submit">
                    {updateTaskMutation.isPending ? "Saving task..." : "Save task"}
                  </Button>
                </form>
              ) : (
                <StatusMessage tone="warning" title="Task updates are restricted">
                  Only active project members can edit task description, and only Project Managers or Admins can edit
                  planning fields.
                </StatusMessage>
              )}

              {canManageTaskPlanning ? (
                <div className="form-stack">
                  <h3 className="card-title">Delete task</h3>
                  {selectedTaskQuery.data.subtasks.length ? (
                    <label className="field" htmlFor="confirm-cascade-delete">
                      <span className="field__label">
                        I understand this will also soft-delete all active subtasks.
                      </span>
                      <input
                        checked={confirmCascadeDelete}
                        className="field__input"
                        id="confirm-cascade-delete"
                        onChange={(event) => setConfirmCascadeDelete(event.target.checked)}
                        type="checkbox"
                      />
                    </label>
                  ) : null}
                  {deleteTaskError?.code === "CASCADE_CONFIRMATION_REQUIRED" ? (
                    <StatusMessage tone="error" title="Task deletion failed">
                      {deleteTaskError.message}
                    </StatusMessage>
                  ) : null}
                  {deleteTaskError?.code === "TASK_PERMISSION_DENIED" ? (
                    <StatusMessage tone="error" title="Permission denied">
                      {deleteTaskError.message}
                    </StatusMessage>
                  ) : null}
                  <Button
                    className="button button--danger"
                    disabled={deleteTaskMutation.isPending}
                    onClick={() => {
                      setShowTaskDeleteSuccess(false);
                      deleteTaskMutation.reset();
                      deleteTaskMutation.mutate(
                        {
                          confirm_cascade_subtasks: confirmCascadeDelete,
                        },
                        {
                          onSuccess: async () => {
                            setShowTaskDeleteSuccess(true);
                            setSelectedTaskId(null);
                            await projectTasksQuery.refetch();
                          },
                        },
                      );
                    }}
                    type="button"
                  >
                    {deleteTaskMutation.isPending ? "Deleting task..." : "Delete task"}
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </Panel>

        <Panel className="project-members-panel">
          <div className="panel-heading">
            <h2 className="panel-heading__title">Project members</h2>
            <p className="panel-heading__body">
              Review the active member list and add collaborators with a project role from the same workspace.
            </p>
          </div>
          {!projectId ? (
            <StatusMessage title="Project members are unavailable">
              Select a project detail route before managing members.
            </StatusMessage>
          ) : null}
          {projectId && projectMembersQuery.isPending ? (
            <StatusMessage title="Loading members">
              The current project member list is loading from the backend.
            </StatusMessage>
          ) : null}
          {projectId && isApiError(projectMembersQuery.error) ? (
            <StatusMessage tone="error" title="Member list unavailable">
              {projectMembersQuery.error.message}
            </StatusMessage>
          ) : null}
          {projectId &&
          !projectMembersQuery.isPending &&
          !projectMembersQuery.error &&
          (projectMembersQuery.data?.length ?? 0) === 0 ? (
            <StatusMessage title="No active members">
              Add the first member to expand the project workspace beyond the owner.
            </StatusMessage>
          ) : null}
          {projectMembersQuery.data?.length ? (
            <div className="member-list" role="list" aria-label="Project members">
              {projectMembersQuery.data.map((member) => (
                <div className="member-list__item" key={member.user_id} role="listitem">
                  <div className="member-list__identity">
                    <strong>{member.name}</strong>
                    <span>{member.email}</span>
                  </div>
                  <div className="member-list__meta">
                    {projectQuery.data?.can_manage_members ? (
                      <label className="member-role-editor" htmlFor={`member-role-${member.user_id}`}>
                        <span className="member-role-editor__label">Role</span>
                        <select
                          className="field__input member-role-editor__select"
                          id={`member-role-${member.user_id}`}
                          onChange={(event) => {
                            setMemberRoleDrafts((currentDrafts) => ({
                              ...currentDrafts,
                              [member.user_id]: event.target.value as ProjectMemberRole,
                            }));
                            setMemberActionSuccess(null);
                          }}
                          value={memberRoleDrafts[member.user_id] ?? member.role}
                        >
                          <option value="TEAM_MEMBER">TEAM_MEMBER</option>
                          <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
                        </select>
                      </label>
                    ) : (
                      <span className="member-role-pill">{member.role.replace("_", " ")}</span>
                    )}
                    {!member.is_active ? <span className="member-status-pill">Inactive user</span> : null}
                    {projectQuery.data?.can_manage_members ? (
                      <div className="member-actions">
                        <Button
                          className="member-actions__button"
                          disabled={
                            updateProjectMemberMutation.isPending &&
                            activeRoleUpdateUserId === member.user_id
                          }
                          onClick={() => {
                            setShowAddMemberSuccess(false);
                            setMemberActionSuccess(null);
                            updateProjectMemberMutation.reset();
                            removeProjectMemberMutation.reset();
                            setActiveRoleUpdateUserId(member.user_id);
                            setActiveRemoveUserId(null);
                            updateProjectMemberMutation.mutate(
                              {
                                userId: member.user_id,
                                role: memberRoleDrafts[member.user_id] ?? member.role,
                              },
                              {
                                onSuccess: (updatedMember) => {
                                  setMemberActionSuccess(`Updated ${updatedMember.name}.`);
                                },
                              },
                            );
                          }}
                          type="button"
                          variant="secondary"
                        >
                          {updateProjectMemberMutation.isPending &&
                          activeRoleUpdateUserId === member.user_id
                            ? "Saving role..."
                            : "Save role"}
                        </Button>
                        <Button
                          className="button button--danger member-actions__button"
                          disabled={
                            removeProjectMemberMutation.isPending &&
                            activeRemoveUserId === member.user_id
                          }
                          onClick={() => {
                            setShowAddMemberSuccess(false);
                            setMemberActionSuccess(null);
                            updateProjectMemberMutation.reset();
                            removeProjectMemberMutation.reset();
                            setActiveRoleUpdateUserId(null);
                            setActiveRemoveUserId(member.user_id);
                            removeProjectMemberMutation.mutate(
                              { userId: member.user_id },
                              {
                                onSuccess: () => {
                                  if (!user.is_admin && member.user_id === user.id) {
                                    navigate("/");
                                    return;
                                  }

                                  setMemberActionSuccess(`Removed ${member.name}.`);
                                },
                              },
                            );
                          }}
                          type="button"
                        >
                          {removeProjectMemberMutation.isPending &&
                          activeRemoveUserId === member.user_id
                            ? "Removing..."
                            : "Remove member"}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          {projectQuery.data && !projectQuery.data.can_manage_members ? (
            <StatusMessage tone="warning" title="Member changes are restricted">
              Only Admins and active Project Managers can add members to this project.
            </StatusMessage>
          ) : null}
          {projectQuery.data?.can_manage_members ? (
            <form
              className="form-stack"
              onSubmit={handleMemberSubmit((values) => {
                setShowAddMemberSuccess(false);
                addProjectMemberMutation.reset();
                addProjectMemberMutation.mutate(values, {
                  onSuccess: () => {
                    setShowAddMemberSuccess(true);
                    resetMemberForm({
                      user_id: "",
                      role: values.role,
                    });
                  },
                });
              })}
            >
              <Field
                error={memberErrors.user_id?.message ?? serverMemberUserIdError}
                label="User ID"
                type="text"
                {...registerMember("user_id")}
              />
              <label className="field" htmlFor="member-role">
                <span className="field__label">Project role</span>
                <select
                  className="field__input"
                  id="member-role"
                  {...registerMember("role")}
                >
                  <option value="TEAM_MEMBER">TEAM_MEMBER</option>
                  <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
                </select>
                {memberErrors.role?.message ?? serverMemberRoleError ? (
                  <span className="field__error" role="alert">
                    {memberErrors.role?.message ?? serverMemberRoleError}
                  </span>
                ) : null}
              </label>
              {addProjectMemberError?.code === "PROJECT_PERMISSION_DENIED" ? (
                <StatusMessage tone="error" title="Permission denied">
                  {addProjectMemberError.message}
                </StatusMessage>
              ) : null}
              {serverMemberFormError ? (
                <StatusMessage tone="error" title="Member add failed">
                  {serverMemberFormError}
                </StatusMessage>
              ) : null}
              {showAddMemberSuccess ? (
                <StatusMessage title="Member added">
                  The member list was updated for the current project.
                </StatusMessage>
              ) : null}
              {memberActionError ? (
                <StatusMessage tone="error" title="Member action failed">
                  {memberActionError.message}
                </StatusMessage>
              ) : null}
              {memberActionSuccess ? (
                <StatusMessage title="Member updated">
                  {memberActionSuccess}
                </StatusMessage>
              ) : null}
              <Button disabled={addProjectMemberMutation.isPending} type="submit">
                {addProjectMemberMutation.isPending ? "Adding member..." : "Add member"}
              </Button>
            </form>
          ) : null}
        </Panel>

        <Panel className="project-edit-panel">
          <div className="panel-heading">
            <h2 className="panel-heading__title">Edit project</h2>
            <p className="panel-heading__body">
              Update the current project details without changing the stable project code used for future task keys.
            </p>
          </div>
          {!projectQuery.data ? (
            <StatusMessage title="Project edit is unavailable">
              Select a project detail route before editing.
            </StatusMessage>
          ) : null}
          {projectQuery.data && !projectQuery.data.can_edit ? (
            <StatusMessage tone="warning" title="Read-only access">
              Only Admins and active Project Managers can edit this project. The current account can view details but
              cannot change them.
            </StatusMessage>
          ) : null}
          {projectQuery.data?.can_edit ? (
            <form
              className="form-stack"
              onSubmit={handleEditSubmit((values) => {
                setShowEditSuccess(false);
                updateProjectMutation.reset();
                updateProjectMutation.mutate(values, {
                  onSuccess: () => {
                    setShowEditSuccess(true);
                  },
                });
              })}
            >
              <Field
                error={editErrors.name?.message ?? serverEditNameError}
                label="Project name"
                type="text"
                {...registerEdit("name")}
              />
              <Field
                error={serverEditCodeError}
                label="Project code"
                readOnly
                type="text"
                value={projectQuery.data.code}
              />
              <label className="field" htmlFor="edit-description">
                <span className="field__label">Description</span>
                <textarea
                  className="field__input field__input--textarea"
                  id="edit-description"
                  rows={4}
                  {...registerEdit("description")}
                />
                {editErrors.description?.message ?? serverEditDescriptionError ? (
                  <span className="field__error" role="alert">
                    {editErrors.description?.message ?? serverEditDescriptionError}
                  </span>
                ) : null}
              </label>
              <div className="split-fields">
                <Field
                  error={editErrors.start_date?.message ?? serverEditStartDateError}
                  label="Start date"
                  type="date"
                  {...registerEdit("start_date")}
                />
                <Field
                  error={editErrors.end_date?.message ?? serverEditEndDateError}
                  label="End date"
                  type="date"
                  {...registerEdit("end_date")}
                />
              </div>
              {updateProjectError?.code === "PROJECT_PERMISSION_DENIED" ? (
                <StatusMessage tone="error" title="Permission denied">
                  {updateProjectError.message}
                </StatusMessage>
              ) : null}
              {serverEditFormError ? (
                <StatusMessage tone="error" title="Project update failed">
                  {serverEditFormError}
                </StatusMessage>
              ) : null}
              {showEditSuccess ? (
                <StatusMessage title="Project updated">
                  The current project details were saved successfully.
                </StatusMessage>
              ) : null}
              <Button disabled={updateProjectMutation.isPending} type="submit">
                {updateProjectMutation.isPending ? "Saving changes..." : "Save changes"}
              </Button>
            </form>
          ) : null}
        </Panel>

        <Panel className="project-delete-panel">
          <div className="panel-heading">
            <h2 className="panel-heading__title">Delete project</h2>
            <p className="panel-heading__body">
              Remove this project from the active workspace only after an explicit confirmation step.
            </p>
          </div>
          {!projectQuery.data ? (
            <StatusMessage title="Project delete is unavailable">
              Select a project detail route before deleting.
            </StatusMessage>
          ) : null}
          {projectQuery.data && !projectQuery.data.can_delete ? (
            <StatusMessage tone="warning" title="Delete is restricted">
              Only Admins and active Project Managers can delete this project.
            </StatusMessage>
          ) : null}
          {projectQuery.data?.can_delete ? (
            <form
              className="form-stack"
              onSubmit={(event) => {
                event.preventDefault();
                setShowDeleteSuccess(false);
                deleteProjectMutation.reset();

                if (!deleteConfirmationChecked) {
                  setDeleteConfirmationError(
                    "Project deletion confirmation is required before continuing.",
                  );
                  return;
                }

                setDeleteConfirmationError(null);
                deleteProjectMutation.mutate(undefined, {
                  onSuccess: () => {
                    setShowDeleteSuccess(true);
                    navigate("/");
                  },
                });
              }}
            >
              <StatusMessage tone="warning" title="Destructive action">
                Deleting a project removes it from the active workspace and also soft-deletes its memberships.
              </StatusMessage>
              <label className="checkbox-field" htmlFor="confirm-project-delete">
                <input
                  checked={deleteConfirmationChecked}
                  className="checkbox-field__input"
                  id="confirm-project-delete"
                  onChange={(event) => {
                    setDeleteConfirmationChecked(event.target.checked);
                    if (event.target.checked) {
                      setDeleteConfirmationError(null);
                    }
                  }}
                  type="checkbox"
                />
                <span className="checkbox-field__label">
                  I understand this will soft-delete this project and its memberships.
                </span>
              </label>
              {deleteConfirmationError || serverDeleteConfirmationError ? (
                <span className="field__error" role="alert">
                  {deleteConfirmationError ?? serverDeleteConfirmationError}
                </span>
              ) : null}
              {deleteProjectError?.code === "PROJECT_PERMISSION_DENIED" ? (
                <StatusMessage tone="error" title="Permission denied">
                  {deleteProjectError.message}
                </StatusMessage>
              ) : null}
              {serverDeleteFormError ? (
                <StatusMessage tone="error" title="Project delete failed">
                  {serverDeleteFormError}
                </StatusMessage>
              ) : null}
              {showDeleteSuccess ? (
                <StatusMessage title="Project deleted">
                  The project was removed from the active workspace.
                </StatusMessage>
              ) : null}
              <Button
                className="button button--danger"
                disabled={deleteProjectMutation.isPending}
                type="submit"
              >
                {deleteProjectMutation.isPending ? "Deleting project..." : "Delete project"}
              </Button>
            </form>
          ) : null}
        </Panel>

        <Panel className="project-create-panel">
          <div className="panel-heading">
            <h2 className="panel-heading__title">Create a project</h2>
            <p className="panel-heading__body">
              Keep the project-creation flow in place while the shell grows into the real project workspace.
            </p>
          </div>
          <form
            className="form-stack"
            onSubmit={handleSubmit((values) => {
              createProjectMutation.reset();
              setLastCreatedProjectId(null);
              createProjectMutation.mutate(values, {
                onSuccess: (project) => {
                  setLastCreatedProjectId(project.id);
                  navigate(`/projects/${project.id}`);
                },
              });
            })}
          >
            <Field
              error={errors.name?.message ?? serverNameError}
              label="Project name"
              type="text"
              {...register("name")}
            />
            <Field
              error={errors.code?.message ?? serverCodeError}
              label="Project code"
              type="text"
              {...register("code")}
            />
            <label className="field" htmlFor="description">
              <span className="field__label">Description</span>
              <textarea
                className="field__input field__input--textarea"
                id="description"
                rows={4}
                {...register("description")}
              />
              {errors.description?.message ?? serverDescriptionError ? (
                <span className="field__error" role="alert">
                  {errors.description?.message ?? serverDescriptionError}
                </span>
              ) : null}
            </label>
            <div className="split-fields">
              <Field
                error={errors.start_date?.message ?? serverStartDateError}
                label="Start date"
                type="date"
                {...register("start_date")}
              />
              <Field
                error={errors.end_date?.message ?? serverEndDateError}
                label="End date"
                type="date"
                {...register("end_date")}
              />
            </div>
            {projectError?.code === "PROJECT_PERMISSION_DENIED" ? (
              <StatusMessage tone="error" title="Permission denied">
                {projectError.message}
              </StatusMessage>
            ) : null}
            {serverFormError ? (
              <StatusMessage tone="error" title="Project creation failed">
                {serverFormError}
              </StatusMessage>
            ) : null}
            {lastCreatedProjectId && projectId === lastCreatedProjectId && !projectError ? (
              <StatusMessage title="Project created">
                The new project was added to the accessible list and opened directly in the workspace.
              </StatusMessage>
            ) : null}
            <Button disabled={createProjectMutation.isPending} type="submit">
              {createProjectMutation.isPending ? "Creating project..." : "Create project"}
            </Button>
          </form>
        </Panel>
      </div>
    </AppShellPage>
  );
}
