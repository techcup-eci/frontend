import Navbar from "../../../shared/components/shared/Navbar";
import Sidebar from "../../../shared/components/shared/Sidebar";
import { Home, Trophy, Users, CreditCard, Calendar, ListChecks, Table, Layers } from "lucide-react";
import Badge from "../../../shared/components/shared/Badge";
import { Link } from "react-router";

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
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userName="María Rodríguez" role="Organizador" />
      <div className="flex flex-1">
        <Sidebar sections={organizerSidebar} />
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Bienvenida */}
            <div className="rounded-xl border border-border bg-gradient-to-r from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="mb-2 text-3xl font-bold">Panel de Organización</h1>
                  <p className="text-primary-foreground/80">TechCup Fútbol 2025-1</p>
                </div>
                <Badge variant="default" size="lg">
                  Organizador
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
                <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FACC15]/10">
                      <CreditCard className="h-5 w-5 text-[#FACC15]" />
                    </div>
                    <div>
                      <p className="font-medium">Neural FC - Comprobante de pago</p>
                      <p className="text-sm text-muted-foreground">Subido hace 2 horas</p>
                    </div>
                  </div>
                  <Link
                    to="/organizer/teams"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                  >
                    Revisar
                  </Link>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FACC15]/10">
                      <CreditCard className="h-5 w-5 text-[#FACC15]" />
                    </div>
                    <div>
                      <p className="font-medium">Los Cibernéticos - Comprobante de pago</p>
                      <p className="text-sm text-muted-foreground">Subido hace 1 día</p>
                    </div>
                  </div>
                  <Link
                    to="/organizer/teams"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                  >
                    Revisar
                  </Link>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FACC15]/10">
                      <CreditCard className="h-5 w-5 text-[#FACC15]" />
                    </div>
                    <div>
                      <p className="font-medium">Stack Overflow FC - Comprobante de pago</p>
                      <p className="text-sm text-muted-foreground">Subido hace 2 días</p>
                    </div>
                  </div>
                  <Link
                    to="/organizer/teams"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                  >
                    Revisar
                  </Link>
                </div>
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

            {/* Acceso rápido */}
            <div className="grid gap-4 md:grid-cols-4">
              <Link
                to="/organizer/teams"
                className="rounded-xl border border-border bg-card p-6 transition hover:shadow-lg"
              >
                <Users className="mb-3 h-10 w-10 text-primary" />
                <h3 className="mb-2 font-bold">Gestionar equipos</h3>
                <p className="text-sm text-muted-foreground">Ver y aprobar inscripciones</p>
              </Link>
              <Link
                to="/organizer/schedule"
                className="rounded-xl border border-border bg-card p-6 transition hover:shadow-lg"
              >
                <Calendar className="mb-3 h-10 w-10 text-accent" />
                <h3 className="mb-2 font-bold">Programar partidos</h3>
                <p className="text-sm text-muted-foreground">Crear calendario de juegos</p>
              </Link>
              <Link
                to="/organizer/standings"
                className="rounded-xl border border-border bg-card p-6 transition hover:shadow-lg"
              >
                <Table className="mb-3 h-10 w-10 text-[#4ADE80]" />
                <h3 className="mb-2 font-bold">Tabla de posiciones</h3>
                <p className="text-sm text-muted-foreground">Ver clasificación actual</p>
              </Link>
              <Link
                to="/organizer/bracket"
                className="rounded-xl border border-border bg-card p-6 transition hover:shadow-lg"
              >
                <Layers className="mb-3 h-10 w-10 text-[#FACC15]" />
                <h3 className="mb-2 font-bold">Llaves eliminatorias</h3>
                <p className="text-sm text-muted-foreground">Gestionar fase final</p>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
