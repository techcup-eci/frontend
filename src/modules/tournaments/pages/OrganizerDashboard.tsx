import {
	Calendar,
	CreditCard,
	Home,
	Layers,
	ListChecks,
	Table,
	Trophy,
	Users,
    FileText,
} from "lucide-react";
import { Link } from "react-router";
import Badge from "../../../shared/components/shared/Badge";
import { useGetRegistrations } from "../../registrations/hooks/useRegistrations";

export default function OrganizerDashboard() {
    const { data: registrations, isLoading } = useGetRegistrations();

    // Calculate dynamic stats
    const totalTeams = registrations ? registrations.length : 0;
    const pendingReviews = registrations ? registrations.filter(r => r.status === 'UNDER_REVIEW').length : 0;
    const pendingRegistrationsList = registrations 
        ? registrations.filter(r => r.status === 'UNDER_REVIEW').sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).slice(0, 5)
        : [];

    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) return `Hace ${diffInSeconds} segundos`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `Hace ${diffInMinutes} minutos`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `Hace ${diffInHours} horas`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `Hace ${diffInDays} días`;
    };

	return (
		<div className="flex min-h-screen flex-col">
			<div className="flex flex-1">
				<main className="flex-1 bg-background p-8">
					<div className="mx-auto max-w-7xl space-y-8">
						{/* Bienvenida */}
						<div className="rounded-xl border border-border bg-gradient-to-r from-primary to-primary/80 p-8 text-primary-foreground shadow-lg">
							<div className="flex items-center justify-between">
								<div>
									<h1 className="mb-2 text-3xl font-bold">
										Panel de Organización
									</h1>
									<p className="text-primary-foreground/80">
										TechCup Fútbol 2025-1
									</p>
								</div>
								<Badge variant="finished" size="lg">
									<span className="text-white">Organizador</span>
								</Badge>
							</div>
						</div>

						{/* Métricas principales */}
						<div className="grid gap-6 md:grid-cols-4">
							<div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-transform hover:scale-[1.02]">
								<div className="mb-2 flex items-center gap-3">
									<Trophy className="h-8 w-8 text-primary" />
									<h2 className="font-bold">Torneos activos</h2>
								</div>
								<p className="text-3xl font-bold">1</p>
								<p className="text-sm text-muted-foreground">TechCup 2025-1</p>
							</div>

							<div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-transform hover:scale-[1.02]">
								<div className="mb-2 flex items-center gap-3">
									<Users className="h-8 w-8 text-accent" />
									<h2 className="font-bold">Solicitudes totales</h2>
								</div>
								<p className="text-3xl font-bold">{isLoading ? '-' : totalTeams}</p>
								<p className="text-sm text-muted-foreground">
									Equipos interesados
								</p>
							</div>

							<div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-transform hover:scale-[1.02]">
								<div className="mb-2 flex items-center gap-3">
									<CreditCard className="h-8 w-8 text-[#FACC15]" />
									<h2 className="font-bold">Pagos pendientes</h2>
								</div>
								<p className="text-3xl font-bold">{isLoading ? '-' : pendingReviews}</p>
								<p className="text-sm text-muted-foreground">Por revisar</p>
							</div>

							<div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-transform hover:scale-[1.02]">
								<div className="mb-2 flex items-center gap-3">
									<Calendar className="h-8 w-8 text-[#4ADE80]" />
									<h2 className="font-bold">Partidos esta semana</h2>
								</div>
								<p className="text-3xl font-bold">4</p>
								<p className="text-sm text-muted-foreground">12-18 abril</p>
							</div>
						</div>

						{/* Acción requerida */}
						<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
							<h2 className="mb-6 text-xl font-bold flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                  {pendingReviews > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                Acción requerida: Comprobantes por revisar
                            </h2>
                            
                            {isLoading ? (
                                <div className="flex justify-center py-8 text-muted-foreground">Cargando tareas pendientes...</div>
                            ) : pendingRegistrationsList.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center text-muted-foreground">
                                    <ListChecks className="mb-3 h-12 w-12 opacity-20" />
                                    <p className="text-lg font-medium">¡Todo al día!</p>
                                    <p className="text-sm">No hay comprobantes de pago pendientes por revisar.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingRegistrationsList.map((reg) => (
                                        <div key={reg.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/30">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FACC15]/10">
                                                    <FileText className="h-5 w-5 text-[#FACC15]" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground">
                                                        Equipo: {reg.teamId} <span className="text-muted-foreground font-normal ml-2">ID: {reg.id.split('-')[0]}</span>
                                                    </p>
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        {getRelativeTime(reg.submittedAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link
                                                to={`/organizer/payments?search=${reg.teamId}`}
                                                className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 hover:scale-105"
                                            >
                                                Revisar
                                            </Link>
                                        </div>
                                    ))}
                                    {pendingReviews > 5 && (
                                        <div className="pt-2 text-center">
                                            <Link to="/organizer/payments" className="text-sm font-semibold text-primary hover:underline">
                                                Ver {pendingReviews - 5} solicitudes más...
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
						</div>

						{/* Resumen del torneo */}
						<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
							<h2 className="mb-6 text-xl font-bold">
								Resumen del torneo activo
							</h2>
							<div className="grid gap-6 md:grid-cols-3">
								<div>
									<p className="mb-1 text-sm text-muted-foreground">Nombre</p>
									<p className="font-bold">TechCup 2025-1</p>
								</div>
								<div>
									<p className="mb-1 text-sm text-muted-foreground">
										Fase actual
									</p>
									<Badge variant="progress">Fase de grupos</Badge>
								</div>
								<div>
									<p className="mb-1 text-sm text-muted-foreground">
										Fecha de cierre de inscripciones
									</p>
									<p className="font-bold">28/02/2025</p>
								</div>
								<div>
									<p className="mb-1 text-sm text-muted-foreground">
										Fecha de inicio
									</p>
									<p className="font-bold">15/03/2025</p>
								</div>
								<div>
									<p className="mb-1 text-sm text-muted-foreground">
										Fecha de finalización
									</p>
									<p className="font-bold">30/05/2025</p>
								</div>
								<div>
									<p className="mb-1 text-sm text-muted-foreground">
										Próximo partido
									</p>
									<p className="font-bold">12/04/2025 - 14:00</p>
								</div>
							</div>
						</div>

						{/* Acceso rápido */}
						<div className="grid gap-4 md:grid-cols-4">
							<Link
								to="/organizer/payments"
								className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
							>
								<Users className="mb-3 h-10 w-10 text-primary" />
								<h3 className="mb-2 font-bold">Gestionar pagos</h3>
								<p className="text-sm text-muted-foreground">
									Ver y aprobar inscripciones
								</p>
							</Link>
							<Link
								to="/organizer/schedule"
								className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
							>
								<Calendar className="mb-3 h-10 w-10 text-accent" />
								<h3 className="mb-2 font-bold">Programar partidos</h3>
								<p className="text-sm text-muted-foreground">
									Crear calendario de juegos
								</p>
							</Link>
							<Link
								to="/organizer/standings"
								className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
							>
								<Table className="mb-3 h-10 w-10 text-[#4ADE80]" />
								<h3 className="mb-2 font-bold">Tabla de posiciones</h3>
								<p className="text-sm text-muted-foreground">
									Ver clasificación actual
								</p>
							</Link>
							<Link
								to="/organizer/bracket"
								className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
							>
								<Layers className="mb-3 h-10 w-10 text-[#FACC15]" />
								<h3 className="mb-2 font-bold">Llaves eliminatorias</h3>
								<p className="text-sm text-muted-foreground">
									Gestionar fase final
								</p>
							</Link>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
