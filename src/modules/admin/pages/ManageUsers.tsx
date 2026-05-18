import { useState } from "react";
import { Search, RefreshCw, Shield } from "lucide-react";
import Badge from "../../../shared/components/shared/Badge";
import { useAdminUsers, useUpdateUserRole } from "../hooks/useAdminUsers";
import { ROLE_LABELS, ASSIGNABLE_ROLES, type AdminRole } from "../types/admin";
import { toast } from "sonner";

const roleBadgeVariant = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "error";
    case "ORGANIZER":
      return "warning";
    case "CAPTAIN":
      return "info";
    case "REFEREE":
      return "success";
    case "PLAYER":
      return "pending";
    default:
      return "pending";
  }
};

export default function ManageUsers() {
  const { data: users = [], isLoading, refetch } = useAdminUsers();
  const updateRole = useUpdateUserRole();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingUser, setEditingUser] = useState<{
    id: number;
    email: string;
    role: string;
  } | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus =
      !statusFilter ||
      (statusFilter === "active" ? user.active : !user.active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleChange = (userId: number, newRole: string) => {
    updateRole.mutate(
      { userId, role: newRole },
      {
        onSuccess: () => {
          toast.success("Rol actualizado", {
            description: `El usuario ahora es ${ROLE_LABELS[newRole] ?? newRole}`,
          });
          setEditingUser(null);
        },
        onError: (error) => {
          const message =
            error instanceof Error ? error.message : "No se pudo actualizar el rol";
          toast.error("Error al actualizar rol", { description: message });
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold">Gestionar usuarios</h1>
                <p className="text-muted-foreground">
                  Administra roles y permisos de los usuarios del sistema
                </p>
              </div>
              <button
                onClick={() => refetch()}
                className="rounded-lg border border-border bg-background px-4 py-2 font-medium transition hover:bg-accent"
              >
                <RefreshCw className="mr-2 inline h-4 w-4" />
                Actualizar
              </button>
            </div>

            {/* Filtros */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por correo..."
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
                {ASSIGNABLE_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
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
                <h2 className="text-xl font-bold">
                  Usuarios ({filteredUsers.length})
                </h2>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border bg-accent/5">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-bold">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold">
                          Rol
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-bold">
                          Estado
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-bold">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, idx) => (
                        <tr
                          key={user.id}
                          className={`border-b border-border ${idx % 2 === 0 ? "bg-background" : ""}`}
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="font-semibold">{user.email}</div>
                                <div className="text-xs text-muted-foreground">
                                  ID: {user.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge variant={roleBadgeVariant(user.role)}>
                              {ROLE_LABELS[user.role] ?? user.role}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Badge
                              variant={user.active ? "success" : "error"}
                            >
                              {user.active ? "Activo" : "Inactivo"}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() =>
                                  setEditingUser({
                                    id: user.id,
                                    email: user.email,
                                    role: user.role,
                                  })
                                }
                                className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                              >
                                Cambiar rol
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">
                      No se encontraron usuarios con los filtros seleccionados
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Modal de cambio de rol */}
          {editingUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">
                <h2 className="mb-2 text-xl font-bold">Cambiar rol</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  {editingUser.email}
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Nuevo rol
                    </label>
                    <select
                      value={editingUser.role}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          role: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-border bg-input-background px-4 py-2 focus:border-primary focus:outline-none"
                    >
                      {ASSIGNABLE_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABELS[r]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() =>
                        handleRoleChange(editingUser.id, editingUser.role)
                      }
                      disabled={updateRole.isPending}
                      className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                    >
                      {updateRole.isPending ? "Guardando..." : "Guardar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="flex-1 rounded-lg border border-border bg-background px-6 py-3 font-semibold transition hover:bg-accent"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
