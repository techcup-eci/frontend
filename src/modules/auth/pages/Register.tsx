import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Trophy } from "lucide-react";
import { useRegister } from "../hooks/useRegister";
import { registerRequestSchema, type RegisterRequest } from "../types/authSchemas";
import { ZodError } from "zod";

const relationshipOptions = [
  { value: "STUDENT", label: "Estudiante" },
  { value: "TEACHER", label: "Profesor" },
  { value: "GRADUATE", label: "Graduado" },
  { value: "STAFF", label: "Personal Administrativo" },
  { value: "FAMILY", label: "Familiar" },
] as const;

const documentTypeOptions = [
  { value: "CC", label: "Cédula de Ciudadanía (CC)" },
  { value: "TI", label: "Tarjeta de Identidad (TI)" },
  { value: "CE", label: "Cédula de Extranjería (CE)" },
  { value: "PP", label: "Pasaporte (PP)" },
] as const;

const programOptions = [
  "Ingeniería de Sistemas",
  "Ingeniería de Inteligencia Artificial",
  "Ingeniería de Ciberseguridad",
  "Ingeniería Estadística",
] as const;

/**
 * Extracts field-level error messages from a ZodError for display on individual inputs.
 */
function zodFieldErrors(error: ZodError): Record<string, string> {
  const map: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as string;
    if (!map[field]) map[field] = issue.message;
  }
  return map;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isPending } = useRegister();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    relationship: "" as RegisterRequest["relationship"] | "",
    program: "",
    semester: "" as string,
    documentType: "" as RegisterRequest["documentType"] | "",
    documentNumber: "",
    birthDate: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (serverError) setServerError(null);
  };

  const isStudent = formData.relationship === "STUDENT";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // ── Confirm password (not in Zod schema — backend doesn't receive it) ──
    const extraErrors: Record<string, string> = {};
    if (formData.password !== formData.confirmPassword) {
      extraErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    // ── Zod validation (source of truth) ──────────────────────────────────
    const zodResult = registerRequestSchema.safeParse({
      email: formData.email.trim(),
      password: formData.password,
      role: "INVITED",
      fullName: formData.fullName.trim(),
      relationship: formData.relationship || undefined,
      program: formData.program,
      semester: isStudent ? Number(formData.semester) : null,
      documentType: formData.documentType || undefined,
      documentNumber: formData.documentNumber ? Number(formData.documentNumber) : undefined,
      birthDate: formData.birthDate,
    });

    if (!zodResult.success) {
      const zodErrors = zodFieldErrors(zodResult.error);
      setFieldErrors({ ...zodErrors, ...extraErrors });
      return;
    }

    if (Object.keys(extraErrors).length > 0) {
      setFieldErrors(extraErrors);
      return;
    }

    // ── Submit ────────────────────────────────────────────────────────────
    try {
      await register(zodResult.data);
      navigate("/home", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al registrar. Intenta de nuevo.";
      setServerError(message);
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-lg border px-4 py-3 text-[var(--color-ink)] focus:outline-none transition-all ${
      fieldErrors[field]
        ? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-1 focus:ring-destructive"
        : "border-border bg-[var(--color-mist)] focus:border-[var(--color-cool-sky)] focus:ring-1 focus:ring-[var(--color-cool-sky)]"
    }`;

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
          <h1 className="mb-4 text-4xl font-black text-white tracking-tight">
            TechCup Fútbol
          </h1>
          <p className="text-xl text-[var(--color-mist)]">
            Únete al torneo más emocionante de la ECI
          </p>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="flex w-full items-center justify-center overflow-y-auto p-8 lg:w-1/2">
        <div className="w-full max-w-md py-8">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold">Crear cuenta</h2>
            <p className="text-muted-foreground">
              Completa el formulario para registrarte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre completo */}
            <div>
              <label className="mb-2 block text-sm font-medium">Nombre completo</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className={inputClass("fullName")}
                placeholder="Juan Pérez García"
              />
              {fieldErrors.fullName && (
                <p className="mt-1 text-sm text-destructive">{fieldErrors.fullName}</p>
              )}
            </div>

            {/* Correo */}
            <div>
              <label className="mb-2 block text-sm font-medium">Correo electrónico</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={inputClass("email")}
                placeholder="correo@escuelaing.edu.co"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-destructive">{fieldErrors.email}</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="mb-2 block text-sm font-medium">Contraseña</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={inputClass("password")}
                placeholder="Mínimo 8 caracteres"
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-destructive">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="mb-2 block text-sm font-medium">Confirmar contraseña</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                className={inputClass("confirmPassword")}
                placeholder="Repite tu contraseña"
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-sm text-destructive">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Relación con la universidad */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Relación con la Escuela
              </label>
              <select
                required
                value={formData.relationship}
                onChange={(e) => handleChange("relationship", e.target.value)}
                className={inputClass("relationship")}
              >
                <option value="">Selecciona</option>
                {relationshipOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {fieldErrors.relationship && (
                <p className="mt-1 text-sm text-destructive">{fieldErrors.relationship}</p>
              )}
            </div>

            {/* Programa académico */}
            <div>
              <label className="mb-2 block text-sm font-medium">Programa académico</label>
              <select
                required
                value={formData.program}
                onChange={(e) => handleChange("program", e.target.value)}
                className={inputClass("program")}
              >
                <option value="">Selecciona</option>
                {programOptions.map((prog) => (
                  <option key={prog} value={prog}>
                    {prog}
                  </option>
                ))}
              </select>
              {fieldErrors.program && (
                <p className="mt-1 text-sm text-destructive">{fieldErrors.program}</p>
              )}
            </div>

            {/* Semestre (condicional) */}
            {isStudent && (
              <div>
                <label className="mb-2 block text-sm font-medium">Semestre actual</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.semester}
                  onChange={(e) => handleChange("semester", e.target.value)}
                  className={inputClass("semester")}
                  placeholder="1"
                />
                {fieldErrors.semester && (
                  <p className="mt-1 text-sm text-destructive">{fieldErrors.semester}</p>
                )}
              </div>
            )}

            {/* Tipo de documento */}
            <div>
              <label className="mb-2 block text-sm font-medium">Tipo de documento</label>
              <select
                required
                value={formData.documentType}
                onChange={(e) => handleChange("documentType", e.target.value)}
                className={inputClass("documentType")}
              >
                <option value="">Selecciona</option>
                {documentTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {fieldErrors.documentType && (
                <p className="mt-1 text-sm text-destructive">{fieldErrors.documentType}</p>
              )}
            </div>

            {/* Número de documento */}
            <div>
              <label className="mb-2 block text-sm font-medium">Número de documento</label>
              <input
                type="text"
                required
                value={formData.documentNumber}
                onChange={(e) => handleChange("documentNumber", e.target.value)}
                className={inputClass("documentNumber")}
                placeholder="1234567890"
              />
              {fieldErrors.documentNumber && (
                <p className="mt-1 text-sm text-destructive">{fieldErrors.documentNumber}</p>
              )}
            </div>

            {/* Fecha de nacimiento */}
            <div>
              <label className="mb-2 block text-sm font-medium">Fecha de nacimiento</label>
              <input
                type="date"
                required
                value={formData.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                className={inputClass("birthDate")}
              />
              {fieldErrors.birthDate && (
                <p className="mt-1 text-sm text-destructive">{fieldErrors.birthDate}</p>
              )}
            </div>

            {/* Error del servidor */}
            {serverError && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-[var(--color-oxblood)] px-4 py-3 font-semibold text-[var(--color-white-pure)] shadow-md transition-all hover:bg-opacity-90 hover:shadow-lg focus:ring-2 focus:ring-[var(--color-cool-sky)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="font-semibold text-[var(--color-cool-sky)] hover:underline transition-all"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
