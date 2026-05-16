import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMatch } from "../services/competitionService";
import type { UpdateMatchRequest } from "../types/competition";
import { matchDetailQueryKey } from "./useMatchDetail";
import { matchesQueryKey } from "./useMatches";

export function useUpdateMatch(tournamentId: string, matchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (match: UpdateMatchRequest) => updateMatch(tournamentId, matchId, match),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchDetailQueryKey(tournamentId, matchId) });
      queryClient.invalidateQueries({ queryKey: matchesQueryKey(tournamentId) });
    },
  });
}
