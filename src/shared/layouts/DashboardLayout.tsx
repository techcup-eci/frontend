import {
	BarChart3,
	Calendar,
	CreditCard,
	FileText,
	Home,
	Layers,
	LayoutList,
	ListChecks,
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

const adminSidebar = [
	{
		items: [
			{ label: "Inicio", path: "/admin/dashboard", icon: Home },
			{ label: "Usuarios", path: "/admin/users", icon: Users },
			{ label: "Auditoría", path: "/admin/audit", icon: FileText },
			{ label: "Torneos", path: "/organizer/dashboard", icon: Trophy },
			{ label: "Sistema", path: "/admin/settings", icon: Settings },
		],
	},
];

const refereeSidebar = [
	{
		items: [
			{ label: "Mis Partidos", path: "/referee/dashboard", icon: Calendar },
			{ label: "Alineaciones", path: "/referee/lineups", icon: LayoutList },
		],
	},
];

const playerSidebar = [
	{
		items: [
			{ label: "Inicio", path: "/player/dashboard", icon: Home },
			{ label: "Mi Perfil", path: "/player/profile", icon: User },
			{ label: "Buscar Equipos", path: "/player/teams", icon: Users },
			{ label: "Torneo", path: "/tournament-info", icon: Trophy },
			{ label: "Estadísticas", path: "/stats", icon: BarChart3 },
			{ label: "Disponibilidad", path: "/player/availability", icon: Calendar },
		],
	},
];

const captainSidebar = [
	{
		items: [
			{ label: "Inicio", path: "/captain/dashboard", icon: Home },
			{ label: "Mi Equipo", path: "/captain/manage", icon: Users },
			{
				label: "Buscar Jugadores",
				path: "/captain/search-players",
				icon: UserPlus,
			},
			{ label: "Pagos", path: "/captain/payment", icon: CreditCard },
			{ label: "Alineación", path: "/captain/lineup", icon: LayoutList },
			{ label: "Torneo", path: "/tournament-info", icon: Trophy },
			{ label: "Estadísticas", path: "/stats", icon: BarChart3 },
		],
	},
];

const organizerSidebar = [
	{
		items: [
			{ label: "Inicio", path: "/organizer/dashboard", icon: Home },
			{ label: "Torneos", path: "/organizer/create-tournament", icon: Trophy },
			{ label: "Equipos", path: "/organizer/teams", icon: Users },
			{ label: "Pagos", path: "/organizer/payments", icon: CreditCard },
			{ label: "Partidos", path: "/organizer/schedule", icon: Calendar },
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

export default function DashboardLayout() {
	const location = useLocation();
	const [open, setOpen] = useState(false);

	// Determine sidebar based on current route path
	let currentSidebar = playerSidebar; // default
	let userName = "Usuario";
	let role = "Jugador";

	if (location.pathname.startsWith("/admin")) {
		currentSidebar = adminSidebar;
		userName = "Admin User";
		role = "Admin";
	} else if (location.pathname.startsWith("/organizer")) {
		currentSidebar = organizerSidebar;
		userName = "Organizador";
		role = "Organizador";
	} else if (location.pathname.startsWith("/captain")) {
		currentSidebar = captainSidebar;
		userName = "Capitán Equipo";
		role = "Capitán";
	} else if (location.pathname.startsWith("/referee")) {
		currentSidebar = refereeSidebar;
		userName = "Árbitro Principal";
		role = "Árbitro";
	} else if (location.pathname.startsWith("/player")) {
		currentSidebar = playerSidebar;
		userName = "Jugador";
		role = "Jugador";
	}

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<Navbar userName={userName} role={role} />
			<div className="flex flex-1 overflow-hidden">
				{/* Desktop Sidebar */}
				<div className="hidden md:flex">
					<Sidebar sections={currentSidebar} />
				</div>

				{/* Mobile Sidebar - Accessible via a button in the main content area for this layout */}
				<div className="md:hidden absolute top-[18px] left-4 z-50">
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 bg-black/50 text-white border-none"
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
