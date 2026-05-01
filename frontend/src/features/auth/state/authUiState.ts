import { create } from "zustand";

type AuthUiNotice = "session-expired" | null;

type AuthUiState = {
  notice: AuthUiNotice;
  setNotice: (notice: AuthUiNotice) => void;
  clearNotice: () => void;
};

export const useAuthUiStore = create<AuthUiState>((set) => ({
  notice: null,
  setNotice: (notice) => {
    set({ notice });
  },
  clearNotice: () => {
    set({ notice: null });
  },
}));

export function markSessionExpired() {
  useAuthUiStore.getState().setNotice("session-expired");
}

export function clearAuthUiNotice() {
  useAuthUiStore.getState().clearNotice();
}
