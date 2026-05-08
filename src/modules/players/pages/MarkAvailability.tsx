import { useState } from "react";
import Navbar from "../../../shared/components/shared/Navbar";
import Sidebar from "../../../shared/components/shared/Sidebar";
import { Home, User, Users, Trophy, BarChart3, Calendar } from "lucide-react";

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

type AvailabilityStatus = "available" | "unavailable" | "pending" | "";

export default function MarkAvailability() {
  const [selectedDays, setSelectedDays] = useState<Record<number, AvailabilityStatus>>({
    1: "available",
    5: "available",
    8: "unavailable",
    12: "available",
    15: "pending",
    20: "available",
  });

  const toggleDayStatus = (day: number) => {
    const statuses: AvailabilityStatus[] = ["", "available", "unavailable", "pending"];
    const currentStatus = selectedDays[day] || "";
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    setSelectedDays({
      ...selectedDays,
      [day]: nextStatus,
    });
  };

  const getStatusColor = (status: AvailabilityStatus) => {
    switch (status) {
      case "available":
        return "bg-[#4ADE80] text-white";
      case "unavailable":
        return "bg-[#EF4444] text-white";
      case "pending":
        return "bg-[#FACC15] text-black";
      default:
        return "bg-background hover:bg-accent";
    }
  };

  const daysInMonth = 30;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const counts = {
    available: Object.values(selectedDays).filter((s) => s === "available").length,
    unavailable: Object.values(selectedDays).filter((s) => s === "unavailable").length,
    pending: Object.values(selectedDays).filter((s) => s === "pending").length,
  };

  return (
    <div className="flex min-h-screen flex-col">
      
      <div className="flex flex-1">
        
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Marcar disponibilidad</h1>
              <p className="text-muted-foreground">
                Indica los días en que estás disponible para jugar
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Calendario */}
              <div className="lg:col-span-2">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="mb-6 text-xl font-bold">Abril 2025</h2>

                  {/* Días de la semana */}
                  <div className="mb-4 grid grid-cols-7 gap-2">
                    {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                      <div key={day} className="text-center text-sm font-bold text-muted-foreground">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Grid de días */}
                  <div className="grid grid-cols-7 gap-2">
                    {days.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDayStatus(day)}
                        className={`aspect-square rounded-lg border border-border p-2 text-center font-semibold transition ${getStatusColor(
                          selectedDays[day]
                        )}`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  {/* Leyenda */}
                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 md:grid-cols-4">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-[#4ADE80]"></div>
                      <span className="text-sm">Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-[#EF4444]"></div>
                      <span className="text-sm">No disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-[#FACC15]"></div>
                      <span className="text-sm">Por confirmar</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded border border-border bg-background"></div>
                      <span className="text-sm">Sin definir</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel lateral */}
              <div className="space-y-6">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="mb-6 text-xl font-bold">Resumen</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Días disponibles</span>
                      <span className="text-2xl font-bold text-[#4ADE80]">{counts.available}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">No disponibles</span>
                      <span className="text-2xl font-bold text-[#EF4444]">{counts.unavailable}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Por confirmar</span>
                      <span className="text-2xl font-bold text-[#FACC15]">{counts.pending}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90">
                  Guardar disponibilidad
                </button>

                <div className="rounded-lg bg-blue-500/10 p-4 text-sm text-blue-600">
                  <p className="font-semibold">Tip:</p>
                  <p className="mt-1">Haz clic en un día para cambiar tu disponibilidad</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


