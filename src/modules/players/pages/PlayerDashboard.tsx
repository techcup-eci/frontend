import Navbar from "../../../shared/components/shared/Navbar";
import Sidebar from "../../../shared/components/shared/Sidebar";
import { Home, User, Users, Trophy, BarChart3, Calendar, Shield, Bell } from "lucide-react";
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

export default function PlayerDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      
      <div className="flex flex-1">
        
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Bienvenida */}
            <div className="rounded-xl border border-border bg-gradient-to-r from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="mb-2 text-3xl font-bold">Bienvenido, Sebastián</h1>
                  <p className="text-primary-foreground/80">¡Listo para el próximo partido!</p>
                </div>
                <Badge variant="info" size="lg">
                  Jugador
                </Badge>
              </div>
            </div>

            {/* Cards principales */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Mi equipo */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">Mi equipo</h2>
                </div>
                <h3 className="mb-2 text-2xl font-bold">Los Algoritmos FC</h3>
                <p className="mb-4 text-sm text-muted-foreground">Posición en tabla: 1º</p>
                <Badge variant="success">Inscripción aprobada</Badge>
              </div>

              {/* Próximo partido */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <Trophy className="h-6 w-6 text-accent" />
                  </div>
                  <h2 className="text-xl font-bold">Próximo partido</h2>
                </div>
                <h3 className="mb-2 text-xl font-bold">vs Byte Brothers</h3>
                <p className="text-sm text-muted-foreground">12/04/2025 - 14:00</p>
                <p className="mt-2 text-sm font-medium">Cancha Principal ECI</p>
              </div>

              {/* Estado de inscripción */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4ADE80]/10">
                    <Users className="h-6 w-6 text-[#4ADE80]" />
                  </div>
                  <h2 className="text-xl font-bold">Estado del equipo</h2>
                </div>
                <p className="mb-2 text-sm text-muted-foreground">Jugadores en el equipo</p>
                <p className="mb-4 text-3xl font-bold">9 / 12</p>
                <Badge variant="approved">Pago aprobado</Badge>
              </div>
            </div>

            {/* Notificaciones recientes */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6 flex items-center gap-3">
                <Bell className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Notificaciones recientes</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-4 rounded-lg border border-border bg-background p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4ADE80]/10">
                    <Shield className="h-5 w-5 text-[#4ADE80]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Tu equipo fue aprobado para el torneo</p>
                    <p className="text-sm text-muted-foreground">Hace 2 días</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg border border-border bg-background p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Nuevo partido programado</p>
                    <p className="text-sm text-muted-foreground">Hace 3 días</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg border border-border bg-background p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <Trophy className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">¡Victoria 4-1 contra Code Runners!</p>
                    <p className="text-sm text-muted-foreground">Hace 5 días</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


