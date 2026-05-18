import { useMutation } from "@tanstack/react-query";
import { login as loginRequest } from "../services/authService";
import type { LoginRequest } from "../types/LoginRequest";
import type { AuthUser, AuthRole } from "../types/AuthUser";
import { useAuthStore } from "./useAuthStore";
import { toast } from "sonner";

export function useLogin() {
	const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

	const mutation = useMutation({
		mutationFn: (credentials: LoginRequest) => loginRequest(credentials),
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
			sessionStorage.setItem("playerEmail", data.user.email.trim().toLowerCase());
			toast.success("¡Bienvenido!", { description: `Has iniciado sesión como ${data.user.email}` });
		},
		onError: (error) => {
			const message = extractErrorMessage(error);
			toast.error("Error de autenticación", { description: message });
		},
	});

	return {
		login: mutation.mutateAsync,
		resetState: mutation.reset,
		isPending: mutation.isPending,
		isSuccess: mutation.isSuccess,
		errorMessage: mutation.error instanceof Error ? mutation.error.message : null,
		loggedUserName: mutation.data?.user?.email ?? null,
	};
}

function extractErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		// Axios error with response from backend
		const axiosError = error as { response?: { data?: { error?: string } } };
		if (axiosError.response?.data?.error) {
			return axiosError.response.data.error;
		}
		return error.message;
	}
	return "Ocurrió un error inesperado";
}
