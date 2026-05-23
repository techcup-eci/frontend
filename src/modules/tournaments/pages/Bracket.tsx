import { AlertCircle, Layers, Loader2, XCircle } from "lucide-react";
import Badge from "../../../shared/components/shared/Badge";
import { useActiveBracket } from "../hooks/useBracket";
import { useActiveTournament } from "../hooks/useActiveTournament";
import { useAllTeams } from "../../teams/hooks/useTeams";
import { useMemo } from "react";

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
        <span className="truncate">{team1}</span>
        <span className="font-mono">{score1 ?? "-"}</span>
      </div>
      <div
        className={`flex items-center justify-between rounded px-3 py-2 ${
          score2 !== null && score2 > (score1 || 0) ? "bg-primary/10 font-bold" : "bg-background"
        }`}
      >
        <span className="truncate">{team2}</span>
        <span className="font-mono">{score2 ?? "-"}</span>
      </div>
    </div>
  );
}

const ROUND_LABELS: Record<string, string> = {
  INITIAL: "Fase inicial",
  QUARTERFINAL: "Cuartos de final",
  SEMIFINAL: "Semifinales",
  FINAL: "Final",
};

const ROUND_BADGE_VARIANTS: Record<string, "info" | "warning" | "success" | "default"> = {
  INITIAL: "info",
  QUARTERFINAL: "info",
  SEMIFINAL: "warning",
  FINAL: "success",
};

/**
 * Convert a Long team ID (from teams-ms) to UUID format expected by tournament-ms.
 */
function longToUuid(longId: number): string {
  const hex = longId.toString(16).padStart(12, "0");
  return `00000000-0000-0000-0000-${hex}`;
}

export default function Bracket() {
  const { data: activeTournament, isLoading: isLoadingTournament } = useActiveTournament();
  const { data: matches = [], isLoading, isError, error } = useActiveBracket();
  const { data: teams = [] } = useAllTeams();

  // Build team name map
  const teamNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const team of teams) {
      map.set(longToUuid(team.id), team.name);
      map.set(String(team.id), team.name);
    }
    return map;
  }, [teams]);

  const getTeamName = (id: string): string => {
    return teamNameMap.get(id) ?? id.slice(0, 8);
  };

  // Group matches by round
  const rounds = matches.reduce<Record<string, typeof matches>>((acc, match) => {
    const round = match.round || "INITIAL";
    if (!acc[round]) acc[round] = [];
    acc[round].push(match);
    return acc;
  }, {});

  // Sort rounds in order
  const roundOrder = ["INITIAL", "QUARTERFINAL", "SEMIFINAL", "FINAL"];
  const sortedRounds = Object.keys(rounds).sort(
    (a, b) => roundOrder.indexOf(a) - roundOrder.indexOf(b)
  );

  if (isLoadingTournament || isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando llaves del torneo...</p>
        </div>
      </div>
    );
  }

  if (!activeTournament) {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground/60" />
            <h2 className="text-xl font-bold">No hay torneo activo</h2>
            <p className="text-muted-foreground">
              No hay ningún torneo activo o en progreso en este momento.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <XCircle className="h-10 w-10 text-destructive/60" />
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : "No se pudieron cargar las llaves."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (sortedRounds.length === 0) {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Llaves del Torneo</h1>
            <p className="text-muted-foreground">{activeTournament.name}</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
            <Layers className="mb-4 h-16 w-16 text-muted-foreground/40" />
            <h3 className="mb-2 text-xl font-bold">Sin llaves generadas</h3>
            <p className="text-muted-foreground">
              Las llaves se generarán cuando el organizador inicie el torneo
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Llaves del Torneo</h1>
          <p className="text-muted-foreground">
            {activeTournament.name} — Estructura de eliminación directa
          </p>
        </div>

        <div className="space-y-12">
          {sortedRounds.map((round) => {
            const roundMatches = rounds[round];
            const label = ROUND_LABELS[round] ?? round;
            const badgeVariant = ROUND_BADGE_VARIANTS[round] ?? "default";

            return (
              <div key={round}>
                <div className="mb-4 flex items-center gap-2">
                  <Badge variant={badgeVariant} size="md">{label}</Badge>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {roundMatches.map((m) => (
                    <MatchBox
                      key={m.id}
                      team1={getTeamName(m.homeTeamId)}
                      team2={getTeamName(m.awayTeamId)}
                      score1={m.homeScore}
                      score2={m.awayScore}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
