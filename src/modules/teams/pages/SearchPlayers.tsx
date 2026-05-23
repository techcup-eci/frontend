import { useState, useMemo } from "react";
import { Users, Search, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { useAllTeams } from "../hooks/useTeams";
import { getAllUsers, type UserProfile } from "../../players/services/userService";
import { useQuery } from "@tanstack/react-query";

export default function SearchPlayers() {
  const userId = useAuthStore((state) => state.user?.id);
  const { data: teams = [], isLoading: loadingTeams } = useAllTeams();

  // Find captain's team to show the join code
  const myTeam = useMemo(() => {
    if (!userId) return null;
    return teams.find((t) => t.captainId === userId) ?? null;
  }, [teams, userId]);

  // Fetch all users
  const { data: allUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["all-users"],
    queryFn: getAllUsers,
    staleTime: 1000 * 60 * 2,
  });

  // Build set of user IDs that are already in any team
  const usersInTeams = useMemo(() => {
    const ids = new Set<number>();
    for (const team of teams) {
      for (const pid of team.players) {
        ids.add(pid);
      }
    }
    return ids;
  }, [teams]);

  // Available players: not in any team, not the current user
  const availablePlayers = useMemo(() => {
    return (allUsers as UserProfile[]).filter(
      (u) => u.id !== userId && !usersInTeams.has(u.id)
    );
  }, [allUsers, userId, usersInTeams]);

  const [searchTerm, setSearchTerm] = useState("");

  const filtered = availablePlayers.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.academicProgram?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term)
    );
  });

  const isLoading = loadingTeams || loadingUsers;

  const copyTeamCode = () => {
    if (myTeam?.code) {
      navigator.clipboard.writeText(myTeam.code);
      toast.success("Código copiado al portapapeles");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Buscar jugadores disponibles</h1>
              <p className="text-muted-foreground">
                Jugadores que aún no pertenecen a ningún equipo
              </p>
            </div>

            {/* Team code card */}
            {myTeam && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-3 text-lg font-bold">Comparte tu código de equipo</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Los jugadores pueden unirse a <span className="font-semibold">{myTeam.name}</span> con este código:
                </p>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-accent px-4 py-3 font-mono text-xl font-bold tracking-wider">
                    {myTeam.code}
                  </div>
                  <button
                    onClick={copyTeamCode}
                    className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium transition hover:bg-accent"
                  >
                    <Copy className="h-4 w-4" /> Copiar
                  </button>
                </div>
              </div>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nombre, programa o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-border bg-input-background py-3 pl-10 pr-4 focus:border-primary focus:outline-none"
              />
            </div>

            {/* Players list */}
            {filtered.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-xl border border-border bg-card p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-lg font-bold text-primary">
                          {user.name?.charAt(0)?.toUpperCase() ?? "?"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold">{user.name ?? "Sin nombre"}</h3>
                        <p className="text-sm text-muted-foreground">
                          {user.academicProgram ?? "Sin programa"}
                          {user.semester ? ` · Semestre ${user.semester}` : ""}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="mt-4 rounded-lg bg-accent/10 px-3 py-2 text-xs text-muted-foreground">
                      Comparte tu código de equipo para que se una
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
                <Users className="mb-4 h-16 w-16 text-muted-foreground/40" />
                <h3 className="mb-2 text-xl font-bold">
                  {searchTerm ? "No se encontraron jugadores" : "No hay jugadores disponibles"}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "No se encontraron jugadores con ese criterio"
                    : "Todos los jugadores ya pertenecen a un equipo"}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
