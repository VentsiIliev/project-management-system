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
import { useAddProjectMemberMutation } from "../hooks/useAddProjectMemberMutation";
import { useDeleteProjectMutation } from "../hooks/useDeleteProjectMutation";
import { useProjectQuery } from "../hooks/useProjectQuery";
import { useProjectMembersQuery } from "../hooks/useProjectMembersQuery";
import { useProjectsQuery } from "../hooks/useProjectsQuery";
import { useUpdateProjectMutation } from "../hooks/useUpdateProjectMutation";
import {
  addProjectMemberSchema,
  type AddProjectMemberFormValues,
} from "../schemas/addProjectMemberSchema";
import {
  createProjectSchema,
  type CreateProjectFormValues,
} from "../schemas/createProjectSchema";
import {
  updateProjectSchema,
  type UpdateProjectFormValues,
} from "../schemas/updateProjectSchema";

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
  const projectMembersQuery = useProjectMembersQuery(projectQuery.data ? projectId : null);
  const updateProjectMutation = useUpdateProjectMutation(projectId);
  const addProjectMemberMutation = useAddProjectMemberMutation(projectId);
  const deleteProjectMutation = useDeleteProjectMutation(projectId);
  const [lastCreatedProjectId, setLastCreatedProjectId] = useState<string | null>(null);
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [showAddMemberSuccess, setShowAddMemberSuccess] = useState(false);
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
    addProjectMemberMutation.reset();
    resetMemberForm({
      user_id: "",
      role: "TEAM_MEMBER",
    });
  }, [projectId, resetMemberForm]);

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
                    <span className="member-role-pill">{member.role.replace("_", " ")}</span>
                    {!member.is_active ? <span className="member-status-pill">Inactive user</span> : null}
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
