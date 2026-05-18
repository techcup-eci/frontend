import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listAllUsers,
  updateUserRole,
} from "../services/adminService";
import type { AdminUser } from "../types/admin";

export const adminUsersQueryKey = ["admin", "users"] as const;

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
    },
  });
}
