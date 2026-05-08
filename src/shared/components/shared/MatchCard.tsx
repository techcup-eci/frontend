import { Calendar, Clock, MapPin, Shield } from "lucide-react";
import Badge from "./Badge";

interface MatchCardProps {
  homeTeam: {
    name: string;
    shield?: string;
    score?: number;
  };
  awayTeam: {
    name: string;
    shield?: string;
    score?: number;
  };
  date: string;
  time: string;
  field: string;
  phase: string;
  status?: "upcoming" | "live" | "finished";
}

export default function MatchCard({
  homeTeam,
  awayTeam,
  date,
  time,
  field,
  phase,
  status = "upcoming",
}: MatchCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-lg">
      <div className="border-b border-border bg-gradient-to-r from-primary/5 to-accent/5 p-3">
        <Badge variant="info" size="sm">
          {phase}
        </Badge>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 flex-col items-center gap-2">
            {homeTeam.shield ? (
              <img src={homeTeam.shield} alt={homeTeam.name} className="h-16 w-16 rounded-full" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            )}
            <p className="text-center text-sm font-semibold">{homeTeam.name}</p>
          </div>
          <div className="flex flex-col items-center gap-2 px-6">
            {status === "finished" && homeTeam.score !== undefined && awayTeam.score !== undefined ? (
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold">{homeTeam.score}</span>
                <span className="text-2xl text-muted-foreground">-</span>
                <span className="text-3xl font-bold">{awayTeam.score}</span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">VS</span>
            )}
          </div>
          <div className="flex flex-1 flex-col items-center gap-2">
            {awayTeam.shield ? (
              <img src={awayTeam.shield} alt={awayTeam.name} className="h-16 w-16 rounded-full" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            )}
            <p className="text-center text-sm font-semibold">{awayTeam.name}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2 border-t border-border pt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{field}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
