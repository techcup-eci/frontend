import { useState } from "react";
import Navbar from "../../../shared/components/shared/Navbar";
import Sidebar from "../../../shared/components/shared/Sidebar";
import { Home, Users, FileText, Search, Edit, Trash2 } from "lucide-react";
import Badge from "../../../shared/components/shared/Badge";

const adminSidebar = [
  {
    items: [
      { label: "Dashboard", path: "/admin/dashboard", icon: Home },
      { label: "Gestionar Usuarios", path: "/admin/players", icon: Users },
      { label: "Registro de Auditoría", path: "/admin/audit", icon: FileText },
    ],
  },
];

type User = {
  id: number;
  name: string;
  email: string;
  role: "Jugador" | "Capitán" | "Organizador" | "Árbitro" | "Administrador";
  status: "active" | "inactive";
  lastLogin: string;
};

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Sebastián Torres",
      email: "sebastian.torres@escuelaing.edu.co",
      role: "Jugador",
      status: "active",
      lastLogin: "2025-04-10",
    },
    {
      id: 2,
      name: "Felipe Jiménez",
      email: "felipe.jimenez@escuelaing.edu.co",
      role: "Capitán",
      status: "active",
      lastLogin: "2025-04-09",
    },
    {
      id: 3,
      name: "Andrés Sarmiento",
      email: "andres.sarmiento@escuelaing.edu.co",
      role: "Organizador",
      status: "active",
      lastLogin: "2025-04-10",
    },
    {
      id: 4,
      name: "Carlos Martínez",
      email: "carlos.martinez@gmail.com",
      role: "Árbitro",
      status: "active",
      lastLogin: "2025-04-08",
    },
    {
      id: 5,
      name: "María González",
      email: "maria.gonzalez@escuelaing.edu.co",
      role: "Jugador",
      status: "inactive",
      lastLogin: "2025-03-15",
    },
    {
      id: 6,
      name: "Camila Herrera",
      email: "camila.herrera@escuelaing.edu.co",
      role: "Jugador",
      status: "active",
      lastLogin: "2025-04-10",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteUser = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
      setEditingUser(null);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Administrador":
        return "error";
      case "Organizador":
        return "warning";
      case "Capitán":
        return "info";
      case "Árbitro":
        return "success";
      default:
        return "pending";
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      
      <div className="flex flex-1">
        
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Gestionar usuarios</h1>
              <p className="text-muted-foreground">Administra roles y permisos de los usuarios del sistema</p>
            </div>

            {/* Filtros */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o correo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-border bg-input-background py-3 pl-10 pr-4 focus:border-primary focus:outline-none"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
              >
                <option value="">Todos los roles</option>
                <option value="Jugador">Jugador</option>
                <option value="Capitán">Capitán</option>
                <option value="Organizador">Organizador</option>
                <option value="Árbitro">Árbitro</option>
                <option value="Administrador">Administrador</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
              >
                <option value="">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>

            {/* Tabla de usuarios */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Usuarios ({filteredUsers.length})</h2>
                <button className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary/90">
                  Crear usuario
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-accent/5">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold">Usuario</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Rol</th>
                      <th className="px-4 py-3 text-center text-sm font-bold">Estado</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Último acceso</th>
                      <th className="px-4 py-3 text-center text-sm font-bold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, idx) => (
                      <tr
                        key={user.id}
                        className={`border-b border-border ${idx % 2 === 0 ? "bg-background" : ""}`}
                      >
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Badge variant={user.status === "active" ? "success" : "error"}>
                            {user.status === "active" ? "Activo" : "Inactivo"}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {new Date(user.lastLogin).toLocaleDateString("es-CO", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setEditingUser(user)}
                              className="rounded-lg bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="rounded-lg bg-[#EF4444] p-2 text-white transition hover:bg-[#DC2626]"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Modal de edición */}
          {editingUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">
                <h2 className="mb-6 text-xl font-bold">Editar usuario</h2>
                <form onSubmit={handleUpdateUser} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Nombre completo</label>
                    <input
                      type="text"
                      required
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Correo electrónico</label>
                    <input
                      type="email"
                      required
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Rol</label>
                    <select
                      required
                      value={editingUser.role}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          role: e.target.value as User["role"],
                        })
                      }
                      className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                    >
                      <option value="Jugador">Jugador</option>
                      <option value="Capitán">Capitán</option>
                      <option value="Organizador">Organizador</option>
                      <option value="Árbitro">Árbitro</option>
                      <option value="Administrador">Administrador</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Estado</label>
                    <select
                      required
                      value={editingUser.status}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          status: e.target.value as User["status"],
                        })
                      }
                      className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
                    >
                      Guardar cambios
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="flex-1 rounded-lg border border-border bg-background px-6 py-3 font-semibold transition hover:bg-accent"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

