import { Check, Loader2, UserPlus, Users, X } from "lucide-react";
import { useParams } from "react-router";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import {
	useAcceptRequest,
	useAllTeams,
	usePendingRequests,
	useRejectRequest,
	useTeam,
} from "../hooks/useTeams";

export default function PendingRequests() {
	const userId = useAuthStore((state) => state.user?.id);
	const { data: teams } = useAllTeams();
	const myTeam = teams?.find((t) => t.captainId === userId);
	const teamId = myTeam?.id ?? 0;

	const { data: team, isLoading } = useTeam(teamId);
	const { data: requests, isLoading: reqLoading } = usePendingRequests(teamId);
	const accept = useAcceptRequest(teamId);
	const reject = useRejectRequest(teamId);

	if (!myTeam && !isLoading) {
		return (
			<div className="flex min-h-screen flex-col">
				<main className="flex-1 bg-background p-8">
					<div className="mx-auto max-w-7xl">
						<div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
							<Users className="mb-4 h-16 w-16 text-muted-foreground" />
							<h3 className="mb-2 text-xl font-bold">No tienes un equipo</h3>
							<p className="text-muted-foreground">
								Crea un equipo primero para ver solicitudes
							</p>
						</div>
					</div>
				</main>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col">
			<div className="flex flex-1">
				<main className="flex-1 bg-background p-8">
					<div className="mx-auto max-w-7xl space-y-8">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<h1 className="mb-2 text-3xl font-bold">
									Solicitudes pendientes
								</h1>
								<p className="text-muted-foreground">
									Jugadores que quieren unirse a {team?.name ?? "tu equipo"}
								</p>
							</div>
							<div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2">
								<UserPlus className="h-5 w-5 text-primary" />
								<span className="text-sm font-medium">
									{reqLoading ? "..." : (requests?.length ?? 0)} pendiente
									{(requests?.length ?? 0) !== 1 ? "s" : ""}
								</span>
							</div>
						</div>

						{!requests || requests.length === 0 ? (
							<div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
								<Users className="mb-4 h-16 w-16 text-muted-foreground" />
								<h3 className="mb-2 text-xl font-bold">
									No hay solicitudes pendientes
								</h3>
								<p className="text-muted-foreground">
									Los jugadores que soliciten unirse aparecerán aquí
								</p>
							</div>
						) : (
							<div className="space-y-3">
								{requests.map((playerId) => (
									<div
										key={playerId}
										className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
									>
										<div className="flex items-center gap-4">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
												<UserPlus className="h-5 w-5 text-primary" />
											</div>
											<p className="font-bold">Jugador #{playerId}</p>
										</div>
										<div className="flex gap-2">
											<button
												onClick={() => accept.mutate(playerId)}
												disabled={accept.isPending}
												className="flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
											>
												<Check className="h-4 w-4" /> Aceptar
											</button>
											<button
												onClick={() => reject.mutate(playerId)}
												disabled={reject.isPending}
												className="flex items-center gap-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-accent"
											>
												<X className="h-4 w-4" /> Rechazar
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
