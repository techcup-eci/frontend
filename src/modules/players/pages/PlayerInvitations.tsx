import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Users, ChevronRight, Loader2, XCircle } from "lucide-react";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { useAllTeams, useSendJoinRequest } from "../../teams/hooks/useTeams";
import { toast } from "sonner";

interface TeamInfo {
  id: number;
  name: string;
  colors: string;
  currentPlayers: number;
  maxPlayers: number;
  code: string;
}

export default function PlayerInvitations() {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.id);
  const { data: teams = [], isLoading, isError } = useAllTeams();
  const sendRequest = useSendJoinRequest();
  const [requestingId, setRequestingId] = useState<number | null>(null);

  async function handleSendRequest(teamId: number, teamName: string) {
    setRequestingId(teamId);
    try {
      await sendRequest.mutateAsync(teamId);
      toast.success(`Solicitud enviada a ${teamName}`);
    } catch {
      // Error already shown by hook toast
    } finally {
      setRequestingId(null);
    }
  }

  if (!userId) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
              <Mail className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-bold">Debes iniciar sesión</h3>
              <p className="text-muted-foreground">Inicia sesión para ver equipos disponibles</p>
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
                <h1 className="mb-2 text-3xl font-bold">Buscar equipos</h1>
                <p className="text-muted-foreground">
                  Envía solicitudes para unirte a un equipo
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">
                  {teams.length} equipo{teams.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {isError && (
              <div className="flex items-center gap-3 rounded-lg bg-[#EF4444]/10 px-4 py-3 text-sm font-medium text-[#EF4444]">
                <XCircle className="h-5 w-5 flex-shrink-0" />
                Error al cargar los equipos
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center rounded-xl border border-border bg-card py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">
                  Cargando equipos...
                </span>
              </div>
            ) : teams.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
                <Users className="mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-bold">No hay equipos disponibles</h3>
                <p className="text-muted-foreground">
                  Los equipos aparecerán aquí cuando estén disponibles
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {teams.map((team: TeamInfo) => (
                  <div
                    key={team.id}
                    className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: `${team.colors}20`,
                          border: `2px solid ${team.colors}`,
                        }}
                      >
                        <Users className="h-6 w-6" style={{ color: team.colors }} />
                      </div>
                      <div>
                        <p className="font-semibold">{team.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {team.currentPlayers} / {team.maxPlayers} jugadores
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleSendRequest(team.id, team.name)}
                        disabled={requestingId === team.id || sendRequest.isPending}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                      >
                        {requestingId === team.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            Enviar solicitud
                            <ChevronRight className="h-4 w-4" />
                          </>
                        )}
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
