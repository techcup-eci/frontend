import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { apiClient } from "../../../core/api/apiClient";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { Bell, Users, ChevronRight, Loader2, XCircle } from "lucide-react";

export default function PendingRequests() {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.id);
  const [jugadorIds, setJugadorIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<number | null>(null);

  // Get the captain's team ID — for now we fetch all teams and find the one owned by this user
  useEffect(() => {
    async function findMyTeam() {
      if (!userId) return;
      try {
        const { data: teams } = await apiClient.get<any[]>("/api/teams");
        const myTeam = teams.find((t: any) => t.captainId === userId);
        if (myTeam) {
          setTeamId(myTeam.id);
        }
      } catch {
        // Will show error state
      }
    }
    findMyTeam();
  }, [userId]);

  useEffect(() => {
    if (teamId) {
      fetchRequests();
    }
  }, [teamId]);

  async function fetchRequests() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get<number[]>(`/api/teams/${teamId}/solicitudes`);
      setJugadorIds(data ?? []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cargar las solicitudes pendientes";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleReject(jugadorId: number) {
    setRejectingId(jugadorId);
    setError(null);
    try {
      await apiClient.post(`/api/teams/${teamId}/solicitudes/${jugadorId}/reject`);
      setJugadorIds((prev) => prev.filter((id) => id !== jugadorId));
      setConfirmMessage(`Solicitud del jugador ${jugadorId} rechazada exitosamente`);
      setTimeout(() => setConfirmMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al rechazar la solicitud";
      setError(msg);
    } finally {
      setRejectingId(null);
    }
  }

  if (!teamId && !loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
              <Users className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-bold">No tienes un equipo</h3>
              <p className="text-muted-foreground">Crea un equipo primero para ver solicitudes</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold">Solicitudes pendientes</h1>
                <p className="text-muted-foreground">
                  Jugadores que quieren unirse a tu equipo
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2">
                <Bell className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">
                  {jugadorIds.length} pendiente{jugadorIds.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {confirmMessage && (
              <div className="rounded-lg bg-[#4ADE80]/10 px-4 py-3 text-sm font-medium text-[#4ADE80]">
                {confirmMessage}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-3 rounded-lg bg-[#EF4444]/10 px-4 py-3 text-sm font-medium text-[#EF4444]">
                <XCircle className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center rounded-xl border border-border bg-card py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Cargando solicitudes...</span>
              </div>
            ) : jugadorIds.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
                <Users className="mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-bold">No hay solicitudes pendientes</h3>
                <p className="text-muted-foreground">
                  Los jugadores que soliciten unirse aparecerán aquí
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {jugadorIds.map((jugadorId) => (
                  <div
                    key={jugadorId}
                    className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Solicitud de jugador</p>
                        <p className="text-sm text-muted-foreground">ID: {jugadorId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleReject(jugadorId)}
                        disabled={rejectingId === jugadorId}
                        className="flex items-center gap-2 rounded-lg border border-destructive bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/20 disabled:opacity-50"
                      >
                        {rejectingId === jugadorId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Rechazar"
                        )}
                      </button>
                      <button
                        onClick={() => navigate(`/captain/requests/${jugadorId}`)}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                      >
                        Ver / Aceptar
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
