import { AlertCircle, Loader2, Target, XCircle } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useMatchDetail } from "../../competitions/hooks/useMatchDetail";
import { useReportResult } from "../../competitions/hooks/useReportResult";
import type { MatchResultRequest } from "../../competitions/types/competition";
import { useActiveTournament } from "../hooks/useActiveTournament";
import { useAllTeams } from "../../teams/hooks/useTeams";

type PlayerGoal = {
	key: string;
	playerId: string;
	teamId: string;
	minute: number;
	goalType: string;
};

type PlayerCard = {
	key: string;
	playerId: string;
	teamId: string;
	type: string;
	minute: number;
};

/**
 * Convert a Long team ID (from teams-ms) to UUID format expected by tournament-ms.
 */
function longToUuid(longId: number): string {
  const hex = longId.toString(16).padStart(12, "0");
  return `00000000-0000-0000-0000-${hex}`;
}

export default function RegisterResult() {
	const { id: matchId } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { data: activeTournament, isLoading: isLoadingTournament } =
		useActiveTournament();
	const { data: teams = [] } = useAllTeams();

	const tournamentId = activeTournament?.id ?? "";

	const {
		data: match,
		isLoading,
		isError,
		error,
	} = useMatchDetail(tournamentId, matchId ?? "");
	const reportMutation = useReportResult(tournamentId, matchId ?? "");

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

	const [homeScore, setHomeScore] = useState<number>(0);
	const [awayScore, setAwayScore] = useState<number>(0);
	const [homeGoals, setHomeGoals] = useState<PlayerGoal[]>([]);
	const [awayGoals, setAwayGoals] = useState<PlayerGoal[]>([]);
	const [homeCards, setHomeCards] = useState<PlayerCard[]>([]);
	const [awayCards, setAwayCards] = useState<PlayerCard[]>([]);

	useEffect(() => {
		if (match) {
			setHomeScore(match.homeScore); // eslint-disable-line react-hooks/set-state-in-effect
			setAwayScore(match.awayScore);
		}
	}, [match]);

	const homeTeamId = match?.homeTeamId ?? "";
	const awayTeamId = match?.awayTeamId ?? "";

	const addHomeGoal = () => {
		const key = `hg-${Date.now()}`;
		setHomeGoals([
			...homeGoals,
			{ key, playerId: "", teamId: homeTeamId, minute: 0, goalType: "GOAL" },
		]);
	};

	const addAwayGoal = () => {
		const key = `ag-${Date.now()}`;
		setAwayGoals([
			...awayGoals,
			{ key, playerId: "", teamId: awayTeamId, minute: 0, goalType: "GOAL" },
		]);
	};

	const addHomeCard = () => {
		const key = `hc-${Date.now()}`;
		setHomeCards([
			...homeCards,
			{ key, playerId: "", teamId: homeTeamId, type: "YELLOW", minute: 0 },
		]);
	};

	const addAwayCard = () => {
		const key = `ac-${Date.now()}`;
		setAwayCards([
			...awayCards,
			{ key, playerId: "", teamId: awayTeamId, type: "YELLOW", minute: 0 },
		]);
	};

	const updateHomeGoal = (
		key: string,
		field: keyof PlayerGoal,
		value: string | number,
	) => {
		setHomeGoals(
			homeGoals.map((g) => (g.key === key ? { ...g, [field]: value } : g)),
		);
	};

	const updateAwayGoal = (
		key: string,
		field: keyof PlayerGoal,
		value: string | number,
	) => {
		setAwayGoals(
			awayGoals.map((g) => (g.key === key ? { ...g, [field]: value } : g)),
		);
	};

	const updateHomeCard = (
		key: string,
		field: keyof PlayerCard,
		value: string | number,
	) => {
		setHomeCards(
			homeCards.map((c) => (c.key === key ? { ...c, [field]: value } : c)),
		);
	};

	const updateAwayCard = (
		key: string,
		field: keyof PlayerCard,
		value: string | number,
	) => {
		setAwayCards(
			awayCards.map((c) => (c.key === key ? { ...c, [field]: value } : c)),
		);
	};

	const removeHomeGoal = (key: string) => {
		setHomeGoals(homeGoals.filter((g) => g.key !== key));
	};

	const removeAwayGoal = (key: string) => {
		setAwayGoals(awayGoals.filter((g) => g.key !== key));
	};

	const removeHomeCard = (key: string) => {
		setHomeCards(homeCards.filter((c) => c.key !== key));
	};

	const removeAwayCard = (key: string) => {
		setAwayCards(awayCards.filter((c) => c.key !== key));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const totalHomeGoals = homeGoals.reduce(
			(sum, g) => sum + (Number(g.minute) > 0 ? 1 : 0),
			0,
		);
		const totalAwayGoals = awayGoals.reduce(
			(sum, g) => sum + (Number(g.minute) > 0 ? 1 : 0),
			0,
		);

		if (totalHomeGoals !== homeScore || totalAwayGoals !== awayScore) {
			toast.error(
				"La cantidad de goles por jugador no coincide con el marcador final. Por favor verifica los datos.",
			);
			return;
		}

		const payload: MatchResultRequest = {
			homeScore,
			awayScore,
			goals: [
				...homeGoals
					.filter((g) => g.playerId && Number(g.minute) > 0)
					.map((g) => ({
						playerId: g.playerId,
						teamId: g.teamId,
						minute: Number(g.minute),
						goalType: g.goalType,
					})),
				...awayGoals
					.filter((g) => g.playerId && Number(g.minute) > 0)
					.map((g) => ({
						playerId: g.playerId,
						teamId: g.teamId,
						minute: Number(g.minute),
						goalType: g.goalType,
					})),
			],
			cards: [
				...homeCards
					.filter((c) => c.playerId && Number(c.minute) > 0)
					.map((c) => ({
						playerId: c.playerId,
						teamId: c.teamId,
						type: c.type,
						minute: Number(c.minute),
					})),
				...awayCards
					.filter((c) => c.playerId && Number(c.minute) > 0)
					.map((c) => ({
						playerId: c.playerId,
						teamId: c.teamId,
						type: c.type,
						minute: Number(c.minute),
					})),
			],
		};

		reportMutation.mutate(payload, {
			onSuccess: () => toast.success("Resultado registrado exitosamente"),
			onError: (err: unknown) => {
				const message =
					(
						err as {
							response?: { data?: { message?: string } };
							message?: string;
						}
					)?.response?.data?.message ||
					(err as Error)?.message ||
					"No se pudo registrar el resultado";
				toast.error(message);
			},
		});
	};

	if (isLoadingTournament || isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<p className="text-muted-foreground">
						Cargando información del partido...
					</p>
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
						<button
							onClick={() => navigate("/organizer/dashboard")}
							className="mt-4 rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground"
						>
							Volver al panel
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (isError || !match) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<div className="flex flex-col items-center gap-3 text-center">
					<XCircle className="h-10 w-10 text-destructive/60" />
					<p className="text-muted-foreground">
						{error instanceof Error
							? error.message
							: "No se pudo cargar la información del partido."}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="p-8">
			<div className="mx-auto max-w-7xl space-y-8">
				<div>
					<h1 className="mb-2 text-3xl font-bold">
						Registrar resultado del partido
					</h1>
					<p className="text-muted-foreground">
						Ingresa el marcador y las estadísticas del partido
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-8">
					{/* Información del partido */}
					<div className="rounded-xl border border-border bg-card p-6">
						<h2 className="mb-6 text-xl font-bold">Información del partido</h2>
						<div className="mb-6 rounded-lg border-2 border-primary bg-gradient-to-r from-primary/10 to-accent/10 p-6">
							<div className="grid gap-4 md:grid-cols-2">
								<div>
									<p className="mb-2 text-sm text-muted-foreground">Fecha</p>
									<p className="font-semibold">
										{new Date(match.scheduledAt).toLocaleDateString("es-CO", {
											weekday: "long",
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</p>
								</div>
								<div>
									<p className="mb-2 text-sm text-muted-foreground">Cancha</p>
									<p className="font-semibold">
										{match.fieldName ?? "No asignada"}
									</p>
								</div>
							</div>
						</div>

						{/* Marcador */}
						<div className="grid items-center gap-4 md:grid-cols-[1fr,auto,1fr]">
							<div className="text-center">
								<p className="mb-3 text-lg font-bold">{getTeamName(match.homeTeamId)}</p>
								<input
									type="number"
									min="0"
									max="20"
									required
									value={homeScore}
									onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
									className="w-24 rounded-lg border border-border bg-input-background px-4 py-3 text-center text-3xl font-bold focus:border-primary focus:outline-none"
								/>
							</div>

							<div className="text-4xl font-bold text-muted-foreground">-</div>

							<div className="text-center">
								<p className="mb-3 text-lg font-bold">{getTeamName(match.awayTeamId)}</p>
								<input
									type="number"
									min="0"
									max="20"
									required
									value={awayScore}
									onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
									className="w-24 rounded-lg border border-border bg-input-background px-4 py-3 text-center text-3xl font-bold focus:border-primary focus:outline-none"
								/>
							</div>
						</div>
					</div>

					{/* Estadísticas por equipo */}
					<div className="grid gap-8 lg:grid-cols-2">
						{/* Equipo local */}
						<div className="rounded-xl border border-border bg-card p-6">
							<h2 className="mb-6 text-xl font-bold">{getTeamName(match.homeTeamId)}</h2>

							<div className="mb-6">
								<div className="mb-3 flex items-center justify-between">
									<h3 className="flex items-center gap-2 font-semibold">
										<Target className="h-4 w-4" />
										Goles (
										{
											homeGoals.filter(
												(g) => g.playerId && Number(g.minute) > 0,
											).length
										}
										)
									</h3>
									<button
										type="button"
										onClick={addHomeGoal}
										className="rounded-lg bg-accent px-3 py-1 text-sm font-medium transition hover:bg-accent/80"
									>
										+ Agregar gol
									</button>
								</div>
								<div className="space-y-2">
									{homeGoals.map((goal) => (
										<div
											key={goal.key}
											className="flex items-center gap-2 rounded-lg border border-border bg-background p-3"
										>
											<input
												type="text"
												placeholder="Player ID"
												value={goal.playerId}
												onChange={(e) =>
													updateHomeGoal(goal.key, "playerId", e.target.value)
												}
												className="flex-1 rounded border border-border bg-input-background px-2 py-1 text-sm focus:border-primary focus:outline-none"
											/>
											<input
												type="number"
												placeholder="Min"
												min={0}
												max={120}
												value={goal.minute || ""}
												onChange={(e) =>
													updateHomeGoal(
														goal.key,
														"minute",
														parseInt(e.target.value) || 0,
													)
												}
												className="w-16 rounded border border-border bg-input-background px-2 py-1 text-center text-sm focus:border-primary focus:outline-none"
											/>
											<button
												type="button"
												onClick={() => removeHomeGoal(goal.key)}
												className="rounded p-1 text-[#EF4444] transition hover:bg-[#EF4444]/10"
											>
												×
											</button>
										</div>
									))}
									{homeGoals.length === 0 && (
										<p className="text-sm text-muted-foreground">
											Sin goles registrados
										</p>
									)}
								</div>
							</div>

							<div>
								<div className="mb-3 flex items-center justify-between">
									<h3 className="flex items-center gap-2 font-semibold">
										<AlertCircle className="h-4 w-4" />
										Tarjetas ({homeCards.length})
									</h3>
									<button
										type="button"
										onClick={addHomeCard}
										className="rounded-lg bg-accent px-3 py-1 text-sm font-medium transition hover:bg-accent/80"
									>
										+ Agregar tarjeta
									</button>
								</div>
								<div className="space-y-2">
									{homeCards.map((card) => (
										<div
											key={card.key}
											className="flex items-center gap-2 rounded-lg border border-border bg-background p-3"
										>
											<input
												type="text"
												placeholder="Player ID"
												value={card.playerId}
												onChange={(e) =>
													updateHomeCard(card.key, "playerId", e.target.value)
												}
												className="flex-1 rounded border border-border bg-input-background px-2 py-1 text-sm focus:border-primary focus:outline-none"
											/>
											<select
												value={card.type}
												onChange={(e) =>
													updateHomeCard(card.key, "type", e.target.value)
												}
												className="rounded border border-border bg-input-background px-2 py-1 text-sm focus:border-primary focus:outline-none"
											>
												<option value="YELLOW">Amarilla</option>
												<option value="RED">Roja</option>
											</select>
											<input
												type="number"
												placeholder="Min"
												min={0}
												max={120}
												value={card.minute || ""}
												onChange={(e) =>
													updateHomeCard(
														card.key,
														"minute",
														parseInt(e.target.value) || 0,
													)
												}
												className="w-16 rounded border border-border bg-input-background px-2 py-1 text-center text-sm focus:border-primary focus:outline-none"
											/>
											<button
												type="button"
												onClick={() => removeHomeCard(card.key)}
												className="rounded p-1 text-[#EF4444] transition hover:bg-[#EF4444]/10"
											>
												×
											</button>
										</div>
									))}
									{homeCards.length === 0 && (
										<p className="text-sm text-muted-foreground">
											Sin tarjetas registradas
										</p>
									)}
								</div>
							</div>
						</div>

						{/* Equipo visitante */}
						<div className="rounded-xl border border-border bg-card p-6">
							<h2 className="mb-6 text-xl font-bold">{getTeamName(match.awayTeamId)}</h2>

							<div className="mb-6">
								<div className="mb-3 flex items-center justify-between">
									<h3 className="flex items-center gap-2 font-semibold">
										<Target className="h-4 w-4" />
										Goles (
										{
											awayGoals.filter(
												(g) => g.playerId && Number(g.minute) > 0,
											).length
										}
										)
									</h3>
									<button
										type="button"
										onClick={addAwayGoal}
										className="rounded-lg bg-accent px-3 py-1 text-sm font-medium transition hover:bg-accent/80"
									>
										+ Agregar gol
									</button>
								</div>
								<div className="space-y-2">
									{awayGoals.map((goal) => (
										<div
											key={goal.key}
											className="flex items-center gap-2 rounded-lg border border-border bg-background p-3"
										>
											<input
												type="text"
												placeholder="Player ID"
												value={goal.playerId}
												onChange={(e) =>
													updateAwayGoal(goal.key, "playerId", e.target.value)
												}
												className="flex-1 rounded border border-border bg-input-background px-2 py-1 text-sm focus:border-primary focus:outline-none"
											/>
											<input
												type="number"
												placeholder="Min"
												min={0}
												max={120}
												value={goal.minute || ""}
												onChange={(e) =>
													updateAwayGoal(
														goal.key,
														"minute",
														parseInt(e.target.value) || 0,
													)
												}
												className="w-16 rounded border border-border bg-input-background px-2 py-1 text-center text-sm focus:border-primary focus:outline-none"
											/>
											<button
												type="button"
												onClick={() => removeAwayGoal(goal.key)}
												className="rounded p-1 text-[#EF4444] transition hover:bg-[#EF4444]/10"
											>
												×
											</button>
										</div>
									))}
									{awayGoals.length === 0 && (
										<p className="text-sm text-muted-foreground">
											Sin goles registrados
										</p>
									)}
								</div>
							</div>

							<div>
								<div className="mb-3 flex items-center justify-between">
									<h3 className="flex items-center gap-2 font-semibold">
										<AlertCircle className="h-4 w-4" />
										Tarjetas ({awayCards.length})
									</h3>
									<button
										type="button"
										onClick={addAwayCard}
										className="rounded-lg bg-accent px-3 py-1 text-sm font-medium transition hover:bg-accent/80"
									>
										+ Agregar tarjeta
									</button>
								</div>
								<div className="space-y-2">
									{awayCards.map((card) => (
										<div
											key={card.key}
											className="flex items-center gap-2 rounded-lg border border-border bg-background p-3"
										>
											<input
												type="text"
												placeholder="Player ID"
												value={card.playerId}
												onChange={(e) =>
													updateAwayCard(card.key, "playerId", e.target.value)
												}
												className="flex-1 rounded border border-border bg-input-background px-2 py-1 text-sm focus:border-primary focus:outline-none"
											/>
											<select
												value={card.type}
												onChange={(e) =>
													updateAwayCard(card.key, "type", e.target.value)
												}
												className="rounded border border-border bg-input-background px-2 py-1 text-sm focus:border-primary focus:outline-none"
											>
												<option value="YELLOW">Amarilla</option>
												<option value="RED">Roja</option>
											</select>
											<input
												type="number"
												placeholder="Min"
												min={0}
												max={120}
												value={card.minute || ""}
												onChange={(e) =>
													updateAwayCard(
														card.key,
														"minute",
														parseInt(e.target.value) || 0,
													)
												}
												className="w-16 rounded border border-border bg-input-background px-2 py-1 text-center text-sm focus:border-primary focus:outline-none"
											/>
											<button
												type="button"
												onClick={() => removeAwayCard(card.key)}
												className="rounded p-1 text-[#EF4444] transition hover:bg-[#EF4444]/10"
											>
												×
											</button>
										</div>
									))}
									{awayCards.length === 0 && (
										<p className="text-sm text-muted-foreground">
											Sin tarjetas registradas
										</p>
									)}
								</div>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<button
							type="submit"
							disabled={reportMutation.isPending}
							className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
						>
							{reportMutation.isPending ? "Guardando..." : "Guardar resultado"}
						</button>
						<button
							type="button"
							onClick={() => navigate(-1)}
							className="rounded-lg border border-border bg-background px-6 py-3 font-semibold transition hover:bg-accent"
						>
							Cancelar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
