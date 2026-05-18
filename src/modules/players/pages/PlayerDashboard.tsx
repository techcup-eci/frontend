import { Link } from "react-router";
import { Shield, Trophy, UserPlus, Users, Bell, AlertCircle } from "lucide-react";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import Badge from "../../../shared/components/shared/Badge";

const roleLabels: Record<string, string> = {
  player: "Jugador",
  captain: "Capitán",
  organizer: "Organizador",
  referee: "Árbitro",
  admin: "Administrador",
  invited: "Invitado",
};

export default function PlayerDashboard() {
  const user = useAuthStore((state) => state.user);
  const roleLabel = user?.role ? roleLabels[user.role] ?? user.role : "Jugador";
  const userName = user?.name ?? "Jugador";

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Bienvenida */}
            <div className="rounded-xl border border-border bg-gradient-to-r from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="mb-2 text-3xl font-bold">Bienvenido, {userName}</h1>
                  <p className="text-primary-foreground/80">
                    {user?.role === "player" || user?.role === "captain"
                      ? "¡Listo para el próximo partido!"
                      : "Gestiona tu participación en el torneo."}
                  </p>
                </div>
                <Badge variant="info" size="lg">
                  {roleLabel}
                </Badge>
              </div>
              {(user?.role === "captain" || user?.role === "player") && (
                <div className="mt-6">
                  <Link
                    to="/captain/create-team"
                    className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/20"
                  >
                    <UserPlus className="h-5 w-5" />
                    Crear equipo
                  </Link>
                </div>
              )}
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
                <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                  <AlertCircle className="mb-2 h-8 w-8 opacity-40" />
                  <p className="text-sm">Aún no tienes equipo asignado</p>
                  <p className="mt-1 text-xs">Crea o únete a un equipo para verlo aquí</p>
                </div>
              </div>

              {/* Próximo partido */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <Trophy className="h-6 w-6 text-accent" />
                  </div>
                  <h2 className="text-xl font-bold">Próximo partido</h2>
                </div>
                <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                  <Trophy className="mb-2 h-8 w-8 opacity-40" />
                  <p className="text-sm">No hay partidos programados</p>
                  <p className="mt-1 text-xs">Los partidos aparecerán cuando el torneo esté activo</p>
                </div>
              </div>

              {/* Estado del equipo */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4ADE80]/10">
                    <Users className="h-6 w-6 text-[#4ADE80]" />
                  </div>
                  <h2 className="text-xl font-bold">Estado del equipo</h2>
                </div>
                <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                  <Users className="mb-2 h-8 w-8 opacity-40" />
                  <p className="text-sm">Sin información disponible</p>
                  <p className="mt-1 text-xs">Inscribe un equipo al torneo para ver su estado</p>
                </div>
              </div>
            </div>

            {/* Notificaciones recientes */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6 flex items-center gap-3">
                <Bell className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Notificaciones recientes</h2>
              </div>
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Bell className="mb-2 h-10 w-10 opacity-40" />
                <p className="text-sm">No hay notificaciones</p>
                <p className="mt-1 text-xs">Las actualizaciones del torneo aparecerán aquí</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
