import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { registrationService } from '../services/registrationService';
import type { RegistrationRequest, RegistrationStatus, ReviewRegistrationRequest } from '../types/registration.types';
import { toast } from 'sonner';

export const useGetRegistrations = (params?: { teamId?: string; status?: RegistrationStatus }) => {
  return useQuery({
    queryKey: ['registrations', params],
    queryFn: () => registrationService.getRegistrations(params),
  });
};

export const useCreateRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegistrationRequest) => registrationService.createRegistration(data),
    onSuccess: () => {
      toast.success('Inscripción enviada con éxito');
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
    onError: (error) => {
      toast.error('Error al enviar la inscripción');
      console.error(error);
    },
  });
};

export const useReviewRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, organizerId }: { id: string; data: ReviewRegistrationRequest; organizerId: string }) =>
      registrationService.reviewRegistration(id, data, organizerId),
    onSuccess: () => {
      toast.success('Inscripción revisada correctamente');
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
    onError: (error) => {
      toast.error('Error al revisar la inscripción');
      console.error(error);
    },
  });
};

export const useCancelRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, captainId }: { id: string; captainId: string }) =>
      registrationService.cancelRegistration(id, captainId),
    onSuccess: () => {
      toast.success('Inscripción cancelada');
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
    onError: (error) => {
      toast.error('Error al cancelar la inscripción');
      console.error(error);
    },
  });
};
