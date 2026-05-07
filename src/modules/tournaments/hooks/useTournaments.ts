import { useQuery } from "@tanstack/react-query";
import { getTournaments } from "../services/tournamentService";

export const tournamentsQueryKey = ["tournaments"] as const;

export function useTournaments() {
  return useQuery({
    queryKey: tournamentsQueryKey,
    queryFn: getTournaments,
  });
}
