import { useMutation } from "@tanstack/react-query";
import { register as registerRequest } from "../services/authService";
import type { RegisterRequest } from "../types/authSchemas";
import type { AuthUser, AuthRole } from "../types/AuthUser";
import { useAuthStore } from "./useAuthStore";
import { toast } from "sonner";

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
			toast.success("¡Registro exitoso!", { description: `Bienvenido ${data.user.name}` });
		},
		onError: (error) => {
			const message = extractErrorMessage(error);
			toast.error("Error de registro", { description: message });
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

function extractErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		const axiosError = error as { response?: { data?: { error?: string } | Record<string, string> } };
		const data = axiosError.response?.data;
		if (data) {
			// Single error message (BusinessException)
			if ("error" in data && data.error) return data.error;
			// Validation errors map: { field: "message" }
			const entries = Object.entries(data);
			if (entries.length > 0) {
				return entries.map(([, msg]) => msg).join(" ");
			}
		}
		return error.message;
	}
	return "Ocurrió un error inesperado";
}
