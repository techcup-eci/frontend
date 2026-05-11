import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      
      <div className="w-full max-w-4xl text-center flex flex-col items-center">
        
        {/* Title */}
        <div className="mb-4">
          <h1 className="text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            Ruta no encontrada
          </h1>
        </div>

        {/* The Minimalist 3D VAR Illustration */}
        <div className="relative mb-12 w-full max-w-2xl">
          <img 
            src="/images/var-404.png" 
            alt="Árbitro minimalista revisando el monitor del VAR"
            className="w-full object-contain"
          />
        </div>

        {/* Minimalist Context Text */}
        <div className="mx-auto mb-12 max-w-lg">
          <p className="text-lg font-normal text-muted-foreground leading-relaxed">
            Hemos revisado la jugada detalladamente y la decisión es clara: <strong className="font-semibold text-foreground">Error 404</strong>. 
            La página a la que intentas acceder está fuera de lugar o el sistema ha perdido la conexión.
          </p>
        </div>

        {/* Minimalist Action Button */}
        <Link
          to="/"
          className="group inline-flex items-center gap-3 rounded-full border border-border bg-transparent px-8 py-3.5 font-medium text-foreground transition-all hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
