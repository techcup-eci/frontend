import {
	BarChart3,
	Bell,
	Calendar,
	CreditCard,
	FileText,
	Home,
	Layers,
	LayoutList,
	ListChecks,
	Mail,
	Menu,
	Settings,
	Table,
	Trophy,
	User,
	UserPlus,
	Users,
} from "lucide-react";
import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "../components/shared/Navbar";
import Sidebar from "../components/shared/Sidebar";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { useAuthStore } from "../../modules/auth/hooks/useAuthStore";

// ── Admin ─────────────────────────────────────────────────────────────────────
const adminSidebar = [
	{
		items: [
			{ label: "Inicio", path: "/admin/dashboard", icon: Home },
			{ label: "Usuarios", path: "/admin/players", icon: Users },
			{ label: "Auditoría", path: "/admin/audit", icon: FileText },
		],
	},
];

// ── Organizer ─────────────────────────────────────────────────────────────────
const organizerSidebar = [
	{
		items: [
			{ label: "Inicio", path: "/organizer/dashboard", icon: Home },
			{ label: "Mi Perfil", path: "/organizer/profile", icon: User },
			{ label: "Crear Torneo", path: "/organizer/create-tournament", icon: Trophy },
			{ label: "Equipos", path: "/organizer/teams", icon: Users },
			{ label: "Pagos", path: "/organizer/payments", icon: CreditCard },
			{ label: "Programar Partidos", path: "/organizer/schedule", icon: Calendar },
			{ label: "Resultados", path: "/organizer/calendar", icon: ListChecks },
			{ label: "Tabla de Posiciones", path: "/organizer/standings", icon: Table },
			{ label: "Llaves", path: "/organizer/bracket", icon: Layers },
		],
	},
];

// ── Captain ───────────────────────────────────────────────────────────────────
const captainSidebar = [
	{
		items: [
			{ label: "Inicio", path: "/captain/dashboard", icon: Home },
			{ label: "Mi Equipo", path: "/captain/manage-team", icon: Users },
			{ label: "Buscar Jugadores", path: "/captain/search-players", icon: UserPlus },
			{ label: "Solicitudes", path: "/captain/requests", icon: Bell },
			{ label: "Pagos", path: "/captain/payment", icon: CreditCard },
			{ label: "Alineación", path: "/captain/lineup", icon: LayoutList },
			{ label: "Torneo", path: "/tournament-info", icon: Trophy },
			{ label: "Estadísticas", path: "/tournament-stats", icon: BarChart3 },
		],
	},
];

// ── Referee ───────────────────────────────────────────────────────────────────
const refereeSidebar = [
	{
		items: [
			{ label: "Mis Partidos", path: "/referee/dashboard", icon: Calendar },
		],
	},
];

// ── Player ────────────────────────────────────────────────────────────────────
const playerSidebar = [
	{
		items: [
			{ label: "Inicio", path: "/player/dashboard", icon: Home },
			{ label: "Mi Perfil", path: "/player/profile", icon: User },
			{ label: "Buscar Equipos", path: "/player/teams", icon: Users },
			{ label: "Invitaciones", path: "/player/invitations", icon: Mail },
			{ label: "Torneo", path: "/tournament-info", icon: Trophy },
			{ label: "Estadísticas", path: "/tournament-stats", icon: BarChart3 },
		],
	},
];

// ── Invited (no es jugador aún) ───────────────────────────────────────────────
const invitedSidebar = [
	{
		items: [
			{ label: "Inicio", path: "/user/dashboard", icon: Home },
			{ label: "Mi Perfil", path: "/user/profile", icon: User },
			{ label: "Volverme Jugador", path: "/player/profile/becomePlayer", icon: UserPlus },
			{ label: "Torneo", path: "/tournament-info", icon: Trophy },
		],
	},
];

// ── Role label mapping (auth store values → display labels) ───────────────────
const ROLE_LABELS: Record<string, string> = {
	admin: "Administrador",
	organizer: "Organizador",
	captain: "Capitán",
	referee: "Árbitro",
	player: "Jugador",
	invited: "Invitado",
};

// ── Sidebar registry ─────────────────────────────────────────────────────────
const SIDEBAR_MAP: Record<string, object[]> = {
	admin: adminSidebar,
	organizer: organizerSidebar,
	captain: captainSidebar,
	referee: refereeSidebar,
	player: playerSidebar,
	invited: invitedSidebar,
};

export default function DashboardLayout() {
	const location = useLocation();
	const [open, setOpen] = useState(false);
	const authUser = useAuthStore((state) => state.user);

	const userRole = authUser?.role ?? "invited";
	const roleLabel = ROLE_LABELS[userRole] ?? userRole;
	const userName = authUser?.name ?? "Usuario";

	// Pick sidebar by role — fallback to invited if unknown
	const currentSidebar = SIDEBAR_MAP[userRole] ?? invitedSidebar;

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<Navbar userName={userName} role={roleLabel} />
			<div className="flex flex-1 overflow-hidden">
				{/* Desktop Sidebar */}
				<div className="hidden md:flex">
					<Sidebar sections={currentSidebar} />
				</div>

				{/* Mobile Sidebar */}
				<div className="md:hidden absolute top-[18px] left-4 z-50">
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 bg-background/80 text-foreground border-border shadow-sm backdrop-blur-sm"
							>
								<Menu className="h-4 w-4" />
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="p-0 w-64">
							<Sidebar sections={currentSidebar} />
						</SheetContent>
					</Sheet>
				</div>

				<main className="flex-1 overflow-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
