import { useMutation, useQueryClient } from "@tanstack/react-query";
import { finishTournament } from "../services/tournamentService";

export const useFinishTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => finishTournament(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    },
  });
};