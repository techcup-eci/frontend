import { useQuery } from "@tanstack/react-query";
import { getStandings } from "../services/competitionService";

export const standingsQueryKey = (tournamentId: string) => ["standings", tournamentId] as const;

export function useStandings(tournamentId: string) {
  return useQuery({
    queryKey: standingsQueryKey(tournamentId),
    queryFn: () => getStandings(tournamentId),
    enabled: !!tournamentId,
  });
}
