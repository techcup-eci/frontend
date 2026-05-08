import { useState } from "react";
import Navbar from "../../../shared/components/shared/Navbar";
import Sidebar from "../../../shared/components/shared/Sidebar";
import { Home, Users, Calendar, Trophy, FileText, DollarSign, BarChart3, Target, AlertCircle } from "lucide-react";
import Badge from "../../../shared/components/shared/Badge";

const organizerSidebar = [
  {
    items: [
      { label: "Inicio", path: "/organizer/dashboard", icon: Home },
      { label: "Equipos", path: "/organizer/teams", icon: Users },
      { label: "Programar Partidos", path: "/organizer/schedule", icon: Calendar },
      { label: "Tabla de Posiciones", path: "/organizer/standings", icon: Trophy },
      { label: "Registrar Resultado", path: "/organizer/results", icon: FileText },
      { label: "Pagos", path: "/organizer/payments", icon: DollarSign },
      { label: "Estadísticas", path: "/stats", icon: BarChart3 },
    ],
  },
];

type PlayerStat = {
  playerId: number;
  playerName: string;
  goals: number;
  yellowCards: number;
  redCards: number;
};

export default function RegisterResult() {
  const [matchData, setMatchData] = useState({
    homeTeam: "Los Algoritmos FC",
    awayTeam: "Byte Brothers",
    homeScore: 0,
    awayScore: 0,
    date: "2025-04-12",
    field: "Cancha Principal ECI",
  });

  const [homeStats, setHomeStats] = useState<PlayerStat[]>([
    { playerId: 1, playerName: "Sebastián Torres", goals: 0, yellowCards: 0, redCards: 0 },
    { playerId: 2, playerName: "Andrea Ramírez", goals: 0, yellowCards: 0, redCards: 0 },
    { playerId: 3, playerName: "Miguel Castro", goals: 0, yellowCards: 0, redCards: 0 },
  ]);

  const [awayStats, setAwayStats] = useState<PlayerStat[]>([
    { playerId: 4, playerName: "Andrés Morales", goals: 0, yellowCards: 0, redCards: 0 },
    { playerId: 5, playerName: "Ricardo Torres", goals: 0, yellowCards: 0, redCards: 0 },
    { playerId: 6, playerName: "Daniel Castro", goals: 0, yellowCards: 0, redCards: 0 },
  ]);

  const updateHomeStat = (playerId: number, field: keyof PlayerStat, value: number) => {
    setHomeStats(
      homeStats.map((stat) => (stat.playerId === playerId ? { ...stat, [field]: value } : stat))
    );
  };

  const updateAwayStat = (playerId: number, field: keyof PlayerStat, value: number) => {
    setAwayStats(
      awayStats.map((stat) => (stat.playerId === playerId ? { ...stat, [field]: value } : stat))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalHomeGoals = homeStats.reduce((sum, stat) => sum + stat.goals, 0);
    const totalAwayGoals = awayStats.reduce((sum, stat) => sum + stat.goals, 0);

    if (totalHomeGoals !== matchData.homeScore || totalAwayGoals !== matchData.awayScore) {
      alert(
        "La suma de goles por jugador no coincide con el marcador final. Por favor verifica los datos."
      );
      return;
    }

    alert("Resultado registrado exitosamente");
  };

  return (
    <div className="flex min-h-screen flex-col">
      
      <div className="flex flex-1">
        
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Registrar resultado del partido</h1>
              <p className="text-muted-foreground">Ingresa el marcador y las estadísticas del partido</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Información del partido */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-6 text-xl font-bold">Información del partido</h2>
                <div className="mb-6 rounded-lg border-2 border-primary bg-gradient-to-r from-primary/10 to-accent/10 p-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-sm text-muted-foreground">Fecha</p>
                      <p className="font-semibold">12 de abril de 2025</p>
                    </div>
                    <div>
                      <p className="mb-2 text-sm text-muted-foreground">Cancha</p>
                      <p className="font-semibold">Cancha Principal ECI</p>
                    </div>
                  </div>
                </div>

                {/* Marcador */}
                <div className="grid items-center gap-4 md:grid-cols-[1fr,auto,1fr]">
                  <div className="text-center">
                    <p className="mb-3 text-lg font-bold">{matchData.homeTeam}</p>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      required
                      value={matchData.homeScore}
                      onChange={(e) =>
                        setMatchData({ ...matchData, homeScore: parseInt(e.target.value) || 0 })
                      }
                      className="w-24 rounded-lg border border-border bg-input-background px-4 py-3 text-center text-3xl font-bold focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="text-4xl font-bold text-muted-foreground">-</div>

                  <div className="text-center">
                    <p className="mb-3 text-lg font-bold">{matchData.awayTeam}</p>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      required
                      value={matchData.awayScore}
                      onChange={(e) =>
                        setMatchData({ ...matchData, awayScore: parseInt(e.target.value) || 0 })
                      }
                      className="w-24 rounded-lg border border-border bg-input-background px-4 py-3 text-center text-3xl font-bold focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Estadísticas por equipo */}
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Equipo local */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="mb-6 text-xl font-bold">{matchData.homeTeam}</h2>
                  <div className="space-y-4">
                    {homeStats.map((stat) => (
                      <div key={stat.playerId} className="rounded-lg border border-border bg-background p-4">
                        <p className="mb-3 font-semibold">{stat.playerName}</p>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <Target className="h-3 w-3" />
                              Goles
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              value={stat.goals}
                              onChange={(e) =>
                                updateHomeStat(stat.playerId, "goals", parseInt(e.target.value) || 0)
                              }
                              className="w-full rounded border border-border bg-input-background px-2 py-1 text-center focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <AlertCircle className="h-3 w-3 text-[#FACC15]" />
                              Amarillas
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="2"
                              value={stat.yellowCards}
                              onChange={(e) =>
                                updateHomeStat(
                                  stat.playerId,
                                  "yellowCards",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-full rounded border border-border bg-input-background px-2 py-1 text-center focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <AlertCircle className="h-3 w-3 text-[#EF4444]" />
                              Rojas
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="1"
                              value={stat.redCards}
                              onChange={(e) =>
                                updateHomeStat(
                                  stat.playerId,
                                  "redCards",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-full rounded border border-border bg-input-background px-2 py-1 text-center focus:border-primary focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equipo visitante */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="mb-6 text-xl font-bold">{matchData.awayTeam}</h2>
                  <div className="space-y-4">
                    {awayStats.map((stat) => (
                      <div key={stat.playerId} className="rounded-lg border border-border bg-background p-4">
                        <p className="mb-3 font-semibold">{stat.playerName}</p>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <Target className="h-3 w-3" />
                              Goles
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              value={stat.goals}
                              onChange={(e) =>
                                updateAwayStat(stat.playerId, "goals", parseInt(e.target.value) || 0)
                              }
                              className="w-full rounded border border-border bg-input-background px-2 py-1 text-center focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <AlertCircle className="h-3 w-3 text-[#FACC15]" />
                              Amarillas
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="2"
                              value={stat.yellowCards}
                              onChange={(e) =>
                                updateAwayStat(
                                  stat.playerId,
                                  "yellowCards",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-full rounded border border-border bg-input-background px-2 py-1 text-center focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <AlertCircle className="h-3 w-3 text-[#EF4444]" />
                              Rojas
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="1"
                              value={stat.redCards}
                              onChange={(e) =>
                                updateAwayStat(
                                  stat.playerId,
                                  "redCards",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-full rounded border border-border bg-input-background px-2 py-1 text-center focus:border-primary focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Guardar resultado
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-border bg-background px-6 py-3 font-semibold transition hover:bg-accent"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
