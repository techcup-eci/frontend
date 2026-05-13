import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMatch } from "../services/competitionService";
import { matchesQueryKey } from "./useMatches";

export function useDeleteMatch(tournamentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: string) => deleteMatch(tournamentId, matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchesQueryKey(tournamentId) });
    },
  });
}
