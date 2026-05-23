import { Link } from "react-router";
import {
	Trophy,
	Users,
	Shield,
	BarChart3,
	Calendar,
	Star,
	ArrowRight,
	LogIn,
	UserPlus,
} from "lucide-react";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-white text-[#101828]">
			{/* ── Navbar ─────────────────────────────────────────────── */}
			<nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
				<div className="flex items-center gap-3">
					<Link to="/" className="flex items-center gap-3">
						<img
							src="/images/logo-transparent-background.png"
							alt="TechCup"
							className="h-10 w-auto object-contain"
						/>
					</Link>
					<span className="text-xl font-bold tracking-tight">
							TechCup <span className="text-[#990000]">Fútbol</span>
						</span>
					</div>
					<div className="flex items-center gap-3">
						<Link
							to="/login"
							className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-[#101828] transition hover:bg-gray-50"
						>
							<LogIn className="h-4 w-4" />
							Iniciar sesión
						</Link>
						<Link
							to="/register"
							className="flex items-center gap-2 rounded-lg bg-[#990000] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7a0000]"
						>
							<UserPlus className="h-4 w-4" />
							Registrarme
						</Link>
					</div>
				</div>
			</nav>

			{/* ── Hero ───────────────────────────────────────────────── */}
			<section className="relative overflow-hidden bg-white">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(153,0,0,0.06),transparent_50%)]" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(72,172,240,0.06),transparent_50%)]" />
				<div className="relative mx-auto max-w-6xl px-6 py-24 md:py-36">
					<div className="mx-auto max-w-3xl text-center">
						<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600">
							<Trophy className="h-4 w-4 text-[#990000]" />
							Torneo semestral de fútbol — ECI
						</div>
						<h1 className="mb-6 text-5xl font-black leading-tight tracking-tight text-[#101828] md:text-7xl">
							El torneo que une al{" "}
							<span className="bg-gradient-to-r from-[#990000] to-[#48acf0] bg-clip-text text-transparent">
								campus
							</span>
						</h1>
						<p className="mb-10 text-lg text-gray-500 md:text-xl">
							Plataforma digital para gestionar el torneo de fútbol de los
							programas de Ingeniería de Sistemas, IA, Ciberseguridad y
							Estadística de la Escuela Colombiana de Ingeniería.
						</p>
						<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
							<Link
								to="/register"
								className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#990000] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#990000]/20 transition hover:bg-[#7a0000] sm:w-auto"
							>
								<UserPlus className="h-5 w-5" />
								Crear mi cuenta
								<ArrowRight className="h-4 w-4" />
							</Link>
							<Link
								to="/login"
								className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-[#101828] transition hover:bg-gray-50 sm:w-auto"
							>
								<LogIn className="h-5 w-5" />
								Iniciar sesión
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* ── Features ───────────────────────────────────────────── */}
			<section className="border-t border-gray-100 bg-gray-50/50 py-20">
				<div className="mx-auto max-w-6xl px-6">
					<div className="mb-12 text-center">
						<h2 className="mb-3 text-3xl font-bold text-[#101828]">
							¿Qué puedes hacer en TechCup?
						</h2>
						<p className="text-gray-500">
							Todo lo que necesitas para vivir el torneo, en un solo lugar.
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-3">
						<div className="rounded-2xl border border-gray-100 bg-white p-8 transition hover:shadow-lg">
							<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#990000]/10">
								<Users className="h-6 w-6 text-[#990000]" />
							</div>
							<h3 className="mb-2 text-lg font-bold">Crea y gestiona tu equipo</h3>
							<p className="text-sm text-gray-500">
								Forma tu equipo, busca jugadores por posición y administra
								tu plantilla de forma sencilla.
							</p>
						</div>
						<div className="rounded-2xl border border-gray-100 bg-white p-8 transition hover:shadow-lg">
							<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#48acf0]/10">
								<Calendar className="h-6 w-6 text-[#48acf0]" />
							</div>
							<h3 className="mb-2 text-lg font-bold">Sigue el calendario</h3>
							<p className="text-sm text-gray-500">
								Consulta fechas, horarios y canchas de cada partido.
								Nunca te pierdas un juego.
							</p>
						</div>
						<div className="rounded-2xl border border-gray-100 bg-white p-8 transition hover:shadow-lg">
							<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#990000]/10">
								<BarChart3 className="h-6 w-6 text-[#990000]" />
							</div>
							<h3 className="mb-2 text-lg font-bold">Estadísticas en vivo</h3>
							<p className="text-sm text-gray-500">
								Tabla de posiciones, goleadores, llaves eliminatorias y
								historial completo del torneo.
							</p>
						</div>
						<div className="rounded-2xl border border-gray-100 bg-white p-8 transition hover:shadow-lg">
							<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#48acf0]/10">
								<Shield className="h-6 w-6 text-[#48acf0]" />
							</div>
							<h3 className="mb-2 text-lg font-bold">Inscripción y pagos</h3>
							<p className="text-sm text-gray-500">
								Inscribe tu equipo al torneo, sube comprobantes de pago
								y recibe aprobación del organizador.
							</p>
						</div>
						<div className="rounded-2xl border border-gray-100 bg-white p-8 transition hover:shadow-lg">
							<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#990000]/10">
								<Star className="h-6 w-6 text-[#990000]" />
							</div>
							<h3 className="mb-2 text-lg font-bold">Perfil deportivo</h3>
							<p className="text-sm text-gray-500">
								Crea tu perfil con posición, dorsal y foto. Los capitanes
								te encontrarán más fácil.
							</p>
						</div>
						<div className="rounded-2xl border border-gray-100 bg-white p-8 transition hover:shadow-lg">
							<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#48acf0]/10">
								<Trophy className="h-6 w-6 text-[#48acf0]" />
							</div>
							<h3 className="mb-2 text-lg font-bold">Llaves eliminatorias</h3>
							<p className="text-sm text-gray-500">
								Visualiza el bracket del torneo, cuartos de final,
								semifinales y la gran final.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ── CTA ────────────────────────────────────────────────── */}
			<section className="border-t border-gray-100 bg-white py-20">
				<div className="mx-auto max-w-6xl px-6">
					<div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-[#990000] to-[#6b0000] p-12 text-center text-white md:p-16">
						<h2 className="mb-4 text-3xl font-bold md:text-4xl">
							¿Listo para jugar?
						</h2>
						<p className="mb-8 text-lg text-white/80">
							Únete al torneo de fútbol más grande de la Escuela Colombiana
							de Ingeniería.
						</p>
						<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
							<Link
								to="/register"
								className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#990000] transition hover:bg-gray-50 sm:w-auto"
							>
								<UserPlus className="h-5 w-5" />
								Registrarme ahora
							</Link>
							<Link
								to="/login"
								className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 sm:w-auto"
							>
								<LogIn className="h-5 w-5" />
								Tengo cuenta
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* ── Footer ─────────────────────────────────────────────── */}
			<footer className="border-t border-gray-100 bg-white py-12">
				<div className="mx-auto max-w-6xl px-6 text-center">
					<div className="mb-4 flex items-center justify-center gap-3">
						<img
							src="/images/logo-transparent-background.png"
							alt="TechCup"
							className="h-8 w-auto object-contain"
						/>
						<span className="font-bold">TechCup Fútbol</span>
					</div>
					<p className="mb-1 text-sm text-gray-500">
						Escuela Colombiana de Ingeniería Julio Garavito
					</p>
					<p className="mb-6 text-sm text-gray-400">
						Ingeniería de Sistemas · IA · Ciberseguridad · Estadística
					</p>
					<p className="text-xs text-gray-400">
						© 2026 TechCup Fútbol. Proyecto académico — Desarrollo de Software.
					</p>
				</div>
			</footer>
		</div>
	);
}
