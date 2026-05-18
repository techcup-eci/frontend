import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Mail, Users, ChevronRight, Loader2, XCircle } from "lucide-react";

// TODO: obtener del contexto de autenticación, estos son casos de prueba
const PLAYER_ID = "1";

const BASE_URL = "https://gateway-techcup.nicedesert-e7db8277.eastus.azurecontainerapps.io";

interface TeamInfo {
  id: string;
  name: string;
  colors: string;
  currentPlayers: number;
  maxPlayers: number;
  code: string;
}

function normalizeTeamIds(data: unknown): string[] {
  if (!Array.isArray(data)) return [];
  return data.map((item) => {
    if (typeof item === "string") return item;
    if (typeof item === "number") return String(item);
    if (item && typeof item === "object") {
      const obj = item as Record<string, unknown>;
      return String(obj.teamId ?? obj.equipoId ?? obj.id ?? JSON.stringify(item));
    }
    return String(item);
  });
}

export default function PlayerInvitations() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  async function fetchInvitations() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/players/${PLAYER_ID}/solicitudes`,
        { headers: { "X-User-Id": PLAYER_ID } }
      );
      const teamIds = normalizeTeamIds(data);
      const teamInfos = await Promise.all(
        teamIds.map((teamId) =>
          axios
            .get<TeamInfo>(`${BASE_URL}/api/teams/${teamId}`)
            .then((res) => ({ ...res.data, id: String(res.data.id ?? teamId) }))
            .catch(
              () =>
                ({
                  id: teamId,
                  name: `Equipo ${teamId}`,
                  colors: "#6366f1",
                  currentPlayers: 0,
                  maxPlayers: 12,
                  code: teamId,
                } as TeamInfo)
            )
        )
      );
      setTeams(teamInfos);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? err.message)
        : "Error al cargar las invitaciones";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleReject(teamId: string) {
    setRejectingId(teamId);
    setError(null);
    try {
      await axios.post(
        `${BASE_URL}/api/players/${PLAYER_ID}/solicitudes/${teamId}/reject`,
        {},
        { headers: { "X-User-Id": PLAYER_ID } }
      );
      setTeams((prev) => prev.filter((t) => t.id !== teamId));
      setConfirmMessage("Invitación rechazada exitosamente");
      setTimeout(() => setConfirmMessage(null), 3000);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? err.message)
        : "Error al rechazar la invitación";
      setError(msg);
    } finally {
      setRejectingId(null);
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
                <h1 className="mb-2 text-3xl font-bold">Invitaciones de equipos</h1>
                <p className="text-muted-foreground">
                  Equipos que te han invitado a unirte
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">
                  {teams.length} invitación{teams.length !== 1 ? "es" : ""}
                </span>
              </div>
            </div>

            {/* Feedback messages */}
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

            {/* Content */}
            {loading ? (
              <div className="flex items-center justify-center rounded-xl border border-border bg-card py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">
                  Cargando invitaciones...
                </span>
              </div>
            ) : teams.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
                <Mail className="mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-bold">No tienes invitaciones</h3>
                <p className="text-muted-foreground">
                  Los equipos que te inviten a unirte aparecerán aquí
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {teams.map((team) => (
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
                          {team.currentPlayers} / {team.maxPlayers} jugadores · Código:{" "}
                          {team.code}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleReject(team.id)}
                        disabled={rejectingId === team.id}
                        className="flex items-center gap-2 rounded-lg border border-destructive bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/20 disabled:opacity-50"
                      >
                        {rejectingId === team.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Rechazar"
                        )}
                      </button>
                      <button
                        onClick={() => navigate(`/player/invitations/${team.id}`)}
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
