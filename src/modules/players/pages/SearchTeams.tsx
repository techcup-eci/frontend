import { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../../shared/components/shared/Navbar";
import Sidebar from "../../../shared/components/shared/Sidebar";
import TeamCard from "../../../shared/components/shared/TeamCard";
import { Home, User, Users, Trophy, BarChart3, Calendar, Search } from "lucide-react";

const playerSidebar = [
  {
    items: [
      { label: "Inicio", path: "/player/dashboard", icon: Home },
      { label: "Mi Perfil", path: "/player/profile", icon: User },
      { label: "Buscar Equipos", path: "/player/teams", icon: Users },
      { label: "Torneo", path: "/tournament-info", icon: Trophy },
      { label: "Estadísticas", path: "/stats", icon: BarChart3 },
      { label: "Disponibilidad", path: "/player/availability", icon: Calendar },
    ],
  },
];

export default function SearchTeams() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const teams = [
    {
      id: 1,
      name: "Los Algoritmos FC",
      captain: "Felipe Jiménez",
      players: 9,
      maxPlayers: 12,
      status: "approved" as const,
      positions: ["Mediocampista Central", "Delantero Centro"],
    },
    {
      id: 2,
      name: "Byte Brothers",
      captain: "Andrés Morales",
      players: 10,
      maxPlayers: 12,
      status: "approved" as const,
      positions: ["Defensa Central", "Lateral Derecho"],
    },
    {
      id: 3,
      name: "Neural FC",
      captain: "Camila Herrera",
      players: 8,
      maxPlayers: 12,
      status: "approved" as const,
      positions: ["Portero", "Mediocampista Defensivo"],
    },
    {
      id: 4,
      name: "Los Cibernéticos",
      captain: "Valentina Ruiz",
      players: 11,
      maxPlayers: 12,
      status: "review" as const,
      positions: ["Extremo Derecho"],
    },
  ];

  const filteredTeams = teams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = !positionFilter || team.positions.includes(positionFilter);
    const matchesStatus = !statusFilter || team.status === statusFilter;
    return matchesSearch && matchesPosition && matchesStatus;
  });

  return (
    <div className="flex min-h-screen flex-col">
      
      <div className="flex flex-1">
        
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Buscar equipos disponibles</h1>
              <p className="text-muted-foreground">Encuentra un equipo para unirte al torneo</p>
            </div>

            {/* Filtros */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-border bg-input-background py-3 pl-10 pr-4 focus:border-primary focus:outline-none"
                />
              </div>
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
              >
                <option value="">Todas las posiciones</option>
                <option value="Portero">Portero</option>
                <option value="Defensa Central">Defensa Central</option>
                <option value="Mediocampista Central">Mediocampista Central</option>
                <option value="Delantero Centro">Delantero Centro</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
              >
                <option value="">Todos los estados</option>
                <option value="approved">Aprobados</option>
                <option value="review">En revisión</option>
                <option value="pending">Pendientes</option>
              </select>
            </div>

            {/* Grid de equipos */}
            {filteredTeams.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTeams.map((team) => (
                  <TeamCard
                    key={team.id}
                    name={team.name}
                    captain={team.captain}
                    players={team.players}
                    maxPlayers={team.maxPlayers}
                    status={team.status}
                    positions={team.positions}
                    onView={() => navigate(`/player/teams/${team.id}`)}
                    onJoin={() => {
                      // Aquí iría la lógica para solicitar unirse
                      alert(`Solicitud enviada a ${team.name}`);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
                <Users className="mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-bold">No hay equipos disponibles</h3>
                <p className="text-muted-foreground">No se encontraron equipos con los filtros seleccionados</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}


