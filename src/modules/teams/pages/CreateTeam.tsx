import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, Shield } from "lucide-react";
import { toast } from "sonner";
import { useCreateTeam } from "../hooks/useTeams";
import { createTeamSchema } from "../types/teamSchemas";
import type { CreateTeamFormData } from "../types/teamSchemas";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { updateRole } from "../../auth/services/authService";
import { useActiveTournament } from "../../tournaments/hooks/useActiveTournament";

const COLORS = [
  "#1B5E35", "#B71C1C", "#0D47A1", "#F57F17",
  "#4A148C", "#00695C", "#E65100", "#263238",
] as const;

export default function CreateTeam() {
  const navigate = useNavigate();
  const { mutateAsync: create, isPending } = useCreateTeam();
  const currentUser = useAuthStore((state) => state.user);
  const refreshAuth = useAuthStore((state) => state.refreshAuth);
  const { data: activeTournament } = useActiveTournament();
  const [formData, setFormData] = useState({
    name: "",
    color: COLORS[0],
    photo: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeTournament) {
      toast.error("No hay un torneo activo. Debes esperar a que se cree un torneo para crear un equipo.");
      return;
    }

    if (currentUser?.role !== "CAPTAIN") {
      toast.error("Solo los capitanes pueden crear equipos. Solicita al organizador que te asigne el rol de capitán.");
      return;
    }

    const data: CreateTeamFormData = {
      name: formData.name.trim(),
      colors: formData.color,
      photo: formData.photo,
      idTournament: activeTournament.id,
    };

    const result = createTeamSchema.safeParse(data);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    try {
      await create(result.data);

      // Auto-upgrade: promote PLAYER to CAPTAIN
      if (currentUser && currentUser.role === "PLAYER") {
        try {
          await updateRole(currentUser.id, "CAPTAIN");
          await refreshAuth(); // Get new JWT with CAPTAIN role
        } catch {
          // Role upgrade is best-effort — team already created
        }
      }

      navigate("/captain/dashboard", { replace: true });
    } catch {
      // Error already shown by useCreateTeam hook toast
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-lg border px-4 py-3 text-[var(--color-ink)] focus:outline-none transition-all ${
      fieldErrors[field]
        ? "border-destructive bg-destructive/5"
        : "border-border bg-[var(--color-mist)] focus:border-[var(--color-cool-sky)]"
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-3xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Crear equipo</h1>
              <p className="text-muted-foreground">
                Completa la información de tu equipo para inscribirlo en el torneo
              </p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-8">
              <div className="space-y-6">
                {/* Nombre */}
                <div>
                  <label className="mb-2 block font-medium">Nombre del equipo</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={inputClass("name")}
                    placeholder="Los Algoritmos FC"
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-sm text-destructive">{fieldErrors.name}</p>
                  )}
                </div>

                {/* Color */}
                <div>
                  <label className="mb-2 block font-medium">Color institucional</label>
                  <div className="flex flex-wrap gap-3">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleChange("color", c)}
                        className={`h-10 w-10 rounded-full border-2 transition ${
                          formData.color === c
                            ? "border-[var(--color-ink)] scale-110"
                            : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Escudo (opcional) */}
                <div>
                  <label className="mb-3 block font-medium">Escudo del equipo (opcional)</label>
                  <div className="flex items-center gap-6">
                    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-background">
                      {formData.photo ? (
                        <img src={formData.photo} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <Shield className="h-16 w-16 text-muted-foreground" />
                      )}
                    </div>
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 font-medium transition hover:bg-accent">
                      <Upload className="h-5 w-5" />
                      <span>Subir escudo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => handleChange("photo", reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Vista previa */}
                {formData.name && (
                  <div className="rounded-lg border border-border bg-accent/10 p-6">
                    <p className="mb-4 text-sm font-semibold text-muted-foreground">Vista previa</p>
                    <div className="flex items-center gap-4 rounded-lg bg-background p-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border"
                        style={{ backgroundColor: formData.color + "20" }}>
                        <Shield className="h-8 w-8" style={{ color: formData.color }} />
                      </div>
                      <div><h3 className="text-lg font-bold">{formData.name}</h3></div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-lg bg-[var(--color-oxblood)] px-6 py-3 font-semibold text-white transition hover:bg-opacity-90 disabled:opacity-50"
                >
                  {isPending ? "Creando equipo..." : "Crear equipo"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
