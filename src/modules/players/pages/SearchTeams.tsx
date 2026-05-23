import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import TeamCard from "../../../shared/components/shared/TeamCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../shared/components/ui/dialog";
import { Users, Search, Hash, Loader2, Shield } from "lucide-react";
import { useAllTeams, useSendJoinRequest, useJoinByCode } from "../../teams/hooks/useTeams";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { toast } from "sonner";

interface TeamInfo {
  id: number;
  name: string;
  colors: string;
  currentPlayers: number;
  maxPlayers: number;
  code: string;
  captainId?: number;
  tournamentStatus?: string;
}

export default function SearchTeams() {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.id);
  const userRole = useAuthStore((state) => state.user?.role);
  const { data: teams = [], isLoading, isError } = useAllTeams();
  const joinByCode = useJoinByCode();
  const sendJoin = useSendJoinRequest();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [joinCodeOpen, setJoinCodeOpen] = useState(false);
  const [teamCode, setTeamCode] = useState("");
  const [joiningTeamId, setJoiningTeamId] = useState<number | null>(null);

  // Find the team the user already belongs to (as captain or player)
  const myTeam = useMemo(() => {
    if (!userId) return null;
    return (teams as TeamInfo[]).find(
      (t) => t.captainId === userId || t.players.includes(userId)
    ) ?? null;
  }, [teams, userId]);

  const filteredTeams = (teams as TeamInfo[]).filter((team) => {
    // Don't show the user's own team in the list
    if (myTeam && team.id === myTeam.id) return false;
    const matchesSearch = team.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || team.tournamentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleJoinByCode = async () => {
    if (teamCode.trim().length === 0) return;
    // Already in a team
    if (myTeam) {
      toast.error("Ya perteneces a un equipo", {
        description: `Tu equipo actual es "${myTeam.name}". No puedes unirte a otro.`,
      });
      return;
    }
    // Hook handles success/error toasts
    await joinByCode.mutateAsync(teamCode.trim());
    setJoinCodeOpen(false);
    setTeamCode("");
  };

  const handleJoinTeam = async (teamId: number, teamName: string) => {
    // Already in a team - prevent joining another
    if (myTeam) {
      toast.error("Ya perteneces a un equipo", {
        description: `Tu equipo actual es "${myTeam.name}". No puedes unirte a otro.`,
      });
      return;
    }
    // Check role — backend requires PLAYER role for solicitudes endpoint
    if (userRole !== "player" && userRole !== "captain") {
      toast.error("Debes tener rol de jugador para solicitar unión a un equipo.", {
        description: "Ve a tu perfil y solicita el rol de jugador primero.",
      });
      return;
    }
    // Hook handles success/error toasts
    setJoiningTeamId(teamId);
    try {
      await sendJoin.mutateAsync(teamId);
    } finally {
      setJoiningTeamId(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold">Buscar equipos disponibles</h1>
                <p className="text-muted-foreground">Encuentra un equipo para unirte al torneo</p>
              </div>
              {!myTeam && (
                <button
                  onClick={() => setJoinCodeOpen(true)}
                  className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  <Hash className="h-4 w-4" />
                  Unirme con código de equipo
                </button>
              )}
            </div>

            {/* Already in a team banner */}
            {myTeam && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 flex-shrink-0 text-green-600" />
                  <div className="flex-1">
                    <p className="font-bold text-green-700">Ya perteneces a un equipo</p>
                    <p className="text-sm text-green-600">
                      Tu equipo actual es <span className="font-semibold">{myTeam.name}</span> ({myTeam.currentPlayers}/{myTeam.maxPlayers} jugadores).
                      {myTeam.captainId === userId && " Eres el capitán."}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => {
                          if (myTeam.captainId === userId) {
                            navigate("/captain/manage-team");
                          } else {
                            navigate(`/player/teams/${myTeam.id}`);
                          }
                        }}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                      >
                        Ir a mi equipo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Dialog open={joinCodeOpen} onOpenChange={setJoinCodeOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Unirme con código de equipo</DialogTitle>
                  <DialogDescription>
                    Ingresa el código alfanumérico que te compartió el capitán del equipo.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <label className="mb-2 block font-medium">Código del equipo</label>
                  <input
                    type="text"
                    placeholder="Ej: ABC-12345"
                    value={teamCode}
                    onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
                    maxLength={20}
                  />
                </div>
                <DialogFooter>
                  <button
                    onClick={() => { setJoinCodeOpen(false); setTeamCode(""); }}
                    className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-accent"
                  >
                    Cancelar
                  </button>
                  <button
                    disabled={teamCode.trim().length === 0 || joinByCode.isPending}
                    onClick={handleJoinByCode}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                  >
                    {joinByCode.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Confirmar"
                    )}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-border bg-input-background py-3 pl-10 pr-4 focus:border-primary focus:outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
              >
                <option value="">Todos los estados</option>
                <option value="ACTIVE">Aprobados</option>
                <option value="DRAFT">En revisión</option>
                <option value="NONE">Pendientes</option>
              </select>
            </div>

            {isError && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                Error al cargar los equipos. Intenta nuevamente.
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center rounded-xl border border-border bg-card py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Cargando equipos...</span>
              </div>
            ) : filteredTeams.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTeams.map((team) => (
                  <TeamCard
                    key={team.id}
                    name={team.name}
                    captain={team.captainId ? `#${team.captainId}` : "N/A"}
                    players={team.currentPlayers}
                    maxPlayers={team.maxPlayers || 12}
                    status={team.tournamentStatus === "ACTIVE" ? "approved" : "review"}
                    positions={[]}
                    onView={() => navigate(`/player/teams/${team.id}`)}
                    onJoin={myTeam ? undefined : () => handleJoinTeam(team.id, team.name)}
                    isJoining={joiningTeamId === team.id}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
                <Users className="mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-bold">No hay equipos disponibles</h3>
                <p className="text-muted-foreground">No se encontraron equipos con los filtros seleccionados</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
