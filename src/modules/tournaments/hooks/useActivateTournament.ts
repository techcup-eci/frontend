import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateTournament } from "../services/tournamentService";
import { tournamentsQueryKey } from "./useTournaments";

export function useActivateTournament() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateTournament(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tournamentsQueryKey });
    },
  });
}
