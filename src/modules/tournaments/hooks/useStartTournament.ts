import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../core/api/apiClient";

export function useStartTournament() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            apiClient.patch(`/tournaments/${id}/start`),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["tournaments"] }),
    });
}
