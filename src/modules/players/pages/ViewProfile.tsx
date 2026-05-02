import { Link } from "react-router";
import Navbar from "../../../shared/components/shared/Navbar";
import Sidebar from "../../../shared/components/shared/Sidebar";
import { Home, User, Users, Trophy, BarChart3, Calendar, Edit, Target, AlertCircle } from "lucide-react";
import Badge from "../../../shared/components/shared/Badge";

const playerSidebar = [
  {
    items: [
      { label: "Inicio", path: "/player/dashboard", icon: Home },
      { label: "Mi Perfil", path: "/player/profile", icon: User },
      { label: "Buscar Equipos", path: "/player/teams", icon: Users },
      { label: "Torneo", path: "/tournament-info", icon: Trophy },
      { label: "Estadísticas", path: "/stats", icon: BarChart3 },
      { label: "Disponibilidad", path: "/player/availability", icon: Calendar },
    ],
  },
];

export default function ViewProfile() {
  return (
    <div className="flex min-h-screen flex-col">
      
      <div className="flex flex-1">
        
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Mi perfil deportivo</h1>
              <Link
                to="/player/edit-profile"
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                <Edit className="h-4 w-4" />
                Editar perfil
              </Link>
            </div>

            {/* Tarjeta de jugador expandida */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="border-b border-border bg-gradient-to-r from-primary/10 to-accent/10 p-8">
                <div className="flex items-start gap-6">
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-border bg-background">
                    <User className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h2 className="mb-2 text-3xl font-bold">Sebastián Torres</h2>
                    <p className="mb-4 text-lg text-muted-foreground">sebastian.torres@escuelaing.edu.co</p>
                    <div className="flex gap-3">
                      <Badge variant="success">Disponible</Badge>
                      <Badge variant="info">Jugador</Badge>
                    </div>
                  </div>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-black text-primary-foreground">
                    8
                  </div>
                </div>
              </div>

              <div className="grid gap-6 p-8 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Posición</p>
                  <p className="text-lg font-bold">Mediocampista Central</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Dorsal preferido</p>
                  <p className="text-lg font-bold">8</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Semestre actual</p>
                  <p className="text-lg font-bold">6</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Equipo actual</p>
                  <p className="text-lg font-bold">Los Algoritmos FC</p>
                </div>
              </div>
            </div>

            {/* Estadísticas del torneo */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6 flex items-center gap-3">
                <Trophy className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Estadísticas del torneo</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-4">
                <div className="rounded-lg border border-border bg-background p-4 text-center">
                  <Target className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <p className="mb-1 text-3xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Goles marcados</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4 text-center">
                  <Trophy className="mx-auto mb-2 h-8 w-8 text-[#4ADE80]" />
                  <p className="mb-1 text-3xl font-bold">4</p>
                  <p className="text-sm text-muted-foreground">Partidos jugados</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4 text-center">
                  <AlertCircle className="mx-auto mb-2 h-8 w-8 text-[#FACC15]" />
                  <p className="mb-1 text-3xl font-bold">1</p>
                  <p className="text-sm text-muted-foreground">Tarjetas amarillas</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4 text-center">
                  <AlertCircle className="mx-auto mb-2 h-8 w-8 text-[#EF4444]" />
                  <p className="mb-1 text-3xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Tarjetas rojas</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
