export type UserProfileDTO = {
  id: string | number;
  fullName: string;
  email: string;
  profileImageUrl?: string;
  role?: string;
  permissions?: string;
};

export type ImageUploadResponse = {
  url: string;
  id?: string;
};

// Export vacío para evitar errores de módulo en Vite cuando solo hay tipos
export {};
