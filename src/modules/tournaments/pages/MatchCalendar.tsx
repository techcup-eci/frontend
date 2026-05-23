import { AlertCircle, Calendar, Loader2, XCircle } from "lucide-react";
import MatchCard from "../../../shared/components/shared/MatchCard";
import { useActiveMatches } from "../../competitions/hooks/useActiveMatches";
import { useActiveTournament } from "../hooks/useActiveTournament";
import { useAllTeams } from "../../teams/hooks/useTeams";
import { useMemo } from "react";

function mapStatus(matchStatus: string): "upcoming" | "live" | "finished" {
	switch (matchStatus) {
		case "SCHEDULED":
			return "upcoming";
		case "IN_PROGRESS":
			return "live";
		case "FINISHED":
			return "finished";
		default:
			return "upcoming";
	}
}

/**
 * Convert a Long team ID (from teams-ms) to UUID format expected by tournament-ms.
 */
function longToUuid(longId: number): string {
  const hex = longId.toString(16).padStart(12, "0");
  return `00000000-0000-0000-0000-${hex}`;
}

export default function MatchCalendar() {
	const { data: activeTournament, isLoading: isLoadingTournament } =
		useActiveTournament();
	const { data: matches = [], isLoading: isLoadingMatches, isError, error } = useActiveMatches();
	const { data: teams = [] } = useAllTeams();

	// Build team name map for resolving UUID -> name
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

	// Sort by scheduledAt chronologically
	const sorted = [...matches].sort(
		(a, b) =>
			new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
	);

	if (isLoadingTournament || isLoadingMatches) {
		return (
			<div className="flex items-center justify-center py-16">
				<div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
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

	return (
		<div className="p-8">
			<div className="mx-auto max-w-7xl space-y-8">
				<div>
					<h1 className="mb-2 text-3xl font-bold">Calendario de Partidos</h1>
					<p className="text-muted-foreground">
						{activeTournament.name} — Cronograma completo de partidos
					</p>
				</div>

				{isError ? (
					<div className="flex flex-col items-center gap-3 py-12 text-center">
						<XCircle className="h-10 w-10 text-destructive/60" />
						<p className="text-muted-foreground">
							{error instanceof Error
								? error.message
								: "No se pudieron cargar los partidos."}
						</p>
					</div>
				) : sorted.length === 0 ? (
					<div className="rounded-xl border border-border bg-card p-12 text-center">
						<Calendar className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
						<p className="text-muted-foreground">
							No hay partidos programados aún
						</p>
					</div>
				) : (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{sorted.map((match) => {
							const date = new Date(match.scheduledAt);
							return (
								<MatchCard
									key={match.id}
									homeTeam={{
										name: getTeamName(match.homeTeamId),
										score:
											match.status === "FINISHED" ? match.homeScore : undefined,
									}}
									awayTeam={{
										name: getTeamName(match.awayTeamId),
										score:
											match.status === "FINISHED" ? match.awayScore : undefined,
									}}
									date={date.toLocaleDateString("es-CO", {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
									time={date.toLocaleTimeString("es-CO", {
										hour: "2-digit",
										minute: "2-digit",
									})}
									field={match.fieldName ?? "Sin asignar"}
									phase={match.round}
									status={mapStatus(match.status)}
								/>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
