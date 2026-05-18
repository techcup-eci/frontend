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
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
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
    },
  });
}

export function useRejectRequest(teamId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (playerId: number) => rejectRequest(teamId, playerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", teamId, "requests"] });
    },
  });
}

export function useSendJoinRequest() {
  return useMutation({
    mutationFn: (teamId: number) => sendJoinRequest(teamId),
  });
}

export function useJoinByCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => joinByCode(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}
