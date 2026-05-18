import { useQuery } from "@tanstack/react-query";
import { getActiveStandings } from "../services/competitionService";

export const activeStandingsQueryKey = ["standings", "active"] as const;

export function useActiveStandings() {
  return useQuery({
    queryKey: activeStandingsQueryKey,
    queryFn: getActiveStandings,
  });
}
