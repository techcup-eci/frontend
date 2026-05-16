import { apiClient } from "../../../core/api/apiClient";
import type { AthleticProfileDto } from "../types/athleticProfile";

type ApiEnvelope<T> = {
  data: T;
  message?: string;
  status?: string;
};

const DEFAULT_API_URL = "http://localhost:8080";

function getAthleticProfileBaseUrl() {
  const configuredUrl =
    import.meta.env.VITE_ATHLETIC_PROFILE_URL || import.meta.env.VITE_API_URL;

  const baseUrl =
    configuredUrl && configuredUrl.trim().length > 0
      ? configuredUrl
      : DEFAULT_API_URL;

  return baseUrl.replace(/\/$/, "").replace(/\/api\/v1$/, "");
}

function unwrapPayload<T>(payload: T | ApiEnvelope<T>): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
}

function encodeEmail(email: string) {
  return encodeURIComponent(email);
}

export const getAthleticProfiles = async (): Promise<AthleticProfileDto[]> => {
  const response = await apiClient.get("/AthleticProfile", {
    baseURL: getAthleticProfileBaseUrl(),
  });

  return unwrapPayload<AthleticProfileDto[]>(response.data);
};

export const getAthleticProfileByEmail = async (
  email: string,
): Promise<AthleticProfileDto> => {
  const response = await apiClient.get(`/AthleticProfile/${encodeEmail(email)}`,
    {
      baseURL: getAthleticProfileBaseUrl(),
    },
  );

  return unwrapPayload<AthleticProfileDto>(response.data);
};

export const createAthleticProfile = async (
  payload: AthleticProfileDto,
): Promise<AthleticProfileDto> => {
  const response = await apiClient.post("/AthleticProfile", payload, {
    baseURL: getAthleticProfileBaseUrl(),
  });

  return unwrapPayload<AthleticProfileDto>(response.data);
};

export const updateAthleticProfile = async (
  email: string,
  payload: AthleticProfileDto,
): Promise<AthleticProfileDto> => {
  const response = await apiClient.put(
    `/AthleticProfile/${encodeEmail(email)}`,
    payload,
    {
      baseURL: getAthleticProfileBaseUrl(),
    },
  );

  return unwrapPayload<AthleticProfileDto>(response.data);
};

export const deleteAthleticProfile = async (email: string): Promise<void> => {
  await apiClient.delete(`/AthleticProfile/${encodeEmail(email)}`, {
    baseURL: getAthleticProfileBaseUrl(),
  });
};
