import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTournament } from "../services/tournamentService";
import { tournamentsQueryKey } from "./useTournaments";
import { toast } from "sonner";

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const axiosError = error as { response?: { data?: { error?: string; message?: string } } };
    const data = axiosError.response?.data;
    if (data) {
      if ("error" in data && data.error) return data.error;
      if ("message" in data && data.message) return data.message;
    }
    return error.message;
  }
  return "Ocurrió un error inesperado";
}

export const useDeleteTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTournament(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tournamentsQueryKey });
      toast.success("Torneo eliminado correctamente");
    },
    onError: (error) => {
      toast.error("Error al eliminar torneo", { description: extractErrorMessage(error) });
    },
  });
};