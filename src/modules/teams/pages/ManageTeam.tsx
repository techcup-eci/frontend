import { Check, X, UserPlus, Loader2 } from "lucide-react";
import { useTeam, usePendingRequests, useAcceptRequest, useRejectRequest } from "../hooks/useTeams";
import { useParams, Link } from "react-router";

export default function ManageTeam() {
  const { teamId } = useParams<{ teamId: string }>();
  const id = Number(teamId);

  if (!id || isNaN(id)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">ID de equipo no válido.</p>
      </div>
    );
  }

  const { data: team, isLoading, error } = useTeam(id);
  const { data: requests, isLoading: reqLoading } = usePendingRequests(id);
  const accept = useAcceptRequest(id);
  const reject = useRejectRequest(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">No se pudo cargar el equipo.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold">Gestión del Equipo</h1>
                <p className="text-muted-foreground">{team.name}</p>
                {team.warning && (
                  <p className="mt-1 text-sm font-medium text-amber-600">⚠ {team.warning}</p>
                )}
              </div>
              <div className="rounded-xl border border-border bg-card px-6 py-3">
                <p className="text-sm text-muted-foreground">Jugadores</p>
                <p className="text-2xl font-bold">{team.currentPlayers} / {team.maxPlayers}</p>
              </div>
            </div>

            {/* Players */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-xl font-bold">Jugadores del equipo</h2>
              {team.players.length === 0 ? (
                <p className="text-muted-foreground">No hay jugadores en el equipo aún.</p>
              ) : (
                <div className="space-y-2">
                  {team.players.map((playerId, idx) => (
                    <div key={playerId}
                      className={`flex items-center justify-between rounded-lg border border-border p-3 ${idx % 2 === 0 ? "bg-accent/5" : ""}`}>
                      <span className="font-medium">Jugador #{playerId}</span>
                      {playerId === team.captainId && (
                        <span className="rounded-full bg-[var(--color-oxblood)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-oxblood)]">
                          Capitán
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Requests */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Solicitudes de ingreso</h2>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  {reqLoading ? "..." : (requests?.length ?? 0)} pendientes
                </span>
              </div>
              {(!requests || requests.length === 0) ? (
                <p className="text-muted-foreground">No hay solicitudes pendientes.</p>
              ) : (
                <div className="space-y-3">
                  {requests.map((playerId) => (
                    <div key={playerId}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <UserPlus className="h-5 w-5 text-primary" />
                        </div>
                        <p className="font-bold">Jugador #{playerId}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => accept.mutate(playerId)}
                          disabled={accept.isPending}
                          className="flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                        >
                          <Check className="h-4 w-4" /> Aceptar
                        </button>
                        <button
                          onClick={() => reject.mutate(playerId)}
                          disabled={reject.isPending}
                          className="flex items-center gap-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-accent"
                        >
                          <X className="h-4 w-4" /> Rechazar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Search players CTA */}
            <div className="rounded-lg border-2 border-dashed border-border bg-accent/5 p-8 text-center">
              <UserPlus className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 font-bold">¿Necesitas más jugadores?</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Tienes {team.maxPlayers - team.currentPlayers} cupos disponibles
              </p>
              <Link
                to="/captain/search-players"
                className="inline-block rounded-lg bg-[var(--color-oxblood)] px-6 py-3 font-semibold text-white transition hover:bg-opacity-90"
              >
                Buscar jugadores
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
