import { create } from "zustand";
import type { AuthUser } from "../types/AuthUser";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

interface AuthState {
	status: AuthStatus;
	user: AuthUser | null;
	setAuthChecking: () => void;
	setAuthenticatedUser: (user: AuthUser) => void;
	setUnauthenticated: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	status: "checking",
	user: null,
	setAuthChecking: () => set({ status: "checking" }),
	setAuthenticatedUser: (user) => set({ status: "authenticated", user }),
	setUnauthenticated: () => set({ status: "unauthenticated", user: null }),
}));