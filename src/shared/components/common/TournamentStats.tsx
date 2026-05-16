import { useState } from "react";
import { Target, Calendar, Trophy } from "lucide-react";

export default function TournamentStats() {
  const [activeTab, setActiveTab] = useState<"scorers" | "history" | "teams">("scorers");

  const topScorers = [
    { name: "Felipe Jiménez", team: "Los Algoritmos FC", goals: 8, matches: 4 },
    { name: "Andrés Morales", team: "Byte Brothers", goals: 6, matches: 4 },
    { name: "Camila Herrera", team: "Neural FC", goals: 5, matches: 4 },
    { name: "Valentina Ruiz", team: "Los Cibernéticos", goals: 4, matches: 4 },
    { name: "Diego Ramírez", team: "Kernel Panic CF", goals: 4, matches: 4 },
  ];

  const matchHistory = [
    {
      date: "10/04/2025",
      homeTeam: "Los Algoritmos FC",
      awayTeam: "Code Runners",
      homeScore: 4,
      awayScore: 1,
      field: "Cancha Principal ECI",
    },
    {
      date: "09/04/2025",
      homeTeam: "Neural FC",
      awayTeam: "Binary Warriors",
      homeScore: 3,
      awayScore: 0,
      field: "Cancha Auxiliar Bloque B",
    },
    {
      date: "08/04/2025",
      homeTeam: "Byte Brothers",
      awayTeam: "Stack Overflow FC",
      homeScore: 2,
      awayScore: 2,
      field: "Cancha Principal ECI",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Estadísticas del Torneo</h1>
            <p className="text-muted-foreground">TechCup 2025-1 - Fase de grupos</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border">
            <button
              onClick={() => setActiveTab("scorers")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "scorers"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>Goleadores</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "history"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Historial de partidos</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("teams")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "teams"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span>Resultados por equipo</span>
              </div>
            </button>
          </div>

          {/* Contenido de tabs */}
          {activeTab === "scorers" && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-xl font-bold">Top 10 Goleadores</h2>
              <div className="space-y-4">
                {topScorers.map((player, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-6 rounded-lg border border-border bg-background p-4"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{player.name}</p>
                      <p className="text-sm text-muted-foreground">{player.team}</p>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{player.goals}</p>
                        <p className="text-xs text-muted-foreground">Goles</p>
                      </div>
                      <div className="h-full w-48 overflow-hidden rounded-full bg-background">
                        <div
                          className="h-2 bg-gradient-to-r from-primary to-accent"
                          style={{ width: `${(player.goals / 10) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{player.matches}</p>
                        <p className="text-xs text-muted-foreground">Partidos</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-xl font-bold">Historial de partidos</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-accent/5">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold">Fecha</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Local</th>
                      <th className="px-4 py-3 text-center text-sm font-bold">Resultado</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Visitante</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Cancha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchHistory.map((match, idx) => (
                      <tr key={idx} className={`border-b border-border ${idx % 2 === 0 ? "bg-background" : ""}`}>
                        <td className="px-4 py-4 text-sm">{match.date}</td>
                        <td className="px-4 py-4 font-semibold">{match.homeTeam}</td>
                        <td className="px-4 py-4 text-center">
                          <span className="rounded-lg bg-primary/10 px-4 py-1 font-bold">
                            {match.homeScore} - {match.awayScore}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-semibold">{match.awayTeam}</td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">{match.field}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "teams" && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-xl font-bold">Resultados por equipo</h2>
              <div className="mb-6">
                <label className="mb-2 block font-medium">Selecciona un equipo</label>
                <select className="w-full max-w-md rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none">
                  <option>Los Algoritmos FC</option>
                  <option>Byte Brothers</option>
                  <option>Neural FC</option>
                  <option>Los Cibernéticos</option>
                  <option>Kernel Panic CF</option>
                </select>
              </div>

              <div className="grid gap-6 md:grid-cols-4">
                <div className="rounded-lg border border-border bg-background p-4 text-center">
                  <p className="mb-1 text-2xl font-bold">4</p>
                  <p className="text-sm text-muted-foreground">Partidos jugados</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4 text-center">
                  <p className="mb-1 text-2xl font-bold text-[#4ADE80]">3</p>
                  <p className="text-sm text-muted-foreground">Partidos ganados</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4 text-center">
                  <p className="mb-1 text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Goles a favor</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4 text-center">
                  <p className="mb-1 text-2xl font-bold">+12</p>
                  <p className="text-sm text-muted-foreground">Diferencia de gol</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
