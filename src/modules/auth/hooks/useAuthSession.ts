import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";

export const authMeQueryKey = ["auth", "me"] as const;

export function useAuthSession() {
	const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);
	const user = useAuthStore((state) => state.user);

	useEffect(() => {
		if (!user) return;
		if (Date.now() >= user.expiresAt) {
			setUnauthenticated();
		}
	}, [user, setUnauthenticated]);
}