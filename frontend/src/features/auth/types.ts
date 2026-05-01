export type SessionUser = {
  id: string;
  email: string;
  name: string;
  is_admin: boolean;
  must_reset_password: boolean;
};

export type LoginResponse = {
  user: SessionUser;
  requires_password_reset: boolean;
};
