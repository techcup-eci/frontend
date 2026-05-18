import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Upload, User } from "lucide-react";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import {
  useAthleticProfile,
  useCreateAthleticProfile,
  useUpdateAthleticProfile,
} from "../hooks/useAthleticProfile";

export default function EditProfile() {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.user);
  const storedEmail = sessionStorage.getItem("playerEmail") ?? "";
  const userEmail = authUser?.email ?? storedEmail;
  const { data: profile } = useAthleticProfile(userEmail || undefined);
  const updateProfile = useUpdateAthleticProfile();
  const createProfile = useCreateAthleticProfile();
  const [formData, setFormData] = useState(() => {
    const storageKey = userEmail ? `playerProfileForm:${userEmail}` : "playerProfileForm";
    const stored = sessionStorage.getItem(storageKey);
    if (stored) {
      return JSON.parse(stored) as {
        position: string;
        number: string;
      };
    }

    return {
      position: "Mediocampista Central",
      number: "8",
    };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string>(() => {
    const storageKey = userEmail ? `playerProfilePhoto:${userEmail}` : "playerProfilePhoto";
    return sessionStorage.getItem(storageKey) ?? "";
  });
  const [submitError, setSubmitError] = useState("");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const number = parseInt(formData.number);
    if (number < 1 || number > 99) {
      newErrors.number = "El dorsal debe ser un número entre 1 y 99";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!userEmail) {
      setSubmitError("No se pudo identificar el correo del usuario. Inicia sesión nuevamente.");
      return;
    }

    setSubmitError("");

    const payload = {
      email: userEmail,
      dorsalNumber: number,
      position: formData.position,
      laterality: profile?.laterality ?? "RIGHT",
      stature: profile?.stature ?? "1.70",
      state: profile?.state ?? "ACTIVE",
    };

    try {
      await updateProfile.mutateAsync({
        email: userEmail,
        payload,
      });
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 404 || status === 500) {
        try {
          await createProfile.mutateAsync(payload);
        } catch (createError) {
          const message =
            createError instanceof Error
              ? createError.message
              : "No fue posible actualizar el perfil.";
          setSubmitError(message);
        }
      } else {
        const message = error instanceof Error ? error.message : "No fue posible actualizar el perfil.";
        setSubmitError(message);
      }
    }

    const storageKey = (base: string) => (userEmail ? `${base}:${userEmail}` : base);
    sessionStorage.setItem(storageKey("playerProfileForm"), JSON.stringify(formData));
    if (photoPreview) {
      sessionStorage.setItem(storageKey("playerProfilePhoto"), photoPreview);
    }
    sessionStorage.setItem(storageKey("isPlayer"), "true");
    sessionStorage.setItem("playerEmail", userEmail);

    navigate("/player/profile");
  };

  return (
    <div className="flex min-h-screen flex-col">
      
      <div className="flex flex-1">
        
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-3xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Editar perfil</h1>
              <p className="text-muted-foreground">
                Actualiza tu información de usuario
              </p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-8">
              <div className="space-y-6">
                <div>
                  <label className="mb-3 block font-medium">Foto de perfil</label>
                  <div className="flex items-center gap-6">
                    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-background">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-16 w-16 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 font-medium transition hover:bg-accent">
                        <Upload className="h-5 w-5" />
                        <span>Cambiar foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                      <p className="mt-2 text-sm text-muted-foreground">
                        JPG, PNG. Máximo 5MB
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-medium">Posición</label>
                  <select
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
                  >
                    <option value="Portero">Portero</option>
                    <option value="Defensa Central">Defensa Central</option>
                    <option value="Lateral Derecho">Lateral Derecho</option>
                    <option value="Lateral Izquierdo">Lateral Izquierdo</option>
                    <option value="Mediocampista Defensivo">Mediocampista Defensivo</option>
                    <option value="Mediocampista Central">Mediocampista Central</option>
                    <option value="Extremo Derecho">Extremo Derecho</option>
                    <option value="Extremo Izquierdo">Extremo Izquierdo</option>
                    <option value="Delantero Centro">Delantero Centro</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-medium">Dorsal preferido</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="99"
                    value={formData.number}
                    onChange={(e) => {
                      setFormData({ ...formData, number: e.target.value });
                      if (errors.number) setErrors({ ...errors, number: "" });
                    }}
                    className={`w-full rounded-lg border px-4 py-3 focus:outline-none ${
                      errors.number
                        ? "border-[#EF4444] bg-[#EF4444]/5 focus:border-[#EF4444]"
                        : "border-border bg-input-background focus:border-primary"
                    }`}
                  />
                  {errors.number && <p className="mt-1 text-sm text-[#EF4444]">{errors.number}</p>}
                </div>

                {submitError && (
                  <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                    {submitError}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={updateProfile.isPending}
                    className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    {updateProfile.isPending ? "Guardando..." : "Actualizar perfil"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/player/profile")}
                    className="flex-1 rounded-lg border border-border bg-background px-6 py-3 font-semibold transition hover:bg-accent"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}


