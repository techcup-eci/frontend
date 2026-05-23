import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../core/api/apiClient";
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

export function useStartTournament() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            apiClient.patch(`/api/tournaments/${id}/start`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tournaments"] });
            toast.success("Torneo iniciado correctamente");
        },
        onError: (error) => {
            toast.error("Error al iniciar torneo", { description: extractErrorMessage(error) });
        },
    });
}
