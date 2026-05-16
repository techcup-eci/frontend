import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { AlertCircle, Edit, Shield, Target, Trophy, User, UserPlus } from "lucide-react";
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
  const resolvedIsPlayer = Boolean(profile) || isPlayer;
  const availabilityLabel = profile?.state ?? storedForm?.state ?? "ACTIVE";

  const availabilityText = availabilityLabel === "ACTIVE" ? "Activo" : "Inactivo";
  const lateralityText = profile?.laterality ?? storedForm?.laterality ?? "RIGHT";
  const lateralityLabel =
    lateralityText === "LEFT" ? "Izquierda" : lateralityText === "BOTH" ? "Ambidiestra" : "Derecha";
  const statureLabel = profile?.stature ?? storedForm?.stature ?? "1.70";

  const playerInfo = {
    position: profile?.position ?? storedForm?.position ?? "Mediocampista Central",
    preferredNumber,
    teamName: "Los Algoritmos FC",
    laterality: lateralityLabel,
    stature: statureLabel,
  };

	const roleLabel = resolvedIsPlayer ? "Jugador" : "Usuario";
  const displayName = authUser?.fullName ?? "Sebastián Torres";
  const displayEmail = profile?.email ?? authUser?.email ?? "sebastian.torres@escuelaing.edu.co";

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
              <div className="rounded-lg border border-border bg-red-500/10 px-4 py-3 text-sm text-red-700">
                No fue posible cargar el perfil deportivo.
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

                {/* Estadísticas del torneo */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-6 flex items-center gap-3">
                    <Trophy className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-bold">Estadísticas del torneo</h2>
                  </div>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border border-border bg-background p-4 text-center shadow-sm">
                      <Target className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <p className="mb-1 text-3xl font-bold">3</p>
                      <p className="text-sm text-muted-foreground">Goles marcados</p>
                    </div>
                    <div className="rounded-lg border border-border bg-background p-4 text-center shadow-sm">
                      <Trophy className="mx-auto mb-2 h-8 w-8 text-[#4ADE80]" />
                      <p className="mb-1 text-3xl font-bold">4</p>
                      <p className="text-sm text-muted-foreground">Partidos jugados</p>
                    </div>
                    <div className="rounded-lg border border-border bg-background p-4 text-center shadow-sm">
                      <AlertCircle className="mx-auto mb-2 h-8 w-8 text-[#FACC15]" />
                      <p className="mb-1 text-3xl font-bold">1</p>
                      <p className="text-sm text-muted-foreground">Tarjetas amarillas</p>
                    </div>
                    <div className="rounded-lg border border-border bg-background p-4 text-center shadow-sm">
                      <AlertCircle className="mx-auto mb-2 h-8 w-8 text-[#EF4444]" />
                      <p className="mb-1 text-3xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">Tarjetas rojas</p>
                    </div>
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


