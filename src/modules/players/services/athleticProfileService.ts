import { apiClient } from "../../../core/api/apiClient";
import type { AthleticProfileDto } from "../types/athleticProfile";

/**
 * All calls go through the API Gateway (VITE_API_URL).
 * The base URL is configured in apiClient — do NOT override it here.
 */

export const getAthleticProfiles = async (): Promise<AthleticProfileDto[]> => {
	const response = await apiClient.get("/api/athletic-profiles");
	return response.data;
};

export const getAthleticProfileByUserId = async (
	userId: number,
): Promise<AthleticProfileDto> => {
	const response = await apiClient.get(`/api/athletic-profiles/${userId}`);
	return response.data;
};

export const getAthleticProfileByEmail = async (
	email: string,
): Promise<AthleticProfileDto> => {
	const response = await apiClient.get(
		`/api/athletic-profiles/email/${encodeURIComponent(email)}`,
	);
	return response.data;
};

export const createAthleticProfile = async (
	payload: AthleticProfileDto,
): Promise<AthleticProfileDto> => {
	const response = await apiClient.post("/api/athletic-profiles", payload);
	return response.data;
};

export const updateAthleticProfile = async (
	userId: number,
	payload: AthleticProfileDto,
): Promise<AthleticProfileDto> => {
	const response = await apiClient.put(
		`/api/athletic-profiles/${userId}`,
		payload,
	);
	return response.data;
};

export const deleteAthleticProfile = async (userId: number): Promise<void> => {
	await apiClient.delete(`/api/athletic-profiles/${userId}`);
};
