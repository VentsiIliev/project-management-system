import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
import { useProjectQuery } from "../hooks/useProjectQuery";
import { useProjectsQuery } from "../hooks/useProjectsQuery";
import {
  createProjectSchema,
  type CreateProjectFormValues,
} from "../schemas/createProjectSchema";

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
  const [lastCreatedProjectId, setLastCreatedProjectId] = useState<string | null>(null);
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

  const projectError = isApiError(createProjectMutation.error)
    ? createProjectMutation.error
    : null;
  const selectedProjectError = isApiError(projectQuery.error)
    ? projectQuery.error
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
            </div>
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
