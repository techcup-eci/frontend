import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMatch } from "../services/competitionService";
import type { CreateMatchRequest } from "../types/competition";

export function useCreateMatch(tournamentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ match }: { match: CreateMatchRequest }) =>
      createMatch(tournamentId, match),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}
