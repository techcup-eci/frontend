import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Trophy } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    identification: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    const validDomains = ["@escuelaing.edu.co", "@gmail.com"];
    return validDomains.some((domain) => email.endsWith(domain));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = "Solo se aceptan correos @escuelaing.edu.co o @gmail.com";
    }

    if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener mínimo 8 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Si registro exitoso, redirigir al dashboard de usuario.
    sessionStorage.setItem("playerEmail", formData.email.trim().toLowerCase());
    navigate("/user/dashboard");
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
          <p className="text-xl text-[var(--color-mist)]">Únete al torneo más emocionante de la ECI</p>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold">Crear cuenta</h2>
            <p className="text-muted-foreground">Completa el formulario para registrarte</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block">Nombre completo</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full rounded-lg border border-border bg-[var(--color-mist)] px-4 py-3 text-[var(--color-ink)] focus:border-[var(--color-cool-sky)] focus:ring-1 focus:ring-[var(--color-cool-sky)] focus:outline-none transition-all"
                placeholder="Juan Pérez García"
              />
            </div>

            <div>
              <label className="mb-2 block">Identificación (cédula/pasaporte)</label>
              <input
                type="text"
                required
                value={formData.identification}
                onChange={(e) => setFormData({ ...formData, identification: e.target.value })}
                className="w-full rounded-lg border border-border bg-[var(--color-mist)] px-4 py-3 text-[var(--color-ink)] focus:border-[var(--color-cool-sky)] focus:ring-1 focus:ring-[var(--color-cool-sky)] focus:outline-none transition-all"
                placeholder="1234567890"
              />
            </div>

            <div>
              <label className="mb-2 block">Correo electrónico</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={`w-full rounded-lg border px-4 py-3 text-[var(--color-ink)] focus:outline-none transition-all ${
                  errors.email
                    ? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-1 focus:ring-destructive"
                    : "border-border bg-[var(--color-mist)] focus:border-[var(--color-cool-sky)] focus:ring-1 focus:ring-[var(--color-cool-sky)]"
                }`}
                placeholder="correo@escuelaing.edu.co"
              />
              {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
              <p className="mt-1 text-sm text-muted-foreground">
                Solo se aceptan correos @escuelaing.edu.co o @gmail.com
              </p>
            </div>

            <div>
              <label className="mb-2 block">Contraseña</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                className={`w-full rounded-lg border px-4 py-3 text-[var(--color-ink)] focus:outline-none transition-all ${
                  errors.password
                    ? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-1 focus:ring-destructive"
                    : "border-border bg-[var(--color-mist)] focus:border-[var(--color-cool-sky)] focus:ring-1 focus:ring-[var(--color-cool-sky)]"
                }`}
                placeholder="Mínimo 8 caracteres"
              />
              {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password}</p>}
            </div>

            <div>
              <label className="mb-2 block">Confirmar contraseña</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                }}
                className={`w-full rounded-lg border px-4 py-3 text-[var(--color-ink)] focus:outline-none transition-all ${
                  errors.confirmPassword
                    ? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-1 focus:ring-destructive"
                    : "border-border bg-[var(--color-mist)] focus:border-[var(--color-cool-sky)] focus:ring-1 focus:ring-[var(--color-cool-sky)]"
                }`}
                placeholder="Repite tu contraseña"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block">Edad</label>
                <input
                  type="number"
                  required
                  min="16"
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full rounded-lg border border-border bg-[var(--color-mist)] px-4 py-3 text-[var(--color-ink)] focus:border-[var(--color-cool-sky)] focus:ring-1 focus:ring-[var(--color-cool-sky)] focus:outline-none transition-all"
                  placeholder="18"
                />
              </div>

              <div>
                <label className="mb-2 block">Género</label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full rounded-lg border border-border bg-[var(--color-mist)] px-4 py-3 text-[var(--color-ink)] focus:border-[var(--color-cool-sky)] focus:ring-1 focus:ring-[var(--color-cool-sky)] focus:outline-none transition-all"
                >
                  <option value="">Selecciona</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                  <option value="prefiero-no-decir">Prefiero no decir</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[var(--color-oxblood)] px-4 py-3 font-semibold text-[var(--color-white-pure)] shadow-md transition-all hover:bg-opacity-90 hover:shadow-lg focus:ring-2 focus:ring-[var(--color-cool-sky)] focus:outline-none"
            >
              Crear cuenta
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="font-semibold text-[var(--color-cool-sky)] hover:underline transition-all">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


