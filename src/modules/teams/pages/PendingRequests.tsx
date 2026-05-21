import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Bell, Users, ChevronRight, Loader2, XCircle, CheckCircle } from "lucide-react";
import { apiClient } from "../../../core/api/apiClient";

// TODO: obtener del contexto de autenticación
const TEAM_ID = import.meta.env.VITE_TEAM_ID ?? "1";
const USER_ID = import.meta.env.VITE_USER_ID ?? "10";

function normalizeIds(data: unknown): string[] {
  if (!Array.isArray(data)) return [];
  return data.map((item) => {
    if (typeof item === "string") return item;
    if (typeof item === "number") return String(item);
    if (item && typeof item === "object") {
      const obj = item as Record<string, unknown>;
      return String(obj.jugadorId ?? obj.playerId ?? obj.id ?? JSON.stringify(item));
    }
    return String(item);
  });
}

export default function PendingRequests() {
  const navigate = useNavigate();
  const [jugadorIds, setJugadorIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get(
        `/api/teams/${TEAM_ID}/solicitudes`,
        { headers: { "X-User-Id": USER_ID } }
      );
      setJugadorIds(normalizeIds(data));
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? err.message
          : "Error al cargar las solicitudes pendientes";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept(jugadorId: string) {
    setAcceptingId(jugadorId);
    setError(null);
    try {
      await apiClient.post(
        `/api/teams/${TEAM_ID}/solicitudes/${jugadorId}/accept`,
        {},
        { headers: { "X-User-Id": USER_ID } }
      );
      setJugadorIds((prev) => prev.filter((id) => id !== jugadorId));
      setConfirmMessage(`Jugador ${jugadorId} aceptado en el equipo exitosamente`);
      setTimeout(() => setConfirmMessage(null), 3000);
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? err.message
          : "Error al aceptar la solicitud";
      setError(msg);
    } finally {
      setAcceptingId(null);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Header */}
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

            {/* Feedback messages */}
            {confirmMessage && (
              <div className="flex items-center gap-3 rounded-lg bg-[#4ADE80]/10 px-4 py-3 text-sm font-medium text-[#4ADE80]">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                {confirmMessage}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-3 rounded-lg bg-[#EF4444]/10 px-4 py-3 text-sm font-medium text-[#EF4444]">
                <XCircle className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Content */}
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
                        onClick={() =>
                          navigate(
                            `/users/${jugadorId}/profile?from=requests&teamId=${TEAM_ID}`
                          )
                        }
                        className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-accent"
                      >
                        Ver perfil
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleAccept(jugadorId)}
                        disabled={acceptingId !== null}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                      >
                        {acceptingId === jugadorId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        Aceptar
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
