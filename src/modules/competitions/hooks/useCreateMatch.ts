import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMatch } from "../services/competitionService";
import type { CreateMatchRequest } from "../types/competition";
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

export function useCreateMatch(tournamentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ match }: { match: CreateMatchRequest }) =>
      createMatch(tournamentId, match),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches", "active"] });
      toast.success("Partido creado exitosamente");
    },
    onError: (error) => {
      toast.error("Error al crear partido", { description: extractErrorMessage(error) });
    },
  });
}
