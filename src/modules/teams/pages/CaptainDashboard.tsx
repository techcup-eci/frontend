import {
	AlertTriangle,
	Bell,
	CreditCard,
	Loader2,
	Trophy,
	UserPlus,
	Users,
} from "lucide-react";
import { Link } from "react-router";
import Badge from "../../../shared/components/shared/Badge";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { useAllTeams } from "../hooks/useTeams";

export default function CaptainDashboard() {
	const userId = useAuthStore((state) => state.user?.id);
	const { data: teams, isLoading } = useAllTeams();

	const myTeam = teams?.find((t) => t.captainId === userId);

	if (isLoading) {
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
							<Users className="mb-4 h-16 w-16 text-muted-foreground" />
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

	const pendingCount = 0; // Will be populated when requests endpoint is called
	const availableSlots = myTeam.maxPlayers - myTeam.currentPlayers;

	return (
		<div className="flex min-h-screen flex-col">
			<div className="flex flex-1">
				<main className="flex-1 bg-background p-8">
					<div className="mx-auto max-w-7xl space-y-8">
						{/* Bienvenida */}
						<div className="rounded-xl border border-border bg-gradient-to-r from-primary to-primary p-8 text-primary-foreground">
							<div className="flex items-center justify-between">
								<div>
									<h1 className="mb-2 text-3xl font-bold">Panel del Capitán</h1>
									<p className="text-primary-foreground/80">{myTeam.name}</p>
								</div>
								<Badge variant="default" size="lg">
									Capitán
								</Badge>
							</div>
						</div>

						{/* Alerta de pago pendiente */}
						<div className="rounded-xl border border-[#FACC15] bg-[#FACC15]/10 p-6">
							<div className="flex items-start gap-4">
								<AlertTriangle className="h-6 w-6 flex-shrink-0 text-[#FACC15]" />
								<div className="flex-1">
									<p className="mb-2 font-bold text-[#FACC15]">
										Acción requerida
									</p>
									<p className="mb-4 text-sm">
										Tu inscripción aún no ha sido aprobada. Sube el comprobante
										de pago para participar en el torneo.
									</p>
									<Link
										to="/captain/payments"
										className="inline-block rounded-lg bg-[#FACC15] px-4 py-2 font-semibold text-black transition hover:bg-[#FACC15]/90"
									>
										Subir comprobante
									</Link>
								</div>
							</div>
						</div>

						{/* Cards de resumen */}
						<div className="grid gap-6 md:grid-cols-3">
							<div className="rounded-xl border border-border bg-card p-6">
								<div className="mb-2 flex items-center gap-3">
									<Users className="h-8 w-8 text-primary" />
									<h2 className="font-bold">Jugadores</h2>
								</div>
								<p className="text-3xl font-bold">
									{myTeam.currentPlayers} / {myTeam.maxPlayers}
								</p>
								<p className="text-sm text-muted-foreground">
									{availableSlots} cupos disponibles
								</p>
							</div>

							<div className="rounded-xl border border-border bg-card p-6">
								<div className="mb-2 flex items-center gap-3">
									<Bell className="h-8 w-8 text-accent" />
									<h2 className="font-bold">Solicitudes</h2>
								</div>
								<p className="text-3xl font-bold">{pendingCount}</p>
								<p className="text-sm text-muted-foreground">
									Pendientes de revisar
								</p>
							</div>

							<div className="rounded-xl border border-border bg-card p-6">
								<div className="mb-2 flex items-center gap-3">
									<CreditCard className="h-8 w-8 text-[#FACC15]" />
									<h2 className="font-bold">Estado del pago</h2>
								</div>
								<Badge variant="review">En revisión</Badge>
							</div>
						</div>

						{/* Accesos rápidos */}
						<div className="grid gap-4 md:grid-cols-2">
							<Link
								to="/captain/search-players"
								className="rounded-xl border border-border bg-card p-6 transition hover:shadow-lg"
							>
								<UserPlus className="mb-3 h-10 w-10 text-accent" />
								<h3 className="mb-2 font-bold">Buscar jugadores</h3>
								<p className="text-sm text-muted-foreground">
									Invitar nuevos miembros
								</p>
							</Link>
							<Link
								to="/captain/manage-team"
								className="rounded-xl border border-border bg-card p-6 transition hover:shadow-lg"
							>
								<Bell className="mb-3 h-10 w-10 text-primary" />
								<h3 className="mb-2 font-bold">Solicitudes y equipo</h3>
								<p className="text-sm text-muted-foreground">
									Gestionar tu equipo y solicitudes
								</p>
							</Link>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
