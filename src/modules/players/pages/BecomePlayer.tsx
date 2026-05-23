import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, User } from "lucide-react";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { useCreateAthleticProfile } from "../hooks/useAthleticProfile";
import { updateRole } from "../../auth/services/authService";

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

export default function BecomePlayer() {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.user);
  const { mutateAsync: createProfile, isPending } = useCreateAthleticProfile();
  const [formData, setFormData] = useState({
    position: "Mediocampista Central",
    dorsalNumber: "8",
    laterality: "RIGHT",
    stature: "1.70",
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
    if (number < 1 || number > 99) {
      newErrors.dorsalNumber = "El dorsal debe ser un número entre 1 y 99";
    }

    const statureValue = Number(formData.stature);
    if (!Number.isFinite(statureValue) || statureValue <= 0.5 || statureValue >= 2.5) {
      newErrors.stature = "La estatura debe estar entre 0.5 y 2.5 metros";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const userEmail = authUser?.email ?? sessionStorage.getItem("playerEmail") ?? "";
    if (!userEmail) {
      setErrors({ general: "No se pudo identificar tu correo. Inicia sesión nuevamente." });
      return;
    }

    setErrors({});

    try {
      await createProfile({
        email: userEmail,
        dorsalNumber: number,
        position: formData.position,
        laterality: formData.laterality,
        stature: formData.stature,
        state: "ACTIVE",
      });

      // Auto-upgrade: promote INVITED/USER to PLAYER
      const userId = authUser?.id;
      if (userId && authUser?.role !== "PLAYER" && authUser?.role !== "CAPTAIN") {
        try {
          await updateRole(userId, "PLAYER");
          // Update local auth store directly instead of refreshAuth()
          // (refreshAuth can fail due to httpOnly cookie/cross-origin issues)
          const store = useAuthStore.getState();
          if (store.accessToken && store.user) {
            store.setAuthenticated(store.accessToken, { ...store.user, role: "player" });
          }
        } catch {
          // Role upgrade is best-effort — profile already created
        }
      }

      if (photoPreview) {
        sessionStorage.setItem(`playerProfilePhoto:${userEmail}`, photoPreview);
      }
      sessionStorage.setItem(`isPlayer:${userEmail}`, "true");
      sessionStorage.setItem("playerEmail", userEmail);

      navigate("/player/profile");
    } catch {
      // Error already shown by useCreateAthleticProfile hook toast
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
              <h1 className="mb-2 text-3xl font-bold">Volverme jugador</h1>
              <p className="text-muted-foreground">
                Completa tu información deportiva para participar en el torneo.
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
                      <span>Subir foto</span>
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
                    onChange={(e) => {
                      setFormData({ ...formData, stature: e.target.value });
                      if (errors.stature) setErrors({ ...errors, stature: "" });
                    }}
                    className={inputClass("stature")}
                  />
                  {errors.stature && <p className="mt-1 text-sm text-[#EF4444]">{errors.stature}</p>}
                </div>

                {errors.general && (
                  <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                    {errors.general}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isPending ? "Guardando..." : "Crear perfil"}
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
