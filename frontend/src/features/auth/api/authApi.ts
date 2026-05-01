import { apiRequest, isApiError } from "../../../api/client";
import { type LoginFormValues } from "../schemas/loginSchema";
import { type LoginResponse, type SessionUser } from "../types";

function normalizeSessionUser(user: SessionUser) {
  return {
    ...user,
    must_reset_password: Boolean(user.must_reset_password),
  };
}

export async function login(values: LoginFormValues): Promise<SessionUser> {
  const response = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(values),
  });

  const user = normalizeSessionUser(response.user);
  return {
    ...user,
    must_reset_password:
      response.requires_password_reset ?? user.must_reset_password,
  };
}

export async function fetchSession(): Promise<SessionUser | null> {
  try {
    const session = await apiRequest<SessionUser>("/auth/me");
    return normalizeSessionUser(session);
  } catch (error) {
    if (isApiError(error) && error.status === 401) {
      return null;
    }

    throw error;
  }
}
