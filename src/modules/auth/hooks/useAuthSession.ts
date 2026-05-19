import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";
import { getMe } from "../services/authService";

export const authMeQueryKey = ["auth", "me"] as const;

export function useAuthSession() {
	const setAuthenticatedUser = useAuthStore((state) => state.setAuthenticatedUser);
	const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);
	const user = useAuthStore((state) => state.user);

	useEffect(() => {
		if (!user) return;
		if (Date.now() >= user.expiresAt) {
			setUnauthenticated();
			return;
		}

		let isActive = true;

		async function validateSession() {
			try {
				const me = await getMe();
				if (!isActive) return;
				setAuthenticatedUser({ ...user, email: me.email, role: me.role });
			} catch {
				if (isActive) setUnauthenticated();
			}
		}

		validateSession();

		return () => {
			isActive = false;
		};
	}, [user, setAuthenticatedUser, setUnauthenticated]);
}