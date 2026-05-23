import { AlertCircle, CheckCircle, CreditCard, Loader2, XCircle } from "lucide-react";
import { useMemo } from "react";
import { useActiveTournament } from "../hooks/useActiveTournament";
import { useRegistrations, useApproveRegistration, useRejectRegistration } from "../hooks/useRegistrations";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { useAllTeams } from "../../teams/hooks/useTeams";
import Badge from "../../../shared/components/shared/Badge";

/**
 * Convert a Long team ID (from teams-ms) to UUID format expected by tournament-ms.
 */
function longToUuid(longId: number): string {
  const hex = longId.toString(16).padStart(12, "0");
  return `00000000-0000-0000-0000-${hex}`;
}

const STATUS_CONFIG: Record<string, { label: string; variant: "info" | "warning" | "success" | "error" }> = {
  UNDER_REVIEW: { label: "En revisión", variant: "warning" },
  APPROVED: { label: "Aprobado", variant: "success" },
  REJECTED: { label: "Rechazado", variant: "error" },
  CANCELLED: { label: "Cancelado", variant: "info" },
};

export default function ManageTeams() {
  const { data: activeTournament, isLoading: isLoadingTournament } = useActiveTournament();
  const { data: teams = [] } = useAllTeams();
  const authUser = useAuthStore((state) => state.user);
  const organizerId = authUser?.id ?? 0;

  const tournamentId = activeTournament?.id ?? "";
  const { data: registrations = [], isLoading, isError, error } = useRegistrations(tournamentId);
  const approveMutation = useApproveRegistration(tournamentId);
  const rejectMutation = useRejectRegistration(tournamentId);

  // Build team name map
  const teamNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const team of teams) {
      map.set(longToUuid(team.id), team.name);
      map.set(String(team.id), team.name);
    }
    return map;
  }, [teams]);

  const getTeamName = (id: string): string => {
    return teamNameMap.get(id) ?? id.slice(0, 8);
  };

  if (isLoadingTournament || isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando inscripciones...</p>
        </div>
      </div>
    );
  }

  if (!activeTournament) {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground/60" />
            <h2 className="text-xl font-bold">No hay torneo activo</h2>
            <p className="text-muted-foreground">
              No hay ningún torneo activo o en progreso en este momento.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const pendingCount = registrations.filter((r) => r.status === "UNDER_REVIEW").length;

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Gestionar inscripciones</h1>
            <p className="text-muted-foreground">
              {activeTournament.name} — Revisa y aprueba los comprobantes de pago
            </p>
          </div>
          {pendingCount > 0 && (
            <Badge variant="warning" size="lg">
              {pendingCount} pendiente{pendingCount !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        {isError && (
          <div className="flex items-center gap-3 rounded-lg bg-[#EF4444]/10 px-4 py-3 text-sm font-medium text-[#EF4444]">
            <XCircle className="h-5 w-5 flex-shrink-0" />
            {error instanceof Error ? error.message : "Error al cargar las inscripciones"}
          </div>
        )}

        {registrations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
            <CreditCard className="mb-4 h-16 w-16 text-muted-foreground/40" />
            <h3 className="mb-2 text-xl font-bold">Sin inscripciones</h3>
            <p className="text-muted-foreground">
              Los equipos aparecerán aquí cuando se inscriban al torneo
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg) => {
              const statusCfg = STATUS_CONFIG[reg.status] ?? { label: reg.status, variant: "info" as const };
              const isPending = reg.status === "UNDER_REVIEW";

              return (
                <div
                  key={reg.id}
                  className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Equipo {getTeamName(reg.teamId)}</p>
                      <p className="text-sm text-muted-foreground">
                        Capitán ID: {reg.captainId} · Inscrito el{" "}
                        {new Date(reg.createdAt).toLocaleDateString("es-CO")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>

                    {isPending && reg.paymentReceiptUrl && (
                      <a
                        href={reg.paymentReceiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium transition hover:bg-accent"
                      >
                        Ver comprobante
                      </a>
                    )}

                    {isPending && (
                      <>
                        <button
                          onClick={() =>
                            approveMutation.mutate({ registrationId: reg.id, organizerId })
                          }
                          disabled={approveMutation.isPending}
                          className="flex items-center gap-1 rounded-lg bg-[#4ADE80] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#22C55E] disabled:opacity-60"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Aprobar
                        </button>
                        <button
                          onClick={() =>
                            rejectMutation.mutate({ registrationId: reg.id, organizerId })
                          }
                          disabled={rejectMutation.isPending}
                          className="flex items-center gap-1 rounded-lg bg-[#EF4444] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#DC2626] disabled:opacity-60"
                        >
                          <XCircle className="h-4 w-4" />
                          Rechazar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
