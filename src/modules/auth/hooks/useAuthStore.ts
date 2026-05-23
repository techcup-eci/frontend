import { create } from "zustand";
import type { AuthUser } from "../types/AuthUser";

// ── Types ────────────────────────────────────────────────────────────────

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

interface StoredAuth {
	accessToken: string;
	user: AuthUser;
}

interface AuthState {
	status: AuthStatus;
	accessToken: string | null;
	user: AuthUser | null;

	setAuthenticated: (accessToken: string, user: AuthUser) => void;
	setUnauthenticated: () => void;
	setChecking: () => void;
	checkAuth: () => Promise<void>;
	refreshAuth: () => Promise<void>;
}

// ── Helpers ──────────────────────────────────────────────────────────────

const STORAGE_KEY = "auth_state";
const BASE_URL = (
	import.meta.env.VITE_API_URL ?? "http://localhost:8081"
).replace(/\/$/, "");

function loadFromStorage(): StoredAuth | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as StoredAuth;
		if (!parsed.accessToken || !parsed.user?.id) return null;
		return parsed;
	} catch {
		return null;
	}
}

// ── Store ────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set, get) => ({
	status: "checking",
	accessToken: null,
	user: null,

	setAuthenticated: (accessToken, user) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ accessToken, user }));
		set({ status: "authenticated", accessToken, user });
	},

	setUnauthenticated: () => {
		localStorage.removeItem(STORAGE_KEY);
		set({ status: "unauthenticated", accessToken: null, user: null });
	},

	setChecking: () => set({ status: "checking" }),

	checkAuth: async () => {
		set({ status: "checking" });

		const stored = loadFromStorage();
		console.log("Loaded auth from storage:", stored);
		if (!stored) {
			set({ status: "unauthenticated", accessToken: null, user: null });
			return;
		}

		// Validate stored token
		try {
			const validateRes = await fetch(`${BASE_URL}/api/auth/validate`, {
				headers: { Authorization: `Bearer ${stored.accessToken}` },
			});

			if (validateRes.ok) {
				const data = await validateRes.json();
				const roleMap: Record<string, string> = {
					PLAYER: "player",
					CAPTAIN: "captain",
					ORGANIZER: "organizer",
					REFEREE: "referee",
					ADMIN: "admin",
					INVITED: "invited",
				};
				const mappedRole =
					roleMap[data.user.role] ?? data.user.role.toLowerCase();
				set({
					status: "authenticated",
					accessToken: stored.accessToken,
					user: { ...data.user, role: mappedRole } ?? {
						...stored.user,
						role: mappedRole,
					},
				});
				return;
			}

			if (validateRes.status === 401) {
				// Try silent refresh
				await get().refreshAuth();
				return;
			}
		} catch {
			// Network error — try refresh before giving up
		}

		// If validate failed with non-401 or network error, try refresh
		try {
			await get().refreshAuth();
		} catch {
			get().setUnauthenticated();
		}
	},

	refreshAuth: async () => {
		const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
			method: "POST",
			credentials: "include",
		});

		if (!res.ok) {
			get().setUnauthenticated();
			throw new Error("Refresh failed");
		}

		const data = await res.json();
		const roleMap: Record<string, string> = {
			PLAYER: "player",
			CAPTAIN: "captain",
			ORGANIZER: "organizer",
			REFEREE: "referee",
			ADMIN: "admin",
			INVITED: "invited",
		};
		const mappedRole = roleMap[data.user.role] ?? data.user.role.toLowerCase();
		get().setAuthenticated(data.accessToken, {
			...data.user,
			role: mappedRole,
		});
	},
}));

// ── Auto-init: check auth on app load ────────────────────────────────────
useAuthStore.getState().checkAuth();
