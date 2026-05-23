import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTournament } from "../services/tournamentService";
import { tournamentsQueryKey } from "./useTournaments";
import type { CreateTournamentPayload } from "../types/tournament";
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

export function useCreateTournament() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTournamentPayload) => createTournament(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tournamentsQueryKey });
      toast.success("¡Torneo creado exitosamente!");
    },
    onError: (error) => {
      toast.error("Error al crear torneo", { description: extractErrorMessage(error) });
    },
  });
}
