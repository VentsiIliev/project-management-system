import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { isApiError } from "../../../api/client";
import { Button } from "../../../components/Button";
import { Field } from "../../../components/Field";
import { Panel } from "../../../components/Panel";
import { StatusMessage } from "../../../components/StatusMessage";
import { AppShellPage } from "../../auth/pages/AppShellPage";
import { type SessionUser } from "../../auth/types";
import { useCreateProjectMutation } from "../hooks/useCreateProjectMutation";
import {
  createProjectSchema,
  type CreateProjectFormValues,
} from "../schemas/createProjectSchema";
import { type Project } from "../types";

type ProjectsHomePageProps = {
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

export function ProjectsHomePage({ user }: ProjectsHomePageProps) {
  const createProjectMutation = useCreateProjectMutation();
  const [createdProject, setCreatedProject] = useState<Project | null>(null);
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
  const serverNameError = getDetailMessages(projectError?.details.name)[0];
  const serverCodeError = getDetailMessages(projectError?.details.code)[0];
  const serverStartDateError = getDetailMessages(projectError?.details.start_date)[0];
  const serverEndDateError = getDetailMessages(projectError?.details.end_date)[0];
  const serverDescriptionError = getDetailMessages(projectError?.details.description)[0];
  const serverFormError =
    projectError?.code === "PROJECT_PERMISSION_DENIED"
      ? null
      :
    Object.entries(projectError?.details ?? {})
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
      <div className="workspace-grid">
        <Panel>
          <div className="panel-heading">
            <h2 className="panel-heading__title">Create a project</h2>
            <p className="panel-heading__body">
              Seed the first real product space from the authenticated shell. Project codes are normalized to uppercase
              on submit and remain stable for later task-key generation.
            </p>
          </div>
          <form
            className="form-stack"
            onSubmit={handleSubmit((values) => {
              createProjectMutation.reset();
              setCreatedProject(null);
              createProjectMutation.mutate(values, {
                onSuccess: (project) => {
                  setCreatedProject(project);
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
            <Button disabled={createProjectMutation.isPending} type="submit">
              {createProjectMutation.isPending ? "Creating project..." : "Create project"}
            </Button>
          </form>
        </Panel>

        <Panel>
          <div className="panel-heading">
            <h2 className="panel-heading__title">Latest created project</h2>
            <p className="panel-heading__body">
              Successful project creation returns the canonical backend payload directly into the shell.
            </p>
          </div>
          {createdProject ? (
            <div className="project-summary">
              <div className="project-summary__code">{createdProject.code}</div>
              <h3 className="card-title">{createdProject.name}</h3>
              <p className="shell__summary project-summary__description">
                {createdProject.description || "No description was provided for this project."}
              </p>
              <dl className="details-list">
                <div>
                  <dt>Owner ID</dt>
                  <dd>{createdProject.owner_id}</dd>
                </div>
                <div>
                  <dt>Task counter</dt>
                  <dd>{createdProject.task_counter}</dd>
                </div>
                <div>
                  <dt>Start date</dt>
                  <dd>{createdProject.start_date || "Not set"}</dd>
                </div>
                <div>
                  <dt>End date</dt>
                  <dd>{createdProject.end_date || "Not set"}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <StatusMessage title="No project created yet">
              Submit the form to see the first created project payload rendered in the main application shell.
            </StatusMessage>
          )}
        </Panel>
      </div>
    </AppShellPage>
  );
}
