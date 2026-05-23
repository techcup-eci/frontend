import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRegistrations,
  registerTeam,
  approveRegistration,
  rejectRegistration,
  cancelRegistration,
} from "../services/registrationService";
import type { RegisterTeamRequest } from "../services/registrationService";
import { toast } from "sonner";

// ── Helpers ──

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const axiosError = error as { response?: { data?: { error?: string; message?: string } } };
    const data = axiosError.response?.data;
    if (data) {
      if ("error" in data && data.error) return data.error;
      if ("message" in data && data.message) return data.message;
    }
    return error.message;
  }
  return "Ocurrió un error inesperado";
}

// ── Queries ──

export const registrationsQueryKey = (tournamentId: string) =>
  ["registrations", tournamentId] as const;

export function useRegistrations(tournamentId: string) {
  return useQuery({
    queryKey: registrationsQueryKey(tournamentId),
    queryFn: () => getRegistrations(tournamentId),
    enabled: !!tournamentId,
  });
}

// ── Mutations ──

export function useRegisterTeam(tournamentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ captainId, request }: { captainId: number; request: RegisterTeamRequest }) =>
      registerTeam(tournamentId, captainId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: registrationsQueryKey(tournamentId) });
      toast.success("Equipo inscrito al torneo");
    },
    onError: (error) => {
      toast.error("Error al inscribir equipo", { description: extractErrorMessage(error) });
    },
  });
}

export function useApproveRegistration(tournamentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ registrationId, organizerId }: { registrationId: string; organizerId: number }) =>
      approveRegistration(tournamentId, registrationId, organizerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: registrationsQueryKey(tournamentId) });
      toast.success("Inscripción aprobada");
    },
    onError: (error) => {
      toast.error("Error al aprobar inscripción", { description: extractErrorMessage(error) });
    },
  });
}

export function useRejectRegistration(tournamentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ registrationId, organizerId }: { registrationId: string; organizerId: number }) =>
      rejectRegistration(tournamentId, registrationId, organizerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: registrationsQueryKey(tournamentId) });
      toast.success("Inscripción rechazada");
    },
    onError: (error) => {
      toast.error("Error al rechazar inscripción", { description: extractErrorMessage(error) });
    },
  });
}

export function useCancelRegistration(tournamentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ registrationId, captainId }: { registrationId: string; captainId: number }) =>
      cancelRegistration(tournamentId, registrationId, captainId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: registrationsQueryKey(tournamentId) });
      toast.success("Inscripción cancelada");
    },
    onError: (error) => {
      toast.error("Error al cancelar inscripción", { description: extractErrorMessage(error) });
    },
  });
}
