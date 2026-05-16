import { useState } from "react";
import { Calendar, XCircle } from "lucide-react";
import MatchCard from "../../../shared/components/shared/MatchCard";
import { useMatches } from "../../competitions/hooks/useMatches";

function mapStatus(matchStatus: string): "upcoming" | "live" | "finished" {
  switch (matchStatus) {
    case "SCHEDULED":
      return "upcoming";
    case "IN_PROGRESS":
      return "live";
    case "FINISHED":
      return "finished";
    default:
      return "upcoming";
  }
}

export default function MatchCalendar() {
  // TODO: Replace this hardcoded tournament ID with context/URL param
  const [tournamentId] = useState<string>("tournament-uuid-placeholder");

  const { data: matches = [], isLoading, isError, error } = useMatches(tournamentId);

  // Sort by scheduledAt chronologically
  const sorted = [...matches].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
  );

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Calendario de Partidos</h1>
          <p className="text-muted-foreground">
            Cronograma completo de partidos del torneo
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
                : "No se pudieron cargar los partidos."}
            </p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <Calendar className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">No hay partidos programados aún</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((match) => {
              const date = new Date(match.scheduledAt);
              return (
                <MatchCard
                  key={match.id}
                  homeTeam={{
                    name: match.homeTeamId,
                    score:
                      match.status === "FINISHED" ? match.homeScore : undefined,
                  }}
                  awayTeam={{
                    name: match.awayTeamId,
                    score:
                      match.status === "FINISHED" ? match.awayScore : undefined,
                  }}
                  date={date.toLocaleDateString("es-CO", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  time={date.toLocaleTimeString("es-CO", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  field={match.fieldName ?? "Sin asignar"}
                  phase={match.round}
                  status={mapStatus(match.status)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
