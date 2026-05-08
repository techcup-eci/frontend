import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, User } from "lucide-react";

export default function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    const stored = sessionStorage.getItem("playerProfileForm");
    if (stored) {
      return JSON.parse(stored) as {
        position: string;
        number: string;
        semester: string;
        relationship: string;
        studentLevel: string;
        professorType: string;
      };
    }

    return {
      position: "Mediocampista Central",
      number: "8",
      semester: "6",
      relationship: "estudiante",
      studentLevel: "pregrado",
      professorType: "planta",
    };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string>(() => {
    return sessionStorage.getItem("playerProfilePhoto") ?? "";
  });

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

  const handleSubmit = (e: React.FormEvent) => {
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

    sessionStorage.setItem("playerProfileForm", JSON.stringify(formData));
    if (photoPreview) {
      sessionStorage.setItem("playerProfilePhoto", photoPreview);
    }
    sessionStorage.setItem("isPlayer", "true");

    navigate("/player/profile?player=true");
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
                  <label className="mb-2 block font-medium">Vinculo con la universidad</label>
                  <select
                    required
                    value={formData.relationship}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        relationship: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
                  >
                    <option value="estudiante">Estudiante</option>
                    <option value="profesor">Profesor</option>
                    <option value="invitado">Invitado</option>
                    <option value="graduado">Graduado</option>
                  </select>
                </div>

                {formData.relationship === "estudiante" && (
                  <div>
                    <label className="mb-2 block font-medium">Nivel academico</label>
                    <select
                      required
                      value={formData.studentLevel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          studentLevel: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
                    >
                      <option value="pregrado">Pregrado</option>
                      <option value="posgrado">Posgrado</option>
                      <option value="maestria">Maestria</option>
                      <option value="doctorado">Doctorado</option>
                    </select>
                  </div>
                )}

                {formData.relationship === "profesor" && (
                  <div>
                    <label className="mb-2 block font-medium">Tipo de profesor</label>
                    <select
                      required
                      value={formData.professorType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          professorType: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
                    >
                      <option value="planta">Planta</option>
                      <option value="catedra">Catedra</option>
                    </select>
                  </div>
                )}

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

                {formData.relationship === "estudiante" &&
                  formData.studentLevel === "pregrado" && (
                  <div>
                    <label className="mb-2 block font-medium">Semestre actual</label>
                    <select
                      required
                      value={formData.semester}
                      onChange={(e) =>
                        setFormData({ ...formData, semester: e.target.value })
                      }
                      className="w-full rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                        <option key={sem} value={sem}>
                          Semestre {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    Actualizar perfil
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


