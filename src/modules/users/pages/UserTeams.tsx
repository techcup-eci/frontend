import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useAllTeams } from "../../teams/hooks/useTeams";

export default function UserTeams() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: teams, isLoading, error } = useAllTeams();

  const filtered = teams?.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Equipos</h1>
        <p className="text-muted-foreground">Explora los equipos del torneo</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar equipo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-border bg-[var(--color-mist)] py-3 pl-10 pr-4 focus:border-[var(--color-cool-sky)] focus:outline-none"
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <p className="text-center text-muted-foreground">Error al cargar equipos.</p>
      )}

      {filtered && filtered.length === 0 && (
        <p className="text-center text-muted-foreground">No se encontraron equipos.</p>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered?.map((team) => (
          <div key={team.id}
            className="rounded-xl border border-border bg-card p-6 transition hover:shadow-md">
            <div className="mb-4 flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: team.colors + "20" }}
              >
                <span className="text-xl font-bold" style={{ color: team.colors }}>
                  {team.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-bold">{team.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {team.currentPlayers}/{team.maxPlayers} jugadores
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                team.tournamentStatus === "ACTIVE" || team.tournamentStatus === "IN_PROGRESS"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {team.tournamentStatus === "NONE" ? "Sin torneo" : team.tournamentStatus}
              </span>
              <span className="text-xs text-muted-foreground">Código: {team.code}</span>
            </div>
            {team.warning && (
              <p className="mt-3 text-xs font-medium text-amber-600">⚠ {team.warning}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
