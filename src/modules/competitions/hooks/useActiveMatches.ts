import { useQuery } from "@tanstack/react-query";
import { getActiveMatches } from "../services/competitionService";

export const activeMatchesQueryKey = ["matches", "active"] as const;

export function useActiveMatches() {
  return useQuery({
    queryKey: activeMatchesQueryKey,
    queryFn: getActiveMatches,
  });
}
