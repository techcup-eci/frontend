import { AlertCircle, Calendar, Loader2, XCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import Badge from "../../../shared/components/shared/Badge";
import { useActiveMatches } from "../../competitions/hooks/useActiveMatches";
import { useCreateMatch } from "../../competitions/hooks/useCreateMatch";
import { useDeleteMatch } from "../../competitions/hooks/useDeleteMatch";
import type { CreateMatchRequest } from "../../competitions/types/competition";
import { useActiveTournament } from "../hooks/useActiveTournament";
import { useFields } from "../hooks/useFields";
import { useAllTeams } from "../../teams/hooks/useTeams";

const ROUNDS = ["INITIAL", "QUARTERFINAL", "SEMIFINAL", "FINAL"] as const;

/**
 * Convert a Long team ID (from teams-ms) to UUID format expected by tournament-ms.
 * Java's `new UUID(0, longValue)` produces: 00000000-0000-0000-0000-XXXXXXXXXXXX
 */
function longToUuid(longId: number): string {
  const hex = longId.toString(16).padStart(12, "0");
  return `00000000-0000-0000-0000-${hex}`;
}

export default function ScheduleMatches() {
  const { data: activeTournament, isLoading: isLoadingTournament } =
    useActiveTournament();
  const { data: matches = [], isLoading: isLoadingMatches, isError, error } = useActiveMatches();
  const { data: teams = [], isLoading: isLoadingTeams } = useAllTeams();
  const { data: fields = [], isLoading: isLoadingFields } = useFields(activeTournament?.id ?? "");

  const tournamentId = activeTournament?.id ?? "";

  const createMutation = useCreateMatch(tournamentId);
  const deleteMutation = useDeleteMatch(tournamentId);

  const [newMatch, setNewMatch] = useState<{
    homeTeamId: string;
    awayTeamId: string;
    round: string;
    matchOrder: number;
    scheduledAt: string;
    fieldId: string;
  }>({
    homeTeamId: "",
    awayTeamId: "",
    round: "INITIAL",
    matchOrder: 0,
    scheduledAt: "",
    fieldId: "",
  });

  // Build a map of team UUID -> team name for display
  const teamNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const team of teams) {
      const uuid = longToUuid(team.id);
      map.set(uuid, team.name);
      // Also store the Long ID for reverse lookup
      map.set(String(team.id), team.name);
    }
    return map;
  }, [teams]);

  const getTeamDisplayName = (id: string): string => {
    return teamNameMap.get(id) ?? id.slice(0, 8);
  };

  // Validate date conflicts
  const dateConflict = useMemo(() => {
    if (!newMatch.scheduledAt || !newMatch.fieldId) return null;

    const newDate = new Date(newMatch.scheduledAt);
    const newFieldId = newMatch.fieldId;
    const marginMinutes = 30; // minimum gap between matches on same field

    for (const match of matches) {
      if (match.fieldId === newFieldId || (newFieldId === "" && match.fieldId)) {
        const existingDate = new Date(match.scheduledAt);
        const diffMinutes = Math.abs(newDate.getTime() - existingDate.getTime()) / 60000;
        if (diffMinutes < marginMinutes) {
          return `Conflicto de horario: ya hay un partido en esa cancha a las ${existingDate.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}`;
        }
      }
    }
    return null;
  }, [newMatch.scheduledAt, newMatch.fieldId, matches]);

  const handleAddMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournamentId) {
      toast.error("No hay un torneo activo");
      return;
    }
    if (!newMatch.homeTeamId || !newMatch.awayTeamId) {
      toast.error("Selecciona ambos equipos");
      return;
    }
    if (newMatch.homeTeamId === newMatch.awayTeamId) {
      toast.error("Un equipo no puede jugar contra sí mismo");
      return;
    }
    if (dateConflict) {
      toast.error(dateConflict);
      return;
    }

    const payload: CreateMatchRequest = {
      homeTeamId: newMatch.homeTeamId,
      awayTeamId: newMatch.awayTeamId,
      round: newMatch.round,
      matchOrder: newMatch.matchOrder,
      scheduledAt: new Date(newMatch.scheduledAt).toISOString(),
      ...(newMatch.fieldId ? { fieldId: newMatch.fieldId } : {}),
    };

    createMutation.mutate(
      { match: payload },
      {
        onSuccess: () => {
          setNewMatch({
            homeTeamId: "",
            awayTeamId: "",
            round: "INITIAL",
            matchOrder: 0,
            scheduledAt: "",
            fieldId: "",
          });
        },
      },
    );
  };

  const handleDeleteMatch = (matchId: string) => {
    if (confirm("¿Estás seguro de eliminar este partido?")) {
      deleteMutation.mutate(matchId, {
        onError: (err: unknown) => {
          const message =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            (err as Error)?.message ||
            "No se pudo eliminar el partido";
          toast.error(message);
        },
      });
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isLoading = isLoadingTournament || isLoadingMatches || isLoadingTeams || isLoadingFields;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
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

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Programar partidos</h1>
          <p className="text-muted-foreground">
            {activeTournament.name} — Crea y gestiona el calendario de partidos
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          {/* Lista de partidos */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-xl font-bold">
                Partidos programados ({matches.length})
              </h2>

              {isError ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <XCircle className="h-10 w-10 text-destructive/60" />
                  <p className="text-muted-foreground">
                    {error instanceof Error
                      ? error.message
                      : "No se pudieron cargar los partidos."}
                  </p>
                </div>
              ) : matches.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground/40" />
                  <p className="text-muted-foreground">
                    No hay partidos programados aún.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {matches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-start justify-between rounded-lg border border-border bg-background p-4"
                    >
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <span className="text-lg font-bold">
                            {getTeamDisplayName(match.homeTeamId)} vs {getTeamDisplayName(match.awayTeamId)}
                          </span>
                          <Badge variant="info" size="sm">
                            {match.round}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(match.scheduledAt)} -{" "}
                              {formatTime(match.scheduledAt)}
                            </span>
                          </div>
                          {match.fieldName && <div>Cancha: {match.fieldName}</div>}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteMatch(match.id)}
                        disabled={deleteMutation.isPending}
                        className="rounded-lg bg-[#EF4444] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#DC2626] disabled:opacity-60"
                      >
                        {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Formulario */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-xl font-bold">Nuevo partido</h2>
              <form onSubmit={handleAddMatch} className="space-y-4">
                {/* Equipo local */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Equipo local *
                  </label>
                  <select
                    required
                    value={newMatch.homeTeamId}
                    onChange={(e) =>
                      setNewMatch({ ...newMatch, homeTeamId: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                  >
                    <option value="">Seleccionar equipo...</option>
                    {teams.map((team) => (
                      <option key={team.id} value={longToUuid(team.id)}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Equipo visitante */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Equipo visitante *
                  </label>
                  <select
                    required
                    value={newMatch.awayTeamId}
                    onChange={(e) =>
                      setNewMatch({ ...newMatch, awayTeamId: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                  >
                    <option value="">Seleccionar equipo...</option>
                    {teams
                      .filter((t) => longToUuid(t.id) !== newMatch.homeTeamId)
                      .map((team) => (
                        <option key={team.id} value={longToUuid(team.id)}>
                          {team.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Ronda */}
                <div>
                  <label className="mb-2 block text-sm font-medium">Ronda</label>
                  <select
                    required
                    value={newMatch.round}
                    onChange={(e) =>
                      setNewMatch({ ...newMatch, round: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                  >
                    {ROUNDS.map((r) => (
                      <option key={r} value={r}>
                        {r === "INITIAL" ? "Fase inicial" : r === "QUARTERFINAL" ? "Cuartos de final" : r === "SEMIFINAL" ? "Semifinal" : "Final"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Orden */}
                <div>
                  <label className="mb-2 block text-sm font-medium">Orden</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newMatch.matchOrder}
                    onChange={(e) =>
                      setNewMatch({
                        ...newMatch,
                        matchOrder: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Fecha y hora */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Fecha y hora *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newMatch.scheduledAt}
                    onChange={(e) =>
                      setNewMatch({ ...newMatch, scheduledAt: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Cancha */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Cancha
                  </label>
                  <select
                    value={newMatch.fieldId}
                    onChange={(e) =>
                      setNewMatch({ ...newMatch, fieldId: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                  >
                    <option value="">Sin asignar</option>
                    {fields.map((field) => (
                      <option key={field.id} value={field.id}>
                        {field.name}
                      </option>
                    ))}
                  </select>
                  {fields.length === 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      No hay canchas configuradas. Agrégalas desde la configuración del torneo.
                    </p>
                  )}
                </div>

                {/* Date conflict warning */}
                {dateConflict && (
                  <div className="rounded-lg border border-[#FACC15]/40 bg-[#FACC15]/10 px-3 py-2 text-sm text-[#B45309]">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{dateConflict}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={createMutation.isPending || !tournamentId}
                  className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                >
                  {createMutation.isPending ? "Creando..." : "Agregar partido"}
                </button>
              </form>
            </div>

            <div className="rounded-lg bg-blue-500/10 p-4 text-sm text-blue-600">
              <p className="font-semibold">Recordatorio:</p>
              <ul className="mt-1 space-y-1 text-xs">
                <li>• Evita conflictos de horario en la misma cancha</li>
                <li>• Los equipos no deben tener partidos muy seguidos</li>
                <li>• La cancha es opcional pero recomendada</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
