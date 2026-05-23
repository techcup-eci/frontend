import { useQuery } from "@tanstack/react-query";
import { getActiveTournament } from "../services/tournamentService";

export const activeTournamentQueryKey = ["tournaments", "active"] as const;

export function useActiveTournament() {
  return useQuery({
    queryKey: activeTournamentQueryKey,
    queryFn: getActiveTournament,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
