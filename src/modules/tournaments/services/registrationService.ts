import { apiClient } from "../../../core/api/apiClient";

export interface RegistrationResponse {
  id: string;
  tournamentId: string;
  teamId: string;
  captainId: number;
  paymentReceiptUrl?: string;
  status: string;
  createdAt: string;
}

export interface RegisterTeamRequest {
  teamId: string;
  paymentReceiptUrl?: string;
}

// ── Registrations ──

export const getRegistrations = async (tournamentId: string): Promise<RegistrationResponse[]> => {
  const { data } = await apiClient.get(`/api/tournaments/${tournamentId}/registrations`);
  return data;
};

export const getRegistrationById = async (
  tournamentId: string,
  registrationId: string,
): Promise<RegistrationResponse> => {
  const { data } = await apiClient.get(
    `/api/tournaments/${tournamentId}/registrations/${registrationId}`,
  );
  return data;
};

export const registerTeam = async (
  tournamentId: string,
  captainId: number,
  request: RegisterTeamRequest,
): Promise<RegistrationResponse> => {
  const { data } = await apiClient.post(
    `/api/tournaments/${tournamentId}/registrations`,
    request,
    { headers: { "X-User-Id": String(captainId) } },
  );
  return data;
};

export const approveRegistration = async (
  tournamentId: string,
  registrationId: string,
  organizerId: number,
): Promise<RegistrationResponse> => {
  const { data } = await apiClient.patch(
    `/api/tournaments/${tournamentId}/registrations/${registrationId}/approve`,
    {},
    { headers: { "X-User-Id": String(organizerId) } },
  );
  return data;
};

export const rejectRegistration = async (
  tournamentId: string,
  registrationId: string,
  organizerId: number,
): Promise<RegistrationResponse> => {
  const { data } = await apiClient.patch(
    `/api/tournaments/${tournamentId}/registrations/${registrationId}/reject`,
    {},
    { headers: { "X-User-Id": String(organizerId) } },
  );
  return data;
};

export const cancelRegistration = async (
  tournamentId: string,
  registrationId: string,
  captainId: number,
): Promise<RegistrationResponse> => {
  const { data } = await apiClient.delete(
    `/api/tournaments/${tournamentId}/registrations/${registrationId}`,
    { headers: { "X-User-Id": String(captainId) } },
  );
  return data;
};
