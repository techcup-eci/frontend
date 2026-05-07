import { apiClient } from "../../../core/api/apiClient";

export interface TournamentResponse {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  registrationCloseDate: string;
  maxTeams: number;
  cost: number;
  status: string;
  regulationsUrl?: string;
}

export const getTournaments = async (): Promise<TournamentResponse[]> => {
  const response = await apiClient.get("/tournaments");
  return response.data;
};

export const createTournament = (data: {
  name: string;
  startDate: string;
  endDate: string;
  registrationCloseDate: string;
  maxTeams: number;
  cost: number;
  regulationsUrl?: string;
}) => {
  return apiClient.post("/tournaments", data);
};

export const activateTournament = async (id: string) => {
  const response = await apiClient.patch(`/tournaments/${id}/activate`);
  return response.data;
};