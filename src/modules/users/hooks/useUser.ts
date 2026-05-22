import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';

// GET User Profile
export const useUserProfile = (email?: string) => {
  return useQuery({
    queryKey: ['userProfile', email],
    queryFn: () => {
      if (!email) throw new Error("Email is required to fetch profile");
      return userService.getProfile(email);
    },
    enabled: !!email, // Solo ejecuta si hay email
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// POST Upload Image y PATCH Profile Image
export const useUploadProfileImage = (email?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!email) throw new Error("Email is required to update profile");
      // 1. Subir imagen
      const url = await userService.uploadProfileImage(file);
      // 2. Asociar al usuario
      return await userService.updateProfileImage(email, url);
    },
    onSuccess: (updatedUser) => {
      // Invalida la caché para refetch del perfil o actualiza la caché local
      queryClient.setQueryData(['userProfile', email], updatedUser);
    },
  });
};
