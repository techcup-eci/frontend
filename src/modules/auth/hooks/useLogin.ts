import { useMutation } from "@tanstack/react-query";
import { login as loginRequest } from "../services/authService";
import type { LoginRequest } from "../types/LoginRequest";
import { useAuthStore } from "./useAuthStore";

export function useLogin() {
	const setAuthenticatedUser = useAuthStore((state) => state.setAuthenticatedUser);
	const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);

	const mutation = useMutation({
		mutationFn: (credentials: LoginRequest) => loginRequest(credentials),
		onSuccess: (user) => {
			setAuthenticatedUser(user);
		},
		onError: () => {
			setUnauthenticated();
		},
	});

	return {
		login: mutation.mutateAsync,
		resetState: mutation.reset,
		isPending: mutation.isPending,
		isSuccess: mutation.isSuccess,
		errorMessage: mutation.error instanceof Error ? mutation.error.message : null,
		loggedUserName: mutation.data?.email ?? null,
	};
}