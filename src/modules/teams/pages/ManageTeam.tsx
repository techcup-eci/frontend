import Navbar from "../../../shared/components/shared/Navbar";
import Sidebar from "../../../shared/components/shared/Sidebar";
import { Home, Users, UserPlus, CreditCard, LayoutList, Trophy, BarChart3, Trash2, Eye } from "lucide-react";
import Badge from "../../../shared/components/shared/Badge";

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
 
export default function ManageTeam() {
  const players = [
    { id: 1, name: "Sebastián Torres", position: "Mediocampista Central", number: 8 },
    { id: 2, name: "Andrés Morales", position: "Delantero Centro", number: 9 },
    { id: 3, name: "Camila Herrera", position: "Defensa Central", number: 4 },
    { id: 4, name: "Valentina Ruiz", position: "Mediocampista Defensivo", number: 6 },
    { id: 5, name: "Diego Ramírez", position: "Portero", number: 1 },
    { id: 6, name: "Laura Pérez", position: "Lateral Derecho", number: 2 },
    { id: 7, name: "Carlos Gómez", position: "Lateral Izquierdo", number: 3 },
    { id: 8, name: "Ana Martínez", position: "Extremo Derecho", number: 7 },
    { id: 9, name: "Juan Rodríguez", position: "Extremo Izquierdo", number: 11 },
  ];

  const requests = [
    { id: 1, name: "María López", position: "Mediocampista Central", semester: 5 },
    { id: 2, name: "Pedro Sánchez", position: "Delantero Centro", semester: 7 },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      
      <div className="flex flex-1">
        
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold">Gestión del Equipo</h1>
                <p className="text-muted-foreground">Los Algoritmos FC</p>
              </div>
              <div className="rounded-xl border border-border bg-card px-6 py-3">
                <p className="text-sm text-muted-foreground">Jugadores</p>
                <p className="text-2xl font-bold">9 / 12</p>
              </div>
            </div>

            {/* Jugadores del equipo */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-xl font-bold">Jugadores del equipo</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-accent/5">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold">Jugador</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Posición</th>
                      <th className="px-4 py-3 text-center text-sm font-bold">Dorsal</th>
                      <th className="px-4 py-3 text-center text-sm font-bold">Estado</th>
                      <th className="px-4 py-3 text-center text-sm font-bold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player, idx) => (
                      <tr key={player.id} className={`border-b border-border ${idx % 2 === 0 ? "bg-background" : ""}`}>
                        <td className="px-4 py-4 font-semibold">{player.name}</td>
                        <td className="px-4 py-4 text-sm">{player.position}</td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                            {player.number}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Badge variant="success" size="sm">
                            Activo
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center gap-2">
                            <button className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium transition hover:bg-accent">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="rounded-lg border border-destructive bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive transition hover:bg-destructive/20">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Solicitudes pendientes */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Solicitudes de ingreso</h2>
                <Badge variant="warning">{requests.length} pendientes</Badge>
              </div>
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <UserPlus className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold">{request.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.position} · Semestre {request.semester}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                        Aceptar
                      </button>
                      <button className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-accent">
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botón buscar jugadores */}
            <div className="rounded-lg border-2 border-dashed border-border bg-accent/5 p-8 text-center">
              <UserPlus className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 font-bold">¿Necesitas más jugadores?</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Tienes 3 cupos disponibles para completar tu equipo
              </p>
              <a
                href="/captain/search-players"
                className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Buscar jugadores
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
