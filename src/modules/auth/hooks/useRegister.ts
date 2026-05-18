import { useMutation } from "@tanstack/react-query";
import { register as registerRequest } from "../services/authService";
import type { RegisterRequest } from "../types/authSchemas";
import type { AuthUser, AuthRole } from "../types/AuthUser";
import { useAuthStore } from "./useAuthStore";

export function useRegister() {
	const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

	const mutation = useMutation({
		mutationFn: (data: RegisterRequest) => registerRequest(data),
		onSuccess: (data) => {
			const roleMap: Record<string, string> = {
				PLAYER: "player",
				CAPTAIN: "captain",
				ORGANIZER: "organizer",
				REFEREE: "referee",
				ADMIN: "admin",
				INVITED: "invited",
			};
			const user: AuthUser = {
				...data.user,
				role: (roleMap[data.user.role] ?? data.user.role.toLowerCase()) as AuthRole,
			};
			setAuthenticated(data.accessToken, user);
		},
	});

	return {
		register: mutation.mutateAsync,
		resetState: mutation.reset,
		isPending: mutation.isPending,
		isSuccess: mutation.isSuccess,
		errorMessage: mutation.error instanceof Error ? mutation.error.message : null,
	};
}
