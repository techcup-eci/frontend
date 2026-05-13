import { useState } from "react";
import { toast } from "sonner";
import Navbar from "../../../shared/components/shared/Navbar";
import Sidebar from "../../../shared/components/shared/Sidebar";
import { Home, Users, UserPlus, LayoutList, CreditCard, Trophy, Loader2, XCircle } from "lucide-react";
import { useLineup } from "../../competitions/hooks/useLineup";
import { useCreateLineup } from "../../competitions/hooks/useCreateLineup";
import type { CreateLineupRequest } from "../../competitions/types/competition";

const captainSidebar = [
  {
    items: [
      { label: "Inicio", path: "/captain/dashboard", icon: Home },
      { label: "Mi Equipo", path: "/captain/team", icon: Users },
      { label: "Buscar Jugadores", path: "/captain/players", icon: UserPlus },
      { label: "Alineación", path: "/captain/lineup", icon: LayoutList },
      { label: "Pago de Inscripción", path: "/captain/payment", icon: CreditCard },
      { label: "Torneo", path: "/tournament-info", icon: Trophy },
    ],
  },
];

const FORMATIONS = [
  { value: "TWO_THREE_ONE", label: "2-3-1" },
  { value: "THREE_TWO_ONE", label: "3-2-1" },
  { value: "FOUR_ONE_ONE", label: "4-1-1" },
  { value: "ONE_THREE_TWO", label: "1-3-2" },
] as const;

const ROLES = [
  { value: "GOALKEEPER", label: "Portero" },
  { value: "DEFENDER", label: "Defensa" },
  { value: "MIDFIELDER", label: "Mediocampista" },
  { value: "FORWARD", label: "Delantero" },
] as const;

type PlayerSlot = {
  key: string;
  playerId: string;
  role: string;
};

export default function ConfigureLineup() {
  // TODO: Replace these hardcoded values with route params/context
  const [tournamentId] = useState<string>("tournament-uuid-placeholder");
  const [matchId] = useState<string>("match-uuid-placeholder");
  const [teamId] = useState<string>("team-uuid-placeholder");
  const [userId] = useState<string>("captain-uuid-placeholder");

  const {
    data: existingLineup,
    isLoading,
    isError,
    error,
  } = useLineup(tournamentId, matchId, teamId);
  const createLineupMutation = useCreateLineup(tournamentId, matchId, teamId);

  const [formation, setFormation] = useState<string>("TWO_THREE_ONE");
  const [players, setPlayers] = useState<PlayerSlot[]>([
    { key: "1", playerId: "", role: "GOALKEEPER" },
  ]);

  const addPlayerSlot = () => {
    setPlayers([...players, { key: `slot-${Date.now()}`, playerId: "", role: "MIDFIELDER" }]);
  };

  const removePlayerSlot = (key: string) => {
    if (players.length <= 1) return;
    setPlayers(players.filter((p) => p.key !== key));
  };

  const updatePlayer = (key: string, field: keyof PlayerSlot, value: string) => {
    setPlayers(players.map((p) => (p.key === key ? { ...p, [field]: value } : p)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filledPlayers = players.filter((p) => p.playerId.trim());
    if (filledPlayers.length === 0) {
      toast.error("Debes agregar al menos un jugador");
      return;
    }

    const payload: CreateLineupRequest = {
      formation,
      players: filledPlayers.map((p) => ({
        playerId: p.playerId,
        role: p.role,
      })),
    };

    createLineupMutation.mutate(
      { lineup: payload, userId },
      {
        onSuccess: () => toast.success("Alineación guardada exitosamente"),
        onError: (err: unknown) => {
          const message =
            (err as { response?: { data?: { message?: string } }; message?: string })?.response
              ?.data?.message ||
            (err as Error)?.message ||
            "No se pudo guardar la alineación";
          toast.error(message);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar sections={captainSidebar} />
          <main className="flex flex-1 items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Cargando alineación...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar sections={captainSidebar} />
          <main className="flex flex-1 items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3 text-center">
              <XCircle className="h-10 w-10 text-destructive/60" />
              <p className="text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "No se pudo cargar la alineación."}
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar sections={captainSidebar} />
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Configurar alineación</h1>
              <p className="text-muted-foreground">
                Define la formación y los jugadores para el partido
              </p>
            </div>

            {/* Existing lineup read-only view */}
            {existingLineup && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 text-xl font-bold">Alineación actual</h2>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Formación:{" "}
                    <span className="font-semibold text-foreground">
                      {existingLineup.formation}
                    </span>
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {existingLineup.players.map((p) => (
                    <div
                      key={p.playerId}
                      className="rounded-lg border border-border bg-background p-3"
                    >
                      <p className="font-semibold">{p.playerId}</p>
                      <p className="text-sm text-muted-foreground">{p.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New lineup form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-6 text-xl font-bold">
                  {existingLineup ? "Actualizar alineación" : "Nueva alineación"}
                </h2>

                {/* Formation selector */}
                <div className="mb-6">
                  <label className="mb-3 block font-semibold">Formación:</label>
                  <div className="flex flex-wrap gap-3">
                    {FORMATIONS.map((f) => (
                      <label
                        key={f.value}
                        className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition ${
                          formation === f.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background hover:bg-accent"
                        }`}
                      >
                        <input
                          type="radio"
                          name="formation"
                          value={f.value}
                          checked={formation === f.value}
                          onChange={(e) => setFormation(e.target.value)}
                          className="sr-only"
                        />
                        {f.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Player slots */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Jugadores</h3>
                    <button
                      type="button"
                      onClick={addPlayerSlot}
                      className="rounded-lg bg-accent px-3 py-1 text-sm font-medium transition hover:bg-accent/80"
                    >
                      + Agregar jugador
                    </button>
                  </div>

                  {players.map((slot) => (
                    <div
                      key={slot.key}
                      className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background p-4 sm:flex-nowrap"
                    >
                      <input
                        type="text"
                        placeholder="Player ID (UUID)"
                        value={slot.playerId}
                        onChange={(e) => updatePlayer(slot.key, "playerId", e.target.value)}
                        className="flex-1 rounded-lg border border-border bg-input-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      />
                      <select
                        value={slot.role}
                        onChange={(e) => updatePlayer(slot.key, "role", e.target.value)}
                        className="rounded-lg border border-border bg-input-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      >
                        {ROLES.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                      {players.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePlayerSlot(slot.key)}
                          className="rounded-lg bg-[#EF4444] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#DC2626]"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-blue-500/10 p-4 text-sm text-blue-600">
                <p className="font-semibold">Nota:</p>
                <p className="mt-1 text-xs">
                  Los IDs de jugador deben corresponder a jugadores registrados en tu equipo.
                  La alineación se asociará al partido seleccionado.
                </p>
              </div>

              <button
                type="submit"
                disabled={createLineupMutation.isPending}
                className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
              >
                {createLineupMutation.isPending
                  ? "Guardando..."
                  : existingLineup
                    ? "Actualizar alineación"
                    : "Guardar alineación"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
