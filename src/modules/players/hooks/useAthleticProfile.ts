import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createAthleticProfile,
	deleteAthleticProfile,
	getAthleticProfileByEmail,
	getAthleticProfiles,
	updateAthleticProfile,
} from "../services/athleticProfileService";
import type { AthleticProfileDto } from "../types/athleticProfile";
import { toast } from "sonner";

export const athleticProfilesQueryKey = ["athletic-profiles"] as const;
export const athleticProfileQueryKey = (email: string) =>
	["athletic-profile", email] as const;

// ── Helpers ───────────────────────────────────────────────────────────────

function extractErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		const axiosError = error as { response?: { data?: { error?: string; message?: string } | Record<string, string> } };
		const data = axiosError.response?.data;
		if (data) {
			if ("error" in data && data.error) return data.error;
			if ("message" in data && data.message) return data.message;
			const entries = Object.entries(data);
			if (entries.length > 0) return entries.map(([, msg]) => msg).join(" ");
		}
		return error.message;
	}
	return "Ocurrió un error inesperado";
}

// ── Queries ───────────────────────────────────────────────────────────────

export function useAthleticProfile(email?: string) {
	return useQuery({
		queryKey: athleticProfileQueryKey(email ?? ""),
		queryFn: () => getAthleticProfileByEmail(email as string),
		enabled: Boolean(email),
	});
}

export function useAllAthleticProfiles() {
	return useQuery({
		queryKey: athleticProfilesQueryKey,
		queryFn: getAthleticProfiles,
	});
}

// ── Mutations ─────────────────────────────────────────────────────────────

export function useCreateAthleticProfile() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: AthleticProfileDto) => createAthleticProfile(payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: athleticProfilesQueryKey });
			if (data?.email) {
				queryClient.invalidateQueries({
					queryKey: athleticProfileQueryKey(data.email),
				});
			}
			toast.success("Perfil deportivo creado");
		},
		onError: (error) => {
			toast.error("Error al crear perfil", { description: extractErrorMessage(error) });
		},
	});
}

export function useUpdateAthleticProfile() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, payload }: { userId: number; payload: AthleticProfileDto }) =>
			updateAthleticProfile(userId, payload),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: athleticProfilesQueryKey });
			if (variables.payload.email) {
				queryClient.invalidateQueries({
					queryKey: athleticProfileQueryKey(variables.payload.email),
				});
			}
			toast.success("Perfil deportivo actualizado");
		},
		onError: (error) => {
			toast.error("Error al actualizar perfil", { description: extractErrorMessage(error) });
		},
	});
}

export function useDeleteAthleticProfile() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (userId: number) => deleteAthleticProfile(userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: athleticProfilesQueryKey });
			toast.success("Perfil deportivo eliminado");
		},
		onError: (error) => {
			toast.error("Error al eliminar perfil", { description: extractErrorMessage(error) });
		},
	});
}
