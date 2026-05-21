import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Trash2, Eye, UserPlus, Loader2, XCircle, Users, ChevronRight } from "lucide-react";
import { apiClient } from "../../../core/api/apiClient";
import Badge from "../../../shared/components/shared/Badge";

// TODO: obtener del contexto de autenticación
const TEAM_ID = import.meta.env.VITE_TEAM_ID ?? "1";
const USER_ID = import.meta.env.VITE_USER_ID ?? "10";

interface TeamData {
  id: number;
  name: string;
  players: number[];
  idPlayers: number[];
  currentPlayers: number;
  maxPlayers: number;
  colors: string;
  photo: string;
}

export default function ManageTeam() {
  const navigate = useNavigate();
  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; playerId: number | null }>({
    open: false,
    playerId: null,
  });
  const [deletingPlayerId, setDeletingPlayerId] = useState<number | null>(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get<TeamData>(`/api/teams/${TEAM_ID}`, {
        headers: { "X-User-Id": USER_ID },
      });
      setTeam(data);
    } catch {
      setError("Error al cargar la información del equipo. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  }

  function openConfirmModal(playerId: number) {
    setError(null);
    setConfirmModal({ open: true, playerId });
  }

  function closeModal() {
    setConfirmModal({ open: false, playerId: null });
  }

  async function handleConfirmDelete() {
    const playerId = confirmModal.playerId;
    if (playerId === null) return;

    setDeletingPlayerId(playerId);
    setError(null);
    try {
      await apiClient.delete(`/api/teams/${TEAM_ID}/players/${playerId}`, {
        headers: { "X-User-Id": USER_ID },
      });
      setTeam((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          players: prev.players.filter((id) => id !== playerId),
          idPlayers: prev.idPlayers.filter((id) => id !== playerId),
          currentPlayers: prev.currentPlayers - 1,
        };
      });
      closeModal();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const msg = axiosError?.response?.data?.message;
      setError(msg ?? "No se pudo eliminar al jugador. Es posible que haya un torneo activo.");
      closeModal();
    } finally {
      setDeletingPlayerId(null);
    }
  }

  const playerIds: number[] = (team?.players?.length ? team.players : team?.idPlayers) ?? [];
  const availableSlots = team ? team.maxPlayers - playerIds.length : 0;

  return (
    <div className="flex min-h-screen flex-col">
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg">
            <h3 className="mb-2 text-lg font-bold">Eliminar jugador</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              ¿Estás seguro de que deseas eliminar a este jugador del equipo? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                disabled={deletingPlayerId !== null}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-accent disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletingPlayerId !== null}
                className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition hover:bg-destructive/90 disabled:opacity-50"
              >
                {deletingPlayerId !== null ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold">Gestión del Equipo</h1>
                <p className="text-muted-foreground">
                  {team?.name ?? "Cargando..."}
                </p>
              </div>
              {team && (
                <div className="rounded-xl border border-border bg-card px-6 py-3">
                  <p className="text-sm text-muted-foreground">Jugadores</p>
                  <p className="text-2xl font-bold">
                    {playerIds.length} / {team.maxPlayers}
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-3 rounded-lg bg-[#EF4444]/10 px-4 py-3 text-sm font-medium text-[#EF4444]">
                <XCircle className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center rounded-xl border border-border bg-card py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Cargando equipo...</span>
              </div>
            ) : (
              <>
                {/* Jugadores del equipo */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="mb-6 text-xl font-bold">Jugadores del equipo</h2>
                  {playerIds.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No hay jugadores en el equipo aún
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-border bg-accent/5">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-bold">
                              Jugador
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-bold">
                              Estado
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-bold">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {playerIds.map((playerId, idx) => (
                            <tr
                              key={playerId}
                              className={`border-b border-border ${idx % 2 === 0 ? "bg-background" : ""}`}
                            >
                              <td className="px-4 py-4 font-semibold">
                                Jugador #{playerId}
                              </td>
                              <td className="px-4 py-4 text-center">
                                <Badge variant="success" size="sm">
                                  Activo
                                </Badge>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() => navigate(`/players/${playerId}`)}
                                    className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium transition hover:bg-accent"
                                    title="Ver perfil"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => openConfirmModal(playerId)}
                                    disabled={deletingPlayerId !== null}
                                    className="flex items-center justify-center rounded-lg border border-destructive bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive transition hover:bg-destructive/20 disabled:opacity-50"
                                    title="Eliminar del equipo"
                                  >
                                    {deletingPlayerId === playerId ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Solicitudes de ingreso */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="mb-4 text-xl font-bold">Solicitudes de ingreso</h2>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Revisa y gestiona las solicitudes de jugadores que quieren
                    unirse a tu equipo.
                  </p>
                  <button
                    onClick={() => navigate("/captain/requests")}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    Ver solicitudes pendientes
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Buscar jugadores */}
                <div className="rounded-lg border-2 border-dashed border-border bg-accent/5 p-8 text-center">
                  <UserPlus className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-bold">¿Necesitas más jugadores?</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {availableSlots > 0
                      ? `Tienes ${availableSlots} cupos disponibles para completar tu equipo`
                      : "Tu equipo está completo"}
                  </p>
                  <a
                    href="/captain/search-players"
                    className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    Buscar jugadores
                  </a>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
