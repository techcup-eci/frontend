import { apiClient } from "../../../core/api/apiClient";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  birthDate: string;
  relationship: string;
  academicProgram: string;
  semester: number;
  identificationType: string;
  identificationNumber: number;
  phone: number;
  systemRole: string;
}

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const response = await apiClient.get("/api/users");
  return response.data;
};

export const getUserById = async (id: number): Promise<UserProfile> => {
  const response = await apiClient.get(`/api/users/${id}`);
  return response.data;
};

export const updateUser = async (
  id: number,
  data: Partial<UserProfile>,
): Promise<UserProfile> => {
  const response = await apiClient.put(`/api/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/users/${id}`);
};
