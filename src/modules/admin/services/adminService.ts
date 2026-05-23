import { apiClient } from "../../../core/api/apiClient";
import type { AdminUser } from "../types/admin";

/**
 * Admin service — all calls go through the API Gateway.
 * Uses /api/auth/users/* routes which are routed to identity-ms.
 */

export const listAllUsers = async (): Promise<AdminUser[]> => {
  const response = await apiClient.get("/api/auth/users");
  return response.data;
};

export const updateUserRole = async (
  userId: number,
  role: string
): Promise<{ id: number; email: string; role: string }> => {
  const response = await apiClient.patch(`/api/auth/users/${userId}/role`, {
    role,
  });
  return response.data;
};
