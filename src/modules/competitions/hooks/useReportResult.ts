import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportResult } from "../services/competitionService";
import type { MatchResultRequest } from "../types/competition";
import { matchDetailQueryKey } from "./useMatchDetail";

export function useReportResult(tournamentId: string, matchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (result: MatchResultRequest) => reportResult(tournamentId, matchId, result),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchDetailQueryKey(tournamentId, matchId) });
      queryClient.invalidateQueries({ queryKey: ["standings", tournamentId] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}
