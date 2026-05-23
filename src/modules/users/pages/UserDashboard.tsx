import { BarChart3, Calendar, Trophy, User } from "lucide-react";
import { Link } from "react-router";

export default function UserDashboard() {
	return (
		<div className="flex min-h-screen flex-col">
			<div className="flex flex-1">
				<main className="flex-1 bg-background p-8">
					<div className="mx-auto max-w-7xl space-y-8">
						<div className="rounded-xl border border-border bg-gradient-to-r from-primary to-primary p-8 text-primary-foreground">
							<div className="flex items-center justify-between">
								<div>
									<h1 className="mb-2 text-3xl font-bold">Bienvenido</h1>
									<p className="text-primary-foreground/80">
										Consulta la informacion del torneo.
									</p>
								</div>
								<div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
									<User className="h-4 w-4" />
									Usuario
								</div>
							</div>
						</div>

						<div className="grid gap-6 md:grid-cols-3">
							<Link
								to="/tournament-info"
								className="rounded-xl border border-border bg-card p-6 transition hover:border-primary/40"
							>
								<div className="mb-4 flex items-center gap-3">
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
										<Trophy className="h-6 w-6 text-primary" />
									</div>
									<h2 className="text-xl font-bold">Informacion del torneo</h2>
								</div>
								<p className="text-sm text-muted-foreground">
									Calendario general, reglas y formato.
								</p>
							</Link>

							<Link
								to="/stats"
								className="rounded-xl border border-border bg-card p-6 transition hover:border-primary/40"
							>
								<div className="mb-4 flex items-center gap-3">
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
										<BarChart3 className="h-6 w-6 text-accent" />
									</div>
									<h2 className="text-xl font-bold">Estadisticas</h2>
								</div>
								<p className="text-sm text-muted-foreground">
									Resumen de goles, tarjetas y posiciones.
								</p>
							</Link>

							<Link
								to="/user/teams"
								className="rounded-xl border border-border bg-card p-6 transition hover:border-primary/40"
							>
								<div className="mb-4 flex items-center gap-3">
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4ADE80]/10">
										<Calendar className="h-6 w-6 text-[#4ADE80]" />
									</div>
									<h2 className="text-xl font-bold">Equipos inscritos</h2>
								</div>
								<p className="text-sm text-muted-foreground">
									Consulta los equipos participantes.
								</p>
							</Link>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
