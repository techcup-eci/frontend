import { ServerOff } from "lucide-react";

interface ServiceUnavailableProps {
  serviceName?: string;
  children?: React.ReactNode;
}

/**
 * Shows a "service unavailable" message.
 * Wrap tournament/competition pages with this while the microservice is down.
 */
export function ServiceUnavailable({ serviceName = "Torneos", children }: ServiceUnavailableProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10">
        <ServerOff className="h-10 w-10 text-amber-500" />
      </div>
      <h2 className="mb-3 text-2xl font-bold text-foreground">
        Servicio no disponible
      </h2>
      <p className="max-w-md text-base leading-relaxed text-muted-foreground">
        El microservicio de <span className="font-semibold">{serviceName}</span> no está disponible en este momento.
        Por favor, intenta nuevamente más tarde.
      </p>
      {children}
    </div>
  );
}

/**
 * Convenience export for tournament pages specifically.
 */
export function TournamentUnavailable() {
  return <ServiceUnavailable serviceName="Torneos" />;
}
