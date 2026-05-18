import {
	AlertCircle,
	Calendar,
	Loader2,
	RefreshCw,
	Target,
	Trophy,
} from "lucide-react";
import { useState } from "react";
import {
	useActiveMatchHistory,
	useActiveTopScorers,
} from "../../../modules/competitions/hooks/useActiveStats";
import { useActiveTeamStats } from "../../../modules/competitions/hooks/useActiveTeamStats";
import { useActiveTournament } from "../../../modules/tournaments/hooks/useActiveTournament";

function LoadingState() {
	return (
		<div className="flex items-center justify-center py-20 text-muted-foreground">
			<Loader2 className="mr-2 h-5 w-5 animate-spin" />
			<span>Cargando datos...</span>
		</div>
	);
}

function ErrorState({
	message,
	onRetry,
}: {
	message: string;
	onRetry: () => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-20 text-muted-foreground">
			<AlertCircle className="h-8 w-8 text-destructive" />
			<p className="text-sm">Error al cargar: {message}</p>
			<button
				onClick={onRetry}
				className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent/10 transition"
			>
				<RefreshCw className="h-4 w-4" />
				Reintentar
			</button>
		</div>
	);
}

function NoActiveTournament() {
	return (
		<div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
			<AlertCircle className="h-10 w-10 text-muted-foreground/60" />
			<h2 className="text-xl font-bold">No hay torneo activo</h2>
			<p className="text-muted-foreground">
				No hay ningún torneo activo o en progreso en este momento.
			</p>
		</div>
	);
}

function TopScorersTab() {
	const { data, isLoading, isError, error, refetch } = useActiveTopScorers();

	if (isLoading) return <LoadingState />;
	if (isError)
		return (
			<ErrorState
				message={(error as Error)?.message ?? "Error desconocido"}
				onRetry={refetch}
			/>
		);

	const maxGoals = data?.[0]?.goals ?? 1;

	return (
		<div className="rounded-xl border border-border bg-card p-6">
			<h2 className="mb-6 text-xl font-bold">Top Goleadores</h2>
			{data && data.length === 0 ? (
				<p className="text-center text-muted-foreground py-8">
					No hay goles registrados aún
				</p>
			) : (
				<div className="space-y-4">
					{data?.map((player, idx) => (
						<div
							key={player.playerId}
							className="flex items-center gap-6 rounded-lg border border-border bg-background p-4"
						>
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
								{idx + 1}
							</div>
							<div className="flex-1">
								<p className="font-bold">
									{player.playerName ??
										`Jugador ${player.playerId.slice(0, 8)}…`}
								</p>
								<p className="text-sm text-muted-foreground">
									{player.teamName ?? "Equipo desconocido"}
								</p>
							</div>
							<div className="flex items-center gap-8">
								<div className="text-center">
									<p className="text-2xl font-bold text-primary">
										{player.goals}
									</p>
									<p className="text-xs text-muted-foreground">Goles</p>
								</div>
								<div className="h-2 w-48 overflow-hidden rounded-full bg-border">
									<div
										className="h-full bg-gradient-to-r from-primary to-accent transition-all"
										style={{ width: `${(player.goals / maxGoals) * 100}%` }}
									/>
								</div>
								{player.matchesPlayed !== undefined && (
									<div className="text-center">
										<p className="font-semibold">{player.matchesPlayed}</p>
										<p className="text-xs text-muted-foreground">Partidos</p>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function MatchHistoryTab() {
	const { data, isLoading, isError, error, refetch } = useActiveMatchHistory();

	if (isLoading) return <LoadingState />;
	if (isError)
		return (
			<ErrorState
				message={(error as Error)?.message ?? "Error desconocido"}
				onRetry={refetch}
			/>
		);

	const formatDate = (iso: string) =>
		new Date(iso).toLocaleDateString("es-CO", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});

	return (
		<div className="rounded-xl border border-border bg-card p-6">
			<h2 className="mb-6 text-xl font-bold">Historial de partidos</h2>
			{data && data.length === 0 ? (
				<p className="text-center text-muted-foreground py-8">
					No hay partidos registrados aún
				</p>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="border-b border-border bg-accent/5">
							<tr>
								<th className="px-4 py-3 text-left text-sm font-bold">Fecha</th>
								<th className="px-4 py-3 text-left text-sm font-bold">Ronda</th>
								<th className="px-4 py-3 text-left text-sm font-bold">Local</th>
								<th className="px-4 py-3 text-center text-sm font-bold">
									Resultado
								</th>
								<th className="px-4 py-3 text-left text-sm font-bold">
									Visitante
								</th>
								<th className="px-4 py-3 text-left text-sm font-bold">
									Estado
								</th>
							</tr>
						</thead>
						<tbody>
							{data?.map((match, idx) => (
								<tr
									key={match.matchId}
									className={`border-b border-border ${idx % 2 === 0 ? "bg-background" : ""}`}
								>
									<td className="px-4 py-4 text-sm">
										{formatDate(match.scheduledAt)}
									</td>
									<td className="px-4 py-4 text-sm text-muted-foreground">
										{match.round}
									</td>
									<td className="px-4 py-4 font-semibold">
										{match.homeTeamName ?? match.homeTeamId.slice(0, 8) + "…"}
									</td>
									<td className="px-4 py-4 text-center">
										<span className="rounded-lg bg-primary/10 px-4 py-1 font-bold">
											{match.homeScore ?? "–"} - {match.awayScore ?? "–"}
										</span>
									</td>
									<td className="px-4 py-4 font-semibold">
										{match.awayTeamName ?? match.awayTeamId.slice(0, 8) + "…"}
									</td>
									<td className="px-4 py-4 text-sm text-muted-foreground">
										{match.status}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

function TeamStatsTab() {
	const [teamId, setTeamId] = useState("");
	const [submittedId, setSubmittedId] = useState<string | null>(null);

	const { data, isLoading, isError, error, refetch } =
		useActiveTeamStats(submittedId);

	const goalDiff = data ? data.goalsScored - data.goalsReceived : null;
	const totalMatches = data ? data.wins + data.losses + data.draws : null;

	return (
		<div className="rounded-xl border border-border bg-card p-6">
			<h2 className="mb-6 text-xl font-bold">Estadísticas por equipo</h2>

			<div className="mb-6 flex gap-3">
				<input
					type="text"
					placeholder="UUID del equipo…"
					value={teamId}
					onChange={(e) => setTeamId(e.target.value)}
					className="flex-1 max-w-md rounded-lg border border-border bg-input-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
				/>
				<button
					onClick={() => setSubmittedId(teamId.trim())}
					disabled={!teamId.trim()}
					className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40 hover:opacity-90 transition"
				>
					Buscar
				</button>
			</div>

			{isLoading && <LoadingState />}
			{isError && (
				<ErrorState
					message={(error as Error)?.message ?? "Error desconocido"}
					onRetry={refetch}
				/>
			)}

			{data && (
				<div className="grid gap-6 md:grid-cols-4">
					<div className="rounded-lg border border-border bg-background p-4 text-center">
						<p className="mb-1 text-2xl font-bold">{totalMatches}</p>
						<p className="text-sm text-muted-foreground">Partidos jugados</p>
					</div>
					<div className="rounded-lg border border-border bg-background p-4 text-center">
						<p className="mb-1 text-2xl font-bold text-[#4ADE80]">
							{data.wins}
						</p>
						<p className="text-sm text-muted-foreground">Ganados</p>
					</div>
					<div className="rounded-lg border border-border bg-background p-4 text-center">
						<p className="mb-1 text-2xl font-bold">{data.draws}</p>
						<p className="text-sm text-muted-foreground">Empates</p>
					</div>
					<div className="rounded-lg border border-border bg-background p-4 text-center">
						<p className="mb-1 text-2xl font-bold text-destructive">
							{data.losses}
						</p>
						<p className="text-sm text-muted-foreground">Perdidos</p>
					</div>
					<div className="rounded-lg border border-border bg-background p-4 text-center">
						<p className="mb-1 text-2xl font-bold">{data.goalsScored}</p>
						<p className="text-sm text-muted-foreground">Goles a favor</p>
					</div>
					<div className="rounded-lg border border-border bg-background p-4 text-center">
						<p className="mb-1 text-2xl font-bold">{data.goalsReceived}</p>
						<p className="text-sm text-muted-foreground">Goles en contra</p>
					</div>
					<div className="rounded-lg border border-border bg-background p-4 text-center md:col-span-2">
						<p
							className={`mb-1 text-2xl font-bold ${goalDiff! > 0 ? "text-[#4ADE80]" : goalDiff! < 0 ? "text-destructive" : ""}`}
						>
							{goalDiff! > 0 ? "+" : ""}
							{goalDiff}
						</p>
						<p className="text-sm text-muted-foreground">Diferencia de gol</p>
					</div>
				</div>
			)}
		</div>
	);
}

export default function TournamentStats() {
	const { data: activeTournament, isLoading } = useActiveTournament();
	const [activeTab, setActiveTab] = useState<"scorers" | "history" | "teams">(
		"scorers",
	);

	const tabs = [
		{ id: "scorers" as const, label: "Goleadores", icon: Target },
		{ id: "history" as const, label: "Historial de partidos", icon: Calendar },
		{ id: "teams" as const, label: "Resultados por equipo", icon: Trophy },
	];

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-20 text-muted-foreground">
				<Loader2 className="mr-2 h-5 w-5 animate-spin" />
				<span>Cargando...</span>
			</div>
		);
	}

	if (!activeTournament) {
		return (
			<div className="min-h-screen bg-background">
				<main className="p-8">
					<div className="mx-auto max-w-7xl">
						<NoActiveTournament />
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<main className="p-8">
				<div className="mx-auto max-w-7xl space-y-8">
					<div>
						<h1 className="mb-2 text-3xl font-bold">Estadísticas del Torneo</h1>
						<p className="text-muted-foreground">{activeTournament.name}</p>
					</div>

					<div className="flex gap-2 border-b border-border">
						{tabs.map(({ id, label, icon: Icon }) => (
							<button
								key={id}
								onClick={() => setActiveTab(id)}
								className={`px-6 py-3 font-medium transition ${
									activeTab === id
										? "border-b-2 border-primary text-primary"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								<div className="flex items-center gap-2">
									<Icon className="h-4 w-4" />
									<span>{label}</span>
								</div>
							</button>
						))}
					</div>

					{activeTab === "scorers" && <TopScorersTab />}
					{activeTab === "history" && <MatchHistoryTab />}
					{activeTab === "teams" && <TeamStatsTab />}
				</div>
			</main>
		</div>
	);
}
