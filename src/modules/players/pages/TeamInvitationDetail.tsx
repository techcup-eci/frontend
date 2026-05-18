import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { Users, CheckCircle, XCircle, ArrowLeft, Loader2 } from "lucide-react";

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

export default function TeamInvitationDetail() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<TeamInfo | null>(null);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionDone, setActionDone] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, [teamId]);

  async function fetchTeam() {
    setLoadingTeam(true);
    setTeamError(null);
    try {
      const { data } = await axios.get<TeamInfo>(`${BASE_URL}/api/teams/${teamId}`);
      setTeam({ ...data, id: String(data.id ?? teamId) });
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? err.message)
        : "Error al cargar la información del equipo";
      setTeamError(msg);
    } finally {
      setLoadingTeam(false);
    }
  }

  async function handleAction(action: "accept" | "reject") {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        `${BASE_URL}/api/players/${PLAYER_ID}/solicitudes/${teamId}/${action}`,
        {},
        { headers: { "X-User-Id": PLAYER_ID } }
      );
      const msg =
        action === "accept"
          ? "¡Invitación aceptada! Ahora eres parte del equipo"
          : "Invitación rechazada exitosamente";
      setSuccessMessage(msg);
      setActionDone(true);
      setTimeout(() => navigate("/player/invitations"), 2500);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? err.message)
        : `Error al ${action === "accept" ? "aceptar" : "rechazar"} la invitación`;
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-2xl space-y-8">
            {/* Back */}
            <button
              onClick={() => navigate("/player/invitations")}
              className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a invitaciones
            </button>

            {/* Team card */}
            {loadingTeam ? (
              <div className="flex items-center justify-center rounded-xl border border-border bg-card py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">
                  Cargando información del equipo...
                </span>
              </div>
            ) : teamError ? (
              <div className="flex items-center gap-3 rounded-lg bg-[#EF4444]/10 px-4 py-3 text-sm font-medium text-[#EF4444]">
                <XCircle className="h-5 w-5 flex-shrink-0" />
                {teamError}
              </div>
            ) : team ? (
              <div className="rounded-xl border border-border bg-card p-8">
                <div className="flex flex-col items-center text-center">
                  <div
                    className="mb-6 flex h-24 w-24 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: `${team.colors}20`,
                      border: `3px solid ${team.colors}`,
                    }}
                  >
                    <Users className="h-12 w-12" style={{ color: team.colors }} />
                  </div>
                  <h1 className="mb-1 text-2xl font-bold">{team.name}</h1>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Este equipo te ha invitado a unirte
                  </p>
                  <div className="mb-2 grid w-full max-w-xs grid-cols-2 gap-4">
                    <div className="rounded-lg bg-accent/10 px-4 py-3 text-center">
                      <p className="mb-1 text-xs text-muted-foreground">Jugadores</p>
                      <span className="font-mono text-xl font-semibold text-primary">
                        {team.currentPlayers} / {team.maxPlayers}
                      </span>
                    </div>
                    <div className="rounded-lg bg-accent/10 px-4 py-3 text-center">
                      <p className="mb-1 text-xs text-muted-foreground">Código</p>
                      <span className="font-mono text-xl font-semibold text-primary">
                        {team.code}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Feedback messages */}
            {successMessage && (
              <div className="flex items-center gap-3 rounded-lg bg-[#4ADE80]/10 px-4 py-3 text-sm font-medium text-[#4ADE80]">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                {successMessage}
                <span className="ml-auto text-xs opacity-70">Redirigiendo...</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-3 rounded-lg bg-[#EF4444]/10 px-4 py-3 text-sm font-medium text-[#EF4444]">
                <XCircle className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Action buttons */}
            {!actionDone && !loadingTeam && !teamError && (
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  onClick={() => handleAction("reject")}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl border border-destructive bg-destructive/10 px-6 py-4 text-base font-medium text-destructive transition hover:bg-destructive/20 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <XCircle className="h-5 w-5" />
                      Rechazar invitación
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleAction("accept")}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Aceptar invitación
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
