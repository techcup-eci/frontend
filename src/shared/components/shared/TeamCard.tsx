import { Shield, Users, User } from "lucide-react";
import Badge from "./Badge";

interface TeamCardProps {
  name: string;
  captain: string;
  players: number;
  maxPlayers: number;
  status: "pending" | "review" | "approved" | "rejected";
  shield?: string;
  positions?: string[];
  onView?: () => void;
  onJoin?: () => void;
}

export default function TeamCard({
  name,
  captain,
  players,
  maxPlayers,
  status,
  shield,
  positions = [],
  onView,
  onJoin,
}: TeamCardProps) {
  const availableSlots = maxPlayers - players;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-lg">
      <div className="border-b border-border bg-gradient-to-r from-primary/5 to-accent/5 p-4">
        <div className="flex items-center gap-4">
          {shield ? (
            <img src={shield} alt={name} className="h-16 w-16 rounded-full border-2 border-border" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border-2 border-border">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-bold">{name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Capitán: {captain}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">
              {players} / {maxPlayers} jugadores
            </span>
          </div>
          <Badge variant={status}>{status === "approved" ? "Aprobado" : status === "review" ? "En revisión" : status === "rejected" ? "Rechazado" : "Pendiente"}</Badge>
        </div>

        {availableSlots > 0 && (
          <div className="rounded-lg bg-accent/10 p-3">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              {availableSlots} {availableSlots === 1 ? "cupo libre" : "cupos libres"}
            </p>
            {positions.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {positions.map((pos) => (
                  <span
                    key={pos}
                    className="rounded-full bg-background px-2 py-0.5 text-xs font-medium"
                  >
                    {pos}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          {onView && (
            <button
              onClick={onView}
              className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-accent"
            >
              Ver equipo
            </button>
          )}
          {onJoin && availableSlots > 0 && (
            <button
              onClick={onJoin}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Solicitar unirme
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
