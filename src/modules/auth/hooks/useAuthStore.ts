import { create } from "zustand";
import type { AuthUser } from "../types/AuthUser";

const STORAGE_KEY = "auth_user";

function loadFromStorage(): AuthUser | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const user = JSON.parse(raw) as AuthUser;
		if (Date.now() >= user.expiresAt) {
			localStorage.removeItem(STORAGE_KEY);
			return null;
		}
		return user;
	} catch {
		return null;
	}
}

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

interface AuthState {
	status: AuthStatus;
	user: AuthUser | null;
	setAuthChecking: () => void;
	setAuthenticatedUser: (user: AuthUser) => void;
	setUnauthenticated: () => void;
}

const storedUser = loadFromStorage();

export const useAuthStore = create<AuthState>((set) => ({
	status: storedUser ? "authenticated" : "unauthenticated",
	user: storedUser,
	setAuthChecking: () => set({ status: "checking" }),
	setAuthenticatedUser: (user) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
		set({ status: "authenticated", user });
	},
	setUnauthenticated: () => {
		localStorage.removeItem(STORAGE_KEY);
		set({ status: "unauthenticated", user: null });
	},
}));