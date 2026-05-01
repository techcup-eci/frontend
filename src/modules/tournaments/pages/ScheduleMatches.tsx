import { useState } from "react";
import Navbar from "../../../shared/components/shared/Navbar";
import Sidebar from "../../../shared/components/shared/Sidebar";
import { Home, Users, Calendar, Trophy, FileText, DollarSign, BarChart3 } from "lucide-react";

const organizerSidebar = [
  {
    items: [
      { label: "Inicio", path: "/organizer/dashboard", icon: Home },
      { label: "Equipos", path: "/organizer/teams", icon: Users },
      { label: "Programar Partidos", path: "/organizer/schedule", icon: Calendar },
      { label: "Tabla de Posiciones", path: "/organizer/standings", icon: Trophy },
      { label: "Registrar Resultado", path: "/organizer/results", icon: FileText },
      { label: "Pagos", path: "/organizer/payments", icon: DollarSign },
      { label: "Estadísticas", path: "/stats", icon: BarChart3 },
    ],
  },
];

const teams = [
  "Los Algoritmos FC",
  "Byte Brothers",
  "Neural FC",
  "Los Cibernéticos",
  "Kernel Panic CF",
  "Stack Overflow FC",
  "Coding Warriors",
  "Debug Masters",
];

const fields = [
  { id: 1, name: "Cancha Principal ECI", address: "Entrada por la Av. Caracas" },
  { id: 2, name: "Cancha Auxiliar Bloque B", address: "Entrada por la Calle 73" },
  { id: 3, name: "Cancha Bloque D", address: "Entrada lateral Calle 72" },
];

export default function ScheduleMatches() {
  const [matches, setMatches] = useState([
    {
      id: 1,
      homeTeam: "Los Algoritmos FC",
      awayTeam: "Byte Brothers",
      date: "2025-04-12",
      time: "14:00",
      field: "Cancha Principal ECI",
    },
    {
      id: 2,
      homeTeam: "Neural FC",
      awayTeam: "Los Cibernéticos",
      date: "2025-04-13",
      time: "15:30",
      field: "Cancha Auxiliar Bloque B",
    },
  ]);

  const [newMatch, setNewMatch] = useState({
    homeTeam: "",
    awayTeam: "",
    date: "",
    time: "",
    field: "",
  });

  const handleAddMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMatch.homeTeam === newMatch.awayTeam) {
      alert("Un equipo no puede jugar contra sí mismo");
      return;
    }
    setMatches([
      ...matches,
      {
        id: matches.length + 1,
        ...newMatch,
      },
    ]);
    setNewMatch({
      homeTeam: "",
      awayTeam: "",
      date: "",
      time: "",
      field: "",
    });
  };

  const handleDeleteMatch = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este partido?")) {
      setMatches(matches.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userName="Andrés Sarmiento" role="Organizador" />
      <div className="flex flex-1">
        <Sidebar sections={organizerSidebar} />
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Programar partidos</h1>
              <p className="text-muted-foreground">Crea y gestiona el calendario de partidos del torneo</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
              {/* Lista de partidos */}
              <div className="space-y-6">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="mb-6 text-xl font-bold">Partidos programados ({matches.length})</h2>
                  <div className="space-y-4">
                    {matches.map((match) => (
                      <div
                        key={match.id}
                        className="flex items-start justify-between rounded-lg border border-border bg-background p-4"
                      >
                        <div className="flex-1">
                          <div className="mb-2 text-lg font-bold">
                            {match.homeTeam} vs {match.awayTeam}
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(match.date + "T00:00:00").toLocaleDateString("es-CO", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}{" "}
                                - {match.time}
                              </span>
                            </div>
                            <div>{match.field}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteMatch(match.id)}
                          className="rounded-lg bg-[#EF4444] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#DC2626]"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Formulario */}
              <div className="space-y-6">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="mb-6 text-xl font-bold">Nuevo partido</h2>
                  <form onSubmit={handleAddMatch} className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Equipo local</label>
                      <select
                        required
                        value={newMatch.homeTeam}
                        onChange={(e) => setNewMatch({ ...newMatch, homeTeam: e.target.value })}
                        className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                      >
                        <option value="">Selecciona equipo</option>
                        {teams.map((team) => (
                          <option key={team} value={team}>
                            {team}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Equipo visitante</label>
                      <select
                        required
                        value={newMatch.awayTeam}
                        onChange={(e) => setNewMatch({ ...newMatch, awayTeam: e.target.value })}
                        className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                      >
                        <option value="">Selecciona equipo</option>
                        {teams.map((team) => (
                          <option key={team} value={team}>
                            {team}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Fecha</label>
                      <input
                        type="date"
                        required
                        value={newMatch.date}
                        onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
                        className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Hora</label>
                      <input
                        type="time"
                        required
                        value={newMatch.time}
                        onChange={(e) => setNewMatch({ ...newMatch, time: e.target.value })}
                        className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Cancha</label>
                      <select
                        required
                        value={newMatch.field}
                        onChange={(e) => setNewMatch({ ...newMatch, field: e.target.value })}
                        className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                      >
                        <option value="">Selecciona cancha</option>
                        {fields.map((field) => (
                          <option key={field.id} value={field.name}>
                            {field.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
                    >
                      Agregar partido
                    </button>
                  </form>
                </div>

                <div className="rounded-lg bg-blue-500/10 p-4 text-sm text-blue-600">
                  <p className="font-semibold">Recordatorio:</p>
                  <p className="mt-1 text-xs">
                    Asegúrate de que no haya conflictos de horario en las canchas y que los equipos no
                    tengan partidos muy seguidos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
