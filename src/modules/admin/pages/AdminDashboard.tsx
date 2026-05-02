import Navbar from "../../../shared/components/shared/Navbar";
import Sidebar from "../../../shared/components/shared/Sidebar";
import { Home, Users, FileText, Trophy, Settings, TrendingUp } from "lucide-react";
import { Link } from "react-router";

const adminSidebar = [
  {
    items: [
      { label: "Inicio", path: "/admin/dashboard", icon: Home },
      { label: "Usuarios", path: "/admin/users", icon: Users },
      { label: "Auditoría", path: "/admin/audit", icon: FileText },
      { label: "Torneos", path: "/organizer/dashboard", icon: Trophy },
      { label: "Sistema", path: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminDashboard() {
  const weeks = [
    { week: "Semana 1", registrations: 15 },
    { week: "Semana 2", registrations: 28 },
    { week: "Semana 3", registrations: 42 },
    { week: "Semana 4", registrations: 35 },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      
      <div className="flex flex-1">
        
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Panel de Administración</h1>
              <p className="text-muted-foreground">Gestión global del sistema TechCup Fútbol</p>
            </div>

            {/* Métricas globales */}
            <div className="grid gap-6 md:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-2 flex items-center gap-3">
                  <Users className="h-8 w-8 text-primary" />
                  <h2 className="font-bold">Total usuarios</h2>
                </div>
                <p className="text-3xl font-bold">120</p>
                <p className="text-sm text-muted-foreground">Registrados en el sistema</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-2 flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-[#4ADE80]" />
                  <h2 className="font-bold">Usuarios activos</h2>
                </div>
                <p className="text-3xl font-bold">98</p>
                <p className="text-sm text-muted-foreground">Últimos 7 días</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-2 flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-accent" />
                  <h2 className="font-bold">Equipos creados</h2>
                </div>
                <p className="text-3xl font-bold">10</p>
                <p className="text-sm text-muted-foreground">En el torneo actual</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-2 flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <h2 className="font-bold">Torneos</h2>
                </div>
                <p className="text-3xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Activo actualmente</p>
              </div>
            </div>

            {/* Gráfica de registros */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-xl font-bold">Registros por semana</h2>
              <div className="flex items-end gap-4">
                {weeks.map((item) => (
                  <div key={item.week} className="flex-1">
                    <div className="mb-2 flex items-end justify-center" style={{ height: "200px" }}>
                      <div
                        className="w-full rounded-t-lg bg-primary transition-all hover:bg-primary/80"
                        style={{ height: `${(item.registrations / 50) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold">{item.week}</p>
                      <p className="text-xs text-muted-foreground">{item.registrations} usuarios</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alertas del sistema */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-xl font-bold">Alertas del sistema</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-4 rounded-lg border border-border bg-background p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FACC15]/10">
                    <Users className="h-5 w-5 text-[#FACC15]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">5 usuarios inactivos este mes</p>
                    <p className="text-sm text-muted-foreground">
                      Han pasado más de 30 días sin actividad
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg border border-border bg-background p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EF4444]/10">
                    <FileText className="h-5 w-5 text-[#EF4444]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">3 intentos de acceso fallidos recientes</p>
                    <p className="text-sm text-muted-foreground">Últimas 24 horas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accesos rápidos */}
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                to="/admin/users"
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
