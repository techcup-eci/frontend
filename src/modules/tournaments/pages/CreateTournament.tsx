import { useState } from "react";
import { useNavigate } from "react-router";
import { Trophy, Calendar, Users, DollarSign, Link, AlertCircle, CheckCircle } from "lucide-react";
import { apiClient } from "../../../core/api/apiClient";

interface CreateTournamentForm {
	name: string;
	startDate: string;
	endDate: string;
	registrationCloseDate: string;
	maxTeams: number | "";
	cost: number | "";
	regulationsUrl: string;
}

interface FieldError {
	[key: string]: string;
}

const FIELD_CONFIGS = [
	{
		section: "Información General",
		icon: Trophy,
		fields: [
			{
				id: "name",
				label: "Nombre del Torneo",
				type: "text",
				placeholder: "TechCup Fútbol 2026-1",
				required: true,
				colSpan: "full",
			},
		],
	},
	{
		section: "Fechas",
		icon: Calendar,
		fields: [
			{
				id: "startDate",
				label: "Fecha de Inicio",
				type: "date",
				placeholder: "",
				required: true,
				colSpan: "half",
			},
			{
				id: "endDate",
				label: "Fecha de Finalización",
				type: "date",
				placeholder: "",
				required: true,
				colSpan: "half",
			},
			{
				id: "registrationCloseDate",
				label: "Cierre de Inscripciones",
				type: "date",
				placeholder: "",
				required: true,
				colSpan: "half",
			},
		],
	},
	{
		section: "Configuración",
		icon: Users,
		fields: [
			{
				id: "maxTeams",
				label: "Máximo de Equipos",
				type: "number",
				placeholder: "8",
				required: true,
				colSpan: "half",
				min: 2,
				max: 32,
			},
			{
				id: "cost",
				label: "Costo por Equipo (COP)",
				type: "number",
				placeholder: "50000",
				required: true,
				colSpan: "half",
				min: 0,
			},
		],
	},
	{
		section: "Reglamento",
		icon: Link,
		fields: [
			{
				id: "regulationsUrl",
				label: "URL del Reglamento",
				type: "url",
				placeholder: "https://drive.google.com/...",
				required: false,
				colSpan: "full",
			},
		],
	},
];

export default function CreateTournament() {
	const navigate = useNavigate();
	const [form, setForm] = useState<CreateTournamentForm>({
		name: "",
		startDate: "",
		endDate: "",
		registrationCloseDate: "",
		maxTeams: "",
		cost: "",
		regulationsUrl: "",
	});
	const [errors, setErrors] = useState<FieldError>({});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [serverError, setServerError] = useState("");

	const validate = (): boolean => {
		const newErrors: FieldError = {};

		if (!form.name || form.name.trim().length < 3) {
			newErrors.name = "El nombre debe tener al menos 3 caracteres.";
		}
		if (!form.startDate) {
			newErrors.startDate = "La fecha de inicio es obligatoria.";
		}
		if (!form.endDate) {
			newErrors.endDate = "La fecha de finalización es obligatoria.";
		}
		if (form.startDate && form.endDate && form.endDate <= form.startDate) {
			newErrors.endDate = "La fecha de finalización debe ser posterior a la de inicio.";
		}
		if (!form.registrationCloseDate) {
			newErrors.registrationCloseDate = "El cierre de inscripciones es obligatorio.";
		}
		if (form.registrationCloseDate && form.endDate && form.registrationCloseDate >= form.endDate) {
			newErrors.registrationCloseDate = "El cierre de inscripciones debe ser anterior a la fecha de finalización.";
		}
		if (!form.maxTeams || Number(form.maxTeams) < 2 || Number(form.maxTeams) > 32) {
			newErrors.maxTeams = "El número de equipos debe estar entre 2 y 32.";
		}
		if (form.cost === "" || Number(form.cost) < 0) {
			newErrors.cost = "El costo no puede ser negativo.";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (id: string, value: string) => {
		setForm((prev) => ({ ...prev, [id]: value }));
		if (errors[id]) setErrors((prev) => ({ ...prev, [id]: "" }));
		if (serverError) setServerError("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		setLoading(true);
		setServerError("");

		try {
			await apiClient.post("/tournaments", {
				name: form.name.trim(),
				startDate: form.startDate,
				endDate: form.endDate,
				registrationCloseDate: form.registrationCloseDate,
				maxTeams: Number(form.maxTeams),
				cost: Number(form.cost),
				regulationsUrl: form.regulationsUrl || undefined,
			});

			setSuccess(true);
			setTimeout(() => navigate("/organizer/dashboard"), 1800);
		} catch (err: any) {
			const message =
				err?.response?.data?.message ||
				err?.response?.data?.error ||
				"No fue posible crear el torneo. Intenta de nuevo.";
			setServerError(message);
		} finally {
			setLoading(false);
		}
	};

	const inputClass = (id: string) =>
		`w-full rounded-lg border px-4 py-3 text-[var(--color-ink)] focus:outline-none transition-all ${
			errors[id]
				? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-1 focus:ring-destructive"
				: "border-border bg-[var(--color-mist)] focus:border-[var(--color-cool-sky)] focus:ring-1 focus:ring-[var(--color-cool-sky)]"
		}`;

	if (success) {
		return (
			<div className="flex min-h-screen items-center justify-center p-8">
				<div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-12 text-center shadow-lg">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
						<CheckCircle className="h-8 w-8 text-green-600" />
					</div>
					<h2 className="text-2xl font-bold">¡Torneo creado!</h2>
					<p className="text-muted-foreground">Redirigiendo al panel de control...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background p-6 sm:p-8">
			<div className="mx-auto max-w-3xl">

				{/* Header */}
				<div className="mb-8 flex items-center gap-4">
					<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-oxblood)]">
						<Trophy className="h-6 w-6 text-white" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-[var(--color-ink)] sm:text-3xl">
							Crear Nuevo Torneo
						</h1>
						<p className="text-sm text-muted-foreground">
							Completa la información para registrar el torneo en estado Borrador.
						</p>
					</div>
				</div>

				{/* Server error */}
				{serverError && (
					<div className="mb-6 flex items-start gap-3 rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
						<AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
						<span>{serverError}</span>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					{FIELD_CONFIGS.map(({ section, icon: Icon, fields }) => (
						<div
							key={section}
							className="rounded-xl border border-border bg-card p-6 shadow-sm"
						>
							{/* Section header */}
							<div className="mb-5 flex items-center gap-2 border-b border-border pb-4">
								<Icon className="h-4 w-4 text-[var(--color-oxblood)]" />
								<h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-ink)]">
									{section}
								</h2>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								{fields.map((field) => (
									<div
										key={field.id}
										className={field.colSpan === "full" ? "sm:col-span-2" : ""}
									>
										<label
											htmlFor={field.id}
											className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]"
										>
											{field.label}
											{field.required && (
												<span className="ml-1 text-destructive">*</span>
											)}
										</label>
										<input
											id={field.id}
											type={field.type}
											required={field.required}
											placeholder={field.placeholder}
											min={(field as any).min}
											max={(field as any).max}
											value={String(form[field.id as keyof CreateTournamentForm])}
											onChange={(e) => handleChange(field.id, e.target.value)}
											className={inputClass(field.id)}
										/>
										{errors[field.id] && (
											<p className="mt-1 text-xs text-destructive">
												{errors[field.id]}
											</p>
										)}
									</div>
								))}
							</div>
						</div>
					))}

					{/* Info badge */}
					<div className="flex items-start gap-3 rounded-lg border border-[var(--color-cool-sky)]/30 bg-[var(--color-cool-sky)]/5 p-4 text-sm text-[var(--color-ink)]">
						<AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-cool-sky)]" />
						<span>
							El torneo se creará en estado <strong>Borrador</strong>. Podrás
							activarlo desde el panel de control cuando esté listo.
						</span>
					</div>

					{/* Actions */}
					<div className="flex items-center justify-end gap-3 pt-2">
						<button
							type="button"
							onClick={() => navigate(-1)}
							className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-card/80"
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={loading}
							className="flex items-center gap-2 rounded-lg bg-[var(--color-oxblood)] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg focus:ring-2 focus:ring-[var(--color-cool-sky)] focus:outline-none disabled:opacity-60"
						>
							{loading ? (
								<>
									<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
									Creando...
								</>
							) : (
								<>
									<Trophy className="h-4 w-4" />
									Crear Torneo
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}