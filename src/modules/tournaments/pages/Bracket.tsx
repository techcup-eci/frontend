import Navbar from "../../../shared/components/shared/Navbar";
import Sidebar from "../../../shared/components/shared/Sidebar";
import { Home, Trophy, Users, CreditCard, Calendar, ListChecks, Table, Layers } from "lucide-react";
import Badge from "../../../shared/components/shared/Badge";

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

export default function Bracket() {
  const matches = {
    quarters: [
      { id: 1, team1: "Los Algoritmos FC", team2: "Code Runners", score1: 4, score2: 1 },
      { id: 2, team1: "Neural FC", team2: "Binary Warriors", score1: 3, score2: 0 },
      { id: 3, team1: "Byte Brothers", team2: "Stack Overflow FC", score1: null, score2: null },
      { id: 4, team1: "Los Cibernéticos", team2: "Kernel Panic CF", score1: null, score2: null },
    ],
    semis: [
      { id: 5, team1: "Los Algoritmos FC", team2: "Neural FC", score1: null, score2: null },
      { id: 6, team1: "Por definir", team2: "Por definir", score1: null, score2: null },
    ],
    final: { id: 7, team1: "Por definir", team2: "Por definir", score1: null, score2: null },
  };

  const MatchBox = ({ team1, team2, score1, score2 }: any) => (
    <div className="relative flex min-w-[240px] flex-col gap-1 rounded-lg border border-border bg-card p-3">
      <div
        className={`flex items-center justify-between rounded px-3 py-2 ${
          score1 !== null && score1 > (score2 || 0) ? "bg-primary/10 font-bold" : "bg-background"
        }`}
      >
        <span className="text-sm">{team1}</span>
        <span className="text-lg font-bold">{score1 ?? "-"}</span>
      </div>
      <div
        className={`flex items-center justify-between rounded px-3 py-2 ${
          score2 !== null && score2 > (score1 || 0) ? "bg-primary/10 font-bold" : "bg-background"
        }`}
      >
        <span className="text-sm">{team2}</span>
        <span className="text-lg font-bold">{score2 ?? "-"}</span>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userName="María Rodríguez" role="Organizador" />
      <div className="flex flex-1">
        <Sidebar sections={organizerSidebar} />
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold">Llaves eliminatorias</h1>
                <p className="text-muted-foreground">Fase final del torneo TechCup 2025-1</p>
              </div>
              <Badge variant="progress">Cuartos de final - 2 de 4 jugados</Badge>
            </div>

            <div className="overflow-x-auto">
              <div className="inline-flex min-w-full gap-8 p-4">
                {/* Cuartos de final */}
                <div className="flex flex-col items-center gap-4">
                  <h3 className="mb-4 font-bold text-muted-foreground">CUARTOS DE FINAL</h3>
                  {matches.quarters.map((match) => (
                    <MatchBox key={match.id} {...match} />
                  ))}
                </div>

                {/* Conectores */}
                <div className="flex flex-col justify-around py-12">
                  <div className="h-24 border-r-2 border-t-2 border-border" />
                  <div className="h-24 border-r-2 border-b-2 border-border" />
                  <div className="h-24 border-r-2 border-t-2 border-border" />
                  <div className="h-24 border-r-2 border-b-2 border-border" />
                </div>

                {/* Semifinales */}
                <div className="flex flex-col items-center gap-4">
                  <h3 className="mb-4 font-bold text-muted-foreground">SEMIFINALES</h3>
                  <div className="space-y-32">
                    {matches.semis.map((match) => (
                      <MatchBox key={match.id} {...match} />
                    ))}
                  </div>
                </div>

                {/* Conectores */}
                <div className="flex flex-col justify-around py-12">
                  <div className="h-48 border-r-2 border-t-2 border-border" />
                  <div className="h-48 border-r-2 border-b-2 border-border" />
                </div>

                {/* Final */}
                <div className="flex flex-col items-center gap-4">
                  <h3 className="mb-4 font-bold text-muted-foreground">FINAL</h3>
                  <div className="mt-48">
                    <MatchBox {...matches.final} />
                  </div>
                </div>

                {/* Campeón */}
                <div className="flex flex-col items-center gap-4">
                  <h3 className="mb-4 font-bold text-muted-foreground">CAMPEÓN</h3>
                  <div className="mt-48 flex h-32 w-48 items-center justify-center rounded-lg border-2 border-dashed border-primary bg-primary/5">
                    <div className="text-center">
                      <Trophy className="mx-auto mb-2 h-12 w-12 text-primary" />
                      <p className="font-bold text-primary">Por definir</p>
                    </div>
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
