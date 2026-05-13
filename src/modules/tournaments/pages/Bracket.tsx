import Badge from "../../../shared/components/shared/Badge";

interface MatchBoxProps {
  team1: string;
  team2: string;
  score1: number | null;
  score2: number | null;
}

function MatchBox({ team1, team2, score1, score2 }: MatchBoxProps) {
  return (
    <div className="relative flex min-w-[240px] flex-col gap-1 rounded-lg border border-border bg-card p-3">
      <div
        className={`flex items-center justify-between rounded px-3 py-2 ${
          score1 !== null && score1 > (score2 || 0) ? "bg-primary/10 font-bold" : "bg-background"
        }`}
      >
        <span>{team1}</span>
        <span className="font-mono">{score1 ?? "-"}</span>
      </div>
      <div
        className={`flex items-center justify-between rounded px-3 py-2 ${
          score2 !== null && score2 > (score1 || 0) ? "bg-primary/10 font-bold" : "bg-background"
        }`}
      >
        <span>{team2}</span>
        <span className="font-mono">{score2 ?? "-"}</span>
      </div>
    </div>
  );
}

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

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Llaves del Torneo</h1>
          <p className="text-muted-foreground">Estructura de eliminación directa</p>
        </div>

        <div className="space-y-12">
          {/* Cuartos de final */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="info" size="md">Cuartos de final</Badge>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {matches.quarters.map((m) => (
                <MatchBox key={m.id} {...m} />
              ))}
            </div>
          </div>

          {/* Semifinales */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="warning" size="md">Semifinales</Badge>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {matches.semis.map((m) => (
                <MatchBox key={m.id} {...m} />
              ))}
            </div>
          </div>

          {/* Final */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="success" size="md">Final</Badge>
            </div>
            <div className="flex justify-center">
              <MatchBox {...matches.final} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
