import { LogOut, Trophy } from "lucide-react";
import { Link } from "react-router";
import Badge from "./Badge";

interface NavbarProps {
	userName?: string;
	role?: string;
}

export default function Navbar({ userName, role }: NavbarProps) {
	const handleLogout = () => {
		// Simular logout
		window.location.href = "/login";
	};

	return (
		<nav className="border-b border-border bg-gradient-to-r from-black to-[#0D0D0D] px-8 py-4">
			<div className="flex items-center justify-between">
				<Link to="/" className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
						<Trophy className="h-6 w-6 text-black" />
					</div>
					<span className="text-2xl font-black text-white">TechCup</span>
				</Link>

				<div className="flex items-center gap-4">
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
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}
