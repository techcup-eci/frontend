import { LogOut } from "lucide-react";
import { Link } from "react-router";
import Badge from "./Badge";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
	userName?: string;
	role?: string;
	hideActions?: boolean;
}

export default function Navbar({ userName, role, hideActions }: NavbarProps) {
	const handleLogout = () => {
		// Simular logout
		if (role?.toLowerCase() === "admin") {
			window.location.href = "/login?role=admin";
			return;
		}

		window.location.href = "/login";
	};

	return (
		<nav className="border-b border-border bg-gradient-to-r from-black to-[#0D0D0D] px-8 py-4">
			<div className="flex items-center justify-between">
				<Link to="/" className="flex items-center gap-3">
					<img
						src="/images/logo-techcup.jpg"
						alt="TechCup"
						className="h-12 w-12 rounded-full border border-white/20 object-cover"
					/>
				</Link>

				{!hideActions && (
					<div className="flex items-center gap-4">
						<ThemeToggle />
						
						{userName && role ? (
							<>
								<div className="flex items-center gap-3">
									<div className="text-right">
										<p className="font-semibold text-white">{userName}</p>
										<Badge variant="info" size="sm">
											{role}
										</Badge>
									</div>
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white font-bold">
										{userName.charAt(0)}
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
