import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Trophy } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulación de login - en producción esto haría una petición al backend
    if (formData.email && formData.password) {
      // Redirigir según el rol simulado
      navigate("/player/dashboard");
    } else {
      setError("Credenciales incorrectas. Verifica tu correo y contraseña");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo */}
      <div className="hidden w-1/2 bg-gradient-to-br from-[var(--color-ink)] via-[var(--color-oxblood)] to-[var(--color-ink)] lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 shadow-lg backdrop-blur-sm">
              <Trophy className="h-10 w-10 text-[var(--color-sand)]" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-black text-white tracking-tight">TechCup Fútbol</h1>
          <p className="text-xl text-[var(--color-mist)]">Bienvenido de vuelta al torneo más emocionante</p>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold">Iniciar sesión</h2>
            <p className="text-muted-foreground">Ingresa tus credenciales para continuar</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block">Correo electrónico</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setError("");
                }}
                className="w-full rounded-lg border border-border bg-[var(--color-mist)] px-4 py-3 text-[var(--color-ink)] focus:border-[var(--color-cool-sky)] focus:ring-1 focus:ring-[var(--color-cool-sky)] focus:outline-none transition-all"
                placeholder="correo@escuelaing.edu.co"
              />
            </div>

            <div>
              <label className="mb-2 block">Contraseña</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setError("");
                }}
                className="w-full rounded-lg border border-border bg-[var(--color-mist)] px-4 py-3 text-[var(--color-ink)] focus:border-[var(--color-cool-sky)] focus:ring-1 focus:ring-[var(--color-cool-sky)] focus:outline-none transition-all"
                placeholder="Tu contraseña"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[var(--color-oxblood)] px-4 py-3 font-semibold text-[var(--color-white-pure)] shadow-md transition-all hover:bg-opacity-90 hover:shadow-lg focus:ring-2 focus:ring-[var(--color-cool-sky)] focus:outline-none"
            >
              Ingresar
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="font-semibold text-[var(--color-cool-sky)] hover:underline transition-all">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
