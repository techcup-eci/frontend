import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, Upload } from "lucide-react";
import { apiClient } from "../../../core/api/apiClient";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import type { AuthUser } from "../../auth/types/AuthUser";

export default function CreateTeam() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const setAuthenticatedUser = useAuthStore((state) => state.setAuthenticatedUser);
  const [formData, setFormData] = useState({
    name: "",
    color: "#1B5E35",
    description: "",
  });

  const [shieldPreview, setShieldPreview] = useState<string>("");

  const handleShieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setShieldPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: El jugador que crea el equipo se convierte automáticamente en capitán
    // Requiere coordinación con el microservicio de identidad para cambiar el rol del usuario a CAPTAIN
    // Ver endpoint disponible en users-and-players-ms para actualización de rol
    const captainId = (currentUser as (AuthUser & { id?: number }))?.id;

    const equipoData = {
      name: formData.name,
      colors: formData.color,
      captainId,
      photo: shieldPreview || "",
    };

    try {
      await apiClient.post("/api/teams", equipoData, {
        headers: { "X-User-Id": String(captainId ?? "") },
      });
    } catch (error) {
      console.error("Error al crear el equipo:", error);
    }

    if (currentUser) {
      setAuthenticatedUser({ ...currentUser, role: "captain" });
    }

    navigate("/captain/dashboard");
  };

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

                {/* Nombre del equipo */}
                <div>
                  <label className="mb-2 block font-medium">Nombre del equipo</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
                    placeholder="Los Algoritmos FC"
                  />
                </div>

                {/* Escudo */}
                <div>
                  <label className="mb-3 block font-medium">Escudo del equipo</label>
                  <div className="flex items-center gap-6">
                    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-background">
                      {shieldPreview ? (
                        <img src={shieldPreview} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <Shield className="h-16 w-16 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 font-medium transition hover:bg-accent">
                        <Upload className="h-5 w-5" />
                        <span>Subir escudo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleShieldChange}
                          className="hidden"
                        />
                      </label>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Formatos: PNG, JPG. Tamaño recomendado: 500x500px
                      </p>
                    </div>
                  </div>
                </div>

                {/* Color institucional */}
                <div>
                  <label className="mb-2 block font-medium">Color institucional</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="h-12 w-20 cursor-pointer rounded-lg border border-border"
                    />
                    <span className="font-mono text-sm">{formData.color}</span>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="mb-2 block font-medium">Descripción corta del equipo</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
                    placeholder="Equipo formado por estudiantes de Ingeniería de Sistemas..."
                  />
                </div>

                {/* Vista previa */}
                {formData.name && (
                  <div className="rounded-lg border border-border bg-accent/10 p-6">
                    <p className="mb-4 text-sm font-semibold text-muted-foreground">Vista previa</p>
                    <div className="flex items-center gap-4 rounded-lg bg-background p-4">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border"
                        style={{ backgroundColor: formData.color + "20" }}
                      >
                        {shieldPreview ? (
                          <img src={shieldPreview} alt="Preview" className="h-full w-full rounded-full object-cover" />
                        ) : (
                          <Shield className="h-8 w-8" style={{ color: formData.color }} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{formData.name}</h3>
                        <p className="text-sm text-muted-foreground">{formData.description || "Sin descripción"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botón */}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Crear equipo
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
