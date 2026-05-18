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
  const { data } = await apiClient.get(`/api/tournaments/${tournamentId}/matches`);
  return data;
};

/**
 * Get matches for the active tournament.
 * Returns empty array if no active tournament (204 response).
 */
export const getActiveMatches = async (): Promise<MatchResponse[]> => {
  try {
    const { data } = await apiClient.get("/api/tournaments/matches/active");
    return data;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } };
    if (err.response?.status === 204) return [];
    throw error;
  }
};

export const getMatchById = async (tournamentId: string, matchId: string): Promise<MatchResponse> => {
  const { data } = await apiClient.get(`/api/tournaments/${tournamentId}/matches/${matchId}`);
  return data;
};

export const createMatch = async (
  tournamentId: string,
  match: CreateMatchRequest,
): Promise<MatchResponse> => {
  const { data } = await apiClient.post(`/api/tournaments/${tournamentId}/matches`, match);
  return data;
};

export const updateMatch = async (
  tournamentId: string,
  matchId: string,
  match: UpdateMatchRequest,
): Promise<MatchResponse> => {
  const { data } = await apiClient.put(`/api/tournaments/${tournamentId}/matches/${matchId}`, match);
  return data;
};

export const deleteMatch = async (tournamentId: string, matchId: string): Promise<void> => {
  await apiClient.delete(`/api/tournaments/${tournamentId}/matches/${matchId}`);
};

export const reportResult = async (
  tournamentId: string,
  matchId: string,
  result: MatchResultRequest,
): Promise<MatchResponse> => {
  const { data } = await apiClient.patch(
    `/api/tournaments/${tournamentId}/matches/${matchId}/result`,
    result,
  );
  return data;
};

export const getRefereeMatches = async (
  tournamentId: string,
  refereeId: string,
): Promise<MatchResponse[]> => {
  const { data } = await apiClient.get(`/api/tournaments/${tournamentId}/matches/referee/${refereeId}`);
  return data;
};

// ── Standings ──

export const getStandings = async (tournamentId: string): Promise<StandingResponse[]> => {
  const { data } = await apiClient.get(`/api/tournaments/${tournamentId}/stats/standings`);
  return data;
};

/**
 * Get standings for the active tournament.
 * Returns empty array if no active tournament (204 response).
 */
export const getActiveStandings = async (): Promise<StandingResponse[]> => {
  try {
    const { data } = await apiClient.get("/api/stats/standings");
    return data;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } };
    if (err.response?.status === 204) return [];
    throw error;
  }
};

// ── Stats (active tournament) ──

export interface TopScorerResponse {
  playerId: string;
  playerName?: string;
  teamId?: string;
  teamName?: string;
  goals: number;
  matchesPlayed?: number;
}

export interface MatchHistoryResponse {
  matchId: string;
  round: string;
  matchOrder: number;
  homeTeamId: string;
  homeTeamName?: string;
  awayTeamId: string;
  awayTeamName?: string;
  homeScore: number | null;
  awayScore: number | null;
  scheduledAt: string;
  status: string;
}

export const getActiveTopScorers = async (): Promise<TopScorerResponse[]> => {
  try {
    const { data } = await apiClient.get("/api/stats/top-scorers");
    return data;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } };
    if (err.response?.status === 204) return [];
    throw error;
  }
};

export const getActiveMatchHistory = async (): Promise<MatchHistoryResponse[]> => {
  try {
    const { data } = await apiClient.get("/api/stats/matches");
    return data;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } };
    if (err.response?.status === 204) return [];
    throw error;
  }
};

export interface TeamStatsResponse {
  teamId: string;
  played: number;
  wins: number;
  losses: number;
  draws: number;
  goalsScored: number;
  goalsReceived: number;
  goalDiff: number;
  points: number;
}

export const getActiveTeamStats = async (teamId: string): Promise<TeamStatsResponse> => {
  const { data } = await apiClient.get(`/api/stats/teams/${teamId}`);
  return data;
};

// ── Lineups ──

export const getLineup = async (
  tournamentId: string,
  matchId: string,
  teamId: string,
): Promise<LineupResponse> => {
  const { data } = await apiClient.get(
    `/api/tournaments/${tournamentId}/matches/${matchId}/lineups/${teamId}`,
  );
  return data;
};

export const createLineup = async (
  tournamentId: string,
  matchId: string,
  teamId: string,
  lineup: CreateLineupRequest,
): Promise<LineupResponse> => {
  const { data } = await apiClient.put(
    `/api/tournaments/${tournamentId}/matches/${matchId}/lineups/${teamId}`,
    lineup,
  );
  return data;
};
