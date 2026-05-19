import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { User, CheckCircle, XCircle, ArrowLeft, Loader2 } from "lucide-react";

// TODO: obtener del contexto de autenticación, estos son casos de prueba
const TEAM_ID = "1";
const USER_ID = "10";

const BASE_URL = "https://gateway-techcup.nicedesert-e7db8277.eastus.azurecontainerapps.io";

export default function PlayerRequestDetail() {
  const { jugadorId } = useParams<{ jugadorId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionDone, setActionDone] = useState(false);

  async function handleAction(action: "accept" | "reject") {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        `${BASE_URL}/api/teams/${TEAM_ID}/solicitudes/${jugadorId}/${action}`,
        {},
        { headers: { "X-User-Id": USER_ID } }
      );
      const msg =
        action === "accept"
          ? "Jugador aceptado en el equipo exitosamente"
          : "Solicitud rechazada exitosamente";
      setSuccessMessage(msg);
      setActionDone(true);
      setTimeout(() => navigate("/captain/requests"), 2500);
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? err.message
          : `Error al ${action === "accept" ? "aceptar" : "rechazar"} la solicitud`;
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
              onClick={() => navigate("/captain/requests")}
              className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a solicitudes
            </button>

            {/* Player card */}
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <h1 className="mb-1 text-2xl font-bold">Solicitud de jugador</h1>
                <p className="mb-3 text-sm text-muted-foreground">
                  Este jugador ha solicitado unirse a tu equipo
                </p>
                <div className="rounded-lg bg-accent/10 px-6 py-3">
                  <p className="mb-1 text-xs text-muted-foreground">ID del jugador</p>
                  <span className="font-mono text-xl font-semibold text-primary">
                    {jugadorId}
                  </span>
                </div>
                <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                  Revisa la información del jugador y decide si aceptarlo en el equipo o rechazar su solicitud.
                </p>
              </div>
            </div>

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
            {!actionDone && (
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
                      Rechazar solicitud
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
                      Aceptar al equipo
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
