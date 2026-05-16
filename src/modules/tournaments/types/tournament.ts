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

export interface CreateTournamentPayload {
  name: string;
  startDate: string;
  endDate: string;
  registrationCloseDate: string;
  maxTeams: number;
  cost: number;
  regulationsUrl?: string;
}
