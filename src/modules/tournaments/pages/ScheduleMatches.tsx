import { useState } from "react";
import { Calendar, XCircle } from "lucide-react";
import Badge from "../../../shared/components/shared/Badge";
import { useMatches } from "../../competitions/hooks/useMatches";
import { useCreateMatch } from "../../competitions/hooks/useCreateMatch";
import { useDeleteMatch } from "../../competitions/hooks/useDeleteMatch";
import type { CreateMatchRequest } from "../../competitions/types/competition";

const ROUNDS = ["INITIAL", "QUARTERFINAL", "SEMIFINAL", "FINAL"] as const;

export default function ScheduleMatches() {
  // TODO: Replace this hardcoded tournament ID with context/URL param
  const [tournamentId] = useState<string>("tournament-uuid-placeholder");
  const [userId] = useState<string>("organizer-uuid-placeholder");

  const { data: matches = [], isLoading, isError, error } = useMatches(tournamentId);
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

  const handleAddMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMatch.homeTeamId === newMatch.awayTeamId) {
      alert("Un equipo no puede jugar contra sí mismo");
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
      { match: payload, userId },
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
        onError: (err: unknown) => {
          const message =
            (err as { response?: { data?: { message?: string } }; message?: string })?.response
              ?.data?.message ||
            (err as Error)?.message ||
            "No se pudo crear el partido";
          alert(message);
        },
      },
    );
  };

  const handleDeleteMatch = (matchId: string) => {
    if (confirm("¿Estás seguro de eliminar este partido?")) {
      deleteMutation.mutate(matchId, {
        onError: (err: unknown) => {
          const message =
            (err as { response?: { data?: { message?: string } }; message?: string })?.response
              ?.data?.message ||
            (err as Error)?.message ||
            "No se pudo eliminar el partido";
          alert(message);
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
    return d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Programar partidos</h1>
          <p className="text-muted-foreground">
            Crea y gestiona el calendario de partidos del torneo
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          {/* Lista de partidos */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-xl font-bold">
                Partidos programados ({matches.length})
              </h2>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
                </div>
              ) : isError ? (
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
                  <p className="text-muted-foreground">No hay partidos programados aún.</p>
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
                            {match.homeTeamId} vs {match.awayTeamId}
                          </span>
                          <Badge variant="info" size="sm">
                            {match.round}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(match.scheduledAt)} - {formatTime(match.scheduledAt)}
                            </span>
                          </div>
                          {match.fieldName && <div>{match.fieldName}</div>}
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
                <div>
                  <label className="mb-2 block text-sm font-medium">Equipo local (UUID)</label>
                  <input
                    required
                    type="text"
                    placeholder="UUID del equipo local"
                    value={newMatch.homeTeamId}
                    onChange={(e) =>
                      setNewMatch({ ...newMatch, homeTeamId: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Equipo visitante (UUID)
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="UUID del equipo visitante"
                    value={newMatch.awayTeamId}
                    onChange={(e) =>
                      setNewMatch({ ...newMatch, awayTeamId: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Ronda</label>
                  <select
                    required
                    value={newMatch.round}
                    onChange={(e) => setNewMatch({ ...newMatch, round: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                  >
                    {ROUNDS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Orden</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newMatch.matchOrder}
                    onChange={(e) =>
                      setNewMatch({ ...newMatch, matchOrder: parseInt(e.target.value) || 0 })
                    }
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Fecha y hora</label>
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

                <div>
                  <label className="mb-2 block text-sm font-medium">Cancha (UUID)</label>
                  <input
                    type="text"
                    placeholder="UUID de la cancha (opcional)"
                    value={newMatch.fieldId}
                    onChange={(e) => setNewMatch({ ...newMatch, fieldId: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                >
                  {createMutation.isPending ? "Creando..." : "Agregar partido"}
                </button>
              </form>
            </div>

            <div className="rounded-lg bg-blue-500/10 p-4 text-sm text-blue-600">
              <p className="font-semibold">Recordatorio:</p>
              <p className="mt-1 text-xs">
                Asegúrate de que no haya conflictos de horario en las canchas y que los equipos
                no tengan partidos muy seguidos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
