import { useState } from "react";
import Navbar from "../../../shared/components/shared/Navbar";
import Sidebar from "../../../shared/components/shared/Sidebar";
import { Home, Users, FileText, Search, Calendar, Filter } from "lucide-react";
import Badge from "../../../shared/components/shared/Badge";

const adminSidebar = [
  {
    items: [
      { label: "Dashboard", path: "/admin/dashboard", icon: Home },
      { label: "Gestionar Usuarios", path: "/admin/users", icon: Users },
      { label: "Registro de Auditoría", path: "/admin/audit", icon: FileText },
    ],
  },
];

type AuditEntry = {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  description: string;
  ipAddress: string;
  severity: "info" | "warning" | "error";
};

export default function AuditLog() {
  const [entries] = useState<AuditEntry[]>([
    {
      id: 1,
      timestamp: "2025-04-10 14:32:15",
      user: "Andrés Sarmiento",
      action: "Crear",
      entity: "Partido",
      description: "Programó partido: Los Algoritmos FC vs Byte Brothers",
      ipAddress: "192.168.1.45",
      severity: "info",
    },
    {
      id: 2,
      timestamp: "2025-04-10 14:15:03",
      user: "Laura Jiménez",
      action: "Actualizar",
      entity: "Usuario",
      description: "Cambió el rol de Sebastián Torres a Capitán",
      ipAddress: "192.168.1.12",
      severity: "warning",
    },
    {
      id: 3,
      timestamp: "2025-04-10 13:45:22",
      user: "Felipe Jiménez",
      action: "Eliminar",
      entity: "Jugador",
      description: "Removió a Carlos Díaz del equipo Los Algoritmos FC",
      ipAddress: "192.168.1.78",
      severity: "warning",
    },
    {
      id: 4,
      timestamp: "2025-04-10 12:20:11",
      user: "Sistema",
      action: "Error",
      entity: "Pago",
      description: "Falló el procesamiento de pago para el equipo Neural FC",
      ipAddress: "192.168.1.1",
      severity: "error",
    },
    {
      id: 5,
      timestamp: "2025-04-10 11:05:47",
      user: "Andrés Sarmiento",
      action: "Actualizar",
      entity: "Resultado",
      description: "Registró resultado: Los Algoritmos FC 3 - 2 Byte Brothers",
      ipAddress: "192.168.1.45",
      severity: "info",
    },
    {
      id: 6,
      timestamp: "2025-04-10 10:30:33",
      user: "Sebastián Torres",
      action: "Crear",
      entity: "Perfil",
      description: "Creó su perfil deportivo",
      ipAddress: "192.168.1.89",
      severity: "info",
    },
    {
      id: 7,
      timestamp: "2025-04-10 09:15:58",
      user: "Laura Jiménez",
      action: "Eliminar",
      entity: "Usuario",
      description: "Eliminó la cuenta de Juan Pérez (inactivo por 90 días)",
      ipAddress: "192.168.1.12",
      severity: "error",
    },
    {
      id: 8,
      timestamp: "2025-04-09 18:42:19",
      user: "Carlos Martínez",
      action: "Actualizar",
      entity: "Partido",
      description: "Actualizó el horario del partido en Cancha Principal ECI",
      ipAddress: "192.168.1.56",
      severity: "warning",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.entity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = !actionFilter || entry.action === actionFilter;
    const matchesSeverity = !severityFilter || entry.severity === severityFilter;
    return matchesSearch && matchesAction && matchesSeverity;
  });

  const getSeverityBadge = (severity: AuditEntry["severity"]) => {
    switch (severity) {
      case "info":
        return <Badge variant="info">Info</Badge>;
      case "warning":
        return <Badge variant="warning">Advertencia</Badge>;
      case "error":
        return <Badge variant="error">Error</Badge>;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "Crear":
        return <Badge variant="success">Crear</Badge>;
      case "Actualizar":
        return <Badge variant="info">Actualizar</Badge>;
      case "Eliminar":
        return <Badge variant="error">Eliminar</Badge>;
      case "Error":
        return <Badge variant="error">Error</Badge>;
      default:
        return <Badge variant="pending">{action}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      
      <div className="flex flex-1">
        
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Registro de auditoría</h1>
              <p className="text-muted-foreground">
                Historial completo de actividades del sistema
              </p>
            </div>

            {/* Filtros */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar en registros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-border bg-input-background py-3 pl-10 pr-4 focus:border-primary focus:outline-none"
                />
              </div>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
              >
                <option value="">Todas las acciones</option>
                <option value="Crear">Crear</option>
                <option value="Actualizar">Actualizar</option>
                <option value="Eliminar">Eliminar</option>
                <option value="Error">Error</option>
              </select>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
              >
                <option value="">Todas las severidades</option>
                <option value="info">Info</option>
                <option value="warning">Advertencia</option>
                <option value="error">Error</option>
              </select>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="mb-1 text-sm text-muted-foreground">Total de registros</p>
                <p className="text-2xl font-bold">{entries.length}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="mb-1 text-sm text-muted-foreground">Info</p>
                <p className="text-2xl font-bold text-blue-500">
                  {entries.filter((e) => e.severity === "info").length}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="mb-1 text-sm text-muted-foreground">Advertencias</p>
                <p className="text-2xl font-bold text-[#FACC15]">
                  {entries.filter((e) => e.severity === "warning").length}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="mb-1 text-sm text-muted-foreground">Errores</p>
                <p className="text-2xl font-bold text-[#EF4444]">
                  {entries.filter((e) => e.severity === "error").length}
                </p>
              </div>
            </div>

            {/* Tabla de registros */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-xl font-bold">Actividad reciente ({filteredEntries.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-accent/5">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold">Fecha y hora</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Usuario</th>
                      <th className="px-4 py-3 text-center text-sm font-bold">Acción</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Entidad</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Descripción</th>
                      <th className="px-4 py-3 text-center text-sm font-bold">Severidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.map((entry, idx) => (
                      <tr
                        key={entry.id}
                        className={`border-b border-border ${idx % 2 === 0 ? "bg-background" : ""}`}
                      >
                        <td className="px-4 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{entry.timestamp}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-semibold">{entry.user}</div>
                          <div className="text-xs text-muted-foreground">{entry.ipAddress}</div>
                        </td>
                        <td className="px-4 py-4 text-center">{getActionBadge(entry.action)}</td>
                        <td className="px-4 py-4 text-sm font-medium">{entry.entity}</td>
                        <td className="px-4 py-4 text-sm">{entry.description}</td>
                        <td className="px-4 py-4 text-center">{getSeverityBadge(entry.severity)}</td>
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
