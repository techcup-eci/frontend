import { Ban } from "lucide-react";

export default function ManageRegistrations() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Ban className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-foreground">
          Sección no disponible
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          Esta sección no está disponible por ahora. Estamos trabajando para habilitarla pronto.
        </p>
      </div>
    </div>
  );
}
