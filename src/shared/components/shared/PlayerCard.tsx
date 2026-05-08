import { User } from "lucide-react";
import Badge from "./Badge";

interface PlayerCardProps {
  name: string;
  position: string;
  number: number;
  team?: string;
  semester?: number;
  photo?: string;
  available?: boolean;
  onView?: () => void;
  onInvite?: () => void;
}

export default function PlayerCard({
  name,
  position,
  number,
  team,
  semester,
  photo,
  available = true,
  onView,
  onInvite,
}: PlayerCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-lg">
      <div className="border-b border-border bg-gradient-to-r from-primary/5 to-accent/5 p-4">
        <div className="flex items-center gap-4">
          {photo ? (
            <img src={photo} alt={name} className="h-16 w-16 rounded-full border-2 border-border object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border-2 border-border">
              <User className="h-8 w-8 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="mb-1 font-bold">{name}</h3>
            <p className="text-sm text-muted-foreground">{position}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
            {number}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-2 text-sm">
          {team && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Equipo:</span>
              <span className="font-semibold">{team}</span>
            </div>
          )}
          {semester && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Semestre:</span>
              <span className="font-semibold">{semester}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Disponibilidad:</span>
            <Badge variant={available ? "success" : "error"} size="sm">
              {available ? "Disponible" : "No disponible"}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          {onView && (
            <button
              onClick={onView}
              className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-accent"
            >
              Ver perfil
            </button>
          )}
          {onInvite && !team && (
            <button
              onClick={onInvite}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Invitar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
