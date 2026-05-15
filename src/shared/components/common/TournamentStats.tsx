import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Target, Calendar, Trophy, Loader2, AlertCircle, RefreshCw } from "lucide-react";

const API_BASE = "http://localhost:8080/api/v1";

interface TopScorerResponse {
  playerId: string;
  goals: number;
  playerName?: string;
  teamName?: string;
  matchesPlayed?: number;
}

interface MatchHistoryResponse {
  matchId: string;
  round: string;
  matchOrder: number;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  scheduledAt: string;
  status: string;
  homeTeamName?: string;
  awayTeamName?: string;
  fieldName?: string;
}

interface TeamStatsResponse {
  teamId: string;
  wins: number;
  losses: number;
  draws: number;
  goalsScored: number;
  goalsReceived: number;
}

const statsApi = {
  getTopScorers: (tournamentId: string): Promise<TopScorerResponse[]> =>
    fetch(`${API_BASE}/tournaments/${tournamentId}/stats/top-scorers`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),

  getMatchHistory: (tournamentId: string): Promise<MatchHistoryResponse[]> =>
    fetch(`${API_BASE}/tournaments/${tournamentId}/stats/matches`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),

  getTeamStats: (tournamentId: string, teamId: string): Promise<TeamStatsResponse> =>
    fetch(`${API_BASE}/tournaments/${tournamentId}/stats/teams/${teamId}`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
};

function useFetch<T>(fetchFn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchFn()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, deps);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refetch: load };
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20 text-muted-foreground">
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      <span>Cargando datos...</span>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-muted-foreground">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p className="text-sm">Error al cargar: {message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent/10 transition"
      >
        <RefreshCw className="h-4 w-4" />
        Reintentar
      </button>
    </div>
  );
}

function TopScorersTab({ tournamentId }: { tournamentId: string }) {
  const { data, loading, error, refetch } = useFetch(
    () => statsApi.getTopScorers(tournamentId),
    [tournamentId]
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const maxGoals = data?.[0]?.goals ?? 1;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-6 text-xl font-bold">Top Goleadores</h2>
      <div className="space-y-4">
        {data?.map((player, idx) => (
          <div
            key={player.playerId}
            className="flex items-center gap-6 rounded-lg border border-border bg-background p-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
              {idx + 1}
            </div>
            <div className="flex-1">
              {/* playerName viene si el backend lo incluye; fallback al UUID corto */}
              <p className="font-bold">
                {player.playerName ?? `Jugador ${player.playerId.slice(0, 8)}…`}
              </p>
              <p className="text-sm text-muted-foreground">
                {player.teamName ?? "Equipo desconocido"}
              </p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{player.goals}</p>
                <p className="text-xs text-muted-foreground">Goles</p>
              </div>
              <div className="h-2 w-48 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                  style={{ width: `${(player.goals / maxGoals) * 100}%` }}
                />
              </div>
              {player.matchesPlayed !== undefined && (
                <div className="text-center">
                  <p className="font-semibold">{player.matchesPlayed}</p>
                  <p className="text-xs text-muted-foreground">Partidos</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchHistoryTab({ tournamentId }: { tournamentId: string }) {
  const { data, loading, error, refetch } = useFetch(
    () => statsApi.getMatchHistory(tournamentId),
    [tournamentId]
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-CO", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-6 text-xl font-bold">Historial de partidos</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border bg-accent/5">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-bold">Fecha</th>
              <th className="px-4 py-3 text-left text-sm font-bold">Ronda</th>
              <th className="px-4 py-3 text-left text-sm font-bold">Local</th>
              <th className="px-4 py-3 text-center text-sm font-bold">Resultado</th>
              <th className="px-4 py-3 text-left text-sm font-bold">Visitante</th>
              <th className="px-4 py-3 text-left text-sm font-bold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((match, idx) => (
              <tr
                key={match.matchId}
                className={`border-b border-border ${idx % 2 === 0 ? "bg-background" : ""}`}
              >
                <td className="px-4 py-4 text-sm">{formatDate(match.scheduledAt)}</td>
                <td className="px-4 py-4 text-sm text-muted-foreground">{match.round}</td>
                <td className="px-4 py-4 font-semibold">
                  {match.homeTeamName ?? match.homeTeamId.slice(0, 8) + "…"}
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="rounded-lg bg-primary/10 px-4 py-1 font-bold">
                    {match.homeScore ?? "–"} - {match.awayScore ?? "–"}
                  </span>
                </td>
                <td className="px-4 py-4 font-semibold">
                  {match.awayTeamName ?? match.awayTeamId.slice(0, 8) + "…"}
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">{match.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TeamStatsTab({ tournamentId }: { tournamentId: string }) {
  const [teamId, setTeamId] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useFetch(
    () => submittedId
      ? statsApi.getTeamStats(tournamentId, submittedId)
      : Promise.resolve(null),
    [tournamentId, submittedId]
  );

  const goalDiff = data ? data.goalsScored - data.goalsReceived : null;
  const totalMatches = data ? data.wins + data.losses + data.draws : null;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-6 text-xl font-bold">Estadísticas por equipo</h2>

      <div className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="UUID del equipo…"
          value={teamId}
          onChange={e => setTeamId(e.target.value)}
          className="flex-1 max-w-md rounded-lg border border-border bg-input-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
        />
        <button
          onClick={() => setSubmittedId(teamId.trim())}
          disabled={!teamId.trim()}
          className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40 hover:opacity-90 transition"
        >
          Buscar
        </button>
      </div>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {data && (
        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-background p-4 text-center">
            <p className="mb-1 text-2xl font-bold">{totalMatches}</p>
            <p className="text-sm text-muted-foreground">Partidos jugados</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4 text-center">
            <p className="mb-1 text-2xl font-bold text-[#4ADE80]">{data.wins}</p>
            <p className="text-sm text-muted-foreground">Ganados</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4 text-center">
            <p className="mb-1 text-2xl font-bold">{data.draws}</p>
            <p className="text-sm text-muted-foreground">Empates</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4 text-center">
            <p className="mb-1 text-2xl font-bold text-destructive">{data.losses}</p>
            <p className="text-sm text-muted-foreground">Perdidos</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4 text-center">
            <p className="mb-1 text-2xl font-bold">{data.goalsScored}</p>
            <p className="text-sm text-muted-foreground">Goles a favor</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4 text-center">
            <p className="mb-1 text-2xl font-bold">{data.goalsReceived}</p>
            <p className="text-sm text-muted-foreground">Goles en contra</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4 text-center md:col-span-2">
            <p className={`mb-1 text-2xl font-bold ${goalDiff! > 0 ? "text-[#4ADE80]" : goalDiff! < 0 ? "text-destructive" : ""}`}>
              {goalDiff! > 0 ? "+" : ""}{goalDiff}
            </p>
            <p className="text-sm text-muted-foreground">Diferencia de gol</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TournamentStats() {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [activeTab, setActiveTab] = useState<"scorers" | "history" | "teams">("scorers");

  const tabs = [
    { id: "scorers" as const, label: "Goleadores", icon: Target },
    { id: "history" as const, label: "Historial de partidos", icon: Calendar },
    { id: "teams"   as const, label: "Resultados por equipo", icon: Trophy },
  ];

  if (!tournamentId) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <AlertCircle className="mr-2 h-5 w-5" />
        <span>No se especificó un torneo en la URL.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Estadísticas del Torneo</h1>
            <p className="text-muted-foreground">TechCup 2025-1 — Fase de grupos</p>
          </div>

          <div className="flex gap-2 border-b border-border">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === id
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </div>
              </button>
            ))}
          </div>

          {activeTab === "scorers" && <TopScorersTab tournamentId={tournamentId} />}
          {activeTab === "history" && <MatchHistoryTab tournamentId={tournamentId} />}
          {activeTab === "teams"   && <TeamStatsTab tournamentId={tournamentId} />}
        </div>
      </main>
    </div>
  );
}