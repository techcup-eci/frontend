import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeamName,
  deleteTeam,
  getPendingRequests,
  acceptRequest,
  rejectRequest,
  sendJoinRequest,
  joinByCode,
} from "../services/teamService";
import type { CreateTeamFormData, UpdateTeamNameFormData } from "../types/teamSchemas";
import { toast } from "sonner";

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

export function useAllTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: getAllTeams,
  });
}

export function useTeam(id: number) {
  return useQuery({
    queryKey: ["teams", id],
    queryFn: () => getTeamById(id),
    enabled: id > 0,
  });
}

export function usePendingRequests(teamId: number) {
  return useQuery({
    queryKey: ["teams", teamId, "requests"],
    queryFn: () => getPendingRequests(teamId),
    enabled: teamId > 0,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTeamFormData) => createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("¡Equipo creado exitosamente!");
    },
    onError: (error) => {
      toast.error("Error al crear equipo", { description: extractErrorMessage(error) });
    },
  });
}

export function useUpdateTeamName(teamId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateTeamNameFormData) => updateTeamName(teamId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", teamId] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Nombre del equipo actualizado");
    },
    onError: (error) => {
      toast.error("Error al actualizar nombre", { description: extractErrorMessage(error) });
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Equipo eliminado");
    },
    onError: (error) => {
      toast.error("Error al eliminar equipo", { description: extractErrorMessage(error) });
    },
  });
}

export function useAcceptRequest(teamId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (playerId: number) => acceptRequest(teamId, playerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", teamId] });
      queryClient.invalidateQueries({ queryKey: ["teams", teamId, "requests"] });
      toast.success("Jugador aceptado al equipo");
    },
    onError: (error) => {
      toast.error("Error al aceptar jugador", { description: extractErrorMessage(error) });
    },
  });
}

export function useRejectRequest(teamId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (playerId: number) => rejectRequest(teamId, playerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", teamId, "requests"] });
      toast.success("Solicitud rechazada");
    },
    onError: (error) => {
      toast.error("Error al rechazar solicitud", { description: extractErrorMessage(error) });
    },
  });
}

export function useSendJoinRequest() {
  return useMutation({
    mutationFn: (teamId: number) => sendJoinRequest(teamId),
    onSuccess: () => {
      toast.success("Solicitud de unión enviada");
    },
    onError: (error) => {
      toast.error("Error al enviar solicitud", { description: extractErrorMessage(error) });
    },
  });
}

export function useJoinByCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => joinByCode(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Solicitud enviada por código");
    },
    onError: (error) => {
      toast.error("Error al unirse por código", { description: extractErrorMessage(error) });
    },
  });
}
