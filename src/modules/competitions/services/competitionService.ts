import { apiClient } from "../../../core/api/apiClient";
import type {
  MatchResponse,
  CreateMatchRequest,
  UpdateMatchRequest,
  MatchResultRequest,
  LineupResponse,
  CreateLineupRequest,
  StandingResponse,
} from "../types/competition";

// ── Matches ──

export const getMatches = async (tournamentId: string): Promise<MatchResponse[]> => {
  const { data } = await apiClient.get(`/tournaments/${tournamentId}/matches`);
  return data;
};

export const getMatchById = async (tournamentId: string, matchId: string): Promise<MatchResponse> => {
  const { data } = await apiClient.get(`/tournaments/${tournamentId}/matches/${matchId}`);
  return data;
};

export const createMatch = async (
  tournamentId: string,
  match: CreateMatchRequest,
  userId: string,
): Promise<MatchResponse> => {
  const { data } = await apiClient.post(`/tournaments/${tournamentId}/matches`, match, {
    headers: { "X-User-Id": userId },
  });
  return data;
};

export const updateMatch = async (
  tournamentId: string,
  matchId: string,
  match: UpdateMatchRequest,
): Promise<MatchResponse> => {
  const { data } = await apiClient.put(`/tournaments/${tournamentId}/matches/${matchId}`, match);
  return data;
};

export const deleteMatch = async (tournamentId: string, matchId: string): Promise<void> => {
  await apiClient.delete(`/tournaments/${tournamentId}/matches/${matchId}`);
};

export const reportResult = async (
  tournamentId: string,
  matchId: string,
  result: MatchResultRequest,
): Promise<MatchResponse> => {
  const { data } = await apiClient.patch(
    `/tournaments/${tournamentId}/matches/${matchId}/result`,
    result,
  );
  return data;
};

export const getRefereeMatches = async (
  tournamentId: string,
  refereeId: string,
): Promise<MatchResponse[]> => {
  const { data } = await apiClient.get(`/tournaments/${tournamentId}/matches/referee/${refereeId}`);
  return data;
};

// ── Standings ──

export const getStandings = async (tournamentId: string): Promise<StandingResponse[]> => {
  const { data } = await apiClient.get(`/tournaments/${tournamentId}/stats/standings`);
  return data;
};

// ── Lineups ──

export const getLineup = async (
  tournamentId: string,
  matchId: string,
  teamId: string,
): Promise<LineupResponse> => {
  const { data } = await apiClient.get(
    `/tournaments/${tournamentId}/matches/${matchId}/lineups/${teamId}`,
  );
  return data;
};

export const createLineup = async (
  tournamentId: string,
  matchId: string,
  teamId: string,
  lineup: CreateLineupRequest,
  userId: string,
): Promise<LineupResponse> => {
  const { data } = await apiClient.put(
    `/tournaments/${tournamentId}/matches/${matchId}/lineups/${teamId}`,
    lineup,
    {
      headers: { "X-User-Id": userId },
    },
  );
  return data;
};
