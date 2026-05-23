import { useState } from "react";
import { Users, Search, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useAllTeams, useSendJoinRequest } from "../hooks/useTeams";
import { useAuthStore } from "../../auth/hooks/useAuthStore";

export default function SearchPlayers() {
  const userId = useAuthStore((state) => state.user?.id);
  const { data: teams, isLoading } = useAllTeams();
  const { mutateAsync: sendRequest, isPending } = useSendJoinRequest();
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState<{
    teamId: number;
    success: boolean;
    msg: string;
  } | null>(null);

  // Filter teams the user is NOT already in
  const availableTeams = (teams ?? []).filter(
    (t) => t.captainId !== userId && !t.players.includes(userId ?? 0)
  );

  const filtered = availableTeams.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleJoin(teamId: number, teamName: string) {
    setFeedback(null);
    try {
      await sendRequest(teamId);
      setFeedback({ teamId, success: true, msg: `Solicitud enviada a ${teamName}` });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data
          ?.error ||
        (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        `Error al enviar solicitud a ${teamName}`;
      setFeedback({ teamId, success: false, msg: message });
    }
  }

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
              <h1 className="mb-2 text-3xl font-bold">Buscar equipos disponibles</h1>
              <p className="text-muted-foreground">
                Envía una solicitud para unirte a un equipo
              </p>
            </div>

            {feedback && (
              <div
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
                  feedback.success
                    ? "bg-[#4ADE80]/10 text-[#4ADE80]"
                    : "bg-[#EF4444]/10 text-[#EF4444]"
                }`}
              >
                {feedback.success ? (
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 flex-shrink-0" />
                )}
                {feedback.msg}
              </div>
            )}

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

            {filtered.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((team) => (
                  <div
                    key={team.id}
                    className="rounded-xl border border-border bg-card p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border"
                        style={{ backgroundColor: team.colors + "20" }}
                      >
                        <Users className="h-6 w-6" style={{ color: team.colors }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold">{team.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {team.currentPlayers} / {team.maxPlayers} jugadores
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoin(team.id, team.name)}
                      disabled={isPending || team.currentPlayers >= team.maxPlayers}
                      className="mt-4 w-full rounded-lg bg-[var(--color-oxblood)] px-4 py-2.5 font-semibold text-white transition hover:bg-opacity-90 disabled:opacity-50"
                    >
                      {team.currentPlayers >= team.maxPlayers
                        ? "Equipo lleno"
                        : "Solicitar unión"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
                <Users className="mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-bold">No hay equipos disponibles</h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "No se encontraron equipos con ese nombre"
                    : "No hay equipos a los que puedas unirte"}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
