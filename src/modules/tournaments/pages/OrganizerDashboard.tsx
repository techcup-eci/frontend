import {
  Calendar,
  CreditCard,
  Home,
  Layers,
  ListChecks,
  Table,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import Badge from "../../../shared/components/shared/Badge";
import { useTournaments } from "../hooks/useTournaments";
import { useActivateTournament } from "../hooks/useActivateTournament";
import { useFinishTournament } from "../hooks/useFinishTournament";
import { useDeleteTournament } from "../hooks/useDeleteTournament";
import { useStartTournament } from "../hooks/useStartTournament";

const organizerSidebar = [
  {
    items: [
      { label: "Inicio", path: "/organizer/dashboard", icon: Home },
      { label: "Torneos", path: "/organizer/create-tournament", icon: Trophy },
      { label: "Equipos", path: "/organizer/teams", icon: Users },
      { label: "Pagos", path: "/organizer/teams", icon: CreditCard },
      { label: "Partidos", path: "/organizer/schedule", icon: Calendar },
      { label: "Resultados", path: "/organizer/calendar", icon: ListChecks },
      { label: "Tabla de Posiciones", path: "/organizer/standings", icon: Table },
      { label: "Llaves", path: "/organizer/bracket", icon: Layers },
    ],
  },
];

export default function OrganizerDashboard() {
  const {
    data: tournaments = [],
    isLoading,
    isError,
    error,
  } = useTournaments();
  const activateMutation = useActivateTournament();
  const finishMutation = useFinishTournament();
  const deleteMutation = useDeleteTournament();

  const handleActivate = (id: string) => {
    activateMutation.mutate(id, {
      onSuccess: () => toast.success("Torneo activado correctamente"),
      onError: (err: any) => {
        const message = err?.response?.data?.message || err?.message || "No se pudo activar el torneo";
        toast.error(message);
      },
    });
  };

  const handleStart = (id: string) => {
    startMutation.mutate(id, {
        onSuccess: () => toast.success("Torneo iniciado correctamente"),
        onError: (err: any) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "No se pudo iniciar el torneo";
            toast.error(message);
        },
    });
  };

  const handleFinish = (id: string) => {
    finishMutation.mutate(id, {
      onSuccess: () => toast.success("Torneo finalizado correctamente"),
      onError: (err: any) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "No se pudo finalizar el torneo";
        toast.error(message);
      },
    });
  };

  const handleDelete = (id: string, name: string) => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar el torneo "${name}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    deleteMutation.mutate(id, {
      onSuccess: () => toast.success(`Torneo "${name}" eliminado correctamente`),
      onError: (err: any) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "No se pudo eliminar el torneo";
        toast.error(message);
      },
    });
  };

  const startMutation = useStartTournament();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Bienvenida */}
            <div className="rounded-xl border border-border bg-gradient-to-r from-primary to-primary p-8 text-primary-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="mb-2 text-3xl font-bold">Panel de Organización</h1>
                  <p className="text-primary-foreground/80">TechCup Fútbol 2025-1</p>
                </div>
                <Badge variant="finished" size="lg">
                  <span className="text-white">Organizador</span>
                </Badge>
              </div>
            </div>

            {/* Métricas principales */}
            <div className="grid gap-6 md:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-2 flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-primary" />
                  <h2 className="font-bold">Torneos activos</h2>
                </div>
                <p className="text-3xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">TechCup 2025-1</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-2 flex items-center gap-3">
                  <Users className="h-8 w-8 text-accent" />
                  <h2 className="font-bold">Equipos inscritos</h2>
                </div>
                <p className="text-3xl font-bold">10 / 12</p>
                <p className="text-sm text-muted-foreground">2 cupos disponibles</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-2 flex items-center gap-3">
                  <CreditCard className="h-8 w-8 text-[#FACC15]" />
                  <h2 className="font-bold">Pagos pendientes</h2>
                </div>
                <p className="text-3xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Por revisar</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-2 flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-[#4ADE80]" />
                  <h2 className="font-bold">Partidos esta semana</h2>
                </div>
                <p className="text-3xl font-bold">4</p>
                <p className="text-sm text-muted-foreground">12-18 abril</p>
              </div>
            </div>

            {/* Acción requerida */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-xl font-bold">Acción requerida</h2>
              <div className="space-y-3">
                {[
                  { name: "Neural FC", ago: "2 horas" },
                  { name: "Los Cibernéticos", ago: "1 día" },
                  { name: "Stack Overflow FC", ago: "2 días" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FACC15]/10">
                        <CreditCard className="h-5 w-5 text-[#FACC15]" />
                      </div>
                      <div>
                        <p className="font-medium">{item.name} - Comprobante de pago</p>
                        <p className="text-sm text-muted-foreground">Subido hace {item.ago}</p>
                      </div>
                    </div>
                    <Link
                      to="/organizer/teams"
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                    >
                      Revisar
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen del torneo */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-xl font-bold">Resumen del torneo activo</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Nombre</p>
                  <p className="font-bold">TechCup 2025-1</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Fase actual</p>
                  <Badge variant="progress">Fase de grupos</Badge>
                </div>
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Fecha de cierre de inscripciones</p>
                  <p className="font-bold">28/02/2025</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Fecha de inicio</p>
                  <p className="font-bold">15/03/2025</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Fecha de finalización</p>
                  <p className="font-bold">30/05/2025</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Próximo partido</p>
                  <p className="font-bold">12/04/2025 - 14:00</p>
                </div>
              </div>
            </div>

            {/* Mis Torneos */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Mis Torneos</h2>
                <Link
                  to="/organizer/create-tournament"
                  className="flex items-center gap-2 rounded-lg bg-[var(--color-oxblood)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  <Trophy className="h-4 w-4" />
                  Nuevo Torneo
                </Link>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-[var(--color-oxblood)]" />
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <XCircle className="h-10 w-10 text-destructive/60" />
                  <p className="text-muted-foreground">
                    {error instanceof Error ? error.message : "No se pudieron cargar los torneos."}
                  </p>
                </div>
              ) : tournaments.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <Trophy className="h-10 w-10 text-muted-foreground/40" />
                  <p className="text-muted-foreground">No hay torneos creados aún.</p>
                  <Link
                    to="/organizer/create-tournament"
                    className="text-sm font-medium text-[var(--color-cool-sky)] hover:underline"
                  >
                    Crear el primer torneo
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {tournaments.map((tournament) => (
                    <div
                      key={tournament.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-oxblood)]/10">
                          <Trophy className="h-5 w-5 text-[var(--color-oxblood)]" />
                        </div>
                        <div>
                          <p className="font-medium">{tournament.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {tournament.startDate} → {tournament.endDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            tournament.status === "DRAFT"
                              ? "bg-gray-200 text-gray-700"
                              : "bg-green-200 text-green-800"
                          }`}
                        >
                          {tournament.status}
                        </span>
                        {tournament.status === "DRAFT" && (
                          <button
                            onClick={() => handleActivate(tournament.id)}
                            disabled={activateMutation.isPending}
                            className="rounded-lg bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                          >
                            {activateMutation.isPending ? "Activando..." : "Activar"}
                          </button>
                        )}

                        {tournament.status === "ACTIVE" && (
                        <button
                            onClick={() => handleStart(tournament.id)}
                            disabled={startMutation.isPending}
                            className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                          >
                              {startMutation.isPending ? "Iniciando..." : "Iniciar"}
                          </button>
                          )}

                        {tournament.status === "DRAFT" && (
                          <button
                            onClick={() => handleDelete(tournament.id, tournament.name)}
                            disabled={deleteMutation.isPending}
                            className="rounded-lg bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                          >
                            {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
                          </button>
                        )}

                        {tournament.status === "IN_PROGRESS" && (
                          <button
                            onClick={() => handleFinish(tournament.id)}
                            disabled={finishMutation.isPending}
                            className="rounded-lg bg-purple-600 px-3 py-1 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-60"
                          >
                            {finishMutation.isPending ? "Finalizando..." : "Finalizar"}
                          </button>
                        )}

                        <Link
                          to={`/organizer/tournament/configure`}
                          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                        >
                          Gestionar
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Acceso rápido */}
            <div className="grid gap-4 md:grid-cols-5">
              <Link to="/organizer/teams" className="rounded-xl border border-border bg-card p-6 transition hover:shadow-lg">
                <Users className="mb-3 h-10 w-10 text-primary" />
                <h3 className="mb-2 font-bold">Gestionar equipos</h3>
                <p className="text-sm text-muted-foreground">Ver y aprobar inscripciones</p>
              </Link>
              <Link to="/organizer/schedule" className="rounded-xl border border-border bg-card p-6 transition hover:shadow-lg">
                <Calendar className="mb-3 h-10 w-10 text-accent" />
                <h3 className="mb-2 font-bold">Programar partidos</h3>
                <p className="text-sm text-muted-foreground">Crear calendario de juegos</p>
              </Link>
              <Link to="/organizer/standings" className="rounded-xl border border-border bg-card p-6 transition hover:shadow-lg">
                <Table className="mb-3 h-10 w-10 text-[#4ADE80]" />
                <h3 className="mb-2 font-bold">Tabla de posiciones</h3>
                <p className="text-sm text-muted-foreground">Ver clasificación actual</p>
              </Link>
              <Link to="/organizer/bracket" className="rounded-xl border border-border bg-card p-6 transition hover:shadow-lg">
                <Layers className="mb-3 h-10 w-10 text-[#FACC15]" />
                <h3 className="mb-2 font-bold">Llaves eliminatorias</h3>
                <p className="text-sm text-muted-foreground">Gestionar fase final</p>
              </Link>
              <Link to="/organizer/create-tournament" className="rounded-xl border border-border bg-card p-6 transition hover:shadow-lg">
                <Trophy className="mb-3 h-10 w-10 text-[var(--color-oxblood)]" />
                <h3 className="mb-2 font-bold">Crear Torneo</h3>
                <p className="text-sm text-muted-foreground">Registrar un nuevo torneo</p>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
