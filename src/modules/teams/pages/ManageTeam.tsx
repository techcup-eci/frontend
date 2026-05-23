import { Edit2, Loader2, Save, UserMinus, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import Badge from "../../../shared/components/shared/Badge";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import {
	getUserById,
	type UserProfile,
} from "../../players/services/userService";
import { useActiveTournament } from "../../tournaments/hooks/useActiveTournament";
import {
	useAcceptRequest,
	useAllTeams,
	usePendingRequests,
	useRejectRequest,
	useRemovePlayer,
	useUpdateTeamName,
} from "../hooks/useTeams";

export default function ManageTeam() {
	const userId = useAuthStore((state) => state.user?.id);
	const { data: teams, isLoading: loadingTeams } = useAllTeams();
	const { data: activeTournament } = useActiveTournament();

	// Find the team where the current user is captain
	const myTeam = useMemo(() => {
		if (!userId || !teams) return null;
		return teams.find((t) => t.captainId === userId) ?? null;
	}, [teams, userId]);

	const isTournamentActive =
		activeTournament?.status === "ACTIVE" ||
		activeTournament?.status === "IN_PROGRESS";

	if (loadingTeams) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!myTeam) {
		return (
			<div className="flex min-h-screen flex-col">
				<main className="flex-1 bg-background p-8">
					<div className="mx-auto max-w-7xl">
						<div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
							<Users className="mb-4 h-16 w-16 text-muted-foreground/40" />
							<h3 className="mb-2 text-xl font-bold">No tienes un equipo</h3>
							<p className="mb-4 text-muted-foreground">
								Crea un equipo para comenzar a gestionar tu torneo
							</p>
							<Link
								to="/captain/create-team"
								className="rounded-lg bg-[var(--color-oxblood)] px-6 py-3 font-semibold text-white transition hover:bg-opacity-90"
							>
								Crear equipo
							</Link>
						</div>
					</div>
				</main>
			</div>
		);
	}

	return <TeamContent team={myTeam} isTournamentActive={isTournamentActive} />;
}

// ── Sub-component with team loaded ──────────────────────────────────────

function TeamContent({
	team,
	isTournamentActive,
}: {
	team: NonNullable<ReturnType<typeof useAllTeams>["data"]>[number];
	isTournamentActive: boolean;
}) {
	const { data: requests, isLoading: reqLoading } = usePendingRequests(team.id);
	const accept = useAcceptRequest(team.id);
	const reject = useRejectRequest(team.id);
	const updateName = useUpdateTeamName(team.id);
	const removePlayer = useRemovePlayer(team.id);

	const [editingName, setEditingName] = useState(false);
	const [nameValue, setNameValue] = useState(team.name);

	// Debug: log team data to see what's coming from backend
	console.log(
		"[ManageTeam] team.players:",
		team.players,
		"captainId:",
		team.captainId,
		"captainId type:",
		typeof team.captainId,
	);
	console.log("[ManageTeam] requests:", requests);

	// Fetch player profiles (for both accepted players AND pending requests)
	const [playerProfiles, setPlayerProfiles] = useState<
		Map<number, UserProfile>
	>(new Map());
	const [loadingPlayers, setLoadingPlayers] = useState(true);

	// Combine player IDs from both accepted players and pending requests
	const allPlayerIds = useMemo(() => {
		const ids = new Set(team.players);
		if (requests) {
			for (const rid of requests) ids.add(rid);
		}
		return Array.from(ids);
	}, [team.players, requests]);

	useEffect(() => {
		let cancelled = false;
		const fetchProfiles = async () => {
			setLoadingPlayers(true);
			const map = new Map<number, UserProfile>();
			console.log(
				"[ManageTeam] Fetching profiles for player IDs:",
				allPlayerIds,
			);
			const results = await Promise.allSettled(
				allPlayerIds.map(async (pid) => {
					try {
						const profile = await getUserById(pid);
						console.log(`[ManageTeam] Profile for player ${pid}:`, profile);
						return { pid, profile };
					} catch (err) {
						console.warn(
							`[ManageTeam] Failed to fetch profile for player ${pid}:`,
							err,
						);
						return { pid, profile: null };
					}
				}),
			);
			if (!cancelled) {
				for (const result of results) {
					if (result.status === "fulfilled" && result.value.profile) {
						console.log(
							`[ManageTeam] Storing profile for pid=${result.value.pid}: name=${result.value.profile.name}`,
						);
						map.set(result.value.pid, result.value.profile);
					}
				}
				console.log(
					"[ManageTeam] Final playerProfiles map keys:",
					Array.from(map.keys()),
				);
				setPlayerProfiles(map);
				setLoadingPlayers(false);
			}
		};
		fetchProfiles();
		return () => {
			cancelled = true;
		};
	}, [team.players, requests]);

	const handleSaveName = async () => {
		const trimmed = nameValue.trim();
		if (trimmed.length < 3) {
			toast.error("El nombre debe tener al menos 3 caracteres");
			return;
		}
		try {
			await updateName.mutateAsync({ name: trimmed });
			setEditingName(false);
		} catch {
			setNameValue(team.name);
		}
	};

	const availableSlots = team.maxPlayers - team.currentPlayers;

	return (
		<div className="flex min-h-screen flex-col">
			<div className="flex flex-1">
				<main className="flex-1 bg-background p-8">
					<div className="mx-auto max-w-7xl space-y-8">
						{/* Header */}
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex-1">
								{editingName ? (
									<div className="flex items-center gap-2">
										<input
											type="text"
											value={nameValue}
											onChange={(e) => setNameValue(e.target.value)}
											className="flex-1 rounded-lg border border-border bg-input-background px-4 py-2 text-xl font-bold focus:border-primary focus:outline-none"
											autoFocus
											onKeyDown={(e) => {
												if (e.key === "Enter") handleSaveName();
												if (e.key === "Escape") {
													setNameValue(team.name);
													setEditingName(false);
												}
											}}
										/>
										<button
											onClick={handleSaveName}
											disabled={updateName.isPending}
											className="rounded-lg bg-[var(--color-oxblood)] p-2 text-white transition hover:bg-opacity-90 disabled:opacity-50"
										>
											<Save className="h-5 w-5" />
										</button>
										<button
											onClick={() => {
												setNameValue(team.name);
												setEditingName(false);
											}}
											className="rounded-lg border border-border bg-background p-2 transition hover:bg-accent"
										>
											<X className="h-5 w-5" />
										</button>
									</div>
								) : (
									<div className="flex items-center gap-3">
										<h1 className="text-3xl font-bold">{team.name}</h1>
										{!isTournamentActive && (
											<button
												onClick={() => setEditingName(true)}
												className="rounded-lg border border-border bg-background p-1.5 transition hover:bg-accent"
												title="Editar nombre"
											>
												<Edit2 className="h-4 w-4 text-muted-foreground" />
											</button>
										)}
									</div>
								)}
								<p className="text-muted-foreground">
									Código de equipo:{" "}
									<span className="font-mono font-bold">{team.code}</span>
								</p>
								{team.warning && (
									<p className="mt-1 text-sm font-medium text-amber-600">
										⚠ {team.warning}
									</p>
								)}
							</div>
							<div className="flex gap-3">
								<div className="rounded-xl border border-border bg-card px-6 py-3 text-center">
									<p className="text-sm text-muted-foreground">Jugadores</p>
									<p className="text-2xl font-bold">
										{team.currentPlayers} / {team.maxPlayers}
									</p>
								</div>
								<div className="rounded-xl border border-border bg-card px-6 py-3 text-center">
									<p className="text-sm text-muted-foreground">Estado</p>
									<Badge
										variant={
											team.tournamentStatus === "NONE" ? "info" : "warning"
										}
										size="lg"
									>
										{team.tournamentStatus === "NONE"
											? "Sin torneo"
											: team.tournamentStatus}
									</Badge>
								</div>
							</div>
						</div>

						{/* Players */}
						<div className="rounded-xl border border-border bg-card p-6">
							<h2 className="mb-6 text-xl font-bold">Jugadores del equipo</h2>
							{loadingPlayers ? (
								<div className="flex items-center gap-3 py-4">
									<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
									<p className="text-sm text-muted-foreground">
										Cargando jugadores...
									</p>
								</div>
							) : team.players.length === 0 ? (
								<div className="py-8 text-center">
									<Users className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
									<p className="text-muted-foreground">
										No hay jugadores en el equipo aún. ¡Comienza a buscar
										jugadores!
									</p>
								</div>
							) : (
								<div className="space-y-2">
								{team.players.map((playerId) => {
									const profile = playerProfiles.get(playerId);
									const isCaptain = playerId === team.captainId;
									console.log(
										`[ManageTeam] Render Player ${playerId}: profile.name=${profile?.name ?? "null"}, isCaptain=${isCaptain}`,
									);
									return (
											<div
												key={playerId}
												className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
											>
												<div className="flex items-center gap-4">
													<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
														<span className="text-sm font-bold text-primary">
															{profile?.name?.charAt(0)?.toUpperCase() ?? "?"}
														</span>
													</div>
													<div>
														<p className="font-semibold">
															{profile?.name ?? `Jugador #${playerId}`}
														</p>
														<p className="text-sm text-muted-foreground">
															{profile?.academicProgram
																? `${profile.academicProgram}${profile?.semester ? ` · Semestre ${profile.semester}` : ""}`
																: profile?.email
																	? profile.email
																	: "Sin perfil deportivo"}
														</p>
													</div>
												</div>
												<div className="flex items-center gap-2">
													{isCaptain && <Badge variant="active">Capitán</Badge>}
													{!isCaptain && !isTournamentActive && (
														<button
															onClick={() => {
																const playerName =
																	profile?.name ?? `Jugador #${playerId}`;
																if (
																	confirm(
																		`¿Estás seguro de remover a ${playerName} del equipo?`,
																	)
																) {
																	removePlayer.mutate(playerId);
																}
															}}
															disabled={removePlayer.isPending}
															className="flex items-center gap-1 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-1.5 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
														>
															<UserMinus className="h-4 w-4" /> Remover
														</button>
													)}
													{isTournamentActive && !isCaptain && (
														<span className="text-xs text-muted-foreground">
															No se pueden remover jugadores durante el torneo
														</span>
													)}
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>

						{/* Pending Requests */}
						<div className="rounded-xl border border-border bg-card p-6">
							<div className="mb-6 flex items-center justify-between">
								<h2 className="text-xl font-bold">Solicitudes de ingreso</h2>
								<span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
									{reqLoading ? "..." : (requests?.length ?? 0)} pendientes
								</span>
							</div>
							{!requests || requests.length === 0 ? (
								<p className="text-muted-foreground">
									No hay solicitudes pendientes.
								</p>
							) : (
								<div className="space-y-3">
									{requests.map((playerId) => {
										const profile = playerProfiles.get(playerId);
										return (
											<div
												key={playerId}
												className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
											>
												<div className="flex items-center gap-4">
													<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
														<span className="text-sm font-bold text-primary">
															{profile?.name?.charAt(0)?.toUpperCase() ?? "?"}
														</span>
													</div>
													<div>
														<p className="font-bold">
															{profile?.name ?? `Jugador #${playerId}`}
														</p>
														<p className="text-sm text-muted-foreground">
															{profile?.academicProgram
																? profile.academicProgram
																: profile?.email
																	? profile.email
																	: "Sin perfil deportivo"}
														</p>
													</div>
												</div>
												<div className="flex gap-2">
													<button
														onClick={() => accept.mutate(playerId)}
														disabled={accept.isPending}
														className="flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
													>
														Aceptar
													</button>
													<button
														onClick={() => reject.mutate(playerId)}
														disabled={reject.isPending}
														className="flex items-center gap-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-accent"
													>
														Rechazar
													</button>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>

						{/* Search players CTA */}
						{availableSlots > 0 && (
							<div className="rounded-lg border-2 border-dashed border-border bg-accent/5 p-8 text-center">
								<Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
								<h3 className="mb-2 font-bold">¿Necesitas más jugadores?</h3>
								<p className="mb-4 text-sm text-muted-foreground">
									Tienes {availableSlots} cupos disponibles
								</p>
								<Link
									to="/captain/search-players"
									className="inline-block rounded-lg bg-[var(--color-oxblood)] px-6 py-3 font-semibold text-white transition hover:bg-opacity-90"
								>
									Buscar jugadores
								</Link>
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
