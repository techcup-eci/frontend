import Navbar from "../../../shared/components/shared/Navbar";
import Sidebar from "../../../shared/components/shared/Sidebar";
import { Home, Users, UserPlus, CreditCard, LayoutList, Trophy, BarChart3, Shield, Bell, AlertTriangle } from "lucide-react";
import Badge from "../../../shared/components/shared/Badge";
import { Link } from "react-router";

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

export default function CaptainDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userName="Felipe Jiménez" role="Capitán" />
      <div className="flex flex-1">
        <Sidebar sections={captainSidebar} />
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Bienvenida */}
            <div className="rounded-xl border border-border bg-gradient-to-r from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="mb-2 text-3xl font-bold">Panel del Capitán</h1>
                  <p className="text-primary-foreground/80">Los Algoritmos FC</p>
                </div>
                <Badge variant="active" size="lg">
                  Capitán
                </Badge>
              </div>
            </div>

            {/* Alerta de pago pendiente */}
            <div className="rounded-xl border border-[#FACC15] bg-[#FACC15]/10 p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 flex-shrink-0 text-[#FACC15]" />
                <div className="flex-1">
                  <p className="mb-2 font-bold text-[#FACC15]">Acción requerida</p>
                  <p className="mb-4 text-sm">
                    Tu inscripción aún no ha sido aprobada. Sube el comprobante de pago para participar en el torneo.
                  </p>
                  <Link
                    to="/captain/payment"
                    className="inline-block rounded-lg bg-[#FACC15] px-4 py-2 font-semibold text-black transition hover:bg-[#FACC15]/90"
                  >
                    Subir comprobante
                  </Link>
                </div>
              </div>
            </div>

            {/* Cards de resumen */}
            <div className="grid gap-6 md:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-2 flex items-center gap-3">
                  <Users className="h-8 w-8 text-primary" />
                  <h2 className="font-bold">Jugadores</h2>
                </div>
                <p className="text-3xl font-bold">9 / 12</p>
                <p className="text-sm text-muted-foreground">3 cupos disponibles</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-2 flex items-center gap-3">
                  <Bell className="h-8 w-8 text-accent" />
                  <h2 className="font-bold">Solicitudes</h2>
                </div>
                <p className="text-3xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Pendientes de revisar</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-2 flex items-center gap-3">
                  <CreditCard className="h-8 w-8 text-[#FACC15]" />
                  <h2 className="font-bold">Estado del pago</h2>
                </div>
                <Badge variant="review">En revisión</Badge>
                <p className="mt-2 text-sm text-muted-foreground">Subido hace 1 día</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-2 flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-[#4ADE80]" />
                  <h2 className="font-bold">Próximo partido</h2>
                </div>
                <p className="font-bold">vs Byte Brothers</p>
                <p className="text-sm text-muted-foreground">12/04/2025 - 14:00</p>
              </div>
            </div>

            {/* Actividad reciente */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6 flex items-center gap-3">
                <Bell className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Actividad del equipo</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-4 rounded-lg border border-border bg-background p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                    <UserPlus className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Nueva solicitud de ingreso</p>
                    <p className="text-sm text-muted-foreground">
                      Camila Herrera quiere unirse al equipo - Hace 2 horas
                    </p>
                  </div>
                  <Link
                    to="/captain/manage"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                  >
                    Revisar
                  </Link>
                </div>
                <div className="flex items-start gap-4 rounded-lg border border-border bg-background p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4ADE80]/10">
                    <Users className="h-5 w-5 text-[#4ADE80]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Andrés Morales aceptó la invitación</p>
                    <p className="text-sm text-muted-foreground">Hace 1 día</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg border border-border bg-background p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <Trophy className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Partido programado</p>
                    <p className="text-sm text-muted-foreground">
                      vs Byte Brothers - 12/04/2025 a las 14:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accesos rápidos */}
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                to="/captain/manage"
                className="rounded-xl border border-border bg-card p-6 transition hover:shadow-lg"
              >
                <Users className="mb-3 h-10 w-10 text-primary" />
                <h3 className="mb-2 font-bold">Gestionar jugadores</h3>
                <p className="text-sm text-muted-foreground">Ver equipo y solicitudes</p>
              </Link>
              <Link
                to="/captain/search-players"
                className="rounded-xl border border-border bg-card p-6 transition hover:shadow-lg"
              >
                <UserPlus className="mb-3 h-10 w-10 text-accent" />
                <h3 className="mb-2 font-bold">Buscar jugadores</h3>
                <p className="text-sm text-muted-foreground">Invitar nuevos miembros</p>
              </Link>
              <Link
                to="/captain/lineup"
                className="rounded-xl border border-border bg-card p-6 transition hover:shadow-lg"
              >
                <LayoutList className="mb-3 h-10 w-10 text-[#4ADE80]" />
                <h3 className="mb-2 font-bold">Configurar alineación</h3>
                <p className="text-sm text-muted-foreground">Organizar tu formación</p>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
