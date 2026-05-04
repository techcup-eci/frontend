import Navbar from "../../../shared/components/shared/Navbar";
import Sidebar from "../../../shared/components/shared/Sidebar";
import { Home, User, Users, Trophy, BarChart3, Calendar } from "lucide-react";

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

const rivalLineup = [
  { id: 1, name: "Roberto Silva", dorsal: 1, position: "Portero", top: "85%", left: "50%" },
  { id: 2, name: "Carlos Méndez", dorsal: 2, position: "Lateral Izquierdo", top: "65%", left: "15%" },
  { id: 3, name: "Luis Romero", dorsal: 4, position: "Defensa Central", top: "70%", left: "35%" },
  { id: 4, name: "Jorge Moreno", dorsal: 5, position: "Defensa Central", top: "70%", left: "65%" },
  { id: 5, name: "Pablo Ortiz", dorsal: 3, position: "Lateral Derecho", top: "65%", left: "85%" },
  { id: 6, name: "Andrés Morales", dorsal: 8, position: "Mediocampista", top: "50%", left: "30%" },
  { id: 7, name: "Ricardo Torres", dorsal: 6, position: "Mediocampista", top: "50%", left: "50%" },
  { id: 8, name: "Fernando Gil", dorsal: 10, position: "Mediocampista", top: "50%", left: "70%" },
  { id: 9, name: "Iván Reyes", dorsal: 7, position: "Delantero", top: "20%", left: "25%" },
  { id: 10, name: "Daniel Castro", dorsal: 9, position: "Delantero", top: "15%", left: "50%" },
  { id: 11, name: "Esteban Díaz", dorsal: 11, position: "Delantero", top: "20%", left: "75%" },
];

export default function ViewRivalLineup() {
  return (
    <div className="flex min-h-screen flex-col">
      
      <div className="flex flex-1">
        
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Alineación de Byte Brothers</h1>
              <p className="text-muted-foreground">Formación 4-3-3 del equipo rival</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
              {/* Campo de fútbol */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="relative h-[700px] overflow-hidden rounded-xl border-4 border-white bg-gradient-to-b from-[#4ADE80] to-[#22C55E]">
                  {/* Líneas del campo */}
                  <div className="absolute inset-0">
                    {/* Línea central */}
                    <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-white"></div>
                    {/* Círculo central */}
                    <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"></div>
                    {/* Área superior */}
                    <div className="absolute left-1/2 top-0 h-20 w-48 -translate-x-1/2 border-2 border-b-0 border-white"></div>
                    {/* Área inferior */}
                    <div className="absolute bottom-0 left-1/2 h-20 w-48 -translate-x-1/2 border-2 border-t-0 border-white"></div>
                  </div>

                  {/* Jugadores */}
                  {rivalLineup.map((player) => (
                    <div
                      key={player.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ top: player.top, left: player.left }}
                    >
                      <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-4 border-white bg-[#EF4444] text-xs font-bold text-white shadow-lg">
                        <div className="text-2xl">{player.dorsal}</div>
                      </div>
                      <div className="absolute -bottom-8 left-1/2 w-32 -translate-x-1/2 text-center text-xs font-bold text-white drop-shadow-lg">
                        {player.name.split(" ")[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lista de jugadores */}
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="mb-4 text-xl font-bold">Titulares (11)</h2>
                  <div className="space-y-2">
                    {rivalLineup.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EF4444] text-lg font-bold text-white">
                          {player.dorsal}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{player.name}</p>
                          <p className="text-xs text-muted-foreground">{player.position}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-blue-500/10 p-4 text-sm text-blue-600">
                  <p className="font-semibold">Información del equipo:</p>
                  <div className="mt-2 space-y-1 text-xs">
                    <p>• Capitán: Andrés Morales</p>
                    <p>• Goles a favor: 18</p>
                    <p>• Goles en contra: 9</p>
                    <p>• Posición: 2º lugar</p>
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


