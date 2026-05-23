import {
	BarChart3,
	Bell,
	Calendar,
	CreditCard,
	FileText,
	Home,
	Layers,
	ListChecks,
	Mail,
	Menu,
	Settings,
	Shield,
	Table,
	Trophy,
	User,
	UserPlus,
	Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { useAuthStore } from "../../modules/auth/hooks/useAuthStore";
import { useAllTeams } from "../../modules/teams/hooks/useTeams";
import Navbar from "../components/shared/Navbar";
import Sidebar from "../components/shared/Sidebar";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";

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
			{
				label: "Crear Torneo",
				path: "/organizer/create-tournament",
				icon: Trophy,
			},
			{ label: "Equipos", path: "/organizer/teams", icon: Users },
			{ label: "Pagos", path: "/organizer/payments", icon: CreditCard },
			{
				label: "Programar Partidos",
				path: "/organizer/schedule",
				icon: Calendar,
			},
			{ label: "Resultados", path: "/organizer/calendar", icon: ListChecks },
			{
				label: "Tabla de Posiciones",
				path: "/organizer/standings",
				icon: Table,
			},
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
			{
				label: "Buscar Jugadores",
				path: "/captain/search-players",
				icon: UserPlus,
			},
			{ label: "Pagos", path: "/captain/payments", icon: CreditCard },
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
const playerSidebarBase = [
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
			{
				label: "Volverme Jugador",
				path: "/player/profile/becomePlayer",
				icon: UserPlus,
			},
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
	player: playerSidebarBase,
	invited: invitedSidebar,
};

export default function DashboardLayout() {
	const location = useLocation();
	const [open, setOpen] = useState(false);
	const authUser = useAuthStore((state) => state.user);
	const { data: teams = [] } = useAllTeams();

	const userRole = authUser?.role ?? "invited";
	const roleLabel = ROLE_LABELS[userRole] ?? userRole;
	const userName = authUser?.name ?? "Usuario";

	// Find if player/captain is on a team
	const myTeam = useMemo(() => {
		if (!authUser?.id) return null;
		return (
			teams.find(
				(t) => t.captainId === authUser.id || t.players.includes(authUser.id),
			) ?? null
		);
	}, [teams, authUser?.id]);

	// Build player sidebar dynamically
	const playerSidebar = useMemo(() => {
		const items = [
			{ label: "Inicio", path: "/player/dashboard", icon: Home },
			{ label: "Mi Perfil", path: "/player/profile", icon: User },
		];
		// Add "Mi Equipo" if player is on a team
		if (myTeam) {
			items.push({
				label: "Mi Equipo",
				path: `/player/teams/${myTeam.id}`,
				icon: Shield,
			});
		}
		items.push(
			{ label: "Buscar Equipos", path: "/player/teams", icon: Users },
			{ label: "Invitaciones", path: "/player/invitations", icon: Mail },
			{ label: "Torneo", path: "/tournament-info", icon: Trophy },
			{ label: "Estadísticas", path: "/tournament-stats", icon: BarChart3 },
		);
		return [{ items }];
	}, [myTeam]);

	// Pick sidebar by role — fallback to invited if unknown
	const currentSidebar =
		userRole === "player"
			? playerSidebar
			: (SIDEBAR_MAP[userRole] ?? invitedSidebar);

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
