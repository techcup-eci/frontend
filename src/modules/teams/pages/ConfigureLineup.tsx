import { useState } from "react";
import Navbar from "../../../shared/components/shared/Navbar";
import Sidebar from "../../../shared/components/shared/Sidebar";
import { Home, Users, UserPlus, LayoutList, CreditCard, Trophy } from "lucide-react";

const captainSidebar = [
  {
    items: [
      { label: "Inicio", path: "/captain/dashboard", icon: Home },
      { label: "Mi Equipo", path: "/captain/team", icon: Users },
      { label: "Buscar Jugadores", path: "/captain/players", icon: UserPlus },
      { label: "Alineación", path: "/captain/lineup", icon: LayoutList },
      { label: "Pago de Inscripción", path: "/captain/payment", icon: CreditCard },
      { label: "Torneo", path: "/tournament-info", icon: Trophy },
    ],
  },
];

type Position = {
  id: number;
  name: string;
  top: string;
  left: string;
};

type Player = {
  id: number;
  name: string;
  dorsal: number;
  position: string;
};

const formations = {
  "4-4-2": [
    { id: 1, name: "Portero", top: "85%", left: "50%" },
    { id: 2, name: "Lateral Izquierdo", top: "65%", left: "15%" },
    { id: 3, name: "Defensa Central", top: "70%", left: "40%" },
    { id: 4, name: "Defensa Central", top: "70%", left: "60%" },
    { id: 5, name: "Lateral Derecho", top: "65%", left: "85%" },
    { id: 6, name: "Mediocampista", top: "45%", left: "20%" },
    { id: 7, name: "Mediocampista", top: "45%", left: "45%" },
    { id: 8, name: "Mediocampista", top: "45%", left: "55%" },
    { id: 9, name: "Mediocampista", top: "45%", left: "80%" },
    { id: 10, name: "Delantero", top: "20%", left: "40%" },
    { id: 11, name: "Delantero", top: "20%", left: "60%" },
  ],
  "4-3-3": [
    { id: 1, name: "Portero", top: "85%", left: "50%" },
    { id: 2, name: "Lateral Izquierdo", top: "65%", left: "15%" },
    { id: 3, name: "Defensa Central", top: "70%", left: "40%" },
    { id: 4, name: "Defensa Central", top: "70%", left: "60%" },
    { id: 5, name: "Lateral Derecho", top: "65%", left: "85%" },
    { id: 6, name: "Mediocampista", top: "50%", left: "30%" },
    { id: 7, name: "Mediocampista", top: "50%", left: "50%" },
    { id: 8, name: "Mediocampista", top: "50%", left: "70%" },
    { id: 9, name: "Delantero", top: "20%", left: "25%" },
    { id: 10, name: "Delantero", top: "15%", left: "50%" },
    { id: 11, name: "Delantero", top: "20%", left: "75%" },
  ],
  "3-5-2": [
    { id: 1, name: "Portero", top: "85%", left: "50%" },
    { id: 2, name: "Defensa Central", top: "70%", left: "30%" },
    { id: 3, name: "Defensa Central", top: "70%", left: "50%" },
    { id: 4, name: "Defensa Central", top: "70%", left: "70%" },
    { id: 5, name: "Mediocampista", top: "50%", left: "15%" },
    { id: 6, name: "Mediocampista", top: "50%", left: "35%" },
    { id: 7, name: "Mediocampista", top: "45%", left: "50%" },
    { id: 8, name: "Mediocampista", top: "50%", left: "65%" },
    { id: 9, name: "Mediocampista", top: "50%", left: "85%" },
    { id: 10, name: "Delantero", top: "20%", left: "40%" },
    { id: 11, name: "Delantero", top: "20%", left: "60%" },
  ],
};

export default function ConfigureLineup() {
  const [selectedFormation, setSelectedFormation] = useState<keyof typeof formations>("4-4-2");
  const [assignments, setAssignments] = useState<Record<number, Player | null>>({});

  const availablePlayers: Player[] = [
    { id: 1, name: "Carlos Muñoz", dorsal: 1, position: "Portero" },
    { id: 2, name: "Sebastián Torres", dorsal: 8, position: "Mediocampista Central" },
    { id: 3, name: "Andrea Ramírez", dorsal: 10, position: "Delantero Centro" },
    { id: 4, name: "Miguel Ángel Castro", dorsal: 5, position: "Defensa Central" },
    { id: 5, name: "Laura Gómez", dorsal: 7, position: "Extremo Derecho" },
    { id: 6, name: "Diego Fernández", dorsal: 3, position: "Lateral Izquierdo" },
    { id: 7, name: "Camila Herrera", dorsal: 4, position: "Defensa Central" },
    { id: 8, name: "Juan Pablo Rojas", dorsal: 6, position: "Mediocampista Defensivo" },
    { id: 9, name: "Valentina Ruiz", dorsal: 11, position: "Extremo Izquierdo" },
  ];

  const handleDragStart = (e: React.DragEvent, player: Player) => {
    e.dataTransfer.setData("player", JSON.stringify(player));
  };

  const handleDrop = (e: React.DragEvent, positionId: number) => {
    e.preventDefault();
    const player = JSON.parse(e.dataTransfer.getData("player"));
    setAssignments({ ...assignments, [positionId]: player });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removePlayer = (positionId: number) => {
    const newAssignments = { ...assignments };
    delete newAssignments[positionId];
    setAssignments(newAssignments);
  };

  const assignedPlayerIds = Object.values(assignments)
    .filter((p) => p !== null)
    .map((p) => p!.id);

  const unassignedPlayers = availablePlayers.filter((p) => !assignedPlayerIds.includes(p.id));

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userName="Felipe Jiménez" role="Capitán" />
      <div className="flex flex-1">
        <Sidebar sections={captainSidebar} />
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Configurar alineación</h1>
              <p className="text-muted-foreground">
                Arrastra los jugadores a las posiciones en el campo
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
              {/* Campo de fútbol */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="font-semibold">Formación:</label>
                  <select
                    value={selectedFormation}
                    onChange={(e) => {
                      setSelectedFormation(e.target.value as keyof typeof formations);
                      setAssignments({});
                    }}
                    className="rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                  >
                    <option value="4-4-2">4-4-2</option>
                    <option value="4-3-3">4-3-3</option>
                    <option value="3-5-2">3-5-2</option>
                  </select>
                </div>

                <div className="relative h-[700px] overflow-hidden rounded-xl border-4 border-white bg-gradient-to-b from-[#4ADE80] to-[#22C55E]">
                  {/* Líneas del campo */}
                  <div className="absolute inset-0">
                    {/* Línea central */}
                    <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-white"></div>
                    {/* Círculo central */}
                    <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"></div>
                    {/* Área superior */}
                    <div className="absolute left-1/2 top-0 h-20 w-48 -translate-x-1/2 border-2 border-b-0 border-white"></div>
                    {/* Área inferior */}
                    <div className="absolute bottom-0 left-1/2 h-20 w-48 -translate-x-1/2 border-2 border-t-0 border-white"></div>
                  </div>

                  {/* Posiciones */}
                  {formations[selectedFormation].map((position) => (
                    <div
                      key={position.id}
                      onDrop={(e) => handleDrop(e, position.id)}
                      onDragOver={handleDragOver}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ top: position.top, left: position.left }}
                    >
                      {assignments[position.id] ? (
                        <div className="group relative">
                          <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-4 border-white bg-primary text-xs font-bold text-white shadow-lg">
                            <div className="text-2xl">{assignments[position.id]!.dorsal}</div>
                          </div>
                          <div className="absolute -bottom-8 left-1/2 w-32 -translate-x-1/2 text-center text-xs font-bold text-white drop-shadow-lg">
                            {assignments[position.id]!.name.split(" ")[0]}
                          </div>
                          <button
                            onClick={() => removePlayer(position.id)}
                            className="absolute -right-2 -top-2 hidden h-6 w-6 items-center justify-center rounded-full bg-[#EF4444] text-xs font-bold text-white group-hover:flex"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-dashed border-white/50 bg-white/20 text-xs font-bold text-white">
                          ?
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Panel de jugadores */}
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="mb-4 text-xl font-bold">Jugadores disponibles</h2>
                  <div className="space-y-2">
                    {unassignedPlayers.length > 0 ? (
                      unassignedPlayers.map((player) => (
                        <div
                          key={player.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, player)}
                          className="flex cursor-move items-center gap-3 rounded-lg border border-border bg-background p-3 transition hover:border-primary hover:bg-accent"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                            {player.dorsal}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{player.name}</p>
                            <p className="text-xs text-muted-foreground">{player.position}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-sm text-muted-foreground">
                        Todos los jugadores asignados
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-lg bg-blue-500/10 p-4 text-sm text-blue-600">
                  <p className="font-semibold">Instrucciones:</p>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li>• Arrastra los jugadores al campo</li>
                    <li>• Haz clic en la X para remover</li>
                    <li>• Cambia de formación arriba</li>
                  </ul>
                </div>

                <button className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90">
                  Guardar alineación
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
