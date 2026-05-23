import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listAllUsers,
  updateUserRole,
} from "../services/adminService";
import type { AdminUser } from "../types/admin";
import { toast } from "sonner";

export const adminUsersQueryKey = ["admin", "users"] as const;

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

export function useAdminUsers() {
  return useQuery({
    queryKey: adminUsersQueryKey,
    queryFn: listAllUsers,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersQueryKey });
      toast.success("Rol actualizado correctamente");
    },
    onError: (error) => {
      toast.error("Error al actualizar rol", { description: extractErrorMessage(error) });
    },
  });
}
