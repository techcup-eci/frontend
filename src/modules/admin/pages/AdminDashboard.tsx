import { Users, FileText, Trophy, TrendingUp } from "lucide-react";
import { Link } from "react-router";
import { useAdminUsers } from "../hooks/useAdminUsers";

export default function AdminDashboard() {
  const { data: users = [], isLoading } = useAdminUsers();

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.active).length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const playerCount = users.filter(
    (u) => u.role === "PLAYER" || u.role === "CAPTAIN"
  ).length;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Panel de Administración</h1>
              <p className="text-muted-foreground">
                Gestión global del sistema TechCup Fútbol
              </p>
            </div>

            {/* Métricas globales */}
            <div className="grid gap-6 md:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-2 flex items-center gap-3">
                  <Users className="h-8 w-8 text-primary" />
                  <h2 className="font-bold">Total usuarios</h2>
                </div>
                {isLoading ? (
                  <div className="h-9 w-16 animate-pulse rounded bg-muted" />
                ) : (
                  <p className="text-3xl font-bold">{totalUsers}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Registrados en el sistema
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-2 flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-[#4ADE80]" />
                  <h2 className="font-bold">Usuarios activos</h2>
                </div>
                {isLoading ? (
                  <div className="h-9 w-16 animate-pulse rounded bg-muted" />
                ) : (
                  <p className="text-3xl font-bold">{activeUsers}</p>
                )}
                <p className="text-sm text-muted-foreground">Cuentas habilitadas</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-2 flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-accent" />
                  <h2 className="font-bold">Jugadores</h2>
                </div>
                {isLoading ? (
                  <div className="h-9 w-16 animate-pulse rounded bg-muted" />
                ) : (
                  <p className="text-3xl font-bold">{playerCount}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Jugadores y capitanes
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-2 flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <h2 className="font-bold">Admins</h2>
                </div>
                {isLoading ? (
                  <div className="h-9 w-16 animate-pulse rounded bg-muted" />
                ) : (
                  <p className="text-3xl font-bold">{adminCount}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Administradores del sistema
                </p>
              </div>
            </div>

            {/* Accesos rápidos */}
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                to="/admin/players"
                className="rounded-xl border border-border bg-card p-6 transition hover:shadow-lg"
              >
                <Users className="mb-3 h-10 w-10 text-primary" />
                <h3 className="mb-2 font-bold">Gestión de usuarios</h3>
                <p className="text-sm text-muted-foreground">
                  Administrar roles y permisos de usuarios
                </p>
              </Link>
              <Link
                to="/admin/audit"
                className="rounded-xl border border-border bg-card p-6 transition hover:shadow-lg"
              >
                <FileText className="mb-3 h-10 w-10 text-accent" />
                <h3 className="mb-2 font-bold">Log de auditoría</h3>
                <p className="text-sm text-muted-foreground">
                  Ver historial completo de acciones del sistema
                </p>
              </Link>
              <Link
                to="/organizer/create-tournament"
                className="rounded-xl border border-border bg-card p-6 transition hover:shadow-lg"
              >
                <Trophy className="mb-3 h-10 w-10 text-[#4ADE80]" />
                <h3 className="mb-2 font-bold">Crear torneo</h3>
                <p className="text-sm text-muted-foreground">
                  Configurar un nuevo torneo desde cero
                </p>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
