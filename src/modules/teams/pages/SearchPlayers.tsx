import { useState } from "react";
import axios from "axios";
import { Home, Users, UserPlus, CreditCard, LayoutList, Trophy, BarChart3, Search, CheckCircle, XCircle } from "lucide-react";
import PlayerCard from "../../../shared/components/shared/PlayerCard";

// TODO: obtener del contexto de autenticación, estos son casos de prueba
const TEAM_ID = "1";

const BASE_URL = "http://localhost:8080";

const captainSidebar = [
  {
    items: [
      { label: "Inicio", path: "/captain/dashboard", icon: Home },
      { label: "Mi Equipo", path: "/captain/manage", icon: Users },
      { label: "Buscar Jugadores", path: "/captain/search-players", icon: UserPlus },
      { label: "Pagos", path: "/captain/payment", icon: CreditCard },
      { label: "Alineación", path: "/captain/lineup", icon: LayoutList },
      { label: "Torneo", path: "/tournament-info", icon: Trophy },
      { label: "Estadísticas", path: "/stats", icon: BarChart3 },
    ],
  },
];


export default function SearchPlayers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [inviteFeedback, setInviteFeedback] = useState<{
    playerId: string;
    success: boolean;
    msg: string;
  } | null>(null);

  const availablePlayers = [
    {
      id: "10",
      name: "Roberto Vargas",
      position: "Defensa Central",
      number: 4,
      semester: 5,
      available: true,
    },
    {
      id: "11",
      name: "Carolina Díaz",
      position: "Mediocampista Central",
      number: 10,
      semester: 6,
      available: true,
    },
    {
      id: "12",
      name: "Javier Ortiz",
      position: "Delantero Centro",
      number: 9,
      semester: 4,
      available: false,
    },
    {
      id: "13",
      name: "Sofía Ramírez",
      position: "Extremo Derecho",
      number: 7,
      semester: 8,
      available: true,
    },
    {
      id: "14",
      name: "Miguel Ángel Castro",
      position: "Portero",
      number: 1,
      semester: 3,
      available: true,
    },
    {
      id: "15",
      name: "Daniela Reyes",
      position: "Lateral Izquierdo",
      number: 3,
      semester: 7,
      available: true,
    },
  ];

  async function handleInvite(playerId: string, playerName: string) {
    if (invitingId) return;
    setInvitingId(playerId);
    setInviteFeedback(null);
    try {
      await axios.post(
        `${BASE_URL}/api/players/${playerId}/solicitudes`,
        {},
        { headers: { "X-User-Id": TEAM_ID } }
      );
      setInviteFeedback({
        playerId,
        success: true,
        msg: `Invitación enviada a ${playerName} exitosamente`,
      });
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? err.message)
        : `Error al enviar la invitación a ${playerName}`;
      setInviteFeedback({ playerId, success: false, msg });
    } finally {
      setInvitingId(null);
      setTimeout(() => setInviteFeedback(null), 4000);
    }
  }

  const filteredPlayers = availablePlayers.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = !positionFilter || player.position === positionFilter;
    const matchesSemester = !semesterFilter || player.semester.toString() === semesterFilter;
    return matchesSearch && matchesPosition && matchesSemester;
  });

  return (
    <div className="flex min-h-screen flex-col">
      
      <div className="flex flex-1">
        
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Buscar jugadores disponibles</h1>
              <p className="text-muted-foreground">
                Invita jugadores sin equipo a unirse a Los Algoritmos FC
              </p>
            </div>

            {/* Invite feedback */}
            {inviteFeedback && (
              <div
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
                  inviteFeedback.success
                    ? "bg-[#4ADE80]/10 text-[#4ADE80]"
                    : "bg-[#EF4444]/10 text-[#EF4444]"
                }`}
              >
                {inviteFeedback.success ? (
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 flex-shrink-0" />
                )}
                {inviteFeedback.msg}
              </div>
            )}

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
                <option value="Lateral Derecho">Lateral Derecho</option>
                <option value="Lateral Izquierdo">Lateral Izquierdo</option>
                <option value="Mediocampista Defensivo">Mediocampista Defensivo</option>
                <option value="Mediocampista Central">Mediocampista Central</option>
                <option value="Extremo Derecho">Extremo Derecho</option>
                <option value="Extremo Izquierdo">Extremo Izquierdo</option>
                <option value="Delantero Centro">Delantero Centro</option>
              </select>
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
              >
                <option value="">Todos los semestres</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                  <option key={sem} value={sem}>
                    Semestre {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid de jugadores */}
            {filteredPlayers.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPlayers.map((player) => (
                  <PlayerCard
                    key={player.id}
                    name={player.name}
                    position={player.position}
                    number={player.number}
                    semester={player.semester}
                    available={player.available}
                    onView={() => alert(`Ver perfil de ${player.name}`)}
                    onInvite={() => handleInvite(player.id, player.name)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
                <Users className="mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-bold">No hay jugadores disponibles</h3>
                <p className="text-muted-foreground">
                  No se encontraron jugadores con los filtros seleccionados
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}


