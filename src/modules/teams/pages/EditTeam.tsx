import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Shield, Upload, Loader2, XCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { apiClient } from "../../../core/api/apiClient";

// TODO: obtener del contexto de autenticación
const TEAM_ID = import.meta.env.VITE_TEAM_ID ?? "1";
const USER_ID = import.meta.env.VITE_USER_ID ?? "10";

interface TeamFormData {
  name: string;
  colors: string;
  photo: string;
}

interface TeamData extends TeamFormData {
  id: number;
}

export default function EditTeam() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TeamFormData>({
    name: "",
    colors: "#1B5E35",
    photo: "",
  });
  const [shieldPreview, setShieldPreview] = useState<string>("");
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    setLoadingInitial(true);
    try {
      const { data } = await apiClient.get<TeamData>(`/api/teams/${TEAM_ID}`, {
        headers: { "X-User-Id": USER_ID },
      });
      setFormData({
        name: data.name ?? "",
        colors: data.colors ?? "#1B5E35",
        photo: data.photo ?? "",
      });
      if (data.photo) setShieldPreview(data.photo);
    } catch {
      setError("Error al cargar los datos del equipo.");
    } finally {
      setLoadingInitial(false);
    }
  }

  function handleShieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setShieldPreview(result);
      setFormData((prev) => ({ ...prev, photo: result }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await apiClient.put(
        `/api/teams/${TEAM_ID}`,
        {
          name: formData.name,
          colors: formData.colors,
          photo: formData.photo,
        },
        { headers: { "X-User-Id": USER_ID } }
      );
      setSuccessMessage("¡Equipo actualizado correctamente!");
      setTimeout(() => navigate("/captain/team-info"), 1800);
    } catch {
      setError("Error al guardar los cambios. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  if (loadingInitial) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Cargando datos del equipo...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/captain/team-info")}
                className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </button>
            </div>

            <div>
              <h1 className="mb-2 text-3xl font-bold">Editar equipo</h1>
              <p className="text-muted-foreground">
                Actualiza la información de tu equipo
              </p>
            </div>

            {successMessage && (
              <div className="flex items-center gap-3 rounded-lg bg-[#4ADE80]/10 px-4 py-3 text-sm font-medium text-[#4ADE80]">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                {successMessage}
                <span className="ml-auto text-xs opacity-70">Redirigiendo...</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-3 rounded-lg bg-[#EF4444]/10 px-4 py-3 text-sm font-medium text-[#EF4444]">
                <XCircle className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-8">
              <div className="space-y-6">
                {/* Nombre */}
                <div>
                  <label className="mb-2 block font-medium">
                    Nombre del equipo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
                    placeholder="Los Algoritmos FC"
                  />
                </div>

                {/* Escudo */}
                <div>
                  <label className="mb-3 block font-medium">
                    Escudo del equipo
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-background">
                      {shieldPreview ? (
                        <img
                          src={shieldPreview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Shield className="h-16 w-16 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 font-medium transition hover:bg-accent">
                        <Upload className="h-5 w-5" />
                        <span>Cambiar escudo</span>
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
                  <label className="mb-2 block font-medium">
                    Color institucional
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={formData.colors}
                      onChange={(e) =>
                        setFormData({ ...formData, colors: e.target.value })
                      }
                      className="h-12 w-20 cursor-pointer rounded-lg border border-border"
                    />
                    <span className="font-mono text-sm">{formData.colors}</span>
                  </div>
                </div>

                {/* Vista previa */}
                {formData.name && (
                  <div className="rounded-lg border border-border bg-accent/10 p-6">
                    <p className="mb-4 text-sm font-semibold text-muted-foreground">
                      Vista previa
                    </p>
                    <div className="flex items-center gap-4 rounded-lg bg-background p-4">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border"
                        style={{ backgroundColor: formData.colors + "20" }}
                      >
                        {shieldPreview ? (
                          <img
                            src={shieldPreview}
                            alt="Preview"
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <Shield
                            className="h-8 w-8"
                            style={{ color: formData.colors }}
                          />
                        )}
                      </div>
                      <h3 className="text-lg font-bold">{formData.name}</h3>
                    </div>
                  </div>
                )}

                {/* Botón guardar */}
                <button
                  type="submit"
                  disabled={saving || !!successMessage}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar cambios"
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
