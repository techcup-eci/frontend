import { apiClient } from '../../../core/api/apiClient';
import type {
  RegistrationRequest,
  RegistrationResponse,
  ReviewRegistrationRequest,
  RegistrationStatus,
} from '../types/registration.types';

const BASE_URL = '/v1/registrations';

export const registrationService = {
  getRegistrations: async (params?: { teamId?: string; status?: RegistrationStatus }): Promise<RegistrationResponse[]> => {
    const response = await apiClient.get<RegistrationResponse[]>(BASE_URL, { params });
    return response.data;
  },

  createRegistration: async (data: RegistrationRequest): Promise<RegistrationResponse> => {
    const response = await apiClient.post<RegistrationResponse>(BASE_URL, data);
    return response.data;
  },

  reviewRegistration: async (
    id: string,
    data: ReviewRegistrationRequest,
    organizerId: string
  ): Promise<RegistrationResponse> => {
    const response = await apiClient.put<RegistrationResponse>(`${BASE_URL}/${id}/review`, data, {
      headers: {
        'X-User-Id': organizerId,
      },
    });
    return response.data;
  },

  cancelRegistration: async (id: string, captainId: string): Promise<RegistrationResponse> => {
    const response = await apiClient.put<RegistrationResponse>(
      `${BASE_URL}/${id}/cancel`,
      {},
      {
        headers: {
          'X-User-Id': captainId,
        },
      }
    );
    return response.data;
  },
};
