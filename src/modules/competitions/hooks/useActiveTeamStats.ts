import { useQuery } from "@tanstack/react-query";
import { getActiveTeamStats, type TeamStatsResponse } from "../services/competitionService";

export const activeTeamStatsQueryKey = (teamId: string) => ["stats", "teams", teamId, "active"] as const;

export function useActiveTeamStats(teamId: string | null) {
  return useQuery<TeamStatsResponse>({
    queryKey: activeTeamStatsQueryKey(teamId ?? ""),
    queryFn: () => getActiveTeamStats(teamId!),
    enabled: !!teamId,
  });
}
