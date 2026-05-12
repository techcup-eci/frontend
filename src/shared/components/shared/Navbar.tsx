import { LogOut } from "lucide-react";
import { Link, useLocation } from "react-router";
import Badge from "./Badge";
import ThemeToggle from "./ThemeToggle";
import { useAuthStore } from "../../../modules/auth/hooks/useAuthStore";

interface NavbarProps {
	userName?: string;
	role?: string;
	hideActions?: boolean;
}

export default function Navbar({ userName, role, hideActions }: NavbarProps) {
	const location = useLocation();
	const authUser = useAuthStore((state) => state.user);

	const roleLabels: Record<string, string> = {
		participant: "Usuario",
		captain: "Capitán",
		organizer: "Organizador",
		referee: "Árbitro",
		administrator: "Administrador",
	};

	const resolvedRoleKey = role ?? authUser?.role;
	const resolvedRole = resolvedRoleKey ? roleLabels[resolvedRoleKey] ?? resolvedRoleKey : undefined;
	const resolvedUserName = userName ?? authUser?.fullName;
	const isAuthenticated = !!resolvedUserName && !!resolvedRoleKey;
	const isStatsPage = location.pathname === "/stats";
	const isTournamentInfoPage = location.pathname === "/tournament-info";
	const statsAllowedRoles = new Set(["participant", "captain"]);
	const storedEmail = sessionStorage.getItem("playerEmail") ?? "";
	const hasSessionEmail = storedEmail.trim().length > 0;
	const showLogoutOnStats = resolvedRoleKey ? statsAllowedRoles.has(resolvedRoleKey) : hasSessionEmail;
	const showLogoutOnTournamentInfo = isAuthenticated || hasSessionEmail;
	const shouldShowLogoutOnly =
		(isStatsPage && showLogoutOnStats) ||
		(isTournamentInfoPage && showLogoutOnTournamentInfo);
	const allowActions = !hideActions && (!isStatsPage && !isTournamentInfoPage ? true : shouldShowLogoutOnly);

	const handleLogout = () => {
		// Simular logout
		if (resolvedRole?.toLowerCase() === "administrador") {
			window.location.href = "/login?role=admin";
			return;
		}

		window.location.href = "/login";
	};

	return (
		<nav className="border-b border-border bg-gradient-to-r from-black to-[#0D0D0D] px-4 py-0">
			<div className="flex items-center justify-between">
				<Link to="/" className="flex items-center gap-3">
					<img
						src="/images/logo-transparent-background.png"
						alt="TechCup"
						className="h-20 w-auto object-contain"
					/>
				</Link>

				{allowActions && (
					<div className="flex items-center gap-4">
						<ThemeToggle />
						
						{shouldShowLogoutOnly ? (
							<button
								type="button"
								onClick={handleLogout}
								className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
							>
								<LogOut className="h-4 w-4" />
								<span className="text-sm font-medium">Cerrar sesión</span>
							</button>
						) : isAuthenticated ? (
							<>
								<div className="flex items-center gap-3">
									<div className="text-right">
										<p className="font-semibold text-white">{resolvedUserName}</p>
										<Badge variant="info" size="sm">
											{resolvedRole}
										</Badge>
									</div>
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white font-bold">
										{resolvedUserName.charAt(0)}
									</div>
								</div>
								<button
									type="button"
									onClick={handleLogout}
									className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
								>
									<LogOut className="h-4 w-4" />
									<span className="text-sm font-medium">Cerrar sesión</span>
								</button>
							</>
						) : (
							<div className="flex items-center gap-3">
								<Link
									to="/login"
									className="rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
								>
									Iniciar Sesión
								</Link>
								<Link
									to="/register"
									className="rounded-lg bg-[#F97316] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#F97316]/90"
								>
									Regístrate
								</Link>
								<Link
									to="/login?role=admin"
									className="rounded-lg bg-[var(--color-oxblood)] px-4 py-2 text-sm font-semibold text-[var(--color-white-pure)] transition hover:bg-[var(--color-oxblood)]/90"
								>
									Administrador
								</Link>
							</div>
						)}
					</div>
				)}
			</div>
		</nav>
	);
}
