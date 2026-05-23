import { useQuery } from "@tanstack/react-query";
import { getActiveBracket } from "../../competitions/services/competitionService";
import type { BracketMatchResponse } from "../../competitions/services/competitionService";

export const activeBracketQueryKey = ["bracket", "active"] as const;

export function useActiveBracket() {
  return useQuery<BracketMatchResponse[]>({
    queryKey: activeBracketQueryKey,
    queryFn: getActiveBracket,
  });
}
