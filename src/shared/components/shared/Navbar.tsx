import { LogOut } from "lucide-react";
import { Link, useLocation } from "react-router";
import Badge from "./Badge";
import ThemeToggle from "./ThemeToggle";
import { useAuthStore } from "../../../modules/auth/hooks/useAuthStore";
import { logout as logoutService } from "../../../modules/auth/services/authService";

interface NavbarProps {
	userName?: string;
	role?: string;
	hideActions?: boolean;
}

export default function Navbar({ userName, role, hideActions }: NavbarProps) {
	const location = useLocation();
	const authUser = useAuthStore((state) => state.user);
	const accessToken = useAuthStore((state) => state.accessToken);

	const roleLabels: Record<string, string> = {
		player: "Jugador",
		captain: "Capitán",
		organizer: "Organizador",
		referee: "Árbitro",
		admin: "Administrador",
		invited: "Invitado",
	};

	const resolvedRoleKey = role ?? authUser?.role;
	const resolvedRole = resolvedRoleKey ? (roleLabels[resolvedRoleKey] ?? resolvedRoleKey) : undefined;
	const resolvedUserName = userName ?? authUser?.name;
	const isAuthenticated = !!(accessToken && resolvedUserName && resolvedRoleKey);
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
	const allowActions =
		!hideActions && (!isStatsPage && !isTournamentInfoPage ? true : shouldShowLogoutOnly);

	const handleLogout = async () => {
		try {
			await logoutService();
		} catch {
			// Proceed with local cleanup even if API fails
		}
		useAuthStore.getState().setUnauthenticated();
		sessionStorage.removeItem("playerEmail");
		window.location.href = "/login";
	};

	return (
		<nav className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-black to-[#0D0D0D] px-4 py-0">
			<div className="flex items-center justify-between">
				<Link to="/" className="flex items-center gap-3 shrink-0">
					<img
						src="/images/logo-transparent-background.png"
						alt="TechCup"
						className="h-16 w-auto object-contain md:h-20"
					/>
				</Link>

				{allowActions && (
					<div className="flex items-center gap-2 md:gap-4">
						<ThemeToggle />

						{shouldShowLogoutOnly ? (
							<button
								type="button"
								onClick={handleLogout}
								className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-white text-sm transition hover:bg-white/20 md:px-4"
							>
								<LogOut className="h-4 w-4" />
								<span className="hidden sm:inline text-sm font-medium">Cerrar sesión</span>
							</button>
						) : isAuthenticated ? (
							<>
								<div className="hidden md:flex items-center gap-3">
									<div className="text-right">
										<p className="font-semibold text-white text-sm">{resolvedUserName}</p>
										<Badge variant="info" size="sm">
											{resolvedRole}
										</Badge>
									</div>
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white font-bold">
										{resolvedUserName.charAt(0)}
									</div>
								</div>
								{/* Mobile: just avatar + logout */}
								<div className="flex md:hidden items-center gap-2">
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white font-bold text-sm">
										{resolvedUserName.charAt(0)}
									</div>
								</div>
								<button
									type="button"
									onClick={handleLogout}
									className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-white text-sm transition hover:bg-white/20 md:px-4"
								>
									<LogOut className="h-4 w-4" />
									<span className="hidden sm:inline text-sm font-medium">Cerrar sesión</span>
								</button>
							</>
						) : (
							<div className="flex items-center gap-1 md:gap-3">
								<Link
									to="/login"
									className="rounded-lg px-2 py-2 text-xs md:text-sm font-medium text-white transition hover:bg-white/10 md:px-4"
								>
									Iniciar Sesión
								</Link>
								<Link
									to="/register"
									className="rounded-lg bg-[#F97316] px-2 py-2 text-xs md:text-sm font-medium text-white transition hover:bg-[#F97316]/90 md:px-4"
								>
									Regístrate
								</Link>
								<Link
									to="/login?role=admin"
									className="hidden sm:inline-flex rounded-lg bg-[var(--color-oxblood)] px-4 py-2 text-sm font-semibold text-[var(--color-white-pure)] transition hover:bg-[var(--color-oxblood)]/90"
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
