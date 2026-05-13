import { useState } from "react";
import Navbar from "../../../shared/components/shared/Navbar";
import Sidebar from "../../../shared/components/shared/Sidebar";
import { Home, Trophy, Users, CreditCard, Calendar, ListChecks, Table, Layers, XCircle } from "lucide-react";
import { useStandings } from "../../competitions/hooks/useStandings";

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

export default function Standings() {
  // TODO: Replace this hardcoded tournament ID with context/URL param
  const [tournamentId] = useState<string>("tournament-uuid-placeholder");

  const { data: standings = [], isLoading, isError, error } = useStandings(tournamentId);

  // Sort by points descending, then goalDiff descending
  const sorted = [...standings].sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar sections={organizerSidebar} />
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Tabla de posiciones</h1>
              <p className="text-muted-foreground">
                Actualizada automáticamente
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <XCircle className="h-10 w-10 text-destructive/60" />
                <p className="text-muted-foreground">
                  {error instanceof Error
                    ? error.message
                    : "No se pudieron cargar las posiciones."}
                </p>
              </div>
            ) : standings.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <Trophy className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-muted-foreground">No hay partidos registrados aún</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-primary text-primary-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left">Pos</th>
                        <th className="px-4 py-3 text-left">Equipo</th>
                        <th className="px-4 py-3 text-center">PJ</th>
                        <th className="px-4 py-3 text-center">PG</th>
                        <th className="px-4 py-3 text-center">PE</th>
                        <th className="px-4 py-3 text-center">PP</th>
                        <th className="px-4 py-3 text-center">GF</th>
                        <th className="px-4 py-3 text-center">GC</th>
                        <th className="px-4 py-3 text-center">DG</th>
                        <th className="px-4 py-3 text-center">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((row, idx) => {
                        const pos = idx + 1;
                        return (
                          <tr
                            key={row.teamId}
                            className={`border-t border-border hover:bg-muted/50 ${
                              pos <= 4 ? "bg-[#4ADE80]/5" : ""
                            }`}
                          >
                            <td className="px-4 py-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                {pos}
                              </div>
                            </td>
                            <td className="px-4 py-3 font-semibold">{row.teamId}</td>
                            <td className="px-4 py-3 text-center">{row.played}</td>
                            <td className="px-4 py-3 text-center">{row.wins}</td>
                            <td className="px-4 py-3 text-center">{row.draws}</td>
                            <td className="px-4 py-3 text-center">{row.losses}</td>
                            <td className="px-4 py-3 text-center">{row.goalsScored}</td>
                            <td className="px-4 py-3 text-center">{row.goalsReceived}</td>
                            <td
                              className={`px-4 py-3 text-center font-semibold ${
                                row.goalDiff > 0
                                  ? "text-[#4ADE80]"
                                  : row.goalDiff < 0
                                    ? "text-destructive"
                                    : ""
                              }`}
                            >
                              {row.goalDiff > 0 ? "+" : ""}
                              {row.goalDiff}
                            </td>
                            <td className="px-4 py-3 text-center text-xl font-bold">
                              {row.points}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-bold">Leyenda</h3>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-[#4ADE80]/20" />
                <span className="text-sm text-muted-foreground">
                  Equipos clasificados a cuartos de final (Top 4)
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
