import Navbar from "../shared/Navbar";
import { Calendar, MapPin, AlertCircle } from "lucide-react";

export default function TournamentInfo() {
  const timeline = [
    { date: "15/02/2025", event: "Inscripciones abiertas", status: "completed" },
    { date: "28/02/2025", event: "Cierre de inscripciones", status: "completed" },
    { date: "15/03/2025", event: "Inicio de fase de grupos", status: "active" },
    { date: "30/04/2025", event: "Cuartos de final", status: "pending" },
    { date: "30/05/2025", event: "Final", status: "pending" },
  ];

  const fields = [
    {
      name: "Cancha Principal ECI",
      location: "Escuela Colombiana de Ingeniería - Entrada por Av. Caracas",
    },
    {
      name: "Cancha Auxiliar Bloque B",
      location: "Escuela Colombiana de Ingeniería - Bloque B, piso 1",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userName="Sebastián Torres" role="Jugador" />
      <main className="p-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Información del Torneo</h1>
            <p className="text-muted-foreground">TechCup 2025-1 - Conoce todas las reglas y fechas importantes</p>
          </div>

          {/* Bienvenida */}
          <div className="rounded-xl border border-border bg-card p-8">
            <h2 className="mb-4 text-2xl font-bold">Bienvenido al TechCup 2025-1</h2>
            <p className="mb-4 text-muted-foreground">
              El torneo semestral de fútbol de los programas de Ingeniería de Sistemas, Ingeniería de
              Inteligencia Artificial, Ingeniería de Ciberseguridad e Ingeniería Estadística de la Escuela
              Colombiana de Ingeniería Julio Garavito.
            </p>
            <p className="text-muted-foreground">
              Este torneo busca promover la actividad física, el compañerismo y la sana competencia entre
              estudiantes, graduados, profesores, personal administrativo y familiares.
            </p>
          </div>

          {/* Reglamento */}
          <div className="rounded-xl border border-border bg-card p-8">
            <h2 className="mb-6 text-2xl font-bold">Reglamento</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-bold">Participantes</h3>
                <p className="text-sm text-muted-foreground">
                  Pueden participar estudiantes, graduados, profesores, personal administrativo y familiares de
                  los programas de ingeniería mencionados.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-bold">Duración de partidos</h3>
                <p className="text-sm text-muted-foreground">
                  Cada partido tendrá una duración de 40 minutos (dos tiempos de 20 minutos cada uno) con 5
                  minutos de descanso.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-bold">Número de jugadores</h3>
                <p className="text-sm text-muted-foreground">
                  Los equipos deben tener entre 8 y 12 jugadores inscritos. En cancha juegan 7 jugadores (6 de
                  campo + 1 portero).
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-bold">Sanciones</h3>
                <p className="text-sm text-muted-foreground">
                  Tarjeta amarilla: 1 partido de suspensión. Tarjeta roja: 2 partidos de suspensión. Dos
                  amarillas en el mismo partido equivalen a una roja.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-bold">Sistema de puntos</h3>
                <p className="text-sm text-muted-foreground">
                  Victoria: 3 puntos. Empate: 1 punto. Derrota: 0 puntos. El desempate se define por diferencia
                  de goles, goles a favor y enfrentamiento directo.
                </p>
              </div>
            </div>
          </div>

          {/* Fechas importantes */}
          <div className="rounded-xl border border-border bg-card p-8">
            <h2 className="mb-6 text-2xl font-bold">Fechas importantes</h2>
            <div className="space-y-4">
              {timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      item.status === "completed"
                        ? "bg-[#4ADE80]/10 text-[#4ADE80]"
                        : item.status === "active"
                        ? "bg-primary/10 text-primary"
                        : "bg-[#6B7280]/10 text-[#6B7280]"
                    }`}
                  >
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{item.event}</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                  {item.status === "active" && (
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      En curso
                    </span>
                  )}
                  {item.status === "completed" && (
                    <span className="rounded-full bg-[#4ADE80]/10 px-3 py-1 text-xs font-semibold text-[#4ADE80]">
                      Completado
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Canchas */}
          <div className="rounded-xl border border-border bg-card p-8">
            <h2 className="mb-6 text-2xl font-bold">Canchas disponibles</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-background p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="font-bold">{field.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{field.location}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sanciones */}
          <div className="rounded-xl border border-border bg-card p-8">
            <h2 className="mb-6 text-2xl font-bold">Sanciones vigentes</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-accent/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold">Infracción</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Consecuencia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-sm bg-[#FACC15]"></div>
                        <span>Tarjeta amarilla</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">1 partido de suspensión</td>
                  </tr>
                  <tr className="border-b border-border bg-background">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-sm bg-[#EF4444]"></div>
                        <span>Tarjeta roja</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">2 partidos de suspensión</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3">Dos amarillas en el mismo partido</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      Expulsión + 2 partidos de suspensión
                    </td>
                  </tr>
                  <tr className="bg-background">
                    <td className="px-4 py-3">Comportamiento antideportivo grave</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      Revisión por comité organizador
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
