import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { User, CheckCircle, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useAllTeams, useAcceptRequest, useRejectRequest } from "../hooks/useTeams";
import { useAuthStore } from "../../auth/hooks/useAuthStore";

export default function PlayerRequestDetail() {
  const { jugadorId } = useParams<{ jugadorId: string }>();
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.id);
  const { data: teams } = useAllTeams();
  const myTeam = teams?.find((t) => t.captainId === userId);
  const teamId = myTeam?.id ?? 0;

  const accept = useAcceptRequest(teamId);
  const reject = useRejectRequest(teamId);
  const [actionDone, setActionDone] = useState(false);

  async function handleAction(action: "accept" | "reject") {
    if (!teamId || !jugadorId) return;
    const playerId = Number(jugadorId);
    if (action === "accept") {
      accept.mutate(playerId, {
        onSuccess: () => {
          setActionDone(true);
          setTimeout(() => navigate("/captain/requests"), 2500);
        },
      });
    } else {
      reject.mutate(playerId, {
        onSuccess: () => {
          setActionDone(true);
          setTimeout(() => navigate("/captain/requests"), 2500);
        },
      });
    }
  }

  if (!myTeam) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
              <User className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-bold">No tienes un equipo</h3>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isLoading = accept.isPending || reject.isPending;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-2xl space-y-8">
            <button
              onClick={() => navigate("/captain/requests")}
              className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a solicitudes
            </button>

            <div className="rounded-xl border border-border bg-card p-8">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <h1 className="mb-1 text-2xl font-bold">Solicitud de jugador</h1>
                <p className="mb-3 text-sm text-muted-foreground">
                  Este jugador ha solicitado unirse a {myTeam.name}
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

            {accept.isSuccess && (
              <div className="flex items-center gap-3 rounded-lg bg-[#4ADE80]/10 px-4 py-3 text-sm font-medium text-[#4ADE80]">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                Jugador aceptado en el equipo exitosamente
                <span className="ml-auto text-xs opacity-70">Redirigiendo...</span>
              </div>
            )}
            {reject.isSuccess && (
              <div className="flex items-center gap-3 rounded-lg bg-[#4ADE80]/10 px-4 py-3 text-sm font-medium text-[#4ADE80]">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                Solicitud rechazada exitosamente
                <span className="ml-auto text-xs opacity-70">Redirigiendo...</span>
              </div>
            )}
            {accept.error && (
              <div className="flex items-center gap-3 rounded-lg bg-[#EF4444]/10 px-4 py-3 text-sm font-medium text-[#EF4444]">
                <XCircle className="h-5 w-5 flex-shrink-0" />
                {extractErrorMessage(accept.error)}
              </div>
            )}
            {reject.error && (
              <div className="flex items-center gap-3 rounded-lg bg-[#EF4444]/10 px-4 py-3 text-sm font-medium text-[#EF4444]">
                <XCircle className="h-5 w-5 flex-shrink-0" />
                {extractErrorMessage(reject.error)}
              </div>
            )}

            {!actionDone && (
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  onClick={() => handleAction("reject")}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 rounded-xl border border-destructive bg-destructive/10 px-6 py-4 text-base font-medium text-destructive transition hover:bg-destructive/20 disabled:opacity-50"
                >
                  {isLoading ? (
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
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading ? (
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

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const axiosError = error as { response?: { data?: { error?: string; message?: string } } };
    const data = axiosError.response?.data;
    if (data?.error) return data.error;
    if (data?.message) return data.message;
    return error.message;
  }
  return "Ocurrió un error inesperado";
}
