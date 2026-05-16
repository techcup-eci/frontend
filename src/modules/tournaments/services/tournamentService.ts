import { apiClient } from "../../../core/api/apiClient";
import type { TournamentResponse, CreateTournamentPayload } from "../types/tournament";

export type { TournamentResponse, CreateTournamentPayload };

export const getTournaments = async (): Promise<TournamentResponse[]> => {
  const response = await apiClient.get("/tournaments");
  return response.data;
};

export const createTournament = (data: CreateTournamentPayload) => {
  return apiClient.post("/tournaments", data);
};

export const activateTournament = async (id: string) => {
  const response = await apiClient.patch(`/tournaments/${id}/activate`);
  return response.data;
};


export const finishTournament = async (id: string): Promise<TournamentResponse> => {
  const { data } = await apiClient.patch<TournamentResponse>(`/tournaments/${id}/finish`);
  return data;
};

export const deleteTournament = async (id: string): Promise<void> => {
  await apiClient.delete(`/tournaments/${id}`);
};