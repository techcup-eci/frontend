import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getCurrentUser } from "../services/authService";
import { useAuthStore } from "./useAuthStore";

export const authMeQueryKey = ["auth", "me"] as const;

export function useAuthSession() {
	const setAuthChecking = useAuthStore((state) => state.setAuthChecking);
	const setAuthenticatedUser = useAuthStore((state) => state.setAuthenticatedUser);
	const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);

	const query = useQuery({
		queryKey: authMeQueryKey,
		queryFn: getCurrentUser,
		retry: false,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (query.isPending) {
			setAuthChecking();
			return;
		}

		if (query.isSuccess) {
			setAuthenticatedUser(query.data);
			return;
		}

		setUnauthenticated();
	}, [query.data, query.isPending, query.isSuccess, setAuthenticatedUser, setAuthChecking, setUnauthenticated]);

	return query;
}