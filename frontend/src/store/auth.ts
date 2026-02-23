import { create } from "zustand";

export type Role = "customer" | "worker" | null;

interface AuthState {
  token: string | null;
  role: Role;
  isAuthenticated: boolean;
  login: (token: string, role: Role) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  isAuthenticated: false,

  login: (token, role) =>
    set({
      token,
      role,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      token: null,
      role: null,
      isAuthenticated: false,
    }),
}));