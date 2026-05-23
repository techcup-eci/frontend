import { useQuery } from "@tanstack/react-query";
import { getActiveTopScorers, getActiveMatchHistory, type TopScorerResponse, type MatchHistoryResponse } from "../services/competitionService";

export const activeTopScorersQueryKey = ["stats", "top-scorers", "active"] as const;
export const activeMatchHistoryQueryKey = ["stats", "matches", "active"] as const;

export function useActiveTopScorers() {
  return useQuery<TopScorerResponse[]>({
    queryKey: activeTopScorersQueryKey,
    queryFn: getActiveTopScorers,
  });
}

export function useActiveMatchHistory() {
  return useQuery<MatchHistoryResponse[]>({
    queryKey: activeMatchHistoryQueryKey,
    queryFn: getActiveMatchHistory,
  });
}
