import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Trophy } from "lucide-react";
import { toast } from "sonner";
import { loginRequestSchema } from "../types/authSchemas";
import type { LoginRequest } from "../types/LoginRequest";
import { useLogin } from "../hooks/useLogin";
import type { ZodIssue } from "zod";

function zodErrorsToMap(issues: ZodIssue[]): Partial<Record<keyof LoginRequest, string>> {
  const map: Partial<Record<keyof LoginRequest, string>> = {};
  for (const issue of issues) {
    const field = issue.path[0] as keyof LoginRequest;
    if (field && !map[field]) {
      map[field] = issue.message;
    }
  }
  return map;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [adminOverride, setAdminOverride] = useState(false);
  const allowedDomains = ["@mail.escuelaing.edu.co", "@escuelaing.edu.co", "@gmail.com"];
  const approvedAdminEmails = ["admin@escuelaing.edu.co"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const result = loginRequestSchema.safeParse(formData);
    if (!result.success) {
      setFieldErrors(zodErrorsToMap(result.error.issues));
      return;
    }

    const normalizedEmail = formData.email.trim().toLowerCase();
    const isAllowedDomain = allowedDomains.some((domain) => normalizedEmail.endsWith(domain));
    const searchParams = new URLSearchParams(location.search);
    const isAdminIntent = searchParams.get("role") === "admin";
    const isOrganizerIntent = searchParams.get("role") === "organizer";

    // Simulación de login - en producción esto haría una petición al backend
    if (formData.email && formData.password && isAllowedDomain) {
      const isAdminDomain = normalizedEmail.endsWith("@escuelaing.edu.co");
      const isAdminApproved = approvedAdminEmails.includes(normalizedEmail);

      // Redirigir según el rol simulado
      if (isAdminIntent) {
        if (!isAdminDomain) {
          setError("Solo correos @escuelaing.edu.co pueden iniciar como admin");
          return;
        }

        if (!isAdminApproved) {
          if (!adminOverride) {
            setError("Tu cuenta admin esta pendiente de confirmacion");
            setAdminOverride(true);
            return;
          }
        }

        navigate("/admin/dashboard");
        return;
      }

      if (isOrganizerIntent) {
        const isInstitutionDomain = normalizedEmail.endsWith("@escuelaing.edu.co");
        if (!isInstitutionDomain) {
          setError("Solo correos institucionales pueden iniciar como organizador");
          return;
        }
        navigate("/organizer/dashboard");
        return;
      }

      navigate("/player/dashboard");
    } else {
      setError("Credenciales incorrectas o dominio no permitido");
    }
  };

  const inputClass = (field: keyof LoginRequest) =>
    `w-full rounded-lg border px-4 py-3 text-[var(--color-ink)] focus:outline-none transition-all ${
      fieldErrors[field]
        ? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-1 focus:ring-destructive"
        : "border-border bg-[var(--color-mist)] focus:border-[var(--color-cool-sky)] focus:ring-1 focus:ring-[var(--color-cool-sky)]"
    }`;

  return (
    <div className="flex min-h-screen">
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

      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold">Iniciar sesión</h2>
            <p className="text-muted-foreground">Ingresa tus credenciales para continuar</p>
          </div>

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
                  setAdminOverride(false);
                }}
                className={inputClass("email")}
                placeholder="correo@escuelaing.edu.co"
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-destructive">{fieldErrors.email}</p>}
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
                  setAdminOverride(false);
                }}
                className={inputClass("password")}
                placeholder="Tu contraseña"
              />
              {fieldErrors.password && <p className="mt-1 text-xs text-destructive">{fieldErrors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-oxblood)] px-4 py-3 font-semibold text-[var(--color-white-pure)] shadow-md transition-all hover:bg-opacity-90 hover:shadow-lg focus:ring-2 focus:ring-[var(--color-cool-sky)] focus:outline-none disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
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


