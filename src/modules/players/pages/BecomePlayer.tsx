import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, User } from "lucide-react";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { useCreateAthleticProfile } from "../hooks/useAthleticProfile";
import { updateRole } from "../../auth/services/authService";

export default function BecomePlayer() {
    const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.user);
  const createProfile = useCreateAthleticProfile();
    const [formData, setFormData] = useState({
        position: "Mediocampista Central",
        dorsalNumber: "8",
        laterality: "RIGHT",
        stature: "1.70",
        state: "ACTIVE",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [photoPreview, setPhotoPreview] = useState<string>("");
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

        const number = parseInt(formData.dorsalNumber);
        if (number < 1 || number > 99) {
            newErrors.number = "El dorsal debe ser un número entre 1 y 99";
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
            setSubmitError("No se pudo identificar el correo del usuario. Inicia sesión nuevamente.");
            return;
          }

          setSubmitError("");

          const storageKey = (base: string) => (userEmail ? `${base}:${userEmail}` : base);

          try {
            await createProfile.mutateAsync({
              email: userEmail,
              dorsalNumber: number,
              position: formData.position,
              laterality: formData.laterality,
              stature: formData.stature,
              state: formData.state,
            });

            // Update role to PLAYER after creating athletic profile
            const userId = authUser?.id;
            if (userId) {
              await updateRole(userId, "PLAYER");
              // Refresh token to get updated role
              await useAuthStore.getState().refreshAuth();
            }
          } catch (error) {
            const message = error instanceof Error ? error.message : "No fue posible guardar el perfil.";
            setSubmitError(message);
            return; // Don't navigate on error
          }

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
                            <h1 className="mb-2 text-3xl font-bold">Volverme jugador</h1>
                            <p className="text-muted-foreground">
                              Completa tu informacion deportiva para participar en el torneo.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-8">
                            <div className="space-y-6">
                            <div>
                              <label className="mb-3 block font-medium">Foto de perfil</label>
                              <div className="flex items-center gap-6">
                                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-background">
                                  {photoPreview ? (
                                    <img
                                      src={photoPreview}
                                      alt="Preview"
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <User className="h-16 w-16 text-muted-foreground" />
                                  )}
                                </div>
                                <div>
                                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 font-medium transition hover:bg-accent">
                                    <Upload className="h-5 w-5" />
                                    <span>Subir foto</span>
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
                    value={formData.dorsalNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, dorsalNumber: e.target.value });
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

                <div>
                  <label className="mb-2 block font-medium">Lateralidad</label>
                  <select
                    required
                    value={formData.laterality}
                    onChange={(e) => setFormData({ ...formData, laterality: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
                  >
                    <option value="RIGHT">Derecha</option>
                    <option value="LEFT">Izquierda</option>
                    <option value="BOTH">Ambidiestra</option>
                  </select>
                </div>

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
                    className={`w-full rounded-lg border px-4 py-3 focus:outline-none ${
                      errors.stature
                        ? "border-[#EF4444] bg-[#EF4444]/5 focus:border-[#EF4444]"
                        : "border-border bg-input-background focus:border-primary"
                    }`}
                  />
                  {errors.stature && <p className="mt-1 text-sm text-[#EF4444]">{errors.stature}</p>}
                </div>

                <div>
                  <label className="mb-2 block font-medium">Estado</label>
                  <select
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
                  >
                    <option value="ACTIVE">Activo</option>
                    <option value="INACTIVE">Inactivo</option>
                  </select>
                </div>

                                {submitError && (
                                  <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                                    {submitError}
                                  </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={createProfile.isPending}
                                        className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
                                    >
                                        {createProfile.isPending ? "Guardando..." : "Actualizar perfil"}
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


