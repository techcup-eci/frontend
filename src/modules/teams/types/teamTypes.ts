/** Matches TeamResponseDTO from teams-ms backend */
export interface Team {
  id: number;
  name: string;
  idTournament?: string | null;
  captainId: number;
  players: number[];
  currentPlayers: number;
  maxPlayers: number;
  minPlayers: number;
  colors: string;
  photo: string;
  code?: string;
  tournamentStatus: "NONE" | "DRAFT" | "ACTIVE" | "IN_PROGRESS" | "FINISHED";
  warning?: string;
}

/** Matches TeamRequestDTO from teams-ms backend */
export interface CreateTeamRequest {
  name: string;
  idTournament?: string;
  colors: string;
  photo: string;
}

/** Request to update team name */
export interface UpdateTeamNameRequest {
  name: string;
}
