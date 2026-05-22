import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Trophy } from "lucide-react";
import type { ZodIssue } from "zod";
import { useRegister } from "../hooks/useRegister";
import { registerRequestSchema } from "../types/authSchemas";

function zodErrorsToMap(issues: ZodIssue[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const issue of issues) {
    const field = issue.path.join(".");
    if (field && !map[field]) {
      map[field] = issue.message;
    }
  }
  return map;
}

export default function Register() {
  const navigate = useNavigate();
  const { register, isPending, errorMessage, resetState } = useRegister();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    schoolRelation: "",
    academicLevel: "",
    professorType: "",
    academicProgram: "",
    semester: "",
    identificationType: "",
    identificationNumber: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[^0-9]*$/.test(val)) {
      setFormData((prev) => ({ ...prev, name: val }));
      if (errors.name) {
        setErrors((prev) => ({ ...prev, name: "" }));
      }
    }
  };

  const handleDigitsOnlyChange = (field: "phone" | "identificationNumber") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setFormData((prev) => ({ ...prev, [field]: val }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    resetState();

    const parsedData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      birthDate: formData.birthDate,
      schoolRelation: formData.schoolRelation,
      academicLevel: formData.schoolRelation === "STUDENT" ? formData.academicLevel : undefined,
      professorType: formData.schoolRelation === "PROFESSOR" ? formData.professorType : undefined,
      academicProgram: (formData.schoolRelation === "STUDENT" && formData.academicLevel === "UNDERGRADUATE") 
        ? formData.academicProgram 
        : undefined,
      semester: (formData.schoolRelation === "STUDENT" && formData.academicLevel === "UNDERGRADUATE")
        ? (formData.semester ? Number(formData.semester) : undefined)
        : undefined,
      identificationType: formData.identificationType,
      identificationNumber: formData.identificationNumber ? Number(formData.identificationNumber) : undefined,
      phone: formData.phone ? Number(formData.phone) : undefined,
    };

    const result = registerRequestSchema.safeParse(parsedData);

    if (!result.success) {
      setErrors(zodErrorsToMap(result.error.issues));
      return;
    }

    try {
      await register({
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
        birthDate: result.data.birthDate,
        schoolRelation: result.data.schoolRelation,
        academicLevel: result.data.academicLevel,
        professorType: result.data.professorType,
        academicProgram: result.data.academicProgram,
        semester: result.data.semester,
        identificationType: result.data.identificationType,
        identificationNumber: result.data.identificationNumber,
        phone: result.data.phone,
      });
      sessionStorage.setItem("playerEmail", result.data.email.toLowerCase());
      navigate("/user/dashboard");
    } catch {
      // El error se maneja mediante el valor de errorMessage devuelto por el hook
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-lg border px-4 py-3 text-[var(--color-ink)] focus:outline-none transition-all ${
      errors[field]
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
          <h1 className="mb-4 text-4xl font-black text-white tracking-tight">TechCup Fútbol</h1>
          <p className="text-xl text-[var(--color-mist)]">Únete al torneo más emocionante de la ECI</p>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md my-8">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold">Crear cuenta</h2>
            <p className="text-muted-foreground">Completa el formulario para registrarte</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sección: Información Personal */}
            <div className="space-y-4 border-b border-border/50 pb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-cool-sky)]">Información Personal</h3>
              
              <div>
                <label className="mb-1 block text-sm font-medium">Nombre completo</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  className={inputClass("name")}
                  placeholder="Juan Pérez García"
                />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Fecha de nacimiento</label>
                  <input
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={(e) => {
                      setFormData({ ...formData, birthDate: e.target.value });
                      if (errors.birthDate) setErrors({ ...errors, birthDate: "" });
                    }}
                    className={inputClass("birthDate")}
                  />
                  {errors.birthDate && <p className="mt-1 text-xs text-destructive">{errors.birthDate}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Teléfono</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={handleDigitsOnlyChange("phone")}
                    className={inputClass("phone")}
                    placeholder="3001234567"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Tipo de identificación</label>
                  <select
                    required
                    value={formData.identificationType}
                    onChange={(e) => {
                      setFormData({ ...formData, identificationType: e.target.value });
                      if (errors.identificationType) setErrors({ ...errors, identificationType: "" });
                    }}
                    className={inputClass("identificationType")}
                  >
                    <option value="">Selecciona</option>
                    <option value="CC">Cédula de Ciudadanía (CC)</option>
                    <option value="TI">Tarjeta de Identidad (TI)</option>
                    <option value="PP">Pasaporte (PP)</option>
                    <option value="CE">Cédula de Extranjería (CE)</option>
                    <option value="OTRO">Otro</option>
                  </select>
                  {errors.identificationType && <p className="mt-1 text-xs text-destructive">{errors.identificationType}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Número de identificación</label>
                  <input
                    type="text"
                    required
                    value={formData.identificationNumber}
                    onChange={handleDigitsOnlyChange("identificationNumber")}
                    className={inputClass("identificationNumber")}
                    placeholder="12345678"
                  />
                  {errors.identificationNumber && <p className="mt-1 text-xs text-destructive">{errors.identificationNumber}</p>}
                </div>
              </div>
            </div>

            {/* Sección: Relación Institucional */}
            <div className="space-y-4 border-b border-border/50 pb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-cool-sky)]">Relación Institucional</h3>

              <div>
                <label className="mb-1 block text-sm font-medium">Relación con la escuela</label>
                <select
                  required
                  value={formData.schoolRelation}
                  onChange={(e) => {
                    const rel = e.target.value;
                    setFormData({
                      ...formData,
                      schoolRelation: rel,
                      academicLevel: "",
                      professorType: "",
                      academicProgram: "",
                      semester: "",
                    });
                    setErrors((prev) => ({
                      ...prev,
                      schoolRelation: "",
                      academicLevel: "",
                      professorType: "",
                      academicProgram: "",
                      semester: "",
                    }));
                  }}
                  className={inputClass("schoolRelation")}
                >
                  <option value="">Selecciona</option>
                  <option value="STUDENT">Estudiante</option>
                  <option value="PROFESSOR">Profesor</option>
                  <option value="GRADUATE">Invitado</option>
                </select>
                {errors.schoolRelation && <p className="mt-1 text-xs text-destructive">{errors.schoolRelation}</p>}
              </div>

              {formData.schoolRelation === "STUDENT" && (
                <div>
                  <label className="mb-1 block text-sm font-medium">Nivel académico</label>
                  <select
                    required
                    value={formData.academicLevel}
                    onChange={(e) => {
                      const level = e.target.value;
                      setFormData({
                        ...formData,
                        academicLevel: level,
                        academicProgram: "",
                        semester: "",
                      });
                      setErrors((prev) => ({
                        ...prev,
                        academicLevel: "",
                        academicProgram: "",
                        semester: "",
                      }));
                    }}
                    className={inputClass("academicLevel")}
                  >
                    <option value="">Selecciona</option>
                    <option value="UNDERGRADUATE">Pregrado</option>
                    <option value="POSTGRADUATE">Posgrado</option>
                    <option value="MASTER">Maestría</option>
                  </select>
                  {errors.academicLevel && <p className="mt-1 text-xs text-destructive">{errors.academicLevel}</p>}
                </div>
              )}

              {formData.schoolRelation === "STUDENT" && formData.academicLevel === "UNDERGRADUATE" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Programa académico</label>
                    <select
                      required
                      value={formData.academicProgram}
                      onChange={(e) => {
                        setFormData({ ...formData, academicProgram: e.target.value });
                        if (errors.academicProgram) setErrors({ ...errors, academicProgram: "" });
                      }}
                      className={inputClass("academicProgram")}
                    >
                      <option value="">Selecciona</option>
                      <option value="ESTADISTICA">Estadística</option>
                      <option value="ING_SISTEMAS">Ingeniería de Sistemas</option>
                      <option value="INTELIGENCIA_ARTIFICIAL">Inteligencia Artificial</option>
                      <option value="CIBERSEGURIDAD">Ciberseguridad</option>
                    </select>
                    {errors.academicProgram && <p className="mt-1 text-xs text-destructive">{errors.academicProgram}</p>}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Semestre</label>
                    <select
                      required
                      value={formData.semester}
                      onChange={(e) => {
                        setFormData({ ...formData, semester: e.target.value });
                        if (errors.semester) setErrors({ ...errors, semester: "" });
                      }}
                      className={inputClass("semester")}
                    >
                      <option value="">Selecciona</option>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((sem) => (
                        <option key={sem} value={sem}>
                          {sem}
                        </option>
                      ))}
                    </select>
                    {errors.semester && <p className="mt-1 text-xs text-destructive">{errors.semester}</p>}
                  </div>
                </div>
              )}

              {formData.schoolRelation === "PROFESSOR" && (
                <div>
                  <label className="mb-1 block text-sm font-medium">Tipo de profesor</label>
                  <select
                    required
                    value={formData.professorType}
                    onChange={(e) => {
                      setFormData({ ...formData, professorType: e.target.value });
                      if (errors.professorType) setErrors({ ...errors, professorType: "" });
                    }}
                    className={inputClass("professorType")}
                  >
                    <option value="">Selecciona</option>
                    <option value="FULL_TIME">Tiempo Completo</option>
                    <option value="CHAIR">Cátedra</option>
                  </select>
                  {errors.professorType && <p className="mt-1 text-xs text-destructive">{errors.professorType}</p>}
                </div>
              )}
            </div>

            {/* Sección: Credenciales de Acceso */}
            <div className="space-y-4 pb-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-cool-sky)]">Credenciales de Acceso</h3>
              
              <div>
                <label className="mb-1 block text-sm font-medium">Correo electrónico</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  className={inputClass("email")}
                  placeholder="correo@escuelaing.edu.co"
                />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Dominios permitidos: @mail.escuelaing.edu.co, @escuelaing.edu.co, @gmail.com
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Contraseña</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (errors.password) setErrors({ ...errors, password: "" });
                    }}
                    className={inputClass("password")}
                    placeholder="Mínimo 8 caracteres"
                  />
                  {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Confirmar contraseña</label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                    }}
                    className={inputClass("confirmPassword")}
                    placeholder="Repite tu contraseña"
                  />
                  {errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {errorMessage ? (
              <div className="rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-oxblood)] px-4 py-3 font-semibold text-[var(--color-white-pure)] shadow-md transition-all hover:bg-opacity-90 hover:shadow-lg focus:ring-2 focus:ring-[var(--color-cool-sky)] focus:outline-none disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creando cuenta...
                </>
              ) : (
                "Crear cuenta"
              )}
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


