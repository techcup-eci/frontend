import { AlertCircle, Trophy, XCircle } from "lucide-react";
import { useMemo } from "react";
import { useActiveStandings } from "../../competitions/hooks/useActiveStandings";
import { useActiveTournament } from "../hooks/useActiveTournament";
import { useAllTeams } from "../../teams/hooks/useTeams";

/**
 * Convert a Long team ID (from teams-ms) to UUID format expected by tournament-ms.
 */
function longToUuid(longId: number): string {
  const hex = longId.toString(16).padStart(12, "0");
  return `00000000-0000-0000-0000-${hex}`;
}

export default function Standings() {
	const { data: activeTournament, isLoading: isLoadingTournament } =
		useActiveTournament();
	const {
		data: standings = [],
		isLoading,
		isError,
		error,
	} = useActiveStandings();
	const { data: teams = [] } = useAllTeams();

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

	// Sort by points descending, then goalDiff descending
	const sorted = [...standings].sort(
		(a, b) => b.points - a.points || b.goalDiff - a.goalDiff,
	);

	if (isLoadingTournament || isLoading) {
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
					<h1 className="mb-2 text-3xl font-bold">Tabla de posiciones</h1>
					<p className="text-muted-foreground">
						{activeTournament.name} — Actualizada automáticamente
					</p>
				</div>

				{isError ? (
					<div className="flex flex-col items-center gap-3 py-12 text-center">
						<XCircle className="h-10 w-10 text-destructive/60" />
						<p className="text-muted-foreground">
							{error instanceof Error
								? error.message
								: "No se pudieron cargar las posiciones."}
						</p>
					</div>
				) : standings.length === 0 ? (
					<div className="rounded-xl border border-border bg-card p-12 text-center">
						<Trophy className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
						<p className="text-muted-foreground">
							No hay partidos registrados aún
						</p>
					</div>
				) : (
					<div className="overflow-hidden rounded-xl border border-border bg-card">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-primary text-primary-foreground">
									<tr>
										<th className="px-4 py-3 text-left">Pos</th>
										<th className="px-4 py-3 text-left">Equipo</th>
										<th className="px-4 py-3 text-center">PJ</th>
										<th className="px-4 py-3 text-center">PG</th>
										<th className="px-4 py-3 text-center">PE</th>
										<th className="px-4 py-3 text-center">PP</th>
										<th className="px-4 py-3 text-center">GF</th>
										<th className="px-4 py-3 text-center">GC</th>
										<th className="px-4 py-3 text-center">DG</th>
										<th className="px-4 py-3 text-center">Pts</th>
									</tr>
								</thead>
								<tbody>
									{sorted.map((row, idx) => {
										const pos = idx + 1;
										return (
											<tr
												key={row.teamId}
												className={`border-t border-border hover:bg-muted/50 ${
													pos <= 4 ? "bg-[#4ADE80]/5" : ""
												}`}
											>
												<td className="px-4 py-3">
													<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
														{pos}
													</div>
												</td>
										<td className="px-4 py-3 font-semibold">
											{getTeamName(row.teamId)}
										</td>
												<td className="px-4 py-3 text-center">{row.played}</td>
												<td className="px-4 py-3 text-center">{row.wins}</td>
												<td className="px-4 py-3 text-center">{row.draws}</td>
												<td className="px-4 py-3 text-center">{row.losses}</td>
												<td className="px-4 py-3 text-center">
													{row.goalsScored}
												</td>
												<td className="px-4 py-3 text-center">
													{row.goalsReceived}
												</td>
												<td
													className={`px-4 py-3 text-center font-semibold ${
														row.goalDiff > 0
															? "text-[#4ADE80]"
															: row.goalDiff < 0
																? "text-destructive"
																: ""
													}`}
												>
													{row.goalDiff > 0 ? "+" : ""}
													{row.goalDiff}
												</td>
												<td className="px-4 py-3 text-center text-xl font-bold">
													{row.points}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				)}

				<div className="rounded-xl border border-border bg-card p-6">
					<h3 className="mb-4 font-bold">Leyenda</h3>
					<div className="flex items-center gap-2">
						<div className="h-4 w-4 rounded bg-[#4ADE80]/20" />
						<span className="text-sm text-muted-foreground">
							Equipos clasificados a cuartos de final (Top 4)
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
