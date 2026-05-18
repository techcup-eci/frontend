import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Edit, Shield, Target, Trophy, User, UserPlus } from "lucide-react";
import Badge from "../../../shared/components/shared/Badge";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { useAthleticProfile } from "../hooks/useAthleticProfile";

interface PlayerProfileForm {
  position: string;
  dorsalNumber: string;
  laterality: string;
  stature: string;
  state: string;
}

export default function ViewProfile() {
	const [searchParams] = useSearchParams();
  const authUser = useAuthStore((state) => state.user);
  const emailFromQuery = searchParams.get("email");
  const storedEmail = sessionStorage.getItem("playerEmail") ?? "";
  const userEmail = authUser?.email ?? emailFromQuery ?? storedEmail;
  const storageKey = (base: string) => (userEmail ? `${base}:${userEmail}` : base);

  // Use the actual role from auth store — not session storage
  const userRole = authUser?.role ?? "invited";
  const isPlayerRole = userRole === "player" || userRole === "captain";

  const [isPlayer, setIsPlayer] = useState(() => {
    const fromQuery = searchParams.get("player") === "true";
    const fromStorage = sessionStorage.getItem(storageKey("isPlayer")) === "true";
    return fromQuery || fromStorage;
  });
  const { data: profile, isLoading, isError } = useAthleticProfile(
    userEmail || undefined,
  );

  useEffect(() => {
    if (userEmail) {
      sessionStorage.setItem("playerEmail", userEmail);
    }
  }, [userEmail]);

  const storedForm = useMemo(() => {
    const raw = sessionStorage.getItem(storageKey("playerProfileForm"));
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as PlayerProfileForm;
    } catch {
      return null;
    }
  }, [userEmail]);

  const photoPreview = sessionStorage.getItem(storageKey("playerProfilePhoto")) ?? "";

  const storedNumber = storedForm?.dorsalNumber ? Number(storedForm.dorsalNumber) : null;
  const preferredNumber = profile?.dorsalNumber ??
    (storedNumber && Number.isFinite(storedNumber) ? storedNumber : 8);
  const resolvedIsPlayer = Boolean(profile) || isPlayer || isPlayerRole;
  const availabilityLabel = profile?.state ?? storedForm?.state ?? "ACTIVE";

  const availabilityText = availabilityLabel === "ACTIVE" ? "Activo" : "Inactivo";
  const lateralityText = profile?.laterality ?? storedForm?.laterality ?? "RIGHT";
  const lateralityLabel =
    lateralityText === "LEFT" ? "Izquierda" : lateralityText === "BOTH" ? "Ambidiestra" : "Derecha";
  const statureLabel = profile?.stature ?? storedForm?.stature ?? "1.70";

  const playerInfo = {
    position: profile?.position ?? storedForm?.position ?? "Mediocampista Central",
    preferredNumber,
    teamName: "Sin equipo",
    laterality: lateralityLabel,
    stature: statureLabel,
  };

	const roleLabels: Record<string, string> = {
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
          onClick={() => {
            setIsPlayer(true);
            sessionStorage.setItem(storageKey("isPlayer"), "true");
          }}
                  className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 font-medium text-ink transition hover:bg-secondary/90"
                >
                  <Edit className="h-4 w-4" />
                  Actualizar información
                </Link>
              ) : (
                <Link
                  to="/player/profile/becomePlayer"
          onClick={() => {
            setIsPlayer(false);
            sessionStorage.setItem(storageKey("isPlayer"), "false");
          }}
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

            {isError && (
              <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                No tienes un perfil deportivo aún.{' '}
                <Link to="/player/profile/becomePlayer" className="text-primary underline hover:no-underline">
                  Crea uno aquí
                </Link>
              </div>
            )}


            <div className="grid gap-8 md:grid-cols-[260px_1fr]">
              <div className="flex flex-col items-center gap-4 md:items-start">
                <div className="flex h-56 w-56 items-center justify-center overflow-hidden rounded-full border-4 border-border bg-background">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Foto de perfil"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-24 w-24 text-muted-foreground" />
                  )}
                </div>
                <div className="text-center md:text-left">
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Nombre</p>
                  <h2 className="text-2xl font-bold text-foreground">{displayName}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {displayEmail}
                  </p>
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
                      <Badge variant="success">{availabilityText}</Badge>
                    </div>
                  </div>
                </div>

                {resolvedIsPlayer && (
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Shield className="h-6 w-6 text-primary" />
                        <h2 className="text-xl font-bold">Información deportiva</h2>
                      </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-black text-primary-foreground">
                        {playerInfo.preferredNumber}
                      </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Posición</p>
                        <p className="text-lg font-bold">{playerInfo.position}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Lateralidad</p>
                        <p className="text-lg font-bold">{playerInfo.laterality}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Estatura</p>
                        <p className="text-lg font-bold">{playerInfo.stature} m</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Equipo actual</p>
                        <p className="text-lg font-bold">{playerInfo.teamName}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Estadísticas del torneo — solo para jugadores */}
                {resolvedIsPlayer ? (
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                      <Trophy className="h-6 w-6 text-primary" />
                      <h2 className="text-xl font-bold">Estadísticas del torneo</h2>
                    </div>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Target className="mb-3 h-12 w-12 text-muted-foreground" />
                      <p className="text-lg font-semibold text-muted-foreground">Sin estadísticas aún</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Tus estadísticas aparecerán cuando participes en partidos del torneo
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                      <Trophy className="h-6 w-6 text-muted-foreground" />
                      <h2 className="text-xl font-bold text-muted-foreground">Estadísticas del torneo</h2>
                    </div>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Trophy className="mb-3 h-12 w-12 text-muted-foreground" />
                      <p className="text-lg font-semibold text-muted-foreground">No aplica</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Las estadísticas del torneo están disponibles solo para jugadores
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
