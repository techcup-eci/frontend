import { Link } from "react-router";
import { Trophy, Calendar, Shield, Target, TrendingUp, Award } from "lucide-react";
import MatchCard from "../../../shared/components/shared/MatchCard";

export default function Landing() {
  const upcomingMatches = [
    {
      homeTeam: { name: "Los Algoritmos FC" },
      awayTeam: { name: "Byte Brothers" },
      date: "12/04/2025",
      time: "14:00",
      field: "Cancha Principal ECI",
      phase: "Fase de grupos",
    },
    {
      homeTeam: { name: "Neural FC" },
      awayTeam: { name: "Los Cibernéticos" },
      date: "13/04/2025",
      time: "15:30",
      field: "Cancha Auxiliar Bloque B",
      phase: "Fase de grupos",
    },
    {
      homeTeam: { name: "Kernel Panic CF" },
      awayTeam: { name: "Stack Overflow FC" },
      date: "14/04/2025",
      time: "16:00",
      field: "Cancha Principal ECI",
      phase: "Fase de grupos",
    },
  ];

  const standings = [
    { pos: 1, team: "Los Algoritmos FC", pj: 4, pg: 3, pe: 1, pp: 0, pts: 10 },
    { pos: 2, team: "Neural FC", pj: 4, pg: 3, pe: 0, pp: 1, pts: 9 },
    { pos: 3, team: "Byte Brothers", pj: 4, pg: 2, pe: 1, pp: 1, pts: 7 },
    { pos: 4, team: "Los Cibernéticos", pj: 4, pg: 2, pe: 0, pp: 2, pts: 6 },
    { pos: 5, team: "Kernel Panic CF", pj: 4, pg: 1, pe: 2, pp: 1, pts: 5 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar simple */}
      <nav className="border-b border-border bg-gradient-to-r from-[#1B5E35] to-[#0D0D0D] px-8 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F97316]">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white">TechCup Fútbol</span>
          </div>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="rounded-lg border border-white/20 px-4 py-2 font-medium text-white transition hover:bg-white/10"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-[#F97316] px-4 py-2 font-medium text-white transition hover:bg-[#F97316]/90"
            >
              Regístrate
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-br from-[#1B5E35] to-[#0D0D0D] px-8 py-24">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="mb-6 text-6xl font-black text-white">Torneo 2025-1</h1>
          <p className="mb-4 text-2xl text-white/80">15 marzo – 30 mayo 2025</p>
          <p className="mb-8 text-xl text-white/70">
            El torneo más emocionante de la Escuela Colombiana de Ingeniería
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="rounded-lg bg-[#F97316] px-8 py-4 text-lg font-bold text-white transition hover:bg-[#F97316]/90"
            >
              Regístrate ahora
            </Link>
            <Link
              to="/tournament-info"
              className="rounded-lg border-2 border-white px-8 py-4 text-lg font-bold text-white transition hover:bg-white/10"
            >
              Ver el torneo
            </Link>
          </div>
        </div>
      </section>

      {/* Resumen del torneo */}
      <section className="border-b border-border px-8 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <Shield className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-3xl font-bold text-primary">10 / 12</h3>
              <p className="text-muted-foreground">Equipos inscritos</p>
              <p className="mt-2 text-sm font-semibold text-accent">2 cupos disponibles</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <Trophy className="mx-auto mb-4 h-12 w-12 text-[#FACC15]" />
              <h3 className="mb-2 text-3xl font-bold">Fase de grupos</h3>
              <p className="text-muted-foreground">Fase actual del torneo</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-[#4ADE80]" />
              <h3 className="mb-2 text-3xl font-bold">12 partidos</h3>
              <p className="text-muted-foreground">Jugados hasta ahora</p>
            </div>
          </div>
        </div>
      </section>

      {/* Próximos partidos */}
      <section className="border-b border-border px-8 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-3xl font-bold">Próximos partidos</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {upcomingMatches.map((match, idx) => (
              <MatchCard key={idx} {...match} />
            ))}
          </div>
        </div>
      </section>

      {/* Tabla de posiciones */}
      <section className="border-b border-border px-8 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-3xl font-bold">Tabla de posiciones - Top 5</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full">
              <thead className="border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">Pos</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Equipo</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">PJ</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">PG</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">PE</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">PP</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row, idx) => (
                  <tr key={idx} className={`border-b border-border ${idx % 2 === 0 ? "bg-background" : ""}`}>
                    <td className="px-6 py-4 text-center font-bold">{row.pos}</td>
                    <td className="px-6 py-4 font-semibold">{row.team}</td>
                    <td className="px-6 py-4 text-center">{row.pj}</td>
                    <td className="px-6 py-4 text-center">{row.pg}</td>
                    <td className="px-6 py-4 text-center">{row.pe}</td>
                    <td className="px-6 py-4 text-center">{row.pp}</td>
                    <td className="px-6 py-4 text-center font-bold text-primary">{row.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
            <Link to="/organizer/standings" className="font-semibold text-primary hover:underline">
              Ver tabla completa →
            </Link>
          </div>
        </div>
      </section>

      {/* Estadísticas rápidas */}
      <section className="border-b border-border px-8 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-3xl font-bold">Estadísticas destacadas</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="mb-4 flex items-center gap-3">
                <Target className="h-8 w-8 text-[#F97316]" />
                <h3 className="text-xl font-bold">Máximo goleador</h3>
              </div>
              <p className="mb-2 text-3xl font-bold">Felipe Jiménez</p>
              <p className="text-muted-foreground">Los Algoritmos FC</p>
              <p className="mt-4 text-4xl font-black text-primary">8 goles</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="mb-4 flex items-center gap-3">
                <Award className="h-8 w-8 text-[#FACC15]" />
                <h3 className="text-xl font-bold">Equipo líder</h3>
              </div>
              <p className="mb-2 text-3xl font-bold">Los Algoritmos FC</p>
              <p className="text-muted-foreground">Mejor diferencia de goles</p>
              <p className="mt-4 text-4xl font-black text-primary">+12</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D0D0D] px-8 py-12 text-white/80">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F97316]">
              <Trophy className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="mb-4 text-xl font-bold text-white">TechCup Fútbol</p>
          <p className="mb-2">Escuela Colombiana de Ingeniería Julio Garavito</p>
          <p className="text-sm">Bogotá, Colombia</p>
        </div>
      </footer>
    </div>
  );
}
