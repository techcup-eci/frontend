import { apiClient } from "../../../core/api/apiClient";
import type {UserProfileDTO, ImageUploadResponse} from "../types";

export const userService = {
  getProfile: async (email: string): Promise<UserProfileDTO> => {
    // Ajustar esta ruta según cómo el backend busque al usuario.
    // Usamos el email como identificador basándonos en el store actual.
    const { data } = await apiClient.get<UserProfileDTO>(`/api/users/email/${encodeURIComponent(email)}`);
    return data;
  },

  uploadProfileImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Suponiendo que el endpoint de subida de imágenes está en el gateway bajo /api/images/upload
    // o bajo /api/users/upload. Ajustar según el microservicio de imágenes.
    const { data } = await apiClient.post<ImageUploadResponse>('/api/users/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data.url; 
  },
  
  updateProfileImage: async (email: string, imageUrl: string): Promise<UserProfileDTO> => {
    const { data } = await apiClient.patch<UserProfileDTO>(`/api/users/email/${encodeURIComponent(email)}/image`, { profileImageUrl: imageUrl });
    return data;
  }
};
