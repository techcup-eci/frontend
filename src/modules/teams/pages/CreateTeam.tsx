import { useState } from "react";
import { useNavigate } from "react-router";
import { Home, Users, UserPlus, CreditCard, LayoutList, Trophy, BarChart3, Upload, Shield } from "lucide-react";
import { useAuthStore } from "../../auth/hooks/useAuthStore";

const captainSidebar = [
  {
    items: [
      { label: "Inicio", path: "/captain/dashboard", icon: Home },
      { label: "Mi Equipo", path: "/captain/manage", icon: Users },
      { label: "Buscar Jugadores", path: "/captain/search-players", icon: UserPlus },
      { label: "Pagos", path: "/captain/payment", icon: CreditCard },
      { label: "Alineación", path: "/captain/lineup", icon: LayoutList },
      { label: "Torneo", path: "/tournament-info", icon: Trophy },
      { label: "Estadísticas", path: "/stats", icon: BarChart3 },
    ],
  },
];

export default function CreateTeam() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const setAuthenticatedUser = useAuthStore((state) => state.setAuthenticatedUser);
  const [formData, setFormData] = useState({
    name: "",
    color: "#1B5E35",
    description: "",
    captainId: "",
    playersInput: "",
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

    const playersArray = formData.playersInput
      .split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id));

    const equipoData = {
      name: formData.name,
      colors: formData.color,
      captainId: parseInt(formData.captainId),
      photo: shieldPreview || "", 
      players: playersArray
    };

    try {
      const response = await fetch("https://teams-ms-app.orangemeadow-ea12992b.eastus2.azurecontainerapps.io/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(equipoData),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        console.error("Error al crear el equipo:", errorMsg);
      }
    } catch (error) {
      console.error("Error de conexion:", error);
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

                {/* ID del Capitán */}
                <div>
                  <label className="mb-2 block font-medium">ID del Capitán</label>
                  <input
                    type="number"
                    required
                    value={formData.captainId}
                    onChange={(e) => setFormData({ ...formData, captainId: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
                    placeholder="Ej: 100123"
                  />
                </div>

                {/* IDs de los Jugadores*/}
                <div>
                  <label className="mb-2 block font-medium">IDs de los Jugadores</label>
                  <input
                    type="text"
                    required
                    value={formData.playersInput}
                    onChange={(e) => setFormData({ ...formData, playersInput: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
                    placeholder="Ej: 5, 12, 18, 21 (Separados por coma)"
                  />
                  <p className="mt-1 text-sm text-muted-foreground">Recuerda: Mínimo 7, máximo 12 jugadores.</p>
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
                        {/* Actualicé el nombre para que muestre el ID real que se está escribiendo */}
                        <p className="text-sm text-muted-foreground">Capitán: ID {formData.captainId || "Por definir"}</p>
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