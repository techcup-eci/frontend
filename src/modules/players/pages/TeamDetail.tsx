import { useParams, useNavigate } from "react-router";
import { Loader2, Users, Shield, ArrowLeft, LogOut } from "lucide-react";
import { useTeam, useAllTeams, useLeaveTeam } from "../../teams/hooks/useTeams";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { getUserById, type UserProfile } from "../services/userService";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.id);
  const teamId = Number(id);

  const { data: team, isLoading, error } = useTeam(teamId);
  const { data: allTeams = [] } = useAllTeams();
  const leaveTeam = useLeaveTeam();

  // Check if user is in this team
  const isMember = team?.players.includes(userId ?? 0) ?? false;
  const isCaptain = team?.captainId === userId;

  // Fetch player profiles
  const [playerProfiles, setPlayerProfiles] = useState<Map<number, UserProfile>>(new Map());
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  useEffect(() => {
    if (!team?.players.length) {
      setLoadingProfiles(false);
      return;
    }
    let cancelled = false;
    const fetchProfiles = async () => {
      setLoadingProfiles(true);
      const map = new Map<number, UserProfile>();
      const results = await Promise.allSettled(
        team.players.map(async (pid) => {
          try {
            const profile = await getUserById(pid);
            return { pid, profile };
          } catch {
            return { pid, profile: null };
          }
        })
      );
      if (!cancelled) {
        for (const result of results) {
          if (result.status === "fulfilled" && result.value.profile) {
            map.set(result.value.pid, result.value.profile);
          }
        }
        setPlayerProfiles(map);
        setLoadingProfiles(false);
      }
    };
    fetchProfiles();
    return () => { cancelled = true; };
  }, [team?.players]);

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
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Volver
            </button>

            {/* Team header */}
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="flex items-center gap-6">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-border"
                  style={{ backgroundColor: team.colors + "20" }}
                >
                  <Shield className="h-10 w-10" style={{ color: team.colors }} />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">{team.name}</h1>
                  <p className="text-muted-foreground">
                    Código: <span className="font-mono font-bold">{team.code}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{team.currentPlayers}/{team.maxPlayers}</p>
                  <p className="text-sm text-muted-foreground">jugadores</p>
                </div>
              </div>
            </div>

            {/* Players */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-xl font-bold">Jugadores del equipo</h2>
              {loadingProfiles ? (
                <div className="flex items-center gap-3 py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Cargando jugadores...</p>
                </div>
              ) : team.players.length === 0 ? (
                <p className="text-muted-foreground">No hay jugadores aún.</p>
              ) : (
                <div className="space-y-2">
                  {team.players.map((playerId) => {
                    const profile = playerProfiles.get(playerId);
                    const isCap = playerId === team.captainId;
                    const isMe = playerId === userId;
                    return (
                      <div
                        key={playerId}
                        className={`flex items-center justify-between rounded-lg border border-border p-4 ${
                          isMe ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-sm font-bold text-primary">
                              {profile?.name?.charAt(0)?.toUpperCase() ?? "?"}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold">
                              {profile?.name ?? `Jugador #${playerId}`}
                              {isMe && <span className="ml-2 text-xs text-muted-foreground">(Tú)</span>}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {profile?.academicProgram ?? "Sin perfil deportivo"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isCap && (
                            <span className="rounded-full bg-[var(--color-oxblood)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-oxblood)]">
                              Capitán
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Leave team button for non-captain members */}
            {isMember && !isCaptain && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                <h2 className="mb-2 text-lg font-bold text-destructive">Salir del equipo</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Si te sales, tendrás que buscar otro equipo para unirte. Esta acción no se puede deshacer.
                </p>
                <button
                  onClick={() => {
                    if (confirm(`¿Estás seguro de que quieres salirte de "${team.name}"?`)) {
                      leaveTeam.mutate(teamId, {
                        onSuccess: () => {
                          navigate("/player/teams");
                        },
                      });
                    }
                  }}
                  disabled={leaveTeam.isPending}
                  className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-white transition hover:bg-destructive/90 disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                  {leaveTeam.isPending ? "Saliendo..." : "Salir del equipo"}
                </button>
              </div>
            )}
            {/* Join info for non-members */}
            {!isMember && !isCaptain && (
              <div className="rounded-lg border-2 border-dashed border-border bg-accent/5 p-8 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-bold">¿Quieres unirte a este equipo?</h3>
                <p className="text-sm text-muted-foreground">
                  Comparte el código <span className="font-mono font-bold">{team.code}</span> con el capitán para que te invite,
                  o solicita unión desde la página de búsqueda de equipos.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
