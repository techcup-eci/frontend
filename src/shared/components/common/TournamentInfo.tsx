import { AlertCircle, Calendar, Loader2, MapPin } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useActiveMatches } from "../../../modules/competitions/hooks/useActiveMatches";
import { useActiveStandings } from "../../../modules/competitions/hooks/useActiveStandings";
import { useActiveMatchHistory } from "../../../modules/competitions/hooks/useActiveStats";
import { useActiveTournament } from "../../../modules/tournaments/hooks/useActiveTournament";

export default function TournamentInfo() {
	const {
		data: activeTournament,
		isLoading: isLoadingTournament,
		isError: isTournamentError,
		error: tournamentError,
	} = useActiveTournament();
	const {
		data: matchHistory,
		isLoading: isLoadingMatches,
		isError: isMatchHistoryError,
		error: matchHistoryError,
	} = useActiveMatchHistory();
	const {
		data: standings,
		isLoading: isLoadingStandings,
		isError: isStandingsError,
		error: standingsError,
	} = useActiveStandings();
	const { data: matches, isError: isMatchesError, error: matchesError } =
		useActiveMatches();

	// Show sonner toast on errors
	useEffect(() => {
		if (isTournamentError) {
			toast.error(
				"Error al cargar el torneo: " +
					(tournamentError instanceof Error
						? tournamentError.message
						: "Error desconocido"),
			);
		}
	}, [isTournamentError, tournamentError]);

	useEffect(() => {
		if (isMatchHistoryError) {
			toast.error(
				"Error al cargar el historial: " +
					(matchHistoryError instanceof Error
						? matchHistoryError.message
						: "Error desconocido"),
			);
		}
	}, [isMatchHistoryError, matchHistoryError]);

	useEffect(() => {
		if (isStandingsError) {
			toast.error(
				"Error al cargar posiciones: " +
					(standingsError instanceof Error
						? standingsError.message
						: "Error desconocido"),
			);
		}
	}, [isStandingsError, standingsError]);

	useEffect(() => {
		if (isMatchesError) {
			toast.error(
				"Error al cargar partidos: " +
					(matchesError instanceof Error
						? matchesError.message
						: "Error desconocido"),
			);
		}
	}, [isMatchesError, matchesError]);

	const isLoading =
		isLoadingTournament || isLoadingMatches || isLoadingStandings;

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background">
				<main className="p-8">
					<div className="mx-auto max-w-4xl flex items-center justify-center py-20">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
					</div>
				</main>
			</div>
		);
	}

	if (!activeTournament) {
		return (
			<div className="min-h-screen bg-background">
				<main className="p-8">
					<div className="mx-auto max-w-4xl">
						<div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
							<AlertCircle className="h-10 w-10 text-muted-foreground/60" />
							<h2 className="text-xl font-bold">No hay torneo activo</h2>
							<p className="text-muted-foreground">
								No hay ningún torneo activo o en progreso en este momento.
							</p>
						</div>
					</div>
				</main>
			</div>
		);
	}

	const finishedMatches =
		matchHistory?.filter((m) => m.status === "FINISHED") ?? [];
	const upcomingMatches =
		matches?.filter((m) => m.status === "SCHEDULED") ?? [];

	// Build timeline from tournament dates
	const timeline = [
		{
			date: new Date(activeTournament.startDate).toLocaleDateString("es-CO", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			}),
			event: "Inicio del torneo",
			status:
				activeTournament.status === "IN_PROGRESS" ||
				activeTournament.status === "FINISHED"
					? "completed"
					: "active",
		},
		{
			date: new Date(activeTournament.registrationCloseDate).toLocaleDateString(
				"es-CO",
				{ day: "2-digit", month: "2-digit", year: "numeric" },
			),
			event: "Cierre de inscripciones",
			status:
				activeTournament.status === "ACTIVE" ||
				activeTournament.status === "IN_PROGRESS" ||
				activeTournament.status === "FINISHED"
					? "completed"
					: "pending",
		},
		{
			date: new Date(activeTournament.endDate).toLocaleDateString("es-CO", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			}),
			event: "Final del torneo",
			status: activeTournament.status === "FINISHED" ? "completed" : "pending",
		},
	];

	const statusLabel = (status: string) => {
		switch (status) {
			case "DRAFT":
				return "Borrador";
			case "ACTIVE":
				return "Activo";
			case "IN_PROGRESS":
				return "En Progreso";
			case "FINISHED":
				return "Finalizado";
			default:
				return status;
		}
	};

	const statusColor = (status: string) => {
		switch (status) {
			case "DRAFT":
				return "bg-[#6B7280]/10 text-[#6B7280]";
			case "ACTIVE":
				return "bg-primary/10 text-primary";
			case "IN_PROGRESS":
				return "bg-[#4ADE80]/10 text-[#4ADE80]";
			case "FINISHED":
				return "bg-[#6B7280]/10 text-[#6B7280]";
			default:
				return "bg-[#6B7280]/10 text-[#6B7280]";
		}
	};

	return (
		<div className="min-h-screen bg-background">
			<main className="p-8">
				<div className="mx-auto max-w-4xl space-y-8">
					<div>
						<h1 className="mb-2 text-3xl font-bold">Información del Torneo</h1>
						<p className="text-muted-foreground">{activeTournament.name}</p>
					</div>

					{/* Tournament Info Card */}
					<div className="rounded-xl border border-border bg-card p-8">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-bold">{activeTournament.name}</h2>
							<span
								className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(activeTournament.status)}`}
							>
								{statusLabel(activeTournament.status)}
							</span>
						</div>

						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<div className="rounded-lg border border-border bg-background p-4">
								<p className="text-sm text-muted-foreground mb-1">
									Fecha de inicio
								</p>
								<p className="font-semibold">
									{new Date(activeTournament.startDate).toLocaleDateString(
										"es-CO",
										{ day: "2-digit", month: "long", year: "numeric" },
									)}
								</p>
							</div>
							<div className="rounded-lg border border-border bg-background p-4">
								<p className="text-sm text-muted-foreground mb-1">
									Fecha de finalización
								</p>
								<p className="font-semibold">
									{new Date(activeTournament.endDate).toLocaleDateString(
										"es-CO",
										{ day: "2-digit", month: "long", year: "numeric" },
									)}
								</p>
							</div>
							<div className="rounded-lg border border-border bg-background p-4">
								<p className="text-sm text-muted-foreground mb-1">Equipos</p>
								<p className="font-semibold">
									{activeTournament.maxTeams} máx.
								</p>
							</div>
							<div className="rounded-lg border border-border bg-background p-4">
								<p className="text-sm text-muted-foreground mb-1">
									Costo por equipo
								</p>
								<p className="font-semibold">
									${activeTournament.cost?.toLocaleString("es-CO")}
								</p>
							</div>
						</div>
					</div>

					{/* Reglamento */}
					{activeTournament.regulationsUrl && (
						<div className="rounded-xl border border-border bg-card p-8">
							<h2 className="mb-4 text-2xl font-bold">Reglamento</h2>
							<a
								href={activeTournament.regulationsUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								Ver reglamento del torneo →
							</a>
						</div>
					)}

					{/* Fechas importantes */}
					<div className="rounded-xl border border-border bg-card p-8">
						<h2 className="mb-6 text-2xl font-bold">Fechas importantes</h2>
						<div className="space-y-4">
							{timeline.map((item, idx) => (
								<div key={idx} className="flex items-start gap-4">
									<div
										className={`flex h-10 w-10 items-center justify-center rounded-full ${
											item.status === "completed"
												? "bg-[#4ADE80]/10 text-[#4ADE80]"
												: item.status === "active"
													? "bg-primary/10 text-primary"
													: "bg-[#6B7280]/10 text-[#6B7280]"
										}`}
									>
										<Calendar className="h-5 w-5" />
									</div>
									<div className="flex-1">
										<p className="font-bold">{item.event}</p>
										<p className="text-sm text-muted-foreground">{item.date}</p>
									</div>
									{item.status === "active" && (
										<span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
											En curso
										</span>
									)}
									{item.status === "completed" && (
										<span className="rounded-full bg-[#4ADE80]/10 px-3 py-1 text-xs font-semibold text-[#4ADE80]">
											Completado
										</span>
									)}
								</div>
							))}
						</div>
					</div>

					{/* Resumen de partidos */}
					<div className="rounded-xl border border-border bg-card p-8">
						<h2 className="mb-6 text-2xl font-bold">Resumen de partidos</h2>
						<div className="grid gap-4 md:grid-cols-3">
							<div className="rounded-lg border border-border bg-background p-4 text-center">
								<p className="text-3xl font-bold text-primary">
									{finishedMatches.length}
								</p>
								<p className="text-sm text-muted-foreground">
									Partidos jugados
								</p>
							</div>
							<div className="rounded-lg border border-border bg-background p-4 text-center">
								<p className="text-3xl font-bold text-[#4ADE80]">
									{upcomingMatches.length}
								</p>
								<p className="text-sm text-muted-foreground">
									Próximos partidos
								</p>
							</div>
							<div className="rounded-lg border border-border bg-background p-4 text-center">
								<p className="text-3xl font-bold">{standings?.length ?? 0}</p>
								<p className="text-sm text-muted-foreground">
									Equipos inscritos
								</p>
							</div>
						</div>
					</div>

					{/* Historial de partidos recientes */}
					{finishedMatches.length > 0 && (
						<div className="rounded-xl border border-border bg-card p-8">
							<h2 className="mb-6 text-2xl font-bold">Últimos resultados</h2>
							<div className="space-y-3">
								{finishedMatches.slice(0, 5).map((match) => (
									<div
										key={match.matchId}
										className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
									>
										<div className="flex items-center gap-4">
											<span className="text-sm text-muted-foreground">
												{match.round}
											</span>
											<span className="font-semibold">
												{match.homeTeamId?.slice(0, 8) ?? "Local"}
											</span>
											<span className="rounded-lg bg-primary/10 px-3 py-1 font-bold">
												{match.homeScore ?? 0} - {match.awayScore ?? 0}
											</span>
											<span className="font-semibold">
												{match.awayTeamId?.slice(0, 8) ?? "Visitante"}
											</span>
										</div>
										<span className="text-sm text-muted-foreground">
											{new Date(match.scheduledAt).toLocaleDateString("es-CO", {
												day: "2-digit",
												month: "short",
											})}
										</span>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Tabla de posiciones resumen */}
					{standings && standings.length > 0 && (
						<div className="rounded-xl border border-border bg-card p-8">
							<h2 className="mb-6 text-2xl font-bold">Tabla de posiciones</h2>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="border-b border-border bg-accent/5">
										<tr>
											<th className="px-4 py-3 text-left text-sm font-bold">
												Pos
											</th>
											<th className="px-4 py-3 text-left text-sm font-bold">
												Equipo
											</th>
											<th className="px-4 py-3 text-center text-sm font-bold">
												PJ
											</th>
											<th className="px-4 py-3 text-center text-sm font-bold">
												PG
											</th>
											<th className="px-4 py-3 text-center text-sm font-bold">
												PE
											</th>
											<th className="px-4 py-3 text-center text-sm font-bold">
												PP
											</th>
											<th className="px-4 py-3 text-center text-sm font-bold">
												Pts
											</th>
										</tr>
									</thead>
									<tbody>
										{standings.slice(0, 8).map((row, idx) => (
											<tr key={row.teamId} className="border-b border-border">
												<td className="px-4 py-3">
													<div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
														{idx + 1}
													</div>
												</td>
												<td className="px-4 py-3 font-semibold">
													{row.teamId?.slice(0, 8) ?? "Equipo"}
												</td>
												<td className="px-4 py-3 text-center">{row.played}</td>
												<td className="px-4 py-3 text-center">{row.wins}</td>
												<td className="px-4 py-3 text-center">{row.draws}</td>
												<td className="px-4 py-3 text-center">{row.losses}</td>
												<td className="px-4 py-3 text-center font-bold">
													{row.points}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
