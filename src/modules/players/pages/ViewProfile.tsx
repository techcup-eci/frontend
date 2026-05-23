import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { Edit, Shield, Target, Trophy, User, UserPlus } from "lucide-react";
import Badge from "../../../shared/components/shared/Badge";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { useAthleticProfile } from "../hooks/useAthleticProfile";

export default function ViewProfile() {
  const [searchParams] = useSearchParams();
  const authUser = useAuthStore((state) => state.user);
  const emailFromQuery = searchParams.get("email");
  const storedEmail = sessionStorage.getItem("playerEmail") ?? "";
  const userEmail = authUser?.email ?? emailFromQuery ?? storedEmail;

  const userRole = authUser?.role ?? "invited";
  const isPlayerRole = userRole === "PLAYER" || userRole === "CAPTAIN";

  const { data: profile, isLoading, isError } = useAthleticProfile(
    userEmail || undefined,
  );

  useEffect(() => {
    if (userEmail) {
      sessionStorage.setItem("playerEmail", userEmail);
    }
  }, [userEmail]);

  const hasProfile = Boolean(profile);
  const resolvedIsPlayer = hasProfile || isPlayerRole;

  const lateralityText = profile?.laterality ?? "RIGHT";
  const lateralityLabel =
    lateralityText === "LEFT" ? "Izquierda" : lateralityText === "BOTH" ? "Ambidiestra" : "Derecha";

  const availabilityText = profile?.state === "ACTIVE" ? "Activo" : "Inactivo";

  const roleLabels: Record<string, string> = {
    PLAYER: "Jugador",
    CAPTAIN: "Capitán",
    ORGANIZER: "Organizador",
    REFEREE: "Árbitro",
    ADMIN: "Administrador",
    INVITED: "Invitado",
    player: "Jugador",
    captain: "Capitán",
    organizer: "Organizador",
    referee: "Árbitro",
    admin: "Administrador",
    invited: "Invitado",
  };
  const roleLabel = roleLabels[userRole] ?? userRole;
  const displayName = authUser?.name ?? "Usuario";
  const displayEmail = profile?.email ?? authUser?.email ?? "";

  const photoPreview = userEmail ? sessionStorage.getItem(`playerProfilePhoto:${userEmail}`) ?? "" : "";

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Mi perfil</h1>
              {resolvedIsPlayer ? (
                <Link
                  to="/player/profile/edit"
                  className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 font-medium text-ink transition hover:bg-secondary/90"
                >
                  <Edit className="h-4 w-4" />
                  Actualizar información
                </Link>
              ) : (
                <Link
                  to="/player/profile/becomePlayer"
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  <UserPlus className="h-4 w-4" />
                  Volverme jugador
                </Link>
              )}
            </div>

            {isLoading && (
              <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                Cargando perfil desde el servidor...
              </div>
            )}

            {isError && !isLoading && (
              <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                No tienes un perfil deportivo aún.{" "}
                <Link to="/player/profile/becomePlayer" className="text-primary underline hover:no-underline">
                  Crea uno aquí
                </Link>
              </div>
            )}

            <div className="grid gap-8 md:grid-cols-[260px_1fr]">
              <div className="flex flex-col items-center gap-4 md:items-start">
                <div className="flex h-56 w-56 items-center justify-center overflow-hidden rounded-full border-4 border-border bg-background">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Foto de perfil" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-24 w-24 text-muted-foreground" />
                  )}
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
                      <p className="text-lg font-semibold text-foreground">{roleLabel}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">Estado</p>
                      <Badge variant={hasProfile ? "success" : "default"}>
                        {hasProfile ? availabilityText : "Sin perfil"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {resolvedIsPlayer && hasProfile && (
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Shield className="h-6 w-6 text-primary" />
                        <h2 className="text-xl font-bold">Información deportiva</h2>
                      </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-black text-primary-foreground">
                        {profile.dorsalNumber}
                      </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Posición</p>
                        <p className="text-lg font-bold">{profile.position}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Lateralidad</p>
                        <p className="text-lg font-bold">{lateralityLabel}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Estatura</p>
                        <p className="text-lg font-bold">{profile.stature} m</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Equipo actual</p>
                        <p className="text-lg font-bold">Sin equipo</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Estadísticas del torneo */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-6 flex items-center gap-3">
                    <Trophy className={`h-6 w-6 ${resolvedIsPlayer ? "text-primary" : "text-muted-foreground"}`} />
                    <h2 className={`text-xl font-bold ${resolvedIsPlayer ? "" : "text-muted-foreground"}`}>
                      Estadísticas del torneo
                    </h2>
                  </div>
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Target className="mb-3 h-12 w-12 text-muted-foreground" />
                    <p className="text-lg font-semibold text-muted-foreground">Sin estadísticas aún</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {resolvedIsPlayer
                        ? "Tus estadísticas aparecerán cuando participes en partidos del torneo"
                        : "Las estadísticas del torneo están disponibles solo para jugadores"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
