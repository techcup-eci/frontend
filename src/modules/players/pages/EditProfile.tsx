import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, User } from "lucide-react";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import {
  useAthleticProfile,
  useCreateAthleticProfile,
  useUpdateAthleticProfile,
} from "../hooks/useAthleticProfile";

const POSITIONS = [
  "Portero",
  "Defensa Central",
  "Lateral Derecho",
  "Lateral Izquierdo",
  "Mediocampista Defensivo",
  "Mediocampista Central",
  "Extremo Derecho",
  "Extremo Izquierdo",
  "Delantero Centro",
] as const;

export default function EditProfile() {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.user);
  const storedEmail = sessionStorage.getItem("playerEmail") ?? "";
  const userEmail = authUser?.email ?? storedEmail;
  const { data: profile } = useAthleticProfile(userEmail || undefined);
  const updateProfile = useUpdateAthleticProfile();
  const createProfile = useCreateAthleticProfile();

  const [formData, setFormData] = useState({
    position: profile?.position ?? "Mediocampista Central",
    dorsalNumber: String(profile?.dorsalNumber ?? 8),
    laterality: profile?.laterality ?? "RIGHT",
    stature: profile?.stature ?? "1.70",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const number = parseInt(formData.dorsalNumber);
    if (isNaN(number) || number < 1 || number > 99) {
      newErrors.dorsalNumber = "El dorsal debe ser un número entre 1 y 99";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!userEmail) {
      setErrors({ general: "No se pudo identificar tu correo. Inicia sesión nuevamente." });
      return;
    }

    setErrors({});

    const payload = {
      email: userEmail,
      dorsalNumber: number,
      position: formData.position,
      laterality: formData.laterality,
      stature: formData.stature,
      state: "ACTIVE",
    };

    try {
      const userId = authUser?.id;
      if (!userId) {
        setErrors({ general: "No se pudo identificar tu usuario. Inicia sesión nuevamente." });
        return;
      }

      if (profile) {
        // Profile exists — update it
        await updateProfile.mutateAsync({ userId, payload });
      } else {
        // Profile doesn't exist — create it
        await createProfile.mutateAsync(payload);
      }

      if (photoPreview) {
        sessionStorage.setItem(`playerProfilePhoto:${userEmail}`, photoPreview);
      }
      sessionStorage.setItem(`isPlayer:${userEmail}`, "true");
      sessionStorage.setItem("playerEmail", userEmail);

      navigate("/player/profile");
    } catch {
      // Error already shown by hook toast
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-lg border px-4 py-3 focus:outline-none ${
      errors[field]
        ? "border-[#EF4444] bg-[#EF4444]/5 focus:border-[#EF4444]"
        : "border-border bg-input-background focus:border-primary"
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-3xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Editar perfil deportivo</h1>
              <p className="text-muted-foreground">
                Actualiza tu información deportiva
              </p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-8">
              <div className="space-y-6">
                {/* Foto de perfil */}
                <div>
                  <label className="mb-3 block font-medium">Foto de perfil (opcional)</label>
                  <div className="flex items-center gap-6">
                    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-background">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-16 w-16 text-muted-foreground" />
                      )}
                    </div>
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 font-medium transition hover:bg-accent">
                      <Upload className="h-5 w-5" />
                      <span>Cambiar foto</span>
                      <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Posición */}
                <div>
                  <label className="mb-2 block font-medium">Posición</label>
                  <select
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className={inputClass("position")}
                  >
                    {POSITIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Dorsal */}
                <div>
                  <label className="mb-2 block font-medium">Dorsal preferido</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="99"
                    value={formData.dorsalNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, dorsalNumber: e.target.value });
                      if (errors.dorsalNumber) setErrors({ ...errors, dorsalNumber: "" });
                    }}
                    className={inputClass("dorsalNumber")}
                  />
                  {errors.dorsalNumber && <p className="mt-1 text-sm text-[#EF4444]">{errors.dorsalNumber}</p>}
                </div>

                {/* Lateralidad */}
                <div>
                  <label className="mb-2 block font-medium">Lateralidad</label>
                  <select
                    required
                    value={formData.laterality}
                    onChange={(e) => setFormData({ ...formData, laterality: e.target.value })}
                    className={inputClass("laterality")}
                  >
                    <option value="RIGHT">Derecha</option>
                    <option value="LEFT">Izquierda</option>
                    <option value="BOTH">Ambidiestra</option>
                  </select>
                </div>

                {/* Estatura */}
                <div>
                  <label className="mb-2 block font-medium">Estatura (m)</label>
                  <input
                    type="number"
                    required
                    min="0.5"
                    max="2.5"
                    step="0.01"
                    value={formData.stature}
                    onChange={(e) => setFormData({ ...formData, stature: e.target.value })}
                    className={inputClass("stature")}
                  />
                </div>

                {errors.general && (
                  <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                    {errors.general}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={updateProfile.isPending || createProfile.isPending}
                    className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                  >
                    {updateProfile.isPending || createProfile.isPending ? "Guardando..." : "Actualizar perfil"}
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
