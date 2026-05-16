import { useEffect } from "react";
import { User, UserPlus } from "lucide-react";
import { Link } from "react-router";
import { useAuthStore } from "../../auth/hooks/useAuthStore";

export default function UserProfile() {
  const authUser = useAuthStore((state) => state.user);
  const displayName = authUser?.fullName ?? "Sebastian Torres";
  const displayEmail = authUser?.email ?? "sebastian.torres@escuelaing.edu.co";

  useEffect(() => {
    if (authUser?.email) {
      sessionStorage.setItem("playerEmail", authUser.email.trim().toLowerCase());
    }
  }, [authUser?.email]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Mi perfil</h1>
              <Link
                to="/player/profile/becomePlayer"
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                <UserPlus className="h-4 w-4" />
                Volverme jugador
              </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-[260px_1fr]">
              <div className="flex flex-col items-center gap-4 md:items-start">
                <div className="flex h-56 w-56 items-center justify-center overflow-hidden rounded-full border-4 border-border bg-background">
                  <User className="h-24 w-24 text-muted-foreground" />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Nombre</p>
                  <h2 className="text-2xl font-bold text-foreground">{displayName}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{displayEmail}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">Rol</p>
                      <p className="text-lg font-semibold text-foreground">Usuario</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">Permisos</p>
                      <p className="text-lg font-semibold text-foreground">Consulta</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <User className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-bold">Perfil general</h2>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Este perfil corresponde a un usuario sin rol deportivo asignado.
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
