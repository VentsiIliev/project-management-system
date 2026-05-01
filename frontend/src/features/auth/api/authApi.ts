import { apiRequest, isApiError } from "../../../api/client";
import { type LoginFormValues } from "../schemas/loginSchema";
import { type LoginResponse, type SessionUser } from "../types";

type ForceResetPasswordRequest = {
  new_password: string;
};

type SessionResponse = SessionUser | { user: SessionUser };

function normalizeSessionUser(user: SessionUser) {
  return {
    ...user,
    must_reset_password: Boolean(user.must_reset_password),
  };
}

function extractSessionUser(response: SessionResponse) {
  const user = "user" in response ? response.user : response;
  return normalizeSessionUser(user);
}

export async function login(values: LoginFormValues): Promise<SessionUser> {
  const response = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(values),
  });

  const user = extractSessionUser(response);
  return {
    ...user,
    must_reset_password:
      response.requires_password_reset ?? user.must_reset_password,
  };
}

export async function forceResetPassword(
  values: ForceResetPasswordRequest,
): Promise<SessionUser> {
  const response = await apiRequest<SessionResponse>("/auth/force-reset-password", {
    method: "POST",
    body: JSON.stringify(values),
  });

  return extractSessionUser(response);
}

export async function logout(): Promise<void> {
  await apiRequest<null>("/auth/logout", {
    method: "POST",
  });
}

export async function fetchSession(): Promise<SessionUser | null> {
  try {
    const session = await apiRequest<SessionUser>("/auth/me", {
      suppressUnauthorizedHandler: true,
    });
    return extractSessionUser(session);
  } catch (error) {
    if (isApiError(error) && error.status === 401) {
      return null;
    }

    throw error;
  }
}
