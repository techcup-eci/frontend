import { useState } from "react";
import Navbar from "../../../shared/components/shared/Navbar";
import Sidebar from "../../../shared/components/shared/Sidebar";
import { Home, User, Users, Trophy, BarChart3, Calendar, Loader2, XCircle } from "lucide-react";
import { useLineup } from "../../competitions/hooks/useLineup";

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

const ROLE_LABELS: Record<string, string> = {
  GOALKEEPER: "Portero",
  DEFENDER: "Defensa",
  MIDFIELDER: "Mediocampista",
  FORWARD: "Delantero",
};

export default function ViewLineup() {
  // TODO: Replace these hardcoded values with route params/context
  const [tournamentId] = useState<string>("tournament-uuid-placeholder");
  const [matchId] = useState<string>("match-uuid-placeholder");
  const [teamId] = useState<string>("team-uuid-placeholder");

  const { data: lineup, isLoading, isError, error } = useLineup(tournamentId, matchId, teamId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar sections={playerSidebar} />
          <main className="flex flex-1 items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Cargando alineación...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar sections={playerSidebar} />
          <main className="flex flex-1 items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3 text-center">
              <XCircle className="h-10 w-10 text-destructive/60" />
              <p className="text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "No se pudo cargar la alineación."}
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!lineup) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar sections={playerSidebar} />
          <main className="flex flex-1 items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3 text-center">
              <Users className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-muted-foreground">
                No se encontró alineación para este partido.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar sections={playerSidebar} />
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Alineación del equipo</h1>
              <p className="text-muted-foreground">
                Formación:{" "}
                <span className="font-semibold text-foreground">{lineup.formation}</span>
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
              {/* Formation visual */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 text-xl font-bold">Formación: {lineup.formation}</h2>
                <div className="relative h-[600px] overflow-hidden rounded-xl border-4 border-white bg-gradient-to-b from-[#4ADE80] to-[#22C55E]">
                  {/* Líneas del campo */}
                  <div className="absolute inset-0">
                    <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-white"></div>
                    <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"></div>
                    <div className="absolute left-1/2 top-0 h-20 w-48 -translate-x-1/2 border-2 border-b-0 border-white"></div>
                    <div className="absolute bottom-0 left-1/2 h-20 w-48 -translate-x-1/2 border-2 border-t-0 border-white"></div>
                  </div>

                  {/* Player dots */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-12">
                    <div className="flex flex-wrap justify-center gap-8 px-8">
                      {lineup.players
                        .filter((p) => p.role === "FORWARD")
                        .map((p) => (
                          <div
                            key={p.playerId}
                            className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-4 border-white bg-primary text-xs font-bold text-white shadow-lg"
                          >
                            <span className="text-lg">F</span>
                          </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 px-8">
                      {lineup.players
                        .filter((p) => p.role === "MIDFIELDER")
                        .map((p) => (
                          <div
                            key={p.playerId}
                            className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-4 border-white bg-primary text-xs font-bold text-white shadow-lg"
                          >
                            <span className="text-lg">M</span>
                          </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 px-8">
                      {lineup.players
                        .filter((p) => p.role === "DEFENDER")
                        .map((p) => (
                          <div
                            key={p.playerId}
                            className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-4 border-white bg-primary text-xs font-bold text-white shadow-lg"
                          >
                            <span className="text-lg">D</span>
                          </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 px-8">
                      {lineup.players
                        .filter((p) => p.role === "GOALKEEPER")
                        .map((p) => (
                          <div
                            key={p.playerId}
                            className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-4 border-accent bg-accent text-xs font-bold text-white shadow-lg ring-4 ring-accent/50"
                          >
                            <span className="text-lg">GK</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Player list */}
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="mb-4 text-xl font-bold">Titulares ({lineup.players.length})</h2>
                  <div className="space-y-2">
                    {lineup.players.map((player) => {
                      const isCaptain = lineup.captainId === player.playerId;
                      return (
                        <div
                          key={player.playerId}
                          className={`flex items-center gap-3 rounded-lg border p-3 ${
                            isCaptain ? "border-accent bg-accent/10" : "border-border bg-background"
                          }`}
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                            {player.role.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">
                              {player.playerId}
                              {isCaptain && (
                                <span className="ml-2 text-xs text-accent">(Capitán)</span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {ROLE_LABELS[player.role] ?? player.role}
                            </p>
                          </div>
                        </div>
                      );
                    })}
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
