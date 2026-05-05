import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { AlertCircle, Edit, Shield, Target, Trophy, User, UserPlus } from "lucide-react";
import Badge from "../../../shared/components/shared/Badge";

interface PlayerProfileForm {
  position: string;
  number: string;
  semester: string;
  relationship: string;
  studentLevel: string;
  professorType: string;
}

export default function ViewProfile() {
	const [searchParams] = useSearchParams();
  const [isPlayer, setIsPlayer] = useState(() => {
    const fromQuery = searchParams.get("player") === "true";
    const fromStorage = sessionStorage.getItem("isPlayer") === "true";
    return fromQuery || fromStorage;
  });

  const storedForm = useMemo(() => {
    const raw = sessionStorage.getItem("playerProfileForm");
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as PlayerProfileForm;
    } catch {
      return null;
    }
  }, []);

  const photoPreview = sessionStorage.getItem("playerProfilePhoto") ?? "";

  const playerInfo = {
    position: storedForm?.position ?? "Mediocampista Central",
    preferredNumber: storedForm?.number ? Number(storedForm.number) : 8,
    currentSemester: storedForm?.semester
      ? Number(storedForm.semester)
      : 6,
    teamName: "Los Algoritmos FC",
    showSemester:
      storedForm?.relationship === "estudiante" &&
      storedForm?.studentLevel === "pregrado",
  };

	const roleLabel = isPlayer ? "Jugador" : "Usuario";

  return (
    <div className="flex min-h-screen flex-col">

      <div className="flex flex-1">

        <main className="flex-1 bg-[#b42d3c] p-8">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Mi perfil</h1>
              {isPlayer ? (
                <Link
                  to="/player/profile/edit"
          onClick={() => {
            setIsPlayer(true);
            sessionStorage.setItem("isPlayer", "true");
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
            sessionStorage.setItem("isPlayer", "false");
          }}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  <UserPlus className="h-4 w-4" />
                  Volverme jugador
                </Link>
              )}
            </div>


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
                  <h2 className="text-2xl font-bold text-white">Sebastián Torres</h2>
                  <p className="mt-2 text-sm text-white/70">
                    sebastian.torres@escuelaing.edu.co
                  </p>
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
                      <Badge variant="success">Disponible</Badge>
                    </div>
                  </div>
                </div>

                {isPlayer && (
                  <div className="rounded-xl border border-[#b42d3c]/35 bg-gradient-to-r from-[#f3d3d3] to-[#ead0d0] p-6 shadow-sm">
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

                {/* Estadísticas del torneo */}
                <div className="rounded-xl border border-[#b42d3c]/35 bg-gradient-to-r from-[#f3d3d3] to-[#ead0d0] p-6 shadow-sm">
                  <div className="mb-6 flex items-center gap-3">
                    <Trophy className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-bold">Estadísticas del torneo</h2>
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


