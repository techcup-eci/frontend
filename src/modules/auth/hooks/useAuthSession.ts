import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";

export const authMeQueryKey = ["auth", "me"] as const;

/**
 * Runs a client-side auth check on mount.
 * The store's checkAuth() already handles this on app load,
 * but this hook provides a way for individual components to re-trigger.
 */
export function useAuthSession() {
	const checkAuth = useAuthStore((state) => state.checkAuth);
	const status = useAuthStore((state) => state.status);

	useEffect(() => {
		if (status === "unauthenticated") {
			checkAuth();
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
}
