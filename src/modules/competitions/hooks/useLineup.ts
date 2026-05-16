import { useQuery } from "@tanstack/react-query";
import { getLineup } from "../services/competitionService";

export const lineupQueryKey = (tournamentId: string, matchId: string, teamId: string) =>
  ["lineup", tournamentId, matchId, teamId] as const;

export function useLineup(tournamentId: string, matchId: string, teamId: string) {
  return useQuery({
    queryKey: lineupQueryKey(tournamentId, matchId, teamId),
    queryFn: () => getLineup(tournamentId, matchId, teamId),
    enabled: !!tournamentId && !!matchId && !!teamId,
  });
}
