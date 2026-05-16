export interface MatchResponse {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  round: string;
  matchOrder: number;
  scheduledAt: string;
  status: string;
  tournamentId: string;
  tournamentName?: string;
  fieldId?: string;
  fieldName?: string;
  refereeId?: string;
}

export interface CreateMatchRequest {
  homeTeamId: string;
  awayTeamId: string;
  round: string;
  matchOrder: number;
  scheduledAt: string;
  fieldId?: string;
}

export interface UpdateMatchRequest {
  scheduledAt?: string;
  fieldId?: string;
  refereeId?: string;
}

export interface MatchResultRequest {
  homeScore: number;
  awayScore: number;
  goals: { playerId: string; teamId: string; minute: number; goalType: string }[];
  cards: { playerId: string; teamId: string; type: string; minute: number }[];
}

export interface LineupResponse {
  id: string;
  formation: string;
  teamId: string;
  captainId: string;
  matchId: string;
  players: { playerId: string; role: string }[];
}

export interface CreateLineupRequest {
  formation: string;
  players: { playerId: string; role: string }[];
}

export interface StandingResponse {
  teamId: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsReceived: number;
  goalDiff: number;
  points: number;
}
