import { Calendar, MapPin, Clock } from "lucide-react";
import Badge from "../../../shared/components/shared/Badge";

export default function RefereeDashboard() {
  const matches = [
    {
      id: 1,
      homeTeam: "Los Algoritmos FC",
      awayTeam: "Byte Brothers",
      date: "12/04/2025",
      time: "14:00",
      field: "Cancha Principal ECI",
      status: "upcoming" as const,
    },
    {
      id: 2,
      homeTeam: "Neural FC",
      awayTeam: "Los Cibernéticos",
      date: "13/04/2025",
      time: "15:30",
      field: "Cancha Auxiliar Bloque B",
      status: "upcoming" as const,
    },
    {
      id: 3,
      homeTeam: "Kernel Panic CF",
      awayTeam: "Stack Overflow FC",
      date: "05/04/2025",
      time: "16:00",
      field: "Cancha Principal ECI",
      status: "finished" as const,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      
      <div className="flex flex-1">
        
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Mis partidos asignados</h1>
              <p className="text-muted-foreground">Revisa la información de los partidos que debes arbitrar</p>
            </div>

            {/* Próximo partido destacado */}
            <div className="rounded-xl border-2 border-primary bg-gradient-to-r from-primary/10 to-accent/10 p-8">
              <Badge variant="info" size="sm">
                Próximo partido
              </Badge>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="mb-4 text-2xl font-bold">Los Algoritmos FC vs Byte Brothers</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>12/04/2025</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>14:00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Cancha Principal ECI - Entrada por la Av. Caracas</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <a
                    href="/referee/match/1"
                    className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    Ver detalles del partido
                  </a>
                </div>
              </div>
            </div>

            {/* Lista completa de partidos */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-xl font-bold">Todos los partidos asignados</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-accent/5">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold">Fecha</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Equipos</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Cancha</th>
                      <th className="px-4 py-3 text-center text-sm font-bold">Estado</th>
                      <th className="px-4 py-3 text-center text-sm font-bold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((match, idx) => (
                      <tr key={match.id} className={`border-b border-border ${idx % 2 === 0 ? "bg-background" : ""}`}>
                        <td className="px-4 py-4 text-sm">
                          <div>{match.date}</div>
                          <div className="text-muted-foreground">{match.time}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-semibold">{match.homeTeam}</div>
                          <div className="text-sm text-muted-foreground">vs {match.awayTeam}</div>
                        </td>
                        <td className="px-4 py-4 text-sm">{match.field}</td>
                        <td className="px-4 py-4 text-center">
                          <Badge variant={match.status === "upcoming" ? "info" : "finished"}>
                            {match.status === "upcoming" ? "Próximo" : "Finalizado"}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <a
                            href={`/referee/match/${match.id}`}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            Ver detalles
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
