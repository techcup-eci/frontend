import Navbar from "../../../shared/components/shared/Navbar";
import Sidebar from "../../../shared/components/shared/Sidebar";
import { Home, Trophy, Users, CreditCard, Calendar, ListChecks, Table, Layers } from "lucide-react";

const organizerSidebar = [
  {
    items: [
      { label: "Inicio", path: "/organizer/dashboard", icon: Home },
      { label: "Torneos", path: "/organizer/create-tournament", icon: Trophy },
      { label: "Equipos", path: "/organizer/teams", icon: Users },
      { label: "Pagos", path: "/organizer/teams", icon: CreditCard },
      { label: "Partidos", path: "/organizer/schedule", icon: Calendar },
      { label: "Resultados", path: "/organizer/calendar", icon: ListChecks },
      { label: "Tabla de Posiciones", path: "/organizer/standings", icon: Table },
      { label: "Llaves", path: "/organizer/bracket", icon: Layers },
    ],
  },
];

export default function Standings() {
  const standings = [
    { pos: 1, team: "Los Algoritmos FC", pj: 8, pg: 6, pe: 2, pp: 0, gf: 22, gc: 8, dg: 14, pts: 20 },
    { pos: 2, team: "Neural FC", pj: 8, pg: 6, pe: 1, pp: 1, gf: 19, gc: 10, dg: 9, pts: 19 },
    { pos: 3, team: "Byte Brothers", pj: 8, pg: 5, pe: 2, pp: 1, gf: 18, gc: 11, dg: 7, pts: 17 },
    { pos: 4, team: "Los Cibernéticos", pj: 8, pg: 4, pe: 3, pp: 1, gf: 16, gc: 12, dg: 4, pts: 15 },
    { pos: 5, team: "Kernel Panic CF", pj: 8, pg: 4, pe: 1, pp: 3, gf: 15, gc: 13, dg: 2, pts: 13 },
    { pos: 6, team: "Stack Overflow FC", pj: 8, pg: 3, pe: 3, pp: 2, gf: 14, gc: 14, dg: 0, pts: 12 },
    { pos: 7, team: "Binary Warriors", pj: 8, pg: 3, pe: 2, pp: 3, gf: 12, gc: 15, dg: -3, pts: 11 },
    { pos: 8, team: "Code Runners", pj: 8, pg: 2, pe: 2, pp: 4, gf: 10, gc: 16, dg: -6, pts: 8 },
    { pos: 9, team: "Debug United", pj: 8, pg: 1, pe: 2, pp: 5, gf: 8, gc: 18, dg: -10, pts: 5 },
    { pos: 10, team: "Syntax Error FC", pj: 8, pg: 0, pe: 2, pp: 6, gf: 6, gc: 23, dg: -17, pts: 2 },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userName="María Rodríguez" role="Organizador" />
      <div className="flex flex-1">
        <Sidebar sections={organizerSidebar} />
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Tabla de posiciones</h1>
              <p className="text-muted-foreground">
                Actualizada automáticamente — último partido: 12 abr 2025
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary text-primary-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left">Pos</th>
                      <th className="px-4 py-3 text-left">Equipo</th>
                      <th className="px-4 py-3 text-center">PJ</th>
                      <th className="px-4 py-3 text-center">PG</th>
                      <th className="px-4 py-3 text-center">PE</th>
                      <th className="px-4 py-3 text-center">PP</th>
                      <th className="px-4 py-3 text-center">GF</th>
                      <th className="px-4 py-3 text-center">GC</th>
                      <th className="px-4 py-3 text-center">DG</th>
                      <th className="px-4 py-3 text-center">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((row) => (
                      <tr
                        key={row.pos}
                        className={`border-t border-border hover:bg-muted/50 ${
                          row.pos <= 4 ? "bg-[#4ADE80]/5" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                            {row.pos}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold">{row.team}</td>
                        <td className="px-4 py-3 text-center">{row.pj}</td>
                        <td className="px-4 py-3 text-center">{row.pg}</td>
                        <td className="px-4 py-3 text-center">{row.pe}</td>
                        <td className="px-4 py-3 text-center">{row.pp}</td>
                        <td className="px-4 py-3 text-center">{row.gf}</td>
                        <td className="px-4 py-3 text-center">{row.gc}</td>
                        <td
                          className={`px-4 py-3 text-center font-semibold ${
                            row.dg > 0 ? "text-[#4ADE80]" : row.dg < 0 ? "text-destructive" : ""
                          }`}
                        >
                          {row.dg > 0 ? "+" : ""}
                          {row.dg}
                        </td>
                        <td className="px-4 py-3 text-center text-xl font-bold">{row.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-bold">Leyenda</h3>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-[#4ADE80]/20" />
                <span className="text-sm text-muted-foreground">
                  Equipos clasificados a cuartos de final (Top 4)
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
