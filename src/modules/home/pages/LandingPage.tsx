import {
	Calendar,
	ChevronRight,
	TrendingUp,
	Trophy,
	Users,
} from "lucide-react";
import { Link } from "react-router";
import MatchCard from "../../../shared/components/shared/MatchCard";
import Navbar from "../../../shared/components/shared/Navbar";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Hero */}
			{/* <section className="relative h-[90vh] overflow-hidden bg-gradient-to-br from-[#1B5E35] via-[#0D0D0D] to-[#1B5E35]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 51px),
            repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 51px)`
          }} />
        </div>
        <div className="container relative mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
            <Trophy className="h-12 w-12 text-[#F97316]" />
          </div>
          <h1 className="mb-4 text-6xl font-black text-white">TechCup Fútbol</h1>
          <p className="mb-2 text-2xl font-bold text-[#4ADE80]">Torneo 2025-1</p>
          <p className="mb-12 text-xl text-white/80">15 marzo – 30 mayo 2025</p>
          <div className="flex gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-[#F97316] px-8 py-4 text-lg font-bold text-white transition hover:bg-[#F97316]/90"
            >
              Regístrate
            </Link>
            <Link
              to="/login"
              className="rounded-xl border-2 border-white bg-transparent px-8 py-4 text-lg font-bold text-white transition hover:bg-white/10"
            >
              Ver el torneo
            </Link>
          </div>
        </div>
      </section> */}

			{/* Resumen del torneo */}
			<section className="border-b border-border bg-card py-16">
				<div className="container mx-auto max-w-6xl px-6">
					<div className="grid gap-8 md:grid-cols-3">
						<div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-6 text-center">
							<Users className="h-12 w-12 text-primary" />
							<h3 className="text-3xl font-bold">10 / 12</h3>
							<p className="text-muted-foreground">Equipos inscritos</p>
						</div>
						<div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-6 text-center">
							<Calendar className="h-12 w-12 text-accent" />
							<h3 className="text-3xl font-bold">Fase de grupos</h3>
							<p className="text-muted-foreground">Estado actual</p>
						</div>
						<div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-6 text-center">
							<Trophy className="h-12 w-12 text-[#4ADE80]" />
							<h3 className="text-3xl font-bold">2 cupos</h3>
							<p className="text-muted-foreground">Disponibles</p>
						</div>
					</div>
				</div>
			</section>

			{/* Próximos partidos */}
			<section className="py-16">
				<div className="container mx-auto max-w-6xl px-6">
					<h2 className="mb-8 text-3xl font-bold">Próximos partidos</h2>
					<div className="grid gap-6 md:grid-cols-3">
						<MatchCard
							homeTeam={{ name: "Los Algoritmos FC" }}
							awayTeam={{ name: "Byte Brothers" }}
							date="12/04/2025"
							time="14:00"
							field="Cancha Principal ECI"
							phase="Fase de grupos"
						/>
						<MatchCard
							homeTeam={{ name: "Neural FC" }}
							awayTeam={{ name: "Los Cibernéticos" }}
							date="13/04/2025"
							time="15:30"
							field="Cancha Auxiliar Bloque B"
							phase="Fase de grupos"
						/>
						<MatchCard
							homeTeam={{ name: "Kernel Panic CF" }}
							awayTeam={{ name: "Stack Overflow FC" }}
							date="14/04/2025"
							time="16:00"
							field="Cancha Principal ECI"
							phase="Fase de grupos"
						/>
					</div>
				</div>
			</section>

			{/* Tabla de posiciones resumida */}
			<section className="border-t border-border bg-card py-16">
				<div className="container mx-auto max-w-6xl px-6">
					<div className="mb-8 flex items-center justify-between">
						<h2 className="text-3xl font-bold">Tabla de posiciones</h2>
						<Link
							to="/organizer/standings"
							className="flex items-center gap-2 text-primary hover:underline"
						>
							Ver tabla completa <ChevronRight className="h-5 w-5" />
						</Link>
					</div>
					<div className="overflow-hidden rounded-xl border border-border bg-background">
						<table className="w-full">
							<thead className="bg-primary text-primary-foreground">
								<tr>
									<th className="px-4 py-3 text-left">Pos</th>
									<th className="px-4 py-3 text-left">Equipo</th>
									<th className="px-4 py-3 text-center">PJ</th>
									<th className="px-4 py-3 text-center">PG</th>
									<th className="px-4 py-3 text-center">PE</th>
									<th className="px-4 py-3 text-center">PP</th>
									<th className="px-4 py-3 text-center">Pts</th>
								</tr>
							</thead>
							<tbody>
								{[
									{
										pos: 1,
										team: "Los Algoritmos FC",
										pj: 6,
										pg: 5,
										pe: 1,
										pp: 0,
										pts: 16,
									},
									{
										pos: 2,
										team: "Neural FC",
										pj: 6,
										pg: 4,
										pe: 2,
										pp: 0,
										pts: 14,
									},
									{
										pos: 3,
										team: "Byte Brothers",
										pj: 6,
										pg: 4,
										pe: 1,
										pp: 1,
										pts: 13,
									},
									{
										pos: 4,
										team: "Los Cibernéticos",
										pj: 6,
										pg: 3,
										pe: 2,
										pp: 1,
										pts: 11,
									},
									{
										pos: 5,
										team: "Kernel Panic CF",
										pj: 6,
										pg: 3,
										pe: 1,
										pp: 2,
										pts: 10,
									},
								].map((row) => (
									<tr
										key={row.pos}
										className="border-t border-border hover:bg-muted/50"
									>
										<td className="px-4 py-3 font-bold">{row.pos}</td>
										<td className="px-4 py-3">{row.team}</td>
										<td className="px-4 py-3 text-center">{row.pj}</td>
										<td className="px-4 py-3 text-center">{row.pg}</td>
										<td className="px-4 py-3 text-center">{row.pe}</td>
										<td className="px-4 py-3 text-center">{row.pp}</td>
										<td className="px-4 py-3 text-center font-bold">
											{row.pts}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</section>

			{/* Estadísticas rápidas */}
			<section className="py-16">
				<div className="container mx-auto max-w-6xl px-6">
					<h2 className="mb-8 text-3xl font-bold">Estadísticas del torneo</h2>
					<div className="grid gap-6 md:grid-cols-2">
						<div className="rounded-xl border border-border bg-card p-6">
							<div className="mb-4 flex items-center gap-3">
								<TrendingUp className="h-8 w-8 text-accent" />
								<h3 className="text-xl font-bold">Máximo goleador</h3>
							</div>
							<p className="text-3xl font-bold">Sebastián Torres</p>
							<p className="text-muted-foreground">
								Los Algoritmos FC · 12 goles
							</p>
						</div>
						<div className="rounded-xl border border-border bg-card p-6">
							<div className="mb-4 flex items-center gap-3">
								<Trophy className="h-8 w-8 text-primary" />
								<h3 className="text-xl font-bold">Equipo líder</h3>
							</div>
							<p className="text-3xl font-bold">Los Algoritmos FC</p>
							<p className="text-muted-foreground">16 puntos · 5 victorias</p>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-border bg-card py-12">
				<div className="container mx-auto max-w-6xl px-6 text-center">
					<p className="mb-2 text-lg font-semibold">
						Escuela Colombiana de Ingeniería Julio Garavito
					</p>
					<p className="text-muted-foreground">Bogotá, Colombia</p>
					<p className="mt-4 text-sm text-muted-foreground">
						© 2025 TechCup Fútbol. Todos los derechos reservados.
					</p>
				</div>
			</footer>
		</div>
	);
}
