import { z } from "zod";
import { apiClient } from "../../../core/api/apiClient";
import {
  createTeamSchema,
  updateTeamNameSchema,
  teamResponseSchema,
  type CreateTeamFormData,
  type UpdateTeamNameFormData,
} from "../types/teamSchemas";
import type { Team } from "../types/teamTypes";

// ── Create Team ───────────────────────────────────────────────────────────

export async function createTeam(data: CreateTeamFormData): Promise<Team> {
  const parsed = createTeamSchema.parse(data);
  const response = await apiClient.post("/api/teams", {
    name: parsed.name,
    idTournament: parsed.idTournament ?? null,
    colors: parsed.colors,
    photo: parsed.photo ?? "",
  });
  return teamResponseSchema.parse(response.data);
}

// ── Get All Teams ─────────────────────────────────────────────────────────

export async function getAllTeams(): Promise<Team[]> {
  const response = await apiClient.get("/api/teams");
  return z.array(teamResponseSchema).parse(response.data);
}

export async function getTeamById(id: number): Promise<Team> {
  const response = await apiClient.get(`/api/teams/${id}`);
  return teamResponseSchema.parse(response.data);
}

// ── Update Team Name ──────────────────────────────────────────────────────

export async function updateTeamName(
  teamId: number,
  data: UpdateTeamNameFormData
): Promise<Team> {
  const parsed = updateTeamNameSchema.parse(data);
  const response = await apiClient.put(`/api/teams/${teamId}/name`, {
    name: parsed.name,
  });
  return teamResponseSchema.parse(response.data);
}

// ── Delete Team ───────────────────────────────────────────────────────────

export async function deleteTeam(id: number): Promise<void> {
  await apiClient.delete(`/api/teams/${id}`);
}

// ── Requests ──────────────────────────────────────────────────────────────

export async function getPendingRequests(teamId: number): Promise<number[]> {
  const response = await apiClient.get(`/api/teams/${teamId}/solicitudes`);
  return z.array(z.number()).parse(response.data);
}

export async function acceptRequest(
  teamId: number,
  playerId: number
): Promise<Team> {
  const response = await apiClient.post(
    `/api/teams/${teamId}/solicitudes/${playerId}/accept`
  );
  return teamResponseSchema.parse(response.data);
}

export async function rejectRequest(
  teamId: number,
  playerId: number
): Promise<void> {
  await apiClient.post(`/api/teams/${teamId}/solicitudes/${playerId}/reject`);
}

export async function sendJoinRequest(teamId: number): Promise<void> {
  await apiClient.post(`/api/teams/${teamId}/solicitudes`);
}

export async function joinByCode(code: string): Promise<void> {
  await apiClient.post(`/api/teams/join?code=${encodeURIComponent(code)}`);
}
