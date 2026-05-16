import { useQuery } from "@tanstack/react-query";
import { getMatchById } from "../services/competitionService";

export const matchDetailQueryKey = (tournamentId: string, matchId: string) =>
  ["match", tournamentId, matchId] as const;

export function useMatchDetail(tournamentId: string, matchId: string) {
  return useQuery({
    queryKey: matchDetailQueryKey(tournamentId, matchId),
    queryFn: () => getMatchById(tournamentId, matchId),
    enabled: !!tournamentId && !!matchId,
  });
}
