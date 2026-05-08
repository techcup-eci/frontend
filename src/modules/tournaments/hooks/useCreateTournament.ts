import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTournament } from "../services/tournamentService";
import { tournamentsQueryKey } from "./useTournaments";
import type { CreateTournamentPayload } from "../types/tournament";

export function useCreateTournament() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTournamentPayload) => createTournament(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tournamentsQueryKey });
    },
  });
}
