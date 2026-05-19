import { useMutation } from "@tanstack/react-query";
import { register as registerRequest } from "../services/authService";
import type { RegisterRequest } from "../types/RegisterRequest";
import { useAuthStore } from "./useAuthStore";

export function useRegister() {
	const setAuthenticatedUser = useAuthStore((state) => state.setAuthenticatedUser);
	const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);

	const mutation = useMutation({
		mutationFn: (credentials: RegisterRequest) => registerRequest(credentials),
		onSuccess: (user) => {
			setAuthenticatedUser(user);
		},
		onError: () => {
			setUnauthenticated();
		},
	});

	return {
		register: mutation.mutateAsync,
		resetState: mutation.reset,
		isPending: mutation.isPending,
		isSuccess: mutation.isSuccess,
		errorMessage: mutation.error instanceof Error ? mutation.error.message : null,
		loggedUserName: mutation.data?.email ?? null,
	};
}
