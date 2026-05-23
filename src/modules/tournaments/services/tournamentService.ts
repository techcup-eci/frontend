import { apiClient } from "../../../core/api/apiClient";
import type { TournamentResponse, CreateTournamentPayload } from "../types/tournament";

export type { TournamentResponse, CreateTournamentPayload };

export const getTournaments = async (): Promise<TournamentResponse[]> => {
  const response = await apiClient.get("/api/tournaments");
  return response.data;
};

/**
 * Get the most recent ACTIVE or IN_PROGRESS tournament.
 * Returns null if no active tournament exists (204 response).
 */
export const getActiveTournament = async (): Promise<TournamentResponse | null> => {
  try {
    const response = await apiClient.get("/api/tournaments/active");
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } };
    if (err.response?.status === 204) return null;
    throw error;
  }
};

export const createTournament = (data: CreateTournamentPayload) => {
  return apiClient.post("/api/tournaments", data);
};

export const activateTournament = async (id: string) => {
  const response = await apiClient.patch(`/api/tournaments/${id}/activate`);
  return response.data;
};


export const finishTournament = async (id: string): Promise<TournamentResponse> => {
  const { data } = await apiClient.patch<TournamentResponse>(`/api/tournaments/${id}/finish`);
  return data;
};

export const deleteTournament = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/tournaments/${id}`);
};