import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTournament } from "../services/tournamentService";

export const useDeleteTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTournament(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    },
  });
};