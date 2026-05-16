import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLineup } from "../services/competitionService";
import type { CreateLineupRequest } from "../types/competition";
import { lineupQueryKey } from "./useLineup";

export function useCreateLineup(tournamentId: string, matchId: string, teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lineup,
      userId,
    }: {
      lineup: CreateLineupRequest;
      userId: string;
    }) => createLineup(tournamentId, matchId, teamId, lineup, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: lineupQueryKey(tournamentId, matchId, teamId),
      });
    },
  });
}
