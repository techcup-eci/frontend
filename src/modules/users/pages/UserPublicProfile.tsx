import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import axios from "axios";
import {
  User,
  ArrowLeft,
  Loader2,
  XCircle,
  GraduationCap,
  BadgeInfo,
  CheckCircle,
} from "lucide-react";
import { apiClient } from "../../../core/api/apiClient";

// TODO: obtener del contexto de autenticación
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8082";
const TEAM_ID = import.meta.env.VITE_TEAM_ID ?? "1";
const USER_ID = import.meta.env.VITE_USER_ID ?? "10";

interface UserData {
  id: number;
  name: string;
  email: string;
  birthDate: string;
  role: string;
  relationship: string;
  academicProgram: string;
  semester: number;
  identificationType: string;
  identificationNumber: number;
  phone: number;
  systemRole: string;
}

export default function UserPublicProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fromRequests = searchParams.get("from") === "requests";
  const teamId = searchParams.get("teamId") ?? TEAM_ID;

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionDone, setActionDone] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetchUser();
  }, [userId]);

  async function fetchUser() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get<UserData>(`/api/users/${userId}`, {
        headers: { "X-User-Id": USER_ID },
      });
      setUser(data);
    } catch {
      setError("No se pudo cargar el perfil del jugador. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(action: "accept" | "reject") {
    setActionLoading(true);
    setActionError(null);
    try {
      await axios.post(
        `${BASE_URL}/api/teams/${teamId}/solicitudes/${userId}/${action}`,
        {},
        { headers: { "X-User-Id": USER_ID } }
      );
      const msg =
        action === "accept"
          ? "Jugador aceptado en el equipo exitosamente"
          : "Solicitud rechazada exitosamente";
      setSuccessMessage(msg);
      setActionDone(true);
      setTimeout(() => navigate("/captain/requests"), 2500);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? err.message
        : `Error al ${action === "accept" ? "aceptar" : "rechazar"} la solicitud`;
      setActionError(msg);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-2xl space-y-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </button>

            {error && (
              <div className="flex items-center gap-3 rounded-lg bg-[#EF4444]/10 px-4 py-3 text-sm font-medium text-[#EF4444]">
                <XCircle className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center rounded-xl border border-border bg-card py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Cargando perfil...</span>
              </div>
            ) : user ? (
              <>
                {/* Avatar + nombre */}
                <div className="rounded-xl border border-border bg-card p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                    {user.systemRole && (
                      <span className="mt-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
                        {user.systemRole.toLowerCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Información académica */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-bold">Información académica</h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {user.academicProgram && (
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Programa académico</p>
                        <p className="font-semibold">{user.academicProgram}</p>
                      </div>
                    )}
                    {user.semester > 0 && (
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Semestre</p>
                        <p className="font-semibold">{user.semester}</p>
                      </div>
                    )}
                    {user.role && (
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Rol en la institución</p>
                        <p className="font-semibold capitalize">{user.role.toLowerCase()}</p>
                      </div>
                    )}
                    {user.relationship && (
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Relación</p>
                        <p className="font-semibold">{user.relationship}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Información personal */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <BadgeInfo className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-bold">Información personal</h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {user.birthDate && (
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Fecha de nacimiento</p>
                        <p className="font-semibold">{user.birthDate}</p>
                      </div>
                    )}
                    {user.identificationType && (
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Tipo de identificación</p>
                        <p className="font-semibold">{user.identificationType}</p>
                      </div>
                    )}
                    {user.identificationNumber && (
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Número de identificación</p>
                        <p className="font-semibold">{user.identificationNumber}</p>
                      </div>
                    )}
                    {user.phone && (
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Teléfono</p>
                        <p className="font-semibold">{user.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botones de acción — solo si viene desde solicitudes */}
                {fromRequests && (
                  <div className="space-y-4">
                    {successMessage && (
                      <div className="flex items-center gap-3 rounded-lg bg-[#4ADE80]/10 px-4 py-3 text-sm font-medium text-[#4ADE80]">
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                        {successMessage}
                        <span className="ml-auto text-xs opacity-70">Redirigiendo...</span>
                      </div>
                    )}
                    {actionError && (
                      <div className="flex items-center gap-3 rounded-lg bg-[#EF4444]/10 px-4 py-3 text-sm font-medium text-[#EF4444]">
                        <XCircle className="h-5 w-5 flex-shrink-0" />
                        {actionError}
                      </div>
                    )}
                    {!actionDone && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <button
                          onClick={() => handleAction("reject")}
                          disabled={actionLoading}
                          className="flex items-center justify-center gap-2 rounded-xl border border-destructive bg-destructive/10 px-6 py-4 text-base font-medium text-destructive transition hover:bg-destructive/20 disabled:opacity-50"
                        >
                          {actionLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <>
                              <XCircle className="h-5 w-5" />
                              Rechazar solicitud
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleAction("accept")}
                          disabled={actionLoading}
                          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                        >
                          {actionLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="h-5 w-5" />
                              Aceptar al equipo
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
                <User className="mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-bold">Perfil no encontrado</h3>
                <p className="text-muted-foreground">
                  No se encontró información para este jugador
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
