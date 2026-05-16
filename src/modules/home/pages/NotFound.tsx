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

        {/* Minimalist VAR SVG Illustration */}
        <div className="relative mb-12 w-full max-w-lg">
          <svg viewBox="0 0 500 350" className="w-full text-foreground/80" xmlns="http://www.w3.org/2000/svg">
            {/* Ground line */}
            <line x1="50" y1="320" x2="450" y2="320" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.3" />

            {/* Monitor Stand */}
            <rect x="280" y="250" width="20" height="70" fill="currentColor" opacity="0.8" />
            <path d="M260 320 L320 320 L310 300 L270 300 Z" fill="currentColor" opacity="0.8" />

            {/* Monitor Display */}
            <rect x="180" y="90" width="220" height="160" rx="12" fill="#0f172a" stroke="currentColor" strokeWidth="8" />
            
            {/* Screen Content */}
            <text x="290" y="170" fill="#ef4444" fontSize="56" fontWeight="bold" textAnchor="middle" className="animate-pulse tracking-widest">404</text>
            <text x="290" y="210" fill="#4ade80" fontSize="14" fontFamily="monospace" textAnchor="middle" opacity="0.8">01010111 01001111</text>
            <text x="210" y="120" fill="#4ade80" fontSize="12" fontFamily="monospace" opacity="0.5">101</text>
            <text x="360" y="140" fill="#4ade80" fontSize="12" fontFamily="monospace" opacity="0.5">010</text>
            <text x="220" y="230" fill="#4ade80" fontSize="10" fontFamily="monospace" opacity="0.4">1100</text>
            <text x="360" y="220" fill="#4ade80" fontSize="10" fontFamily="monospace" opacity="0.4">0011</text>
            
            {/* VAR Label */}
            <rect x="270" y="80" width="40" height="20" rx="4" fill="currentColor" />
            <text x="290" y="94" fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="middle">VAR</text>

            {/* Referee Figure */}
            {/* Head */}
            <circle cx="110" cy="140" r="35" fill="currentColor" />
            {/* Whistle */}
            <path d="M 140 150 L 155 155 L 155 160 L 140 155 Z" fill="currentColor" />
            <circle cx="157" cy="157" r="4" fill="currentColor" />
            {/* Body */}
            <path d="M 80 185 Q 110 170 140 185 L 145 320 L 75 320 Z" fill="currentColor" />
            {/* Arm touching screen */}
            <path d="M 125 210 Q 150 240 180 230" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
            <circle cx="180" cy="230" r="8" fill="currentColor" />
            {/* Headset (VAR communication) */}
            <path d="M 110 100 Q 145 100 145 140 L 140 145" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
            <rect x="138" y="135" width="8" height="15" rx="3" fill="currentColor" />
          </svg>
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
