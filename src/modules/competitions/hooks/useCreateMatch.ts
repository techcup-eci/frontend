import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMatch } from "../services/competitionService";
import type { CreateMatchRequest } from "../types/competition";

export function useCreateMatch(tournamentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ match, userId }: { match: CreateMatchRequest; userId: string }) =>
      createMatch(tournamentId, match, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}
