import { useQuery } from "@tanstack/react-query";
import { getMatches } from "../services/competitionService";

export const matchesQueryKey = (tournamentId: string) => ["matches", tournamentId] as const;

export function useMatches(tournamentId: string) {
  return useQuery({
    queryKey: matchesQueryKey(tournamentId),
    queryFn: () => getMatches(tournamentId),
    enabled: !!tournamentId,
  });
}
