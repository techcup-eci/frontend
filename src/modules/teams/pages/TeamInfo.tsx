import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Shield, Users, Loader2, XCircle, Pencil, Settings } from "lucide-react";
import { apiClient } from "../../../core/api/apiClient";

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
  minPlayers: number;
  colors: string;
  photo: string;
  tournamentStatus: string;
}

export default function TeamInfo() {
  const navigate = useNavigate();
  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const playerIds: number[] = (team?.players?.length ? team.players : team?.idPlayers) ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-3xl space-y-8">
            {/* Header con botón editar */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="mb-2 text-3xl font-bold">Información del Equipo</h1>
                <p className="text-muted-foreground">
                  Gestiona los datos de tu equipo
                </p>
              </div>
              <button
                onClick={() => navigate("/captain/edit-team")}
                className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <Pencil className="h-4 w-4" />
                Editar equipo
              </button>
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
                <span className="ml-3 text-muted-foreground">
                  Cargando equipo...
                </span>
              </div>
            ) : team ? (
              <>
                {/* Card principal */}
                <div className="rounded-xl border border-border bg-card p-8">
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                    <div
                      className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4"
                      style={{
                        backgroundColor: `${team.colors}20`,
                        borderColor: team.colors,
                      }}
                    >
                      {team.photo ? (
                        <img
                          src={team.photo}
                          alt="Escudo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Shield
                          className="h-12 w-12"
                          style={{ color: team.colors }}
                        />
                      )}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="mb-2 text-2xl font-bold">{team.name}</h2>
                      <div className="flex items-center justify-center gap-2 sm:justify-start">
                        <span
                          className="inline-block h-4 w-4 rounded-full border border-border"
                          style={{ backgroundColor: team.colors }}
                        />
                        <span className="font-mono text-sm text-muted-foreground">
                          {team.colors}
                        </span>
                      </div>
                      {team.tournamentStatus && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Estado en torneo:{" "}
                          <span className="font-medium capitalize">
                            {team.tournamentStatus.toLowerCase()}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-border bg-card p-6 text-center">
                    <p className="mb-1 text-sm text-muted-foreground">
                      Jugadores actuales
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {playerIds.length}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-6 text-center">
                    <p className="mb-1 text-sm text-muted-foreground">
                      Máximo permitido
                    </p>
                    <p className="text-3xl font-bold">{team.maxPlayers}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-6 text-center">
                    <p className="mb-1 text-sm text-muted-foreground">
                      Mínimo requerido
                    </p>
                    <p className="text-3xl font-bold">{team.minPlayers}</p>
                  </div>
                </div>

                {/* Lista de jugadores con acceso rápido a gestión */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="h-6 w-6 text-primary" />
                      <h3 className="text-lg font-bold">
                        Integrantes del equipo
                      </h3>
                    </div>
                    <button
                      onClick={() => navigate("/captain/manage-team")}
                      className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition hover:bg-accent"
                    >
                      <Settings className="h-4 w-4" />
                      Gestionar
                    </button>
                  </div>
                  {playerIds.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No hay jugadores registrados aún.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {playerIds.map((id) => (
                        <div
                          key={id}
                          className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
                        >
                          <span className="font-medium">Jugador #{id}</span>
                          <button
                            onClick={() => navigate(`/players/${id}`)}
                            className="text-sm text-primary transition hover:underline"
                          >
                            Ver perfil
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
                <Shield className="mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-bold">
                  No se encontró el equipo
                </h3>
                <p className="text-muted-foreground">
                  Verifica que el equipo exista o contacta al administrador
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
