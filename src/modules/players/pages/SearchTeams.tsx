import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { apiClient } from "../../../core/api/apiClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../shared/components/ui/dialog";
import { Shield, Users, User, Search, Hash, Loader2, CheckCircle, XCircle } from "lucide-react";

// TODO: obtener del contexto de autenticación
const USER_ID = import.meta.env.VITE_USER_ID ?? "10";

interface TeamDTO {
  id: number;
  name: string;
  colors: string;
  photo: string;
  idCaptain: number;
  currentPlayers: number;
  maxPlayers: number;
  tournamentStatus: string;
  code?: string;
}

type RequestStatus = "idle" | "loading" | "sent" | "error";

export default function SearchTeams() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [joinCodeOpen, setJoinCodeOpen] = useState(false);
  const [teamCode, setTeamCode] = useState("");
  const [teams, setTeams] = useState<TeamDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<Record<number, RequestStatus>>({});
  const [requestErrors, setRequestErrors] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    setLoading(true);
    setFetchError(null);
    try {
      const { data } = await apiClient.get<TeamDTO[]>("/api/teams");
      setTeams(data);
    } catch {
      setFetchError("Error al cargar los equipos. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendRequest(teamId: number) {
    setRequestStatus((prev) => ({ ...prev, [teamId]: "loading" }));
    setRequestErrors((prev) => {
      const next = { ...prev };
      delete next[teamId];
      return next;
    });
    try {
      await apiClient.post(
        `/api/teams/${teamId}/solicitudes`,
        {},
        { headers: { "X-User-Id": USER_ID } }
      );
      setRequestStatus((prev) => ({ ...prev, [teamId]: "sent" }));
    } catch (err: any) {
      setRequestStatus((prev) => ({ ...prev, [teamId]: "error" }));
      const msg = err?.response?.data?.message ?? "Error al enviar la solicitud.";
      setRequestErrors((prev) => ({ ...prev, [teamId]: msg }));
    }
  }

  const filteredTeams = teams.filter((team) => {
    const matchesSearch = team.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || team.tournamentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold">Buscar equipos disponibles</h1>
                <p className="text-muted-foreground">Encuentra un equipo para unirte al torneo</p>
              </div>
              <button
                onClick={() => setJoinCodeOpen(true)}
                className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                <Hash className="h-4 w-4" />
                Unirme con código de equipo
              </button>
            </div>

            <Dialog open={joinCodeOpen} onOpenChange={setJoinCodeOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Unirme con código de equipo</DialogTitle>
                  <DialogDescription>
                    Ingresa el código alfanumérico que te compartió el capitán del equipo.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <label className="mb-2 block font-medium">Código del equipo</label>
                  <input
                    type="text"
                    placeholder="Ej: ABC-12345"
                    value={teamCode}
                    onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
                    maxLength={20}
                  />
                </div>
                <DialogFooter>
                  <button
                    onClick={() => { setJoinCodeOpen(false); setTeamCode(""); }}
                    className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-accent"
                  >
                    Cancelar
                  </button>
                  <button
                    disabled={teamCode.trim().length === 0}
                    onClick={() => { setJoinCodeOpen(false); setTeamCode(""); }}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                  >
                    Confirmar
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-border bg-input-background py-3 pl-10 pr-4 focus:border-primary focus:outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-border bg-input-background px-4 py-3 focus:border-primary focus:outline-none"
              >
                <option value="">Todos los estados</option>
                <option value="ACTIVE">Aprobados</option>
                <option value="DRAFT">En revisión</option>
                <option value="NONE">Pendientes</option>
              </select>
            </div>

            {fetchError && (
              <div className="flex items-center gap-3 rounded-lg bg-[#EF4444]/10 px-4 py-3 text-sm font-medium text-[#EF4444]">
                <XCircle className="h-5 w-5 flex-shrink-0" />
                {fetchError}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Cargando equipos...</span>
              </div>
            ) : filteredTeams.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTeams.map((team) => {
                  const status = requestStatus[team.id] ?? "idle";
                  const errMsg = requestErrors[team.id];
                  const availableSlots = (team.maxPlayers ?? 12) - (team.currentPlayers ?? 0);

                  return (
                    <div key={team.id} className="overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-lg">
                      <div className="border-b border-border bg-gradient-to-r from-primary/5 to-accent/5 p-4">
                        <div className="flex items-center gap-4">
                          {team.photo ? (
                            <img
                              src={team.photo}
                              alt={team.name}
                              className="h-16 w-16 rounded-full border-2 border-border"
                            />
                          ) : (
                            <div
                              className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border"
                              style={{ backgroundColor: (team.colors ?? "#1B5E35") + "20" }}
                            >
                              <Shield
                                className="h-8 w-8"
                                style={{ color: team.colors ?? "#1B5E35" }}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="mb-1 text-lg font-bold">{team.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>Capitán ID: {team.idCaptain}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">
                              {team.currentPlayers ?? 0} / {team.maxPlayers ?? 12} jugadores
                            </span>
                          </div>
                          {team.colors && (
                            <div className="flex items-center gap-1.5">
                              <span
                                className="h-3 w-3 rounded-full border border-border"
                                style={{ backgroundColor: team.colors }}
                              />
                              <span className="font-mono text-xs text-muted-foreground">
                                {team.colors}
                              </span>
                            </div>
                          )}
                        </div>

                        {team.code && (
                          <p className="text-xs text-muted-foreground">
                            Código:{" "}
                            <span className="font-mono font-semibold">{team.code}</span>
                          </p>
                        )}

                        {availableSlots > 0 && (
                          <div className="rounded-lg bg-accent/10 p-3">
                            <p className="text-xs font-semibold text-muted-foreground">
                              {availableSlots}{" "}
                              {availableSlots === 1 ? "cupo libre" : "cupos libres"}
                            </p>
                          </div>
                        )}

                        {status === "sent" && (
                          <div className="flex items-center gap-2 rounded-lg bg-[#4ADE80]/10 px-3 py-2 text-sm font-medium text-[#4ADE80]">
                            <CheckCircle className="h-4 w-4 flex-shrink-0" />
                            Solicitud enviada correctamente
                          </div>
                        )}
                        {status === "error" && errMsg && (
                          <div className="flex items-center gap-2 rounded-lg bg-[#EF4444]/10 px-3 py-2 text-sm font-medium text-[#EF4444]">
                            <XCircle className="h-4 w-4 flex-shrink-0" />
                            {errMsg}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/player/teams/${team.id}`)}
                            className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-accent"
                          >
                            Ver equipo
                          </button>
                          <button
                            onClick={() => handleSendRequest(team.id)}
                            disabled={status === "loading" || status === "sent"}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {status === "loading" ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Enviando...
                              </>
                            ) : status === "sent" ? (
                              "Solicitud enviada"
                            ) : (
                              "Solicitar unirme"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
                <Users className="mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-bold">No hay equipos disponibles</h3>
                <p className="text-muted-foreground">
                  No se encontraron equipos con los filtros seleccionados
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
