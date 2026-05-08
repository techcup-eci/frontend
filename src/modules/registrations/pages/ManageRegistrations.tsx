import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import { CheckCircle, XCircle, FileText, Search, Clock, ShieldCheck, AlertCircle, Ban } from "lucide-react";
import { useGetRegistrations, useReviewRegistration } from "../hooks/useRegistrations";

// Dummy Organizer ID for demo
const DUMMY_ORGANIZER_ID = "org-123";

export default function ManageRegistrations() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const { data: registrations, isLoading } = useGetRegistrations();
  const { mutate: reviewRegistration, isPending: isReviewing } = useReviewRegistration();

  const handleReview = (id: string, status: 'APPROVED' | 'REJECTED') => {
    const actionText = status === 'APPROVED' ? 'Aprobar' : 'Rechazar';
    if (window.confirm(`¿Estás seguro de que deseas ${actionText} esta inscripción?`)) {
      reviewRegistration({ id, data: { status }, organizerId: DUMMY_ORGANIZER_ID });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UNDER_REVIEW':
        return (
          <div className="flex w-max items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 text-xs font-semibold text-yellow-700 dark:text-yellow-500">
            <Clock className="h-3.5 w-3.5" /> En revisión
          </div>
        );
      case 'APPROVED':
        return (
          <div className="flex w-max items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Aprobado
          </div>
        );
      case 'REJECTED':
        return (
          <div className="flex w-max items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-700 dark:text-red-400">
            <XCircle className="h-3.5 w-3.5" /> Rechazado
          </div>
        );
      case 'CANCELLED':
        return (
          <div className="flex w-max items-center gap-1.5 rounded-full border border-gray-500/30 bg-gray-500/10 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-400">
            <Ban className="h-3.5 w-3.5" /> Cancelado
          </div>
        );
      default:
        return <div className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">{status}</div>;
    }
  };

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    if (!registrations) return [];
    return registrations.filter(reg => 
      reg.teamId.toLowerCase().includes(searchTerm.toLowerCase()) || 
      reg.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [registrations, searchTerm]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!registrations) return { total: 0, pending: 0, approved: 0, rejected: 0 };
    return {
      total: registrations.length,
      pending: registrations.filter(r => r.status === 'UNDER_REVIEW').length,
      approved: registrations.filter(r => r.status === 'APPROVED').length,
      rejected: registrations.filter(r => r.status === 'REJECTED' || r.status === 'CANCELLED').length,
    };
  }, [registrations]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-primary/10 blur-[128px]"></div>
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-secondary/10 blur-[128px]"></div>

      <div className="flex flex-1 relative z-10">
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between border-b border-border/50 pb-6">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                  Gestión de Pagos e Inscripciones
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  Revisa los comprobantes, aprueba equipos oficiales y administra el estado del torneo.
                </p>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total Inscripciones", value: stats.total, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
                { label: "Pendientes por Revisar", value: stats.pending, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
                { label: "Equipos Aprobados", value: stats.approved, icon: ShieldCheck, color: "text-green-500", bg: "bg-green-500/10" },
                { label: "Rechazados / Cancelados", value: stats.rejected, icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
              ].map((stat, i) => (
                <div key={i} className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 shadow-lg backdrop-blur-xl transition-all hover:scale-[1.02]">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{isLoading ? '-' : stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Search and Table Container */}
            <div className="overflow-hidden rounded-3xl border border-border/50 bg-card/60 shadow-xl backdrop-blur-xl">
              {/* Header/Filter */}
              <div className="flex flex-col gap-4 border-b border-border/50 bg-muted/20 p-6 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold">Listado de Solicitudes</h2>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar por Equipo o ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-sm font-medium shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4 font-semibold">ID Inscripción</th>
                      <th className="px-6 py-4 font-semibold">Equipo</th>
                      <th className="px-6 py-4 font-semibold">Fecha de Envío</th>
                      <th className="px-6 py-4 font-semibold">Comprobante</th>
                      <th className="px-6 py-4 font-semibold">Estado</th>
                      <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            <p className="font-medium">Cargando inscripciones...</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <AlertCircle className="mb-2 h-10 w-10 opacity-20" />
                            <p className="text-lg font-medium">No se encontraron registros</p>
                            <p className="text-sm">Intenta ajustar tu búsqueda o espera nuevas solicitudes.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr key={reg.id} className="group transition-colors hover:bg-muted/30">
                          <td className="px-6 py-4">
                            <span className="rounded-md bg-secondary/10 px-2 py-1 font-mono text-xs font-semibold text-secondary-foreground">
                              {reg.id.split('-')[0]}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-foreground">{reg.teamId}</td>
                          <td className="px-6 py-4 font-medium text-muted-foreground">
                            {new Date(reg.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                          </td>
                          <td className="px-6 py-4">
                            <a 
                              href={reg.paymentProofURL} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 font-semibold text-primary transition-colors hover:bg-primary/10"
                            >
                              <FileText className="h-4 w-4" /> Ver Archivo
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(reg.status)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {reg.status === 'UNDER_REVIEW' ? (
                              <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
                                <button
                                  onClick={() => handleReview(reg.id, 'APPROVED')}
                                  disabled={isReviewing}
                                  className="flex items-center gap-1.5 rounded-xl bg-green-500/10 px-3 py-2 text-sm font-bold text-green-700 transition-all hover:bg-green-500/20 disabled:opacity-50 dark:text-green-400"
                                >
                                  <CheckCircle className="h-4 w-4" /> Aprobar
                                </button>
                                <button
                                  onClick={() => handleReview(reg.id, 'REJECTED')}
                                  disabled={isReviewing}
                                  className="flex items-center gap-1.5 rounded-xl bg-destructive/10 px-3 py-2 text-sm font-bold text-destructive transition-all hover:bg-destructive/20 disabled:opacity-50"
                                >
                                  <XCircle className="h-4 w-4" /> Rechazar
                                </button>
                              </div>
                            ) : (
                              <span className="text-sm font-medium text-muted-foreground">Acción completada</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
