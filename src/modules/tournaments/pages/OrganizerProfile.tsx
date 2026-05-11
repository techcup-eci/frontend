import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { AlertCircle, Shield, Target, Trophy, User } from "lucide-react";
import Badge from "../../../shared/components/shared/Badge";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { useAthleticProfile } from "../../players/hooks/useAthleticProfile";

interface PlayerProfileForm {
  position: string;
  number: string;
  semester: string;
  relationship: string;
  studentLevel: string;
  professorType: string;
}

export default function OrganizerProfile() {
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
  const { data: profile, isLoading, isError } = useAthleticProfile(userEmail || undefined);

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

  const storedNumber = storedForm?.number ? Number(storedForm.number) : null;
  const storedSemester = storedForm?.semester ? Number(storedForm.semester) : null;
  const preferredNumber = profile?.dorsalNumber ??
    (storedNumber && Number.isFinite(storedNumber) ? storedNumber : 8);
  const currentSemester = storedSemester && Number.isFinite(storedSemester)
    ? storedSemester
    : 6;
  const resolvedIsPlayer = Boolean(profile) || isPlayer;
  const availabilityLabel = profile?.state ?? "Disponible";

  const playerInfo = {
    position: profile?.position ?? storedForm?.position ?? "Mediocampista Central",
    preferredNumber,
    currentSemester,
    teamName: "Los Algoritmos FC",
    showSemester:
      storedForm?.relationship === "estudiante" &&
      storedForm?.studentLevel === "pregrado",
  };

  const roleLabel = "Organizador";
  const displayName = authUser?.fullName ?? "Sebastian Torres";
  const displayEmail = profile?.email ?? authUser?.email ?? "sebastian.torres@escuelaing.edu.co";

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-[#b42d3c] p-8">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Mi perfil</h1>
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
                  <p className="text-sm uppercase tracking-[0.2em] text-white/70">Nombre</p>
                  <h2 className="text-2xl font-bold text-white">{displayName}</h2>
                  <p className="mt-2 text-sm text-white/70">{displayEmail}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border border-[#b42d3c]/35 bg-gradient-to-r from-[#f3d3d3] to-[#ead0d0] p-6 shadow-sm">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">Rol</p>
                      <p className="text-lg font-semibold text-foreground">{roleLabel}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">Disponibilidad</p>
                      <Badge variant="success">{availabilityLabel}</Badge>
                    </div>
                  </div>
                </div>

                {resolvedIsPlayer && (
                  <div className="rounded-xl border border-[#b42d3c]/35 bg-gradient-to-r from-[#f3d3d3] to-[#ead0d0] p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Shield className="h-6 w-6 text-primary" />
                        <h2 className="text-xl font-bold">Informacion deportiva</h2>
                      </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-black text-primary-foreground">
                        {playerInfo.preferredNumber}
                      </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Posicion</p>
                        <p className="text-lg font-bold">{playerInfo.position}</p>
                      </div>
                      {playerInfo.showSemester && (
                        <div>
                          <p className="mb-1 text-sm text-muted-foreground">Semestre actual</p>
                          <p className="text-lg font-bold">{playerInfo.currentSemester}</p>
                        </div>
                      )}
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Equipo actual</p>
                        <p className="text-lg font-bold">{playerInfo.teamName}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-[#b42d3c]/35 bg-gradient-to-r from-[#f3d3d3] to-[#ead0d0] p-6 shadow-sm">
                  <div className="mb-6 flex items-center gap-3">
                    <Trophy className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-bold">Estadisticas del torneo</h2>
                  </div>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border border-border bg-white p-4 text-center shadow-sm">
                      <Target className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <p className="mb-1 text-3xl font-bold">3</p>
                      <p className="text-sm text-muted-foreground">Goles marcados</p>
                    </div>
                    <div className="rounded-lg border border-border bg-white p-4 text-center shadow-sm">
                      <Trophy className="mx-auto mb-2 h-8 w-8 text-[#4ADE80]" />
                      <p className="mb-1 text-3xl font-bold">4</p>
                      <p className="text-sm text-muted-foreground">Partidos jugados</p>
                    </div>
                    <div className="rounded-lg border border-border bg-white p-4 text-center shadow-sm">
                      <AlertCircle className="mx-auto mb-2 h-8 w-8 text-[#FACC15]" />
                      <p className="mb-1 text-3xl font-bold">1</p>
                      <p className="text-sm text-muted-foreground">Tarjetas amarillas</p>
                    </div>
                    <div className="rounded-lg border border-border bg-white p-4 text-center shadow-sm">
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
